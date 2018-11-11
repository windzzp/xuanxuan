import electron, {
    BrowserWindow, app as ElectronApp, Tray, Menu, nativeImage, globalShortcut, ipcMain, dialog,
} from 'electron';
import Lang from '../../lang';
import EVENT from './remote-events';
import Events from './events';

if (typeof DEBUG === 'undefined') {
    global.DEBUG = process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'development';
} else {
    global.DEBUG = DEBUG;
}

/**
 * 是否是 Mac OS 系统
 * @type {boolean}
 * @private
 */
const IS_MAC_OSX = process.platform === 'darwin';

/**
 * 是否显示调试日志信息
 * @type {boolean}
 * @private
 */
const SHOW_LOG = DEBUG;

if (DEBUG && process.type === 'renderer') {
    console.error('AppRemote must run in main process.');
}

/**
 * 文本选择右键菜单
 * @type {Menu}
 * @private
 */
const SELECT_MENU = Menu.buildFromTemplate([
    {role: 'copy', label: Lang.string('menu.copy')},
    {type: 'separator'},
    {role: 'selectall', label: Lang.string('menu.selectAll')}
]);

/**
 * 文本输入框右键菜单
 * @type {Menu}
 * @private
 */
const INPUT_MENU = Menu.buildFromTemplate([
    {role: 'undo', label: Lang.string('menu.undo')},
    {role: 'redo', label: Lang.string('menu.redo')},
    {type: 'separator'},
    {role: 'cut', label: Lang.string('menu.cut')},
    {role: 'copy', label: Lang.string('menu.copy')},
    {role: 'paste', label: Lang.string('menu.paste')},
    {type: 'separator'},
    {role: 'selectall', label: Lang.string('menu.selectAll')}
]);

/**
 * Electron 主进程运行时管理类
 *
 * @class AppRemote
 */
class AppRemote {
    /**
     * 创建一个主进程运行时管理类实例
     * @memberof AppRemote
     */
    constructor() {
        /**
         * 保存打开的所有窗口实例
         * @type {Object<string, BrowserWindow>}
         */
        this.windows = {};

        /**
         * 保存应用运行时配置
         * @type {Object}
         */
        this.appConfig = {};

        // 绑定渲染进程请求退出事件
        ipcMain.on(EVENT.app_quit, e => {
            this.quit();
        });

        // 绑定与渲染进程通信事件
        ipcMain.on(EVENT.remote, (e, method, callBackEventName, ...args) => {
            let result = this[method];
            if (typeof result === 'function') {
                result = result.call(this, ...args);
            }
            if (method === 'quit') return;
            if (result instanceof Promise) {
                result.then(x => {
                    e.sender.send(callBackEventName, x);
                    return x;
                }).catch(error => {
                    console.warn('Remote error', error);
                });
            } else {
                e.sender.send(callBackEventName, result);
            }
            if (DEBUG) {
                console.info('\n>> Accept remote call', `${callBackEventName}.${method}(`, args, ')');
            }
        });

        // 绑定渲染进程请求发送消息到其他窗口渲染进程事件
        ipcMain.on(EVENT.remote_send, (e, windowName, eventName, ...args) => {
            const browserWindow = this.windows[windowName];
            if (browserWindow) {
                browserWindow.webContents.send(eventName, ...args);
            }
        });

        // 绑定渲染进程请求绑定主进程事件
        ipcMain.on(EVENT.remote_on, (e, eventId, event) => {
            Events.on(event, (...args) => {
                try {
                    e.sender.send(eventId, ...args);
                } catch (e) {
                    this.off(eventId);
                    if (SHOW_LOG) {
                        console.error(`\n>> Remote event '${event}' has be force removed, because window is closed.`, e);
                    }
                }
            });
            // this._eventsMap[eventId] = {remote: true, id: remoteOnEventId};
            if (SHOW_LOG) console.log('\n>> REMOTE EVENT on', event, eventId);
        });

        // 绑定渲染进程请求取消绑定主进程事件
        ipcMain.on(EVENT.remote_off, (e, eventId) => {
            Events.off(eventId);
            if (SHOW_LOG) console.log('\n>> REMOTE EVENT off', eventId);
        });

        // 绑定渲染进程请求触发主进程事件
        ipcMain.on(EVENT.remote_emit, (e, eventId, ...args) => {
            Events.emit(eventId, ...args);
            if (SHOW_LOG) console.log('\n>> REMOTE EVENT emit', eventId);
        });

        // 绑定渲染进程通知准备就绪事件
        ipcMain.on(EVENT.app_ready, (e, config) => {
            Object.assign(this.appConfig, config);
            const langInConfig = config.lang && config.lang[Lang.name];
            if (langInConfig) {
                Lang.update(langInConfig);
            }
            this.initTrayIcon();
            if (SHOW_LOG) console.log('\n>> App ready.', config);
        });

        // 设置 Electron 应用标题
        ElectronApp.setName(Lang.string('app.title'));
    }

