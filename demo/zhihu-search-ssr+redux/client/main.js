import React from 'react';
import App from './app';

import Store from 'redux-store-init';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Provider } from 'react-redux';

/* {
    app: {   // redux module，目前只有一个页面
        keysword: '',
        hots: [],
    },
} */
const createReducers = (initState = {}) => {
    const appInitState = initState.app || {};
    return {
        app: (state = appInitState, action) => state,
    };
};

export default ({ initState }) => {
    // 初始化 store，使用我写的 redux-store-init 模块
    const store = Store({
        reducers: createReducers(initState),
        initState: initState,
    }, [thunk, logger]);

    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}
