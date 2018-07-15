const Module = require('module');
Module._extensions['.less'] =
    Module._extensions['.css'] =
    Module._extensions['.scss'] = () => '';

require('babel-core/register')({
    ignore: [/node_modules/],
    presets: [
        'stage-2',
        'react',
        [
            "latest-node",
            { "target": "current" }
        ],
    ]
});

require('babel-polyfill');
require('./index');