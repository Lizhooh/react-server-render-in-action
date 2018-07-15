import React from 'react';
import ReactDOM from 'react-dom';
import Main from './main';
import './app.less';

ReactDOM.render(
    <Main initState={window.__INIT_STATE__} />,
    document.getElementById('app'),
);