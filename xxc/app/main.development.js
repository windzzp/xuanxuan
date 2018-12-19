/**
 * 入口文件：main.development.js
 * 这是 Electron 主进程的入口文件
 */

import {app as ElectronApp, Menu, shell} from 'electron';
import pkg from './package.json';
import application from './platform/electron/app-remote';
import Lang from './lang';

// 禁用自签发证书警告
ElectronApp.commandLine.appendSwitch('ignore-certificate-errors');

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

/**
 * 检查是否已经打开了其他程序实例
 * 此机制确保系统中仅仅只有一个程序实例在运行，因为程序已经支持多窗口模式，所以多个程序实例没有意义
 * @private
 */
const shouldQuit = ElectronApp.makeSingleInstance((commandLine, workingDirectory) => {
    application.confirmCreateAppWindow();
});
// 如果已经打开，则退出
if (shouldQuit) {
    try {
        ElectronApp.quit();
    } catch (_) {} // eslint-disable-line
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
        console.log('>> 已跳过安装 Electron 调试扩展。');
        return;
    }
    console.log('>> 正在安装 Electron 调试扩展...首次启动可能需要花费几分钟时间，如果长时间没有出现主界面窗口，请尝试退出此命令行任务，然后执行 "npm run start-hot-fast" 来代替 "npm run start-hot" 命令。');
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

/**
 * 创建窗口菜单
 * @private
 * @ignore
 * @return {void}
 */
const createMenu = () => {
    // Create application menu
    if (process.platform === 'darwin') {
        const template = [{
            label: Lang.string('app.title'),
            submenu: [{
                label: Lang.string('menu.about'),
                selector: 'orderFrontStandardAboutPanel:'
            }, {
                type: 'separator'
            }, {
                label: 'Services',
                submenu: []
            }, {
                type: 'separator'
            }, {
                label: Lang.string('menu.hideCurrentWindow'),
                accelerator: 'Command+H',
                selector: 'hide:'
            }, {
                label: Lang.string('menu.hideOtherWindows'),
                accelerator: 'Command+Shift+H',
                selector: 'hideOtherApplications:'
            }, {
                label: Lang.string('menu.showAllWindows'),
                selector: 'unhideAllApplications:'
            }, {
                type: 'separator'
            }, {
                label: Lang.string('menu.quit'),
                accelerator: 'Command+Q',
                click() {
                    application.quit();
                }
            }]
        }, {
            label: Lang.string('menu.edit'),
            submenu: [{
                label: Lang.string('menu.undo'),
                accelerator: 'Command+Z',
                selector: 'undo:'
            }, {
                label: Lang.string('menu.redo'),
                accelerator: 'Shift+Command+Z',
                selector: 'redo:'
            }, {
                type: 'separator'
            }, {
                label: Lang.string('menu.cut'),
                accelerator: 'Command+X',
                selector: 'cut:'
            }, {
                label: Lang.string('menu.copy'),
                accelerator: 'Command+C',
                selector: 'copy:'
            }, {
                label: Lang.string('menu.paste'),
                accelerator: 'Command+V',
                selector: 'paste:'
            }, {
                label: Lang.string('menu.selectAll'),
                accelerator: 'Command+A',
                selector: 'selectAll:'
            }]
        }, {
            label: Lang.string('menu.view'),
            submenu: (DEBUG) ? [{
                label: Lang.string('menu.reload'),
                accelerator: 'Command+R',
                click() {
                    application.currentFocusWindow.webContents.reload();
                }
            }, {
                label: Lang.string('menu.toggleFullscreen'),
                accelerator: 'Ctrl+Command+F',
                click() {
                    application.currentFocusWindow.setFullScreen(!application.currentFocusWindow.isFullScreen());
                }
            }, {
                label: Lang.string('menu.toggleDeveloperTool'),
                accelerator: 'Alt+Command+I',
                click() {
                    application.currentFocusWindow.toggleDevTools();
                }
            }] : [{
                label: Lang.string('menu.toggleFullscreen'),
                accelerator: 'Ctrl+Command+F',
                click() {
                    application.currentFocusWindow.setFullScreen(!application.currentFocusWindow.isFullScreen());
                }
            }]
        }, {
            label: Lang.string('menu.window'),
            submenu: [{
                label: Lang.string('menu.minimize'),
                accelerator: 'Command+M',
                selector: 'performMiniaturize:'
            }, {
                label: Lang.string('menu.close'),
                accelerator: 'Command+W',
                selector: 'performClose:'
            }, {
                type: 'separator'
            }, {
                label: Lang.string('menu.bringAllToFront'),
                selector: 'arrangeInFront:'
            }]
        }, {
            label: Lang.string('menu.help'),
            submenu: [{
                label: Lang.string('menu.website'),
                click() {
                    shell.openExternal(pkg.homepage);
                }
            }, {
                label: Lang.string('menu.project'),
                click() {
                    shell.openExternal('https://github.com/easysoft/xuanxuan');
                }
            }, {
                label: Lang.string('menu.community'),
                click() {
                    shell.openExternal('https://github.com/easysoft/xuanxuan');
                }
            }, {
                label: Lang.string('menu.issues'),
                click() {
                    shell.openExternal('https://github.com/easysoft/xuanxuan/issues');
                }
            }]
        }];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
};

// 当 Electron 初始化完毕且创建完窗口时调用
ElectronApp.on('ready', async () => {
    // 安装 Electron 调试扩展
    await installExtensions();

    // 通知应用管理程序就绪
    application.ready();

    // 创建应用窗口菜单
    createMenu();
});

// 当 Electron 应用被激活时调用
ElectronApp.on('activate', () => {
    // 在 OS X 系统上，可能存在所有应用窗口关闭了，但是程序还没关闭，此时如果收到激活应用请求需要
    // 重新打开应用窗口并创建应用菜单
    application.openOrCreateWindow();
    createMenu();
});

// 设置关于窗口
if (typeof ElectronApp.setAboutPanelOptions === 'function') {
    ElectronApp.setAboutPanelOptions({
        applicationName: Lang.title,
        applicationVersion: pkg.version,
        copyright: 'Copyright (C) 2017 cnezsoft.com',
        credits: `Licence: ${pkg.license}`,
        version: DEBUG ? '[debug]' : ''
    });
}
