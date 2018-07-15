const mongoose = require('mongoose');
const fs = require('fs');
const xss = require('xss');
const { makeExecutableSchema } = require('graphql-tools');

const Boil = mongoose.model('boil');
const User = mongoose.model('user');

// Action
const resolvers = {
    Query: {
        boils: async (root, { limit = 0, offset = 0 }) => {
            const res = await Boil.find({}).skip(offset).limit(limit).sort({ createdAt: -1 });
            return Array.isArray(res) ? res : [];
        },
        user: async (root, { id }) => {
            try {
                const _id = mongoose.Types.ObjectId(id);
                const res = await User.findOne({ _id });
                if (res) {
                    return res.toData();
                }
            }
            catch (err) {
                console.log(err.message);
            }
        },
    },
    Mutation: {
        createBoil: async (root, args) => {
            const res = await Boil.create({
                content: xss(args.content),
                image: args.image,
                user: {
                    id: args.userId,
                    name: args.userName,
                }
            });
            console.log(res);
            return res ? true : false;
        },
        updateBoil: async (root, { id, content, image }) => {
            const _id = mongoose.Types.ObjectId(id);
            const res = await Boil.updateOne({ _id }, {
                $set: {
                    content: content,
                    image: image || '',
                }
            });
            return res ? true : false;
        },
        removeBoil: async (root, { id }) => {
            const _id = mongoose.Types.ObjectId(id);
            const res = await Boil.remove({ _id });
            return res ? true : false;
        },
        addLike: async (root, { bid, uid }) => {
            // $addToSet 不存在才加入
            const res = await Boil.updateOne({ _id: bid }, {
                $addToSet: { likes: uid }
            });
            return res ? true : false;
        },
        cancelLike: async (root, { bid, uid }) => {
            const res = await Boil.updateOne({ _id: bid }, {
                $pull: { likes: uid }
            });
            return res ? true : false;
        }
    }
};

const schema = makeExecutableSchema({
    typeDefs: fs.readFileSync(__dirname + '/schema.gql').toString(),
    resolvers: resolvers
});

module.exports = schema;