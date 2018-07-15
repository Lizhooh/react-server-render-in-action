import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import serve from 'koa-static';
import fetch from 'isomorphic-fetch';
import onlyspace from 'only-space';

import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './client/app';

import Bundler from 'parcel-bundler';

const app = new Koa();
const router = new Router();

const cache = {};

const renderHTML = (data) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="/index.css">
        <title>${data.title || ''}</title>
    </head>
    <body>
        <div id="app">${data.body}</div>
        <script>window.__INIT_STATE__ = (${data.state})</script>
        <script src="/index.js"></script>
    </body>
    </html>
`;

router
    .get('/autocomplete/:key', async ctx => {
        const key = ctx.params.key;
        const url = `https://www.zhihu.com/autocomplete?token=${key}`;
        if (cache[key]) {
            ctx.body = cache[key];
            return;
        }
        try {
            const res = await fetch(url).then(res => res.json());
            const data = res[0].filter(i => i[0] === 'question')
                .map(i => ({ text: onlyspace(i[1]), count: i[4], id: i[3] }));
            cache[key] = data;
            ctx.body = data || [];
        }
        catch (err) {
            cache[key] = [];
            ctx.body = [];
        }
    })
    .get('/', ctx => {
        const state = { keyword: '', hots: [] };
        ctx.body = renderHTML({
            title: 'React 服务端渲染实战',
            body: renderToString(<App initState={state} />),
            state: JSON.stringify(state),
        });
    });

app
    .use(logger())
    .use(serve('public'))
    .use(router.routes())
    .listen(3000, () => {
        const bundler = new Bundler('./client/index.js', {
            outDir: 'public',
            sourceMaps: false,
            minify: true,
        });
        bundler.bundle().then(() => {
            console.log('server run in 3000.');
        });
        bundler.on('buildEnd', () => {
            console.log('client javascript build complete.');
        });
        bundler.on('error', err => {
            console.log('client javascript build error:', err);
        });
    });
