const M = require('mockjs');

module.exports = () => [...new Array(M.Random.integer(5, 30))].map(i => ({
    id: M.Random.id(),
    content: M.Random.ctitle(30, 120),
    image: M.Random.image('320x480'),
    user: {
        id: M.Random.id(),
        name: M.Random.name(),
        summary: M.Random.ctitle(5, 20),
    },
    createdAt: '3 天前',
    likes: [...new Array(M.Random.integer(0, 20))].map(i => M.Random.id())
}));