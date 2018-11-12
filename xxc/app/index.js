/**
 * 入口文件：index.js
 * 这是 Electron 渲染进程启动的主窗口入口文件
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './style/app.less';
import './utils/debug';
import './utils/react-debug';
import IndexView from './views/index';
import appRuntime from './core/runtime';
import {triggerReady} from './core/ui';

// 喧喧运行时管理程序就绪时加载 React 界面组件
appRuntime.ready(() => {
    const appElement = document.getElementById('appContainer');
    ReactDOM.render(<IndexView />, appElement, () => {
        const loadingElement = document.getElementById('loading');
        loadingElement.parentNode.removeChild(loadingElement);

        // 触发界面就绪事件
        triggerReady();
    });
});