    // 初始化并设置 Electron 应用入口路径
    init(entryPath) {
        if (!entryPath) {
            throw new Error('Argument entryPath must be set on init app-remote.');
        }

        this.entryPath = entryPath;
        global.entryPath = entryPath;
    }

    /**
     * 通知主进程准备就绪并打开主界面窗口
     * @memberof AppRemote
     * @return {void}
     */
    ready() {
        this.openMainWindow();
    }

    /**
     * 初始化通知栏图标功能
     * @memberof AppRemote
     * @return {void}
     */
    initTrayIcon() {
        if (this.tray) {
            this.tray.destroy();
        }

        // 创建一个通知栏图标
        const tray = new Tray(`${this.entryPath}/${this.appConfig.media['image.path']}tray-icon-16.png`);

        // 设置通知栏图标右键菜单功能
        const trayContextMenu = Menu.buildFromTemplate([
            {
                label: Lang.string('common.open'),
                click: () => {
                    this.showAndFocusWindow();
                }
            }, {
                label: Lang.string('common.exit'),
                click: () => {
                    this.mainWindow.webContents.send(EVENT.remote_app_quit, 'quit');
                }
            }
        ]);

        // 设置通知栏图标鼠标提示
        tray.setToolTip(Lang.string('app.title'));

        // 绑定通知栏图标点击事件
        tray.on('click', () => {
            this.showAndFocusWindow();
        });

        // 绑定通知栏图标右键点击事件
        tray.on('right-click', () => {
            tray.popUpContextMenu(trayContextMenu);
        });

        /**
         * 通知栏图标管理器
         * @type {Tray}
         */
        this.tray = tray;

        /**
         * 通知栏图标图片缓存
         * @type {string[]}
         * @private
         */
        this._trayIcons = [
            nativeImage.createFromPath(`${this.entryPath}/${this.appConfig.media['image.path']}tray-icon-16.png`),
            nativeImage.createFromPath(`${this.entryPath}/${this.appConfig.media['image.path']}tray-icon-transparent.png`)
        ];

        /**
         * 通知栏图标闪烁计数器
         * @type {number}
         * @private
         */
        this._trayIconCounter = 0;
    }

    /**
     * 创建应用主窗口
     *
     * @param {Object} options Electron 窗口初始化选项
     * @memberof AppRemote
     * @return {void}
     */
    createMainWindow(options) {
        options = Object.assign({
            width: 900,
            height: 650,
            minWidth: 400,
            minHeight: 650,
            url: 'index.html',
            hashRoute: '/index',
            name: 'main',
            resizable: true,
            debug: true
        }, options);

        if (DEBUG) {
            const display = electron.screen.getPrimaryDisplay();
            options.height = display.workAreaSize.height;
            options.width = 800;
            options.x = display.workArea.x;
            options.y = display.workArea.y;
        }

        /**
         * 主窗口实例
         * @type {BrowserWindow}
         */
        this.mainWindow = this.createWindow(options);
    }

