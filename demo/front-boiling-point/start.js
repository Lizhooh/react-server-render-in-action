const mongoose = require('mongoose');
const models = require('./model');
const { app, server } = require('./index');

+ async function () {
    try {
        await server.prepare();
        await mongoose.connect('mongodb://127.0.0.1/front-boil-point');

        // 插入一条默认数据
        const Boil = mongoose.model('boil');
        await Boil.create({
            _id: "5b24de42fff80e307cd4206e",
            content: '如何让你的 JavaScript 更快？在网速差的环境下，JavaScript 文件的下载时间就显得很重要，在手机这种 CPU 偏弱的终端则需要更低的 JavaScript 解析成本。<br /><br />推荐这篇来自 Google 团队的 [JavaScript 代码分割优化](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-star) 的文章。<br />',
            image: 'https://awesomes.oss-cn-beijing.aliyuncs.com/news/1527674042224-2015-3305.jpg',
            user: {
                id: '5b1cb3b5b86bfb23f87abf98',
                name: 'abc123'
            },
        }).catch(err => err);

        app.listen(3000, () => {
            console.log('> Ready on http://localhost:3000')
        });
    }
    catch (err) {
        console.log(err.message);
        process.exit(0);
    }
}();
