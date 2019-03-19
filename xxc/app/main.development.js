/**
 * 入口文件：main.development.js
 * 这是 Electron 主进程的入口文件
 */

import {app as ElectronApp} from 'electron';
import application from './platform/electron/app-remote';

// 禁用自签发证书警告
ElectronApp.commandLine.appendSwitch('ignore-certificate-errors', 'true');
ElectronApp.commandLine.appendSwitch('ignore-urlfetcher-cert-requests', 'true');

// 记录入口文件所在目录
application.init(__dirname);

if (process.env.NODE_ENV === 'production') {
    // 启用 Source Map 支持，方便跟踪调试
    const sourceMapSupport = require('source-map-support'); // eslint-disable-line
    sourceMapSupport.install();
}

if (DEBUG && DEBUG !== 'production') {
    // 启用 electron-debug https://github.com/sindresorhus/electron-debug
    require('electron-debug')(); // eslint-disable-line global-require

    // 使得 app/node_modules 内的模块可以直接使用
    const path = require('path'); // eslint-disable-line
    const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
    require('module').globalPaths.push(p); // eslint-disable-line
}

// 检查是否已经打开了其他程序实例
// 此机制确保系统中仅仅只有一个程序实例在运行，因为程序已经支持多窗口模式，所以多个程序实例没有意义
const gotTheLock = ElectronApp.requestSingleInstanceLock();
if (!gotTheLock) {
    // 如果已经打开，则退出
    try {
        ElectronApp.quit();
        process.exit(0);
    } catch (_) {} // eslint-disable-line
} else if (process.hrtime()[0] > 5) {
    // hack alert: 上面的 if 是确保界面加载完成后再进行弹窗，防止用户心急点击打开好多次从而报错，但可能得想个别的办法
    // 监听请求打开第二个实例事件，提示用户创建一个新的聊天窗口
    ElectronApp.on('second-instance', (/* event, commandLine, workingDirectory */) => {
        application.confirmCreateAppWindow();
    });
}

// 当所有窗口关闭时退出应用
ElectronApp.on('window-all-closed', () => {
    try {
        ElectronApp.quit();
    } catch (_) {} // eslint-disable-line
});

/**
 * 安装调试模式所使用的 Electron 开发工具扩展
 * @private
 * @ignore
 * @return {void}
 */
const installExtensions = async () => {
    if (process.env.SKIP_INSTALL_EXTENSIONS) {
        console.log('>> Skip install electron extension for debug mode.');
        return;
    }
    console.log('>> Installing electron extensions...It may take a few minutes for the first boot. If the main window does not show for a long time, try to exit current task in comand line window and then execute "npm run start-hot-fast" instead of the "npm run start-hot" command.');
    if (process.env.NODE_ENV === 'development') {
        const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
        const extensions = [
            'REACT_DEVELOPER_TOOLS'
        ];
        const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
        for (const name of extensions) { // eslint-disable-line
            try {
                await installer.default(installer[name], forceDownload); // eslint-disable-line
            } catch (e) {} // eslint-disable-line
        }
    }
};

// 当 Electron 初始化完毕且创建完窗口时调用
ElectronApp.on('ready', async () => {
    // 安装 Electron 调试扩展
    await installExtensions();

    // 通知应用管理程序就绪
    application.ready();
});

// 当 Electron 应用被激活时调用
ElectronApp.on('activate', () => {
    // 在 OS X 系统上，可能存在所有应用窗口关闭了，但是程序还没关闭，此时如果收到激活应用请求需要
    // 重新打开应用窗口并创建应用菜单
    application.openOrCreateWindow();
    application.createAppMenu();
});
