const withLess = require('@zeit/next-less');
const path = require('path');

module.exports = withLess({
    distDir: 'build',
    webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
        // 配置别名路径
        config.resolve.alias = {
            '@': path.resolve(__dirname, './Client'),
            '#': path.resolve(__dirname, './pages'),
            ...config.resolve.alias,
        }
        return config
    },
});