    /**
     * 创建应用窗口，所有可用的窗口初始化选项参考 @see https://electronjs.org/docs/api/browser-window#new-browserwindowoptions
     * @param {string} name 窗口名称，用户内部查询窗口实例
     * @param {Object} options Electron 窗口初始化选项
     * @memberof AppRemote
     * @return {BrowserWindow} 创建的应用窗口实例
     */
    createWindow(name, options) {
        if (typeof name === 'object') {
            options = name;
            // eslint-disable-next-line prefer-destructuring
            name = options.name;
        }

        options = Object.assign({
            name,
            showAfterLoad: true,
            hashRoute: `/${name}`,
            url: 'index.html',
            autoHideMenuBar: !IS_MAC_OSX,
            backgroundColor: '#ffffff',
            show: DEBUG,
            webPreferences: {webSecurity: false}
        }, options);

        let browserWindow = this.windows[name];
        if (browserWindow) {
            throw new Error(`The window with name '${name}' has already be created.`);
        }

        const windowSetting = Object.assign({}, options);
        ['url', 'showAfterLoad', 'debug', 'hashRoute', 'onLoad', 'beforeShow', 'afterShow', 'onClosed'].forEach(optionName => {
            delete windowSetting[optionName];
        });
        browserWindow = new BrowserWindow(windowSetting);
        // if(DEBUG) console.log('\n>> Create window with settings', windowSetting);
        this.windows[name] = browserWindow;
        browserWindow.on('closed', () => {
            delete this.windows[name];
            if (options.onClosed) {
                options.onClosed(name);
            }
        });

        browserWindow.webContents.on('did-finish-load', () => {
            if (options.showAfterLoad) {
                if (options.beforeShow) {
                    options.beforeShow(browserWindow, name);
                }
                browserWindow.show();
                browserWindow.focus();
                if (options.afterShow) {
                    options.afterShow(browserWindow, name);
                }
            }
            if (options.onLoad) {
                options.onLoad(browserWindow);
            }
        });

        // 阻止应用窗口导航到其他地址
        browserWindow.webContents.on('will-navigate', event => {
            event.preventDefault();
        });

        let {url} = options;
        if (url) {
            if (!url.startsWith('file://') && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = `file://${this.entryPath}/${options.url}`;
            }
            if (DEBUG) {
                url += '?react_perf';
            }
            if (options.hashRoute) {
                url += `#${options.hashRoute}`;
            }
            browserWindow.loadURL(url);
        }

        if (options.debug && DEBUG) {
            browserWindow.openDevTools();
            browserWindow.webContents.on('context-menu', (e, props) => {
                const {x, y} = props;
                Menu.buildFromTemplate([{
                    label: Lang.string('debug.inspectElement'),
                    click() {
                        browserWindow.inspectElement(x, y);
                    }
                }]).popup(browserWindow);
            });

            browserWindow.webContents.on('crashed', () => {
                const messageBoxOptions = {
                    type: 'info',
                    title: 'Renderer process crashed.',
                    message: 'The renderer process has been crashed, you can reload or close it.',
                    buttons: ['Reload', 'Close']
                };
                dialog.showMessageBox(messageBoxOptions, (index) => {
                    if (index === 0) {
                        browserWindow.reload();
                    } else {
                        browserWindow.close();
                    }
                });
            });
        }

        return browserWindow;
    }

    /**
     * 打开主窗口
     *
     * @memberof AppRemote
     * @return {void}
     */
    openMainWindow() {
        const {mainWindow} = this;
        if (!mainWindow) {
            this.createMainWindow();
        } else if (!mainWindow.isVisible()) {
            mainWindow.show();
            mainWindow.focus();
        }
    }

    /**
     * 获取主窗口实例
     * @memberof AppRemote
     * @type {BrowserWindow}
     */
    get mainWindow() {
        return this.windows.main;
    }

    /**
     * 设置主窗口实例
     * @param {BrowserWindow} mainWindow 主窗口实例
     * @memberof AppRemote
     */
    set mainWindow(mainWindow) {
        if (!mainWindow) {
            delete this.windows.main;
        } else {
            this.windows.main = mainWindow;
            mainWindow.on('close', e => {
                if (this.markClose) return;
                const now = new Date().getTime();
                if (this.lastRequestCloseTime && (now - this.lastRequestCloseTime) < 1000) {
                    electron.dialog.showMessageBox(mainWindow, {
                        buttons: [Lang.string('common.exitIM'), Lang.string('common.cancel')],
                        defaultId: 0,
                        type: 'question',
                        message: Lang.string('common.comfirmQuiteIM')
                    }, response => {
                        if (response === 0) {
                            setTimeout(() => {
                                this.quit();
                            }, 0);
                        }
                    });
                } else {
                    this.lastRequestCloseTime = now;
                    mainWindow.webContents.send(EVENT.remote_app_quit);
                }
                e.preventDefault();
                return false;
            });

            // 绑定右键菜单事件
            mainWindow.webContents.on('context-menu', (e, props) => {
                const {selectionText, isEditable} = props;
                if (isEditable) {
                    INPUT_MENU.popup(mainWindow);
                }
            });
        }
    }

