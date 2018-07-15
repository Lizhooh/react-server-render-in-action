const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const { graphqlKoa } = require('apollo-server-koa');
const logger = require('koa-logger');
const serve = require('koa-static');
const bodyParser = require('koa-body');
const session = require('koa-session');

const isDev = process.env.NODE_ENV !== 'production';
const schema = require('./graphql');
const server = next({ dev: isDev })
const handle = server.getRequestHandler();
const app = new Koa();
const router = new Router();
app.keys = ['abc123'];

router
    .use('/api', require('./routes/api').routes())
    .post('/gql-api', async (ctx, next) => {
        if (ctx.request.body.query.indexOf('mutation') > -1) {
            const isLogin = !!ctx.session.user;
            if (isLogin) {
                return graphqlKoa({ schema })(ctx, next);
            }
            else {
                ctx.body = { status: 403 };
            }
        }
        else {
            return graphqlKoa({ schema })(ctx, next);
        }
    })

    .use(async (ctx, next) => {
        if (!ctx.app.dev && ctx.url === '/_next/webpack-hmr') {
            ctx.status = 302;
        }
        else if (!ctx.app.dev && /\.map$/.test(ctx.url)) {
            ctx.status = 302;
        }
        else {
            await next();
        }
    })
    .get('/*', async ctx => {
        ctx.res.statusCode = 200;
        // 把 session 对象挂载在 res 里，方便在 getInitialProps 里获取 session。
        ctx.res.session = ctx.session;
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

app
    .use(serve('build/static'))
    .use(logger())
    .use(bodyParser())
    .use(session({ key: 'FBP' }, app))
    .use(router.routes())
    .use(router.allowedMethods())
    ;

module.exports = {
    app, server
}
