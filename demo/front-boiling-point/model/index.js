const mongoose = require('mongoose');
const Oid = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },                      // 用户名，唯一
    email: {
        type: String,
        unique: true,
    },                      // 邮箱，唯一
    summary: {
        type: String,
        default: '这个人很懒，什么都没写',
    },                      // 个人介绍
    password: {
        type: String,
    },                      // 密码
}, { timestamps: true, versionKey: false });

UserSchema.virtual('id').get(function () {
    return this._id.toString();
});

UserSchema.method('toData', function () {
    return {
        id: this.id,
        name: this.name,
        email: this.email,
        summary: this.summary
    };
});

const BoilSchema = new mongoose.Schema({
    content: String,        // 沸点内容
    image: String,          // 配图地址
    user: {                 // 用户相关
        id: Oid,
        name: String,
    },
    likes: [String],        // 点赞
}, { timestamps: true, versionKey: false });

BoilSchema.virtual('id').get(function () {
    return this._id.toString();
});

module.exports = {
    User: mongoose.model('user', UserSchema),
    Boil: mongoose.model('boil', BoilSchema),
};