    /**
     * 关闭主窗口
     * @return {void}
     * @memberof AppRemote
     */
    closeMainWindow() {
        this.markClose = true;
        const {mainWindow} = this;
        if (mainWindow) {
            mainWindow.close();
        }
    }

    /**
     * 通过 IPC 向所有应用窗口渲染渲染进程发送消息
     *
     * @param {string} channel 事件频道
     * @param {...any} args 事件参数
     * @return {void}
     * @memberof AppRemote
     */
    sendToWindows(channel, ...args) {
        Object.keys(this.windows).forEach(name => {
            this.sendToWindow(name, channel, ...args);
        });
    }

    /**
     * 通过 IPC 向指定名称的应用窗口渲染渲染进程发送消息
     *
     * @param {string} name 应用窗口名称
     * @param {string} channel 事件频道
     * @param {...any} args 事件参数
     * @return {void}
     * @memberof AppRemote
     */
    sendToWindow(name, channel, ...args) {
        const browserWindow = this.windows[name];
        if (browserWindow) {
            browserWindow.webContents.send(channel, ...args);
        }
    }

    /**
     * 设置通知栏图标工具提示（鼠标悬停显示）消息
     *
     * @param {string|boolean} tooltip 要设置的消息文本，如果设置为 `false`，则显示应用默认名称
     * @memberof AppRemote
     * @return {void}
     */
    trayTooltip(tooltip) {
        this.tray.setToolTip(tooltip || Lang.string('app.title'));
    }

    /**
     * 闪烁通知栏图标
     *
     * @param {boolean} [flash=true] 如果设置为 `true` 则闪烁图标；如果设置为 `false` 则取消闪烁图标
     * @memberof AppRemote
     * @return {void}
     */
    flashTrayIcon(flash = true) {
        if (flash) {
            if (!this._flashTrayIconTask) {
                this._flashTrayIconTask = setInterval(() => {
                    this.tray.setImage(this._trayIcons[(this._trayIconCounter++) % 2]);
                }, 400);
            }
        } else {
            if (this._flashTrayIconTask) {
                clearInterval(this._flashTrayIconTask);
                this._flashTrayIconTask = null;
            }
            this.tray.setImage(this._trayIcons[0]);
        }
    }

    /**
     * 显示并激活指定名称的窗口，如果不指定名称，则激活并显示主窗口
     *
     * @param {string} [windowName='main'] 窗口名称
     * @memberof AppRemote
     * @return {void}
     */
    showAndFocusWindow(windowName = 'main') {
        const browserWindow = this.windows[windowName];
        if (browserWindow) {
            if (browserWindow.isMinimized()) {
                browserWindow.restore();
            } else {
                browserWindow.show();
            }
            browserWindow.focus();
        }
    }

    /**
     * 立即关闭并退出应用程序
     *
     * @memberof AppRemote
     * @return {void}
     */
    quit() {
        this.closeMainWindow();
        this.tray.destroy();
        globalShortcut.unregisterAll();
        ElectronApp.quit();
    }

    /**
     * 设置 Mac Dock 栏应用图标上的原点提示文本
     *
     * @param {string} label 提示文本
     * @memberof AppRemote
     * @return {void}
     */
    dockBadgeLabel(label) {
        if (IS_MAC_OSX) {
            ElectronApp.dock.setBadge(label);
        }
    }

    /**
     * 使 Mac Dock 栏应用图标弹跳并引起用户注意
     *
     * @param {string} [type='informational'] 弹跳类型
     * @memberof AppRemote
     * @return {void}
     */
    dockBounce(type = 'informational') {
        if (IS_MAC_OSX) {
            ElectronApp.dock.bounce(type);
        }
    }
}

/**
 * Electron 主进程运行时管理类全局唯一实例
 * @type {AppRemote}
 */
const app = new AppRemote();

if (DEBUG) console.info('App created.');

export default app;
