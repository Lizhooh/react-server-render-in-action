const Router = require('koa-router');
const router = new Router();
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('user');

const sha256 = (str) => crypto.createHash('sha256').update(str).digest('hex');

router.get('/', ctx => {
    // test
    ctx.cookies.set('a', 'aaa');
    ctx.body = {
        name: 'abc',
        cookie: ctx.request.headers['cookie'],
    };
}).post('/login', async ctx => {
    // 登录
    const { email, password } = ctx.request.body;
    const res = await User.findOne({ email, password: sha256(password) });
    // 返回用户信息
    if (res !== null) {
        ctx.session.user = res.toData();
        ctx.body = { status: 200, result: res.toData() };
    }
    else {
        ctx.body = { status: 400, result: false, error: '邮箱或密码错误' };
    }
}).post('/logout', async ctx => {
    // 登出
    ctx.session = null;
    ctx.body = { status: 200, result: true };
}).get('/auth', async ctx => {
    // 登录状态检查
    if (ctx.session.user) {
        ctx.body = { status: 200, result: ctx.session.user };
    }
    else {
        ctx.body = { status: 200, result: false };
    }
}).get('/check-email', async ctx => {
    // 检查邮箱是否重复
    const { email } = ctx.query;
    const res = await User.findOne({ email });
    ctx.body = {
        status: 200,
        result: res !== null
    };
}).post('/sign', async ctx => {
    // 注册
    const { email, password, name } = ctx.request.body;
    let res = await User.findOne({ email });
    if (res !== null) {
        ctx.body = { status: 400, result: false, error: '邮箱重复' };
        return;
    }
    try {
        res = await User.create({ name, email, password: sha256(password) });
        if (res !== null) {
            ctx.session.user = res.toData();
            ctx.body = { status: 200, result: res.toData() };
        }
    }
    catch (err) {
        ctx.body = {
            status: 400,
            result: false,  // 11000 是 mongodb 键名重复错误代码
            error: err.code === 11000 ? '用户名重复' : err.message
        };
    }
});

module.exports = router;