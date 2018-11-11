import Platform from 'Platform'; // eslint-disable-line
import Config from '../config'; // eslint-disable-line
import Server from './server';
import MemberProfileDialog from '../views/common/member-profile-dialog';
import Messager from '../components/messager';
import ContextMenu from '../components/context-menu';
import modal from '../components/modal';
import {isWebUrl, getSearchParam} from '../utils/html-helper';
import Lang from '../lang';
import events from './events';
import profile from './profile';
import Notice from './notice';
import ImageViewer from '../components/image-viewer';
import Store from '../utils/store';
import {executeCommandLine, registerCommand} from './commander';
import WebViewDialog from '../views/common/webview-dialog';
import {addContextMenuCreator, showContextMenu} from './context-menu';

/**
 * 事件表
 * @type {Object<string, string>}
 * @private
 */
const EVENT = {
    app_link: 'app.link',
    net_online: 'app.net.online',
    net_offline: 'app.net.offline',
    ready: 'app.ready'
};

// 添加图片上下文菜单生成器
addContextMenuCreator('image', ({url, dataType}) => {
    const items = [{
        label: Lang.string('menu.image.view'),
        click: () => {
            ImageViewer.show(url);
        }
    }];
    if (Platform.clipboard && Platform.clipboard.writeImageFromUrl) {
        items.push({
            label: Lang.string('menu.image.copy'),
            click: () => {
                Platform.clipboard.writeImageFromUrl(url, dataType);
            }
        });
    }
    if (Platform.dialog && Platform.dialog.saveAsImageFromUrl) {
        items.push({
            label: Lang.string('menu.image.saveAs'),
            click: () => {
                if (url.startsWith('file://')) {
                    url = url.substr(7);
                }
                return Platform.dialog.saveAsImageFromUrl(url, dataType).then(filename => {
                    if (filename) {
                        Messager.show(Lang.format('file.fileSavedAt.format', filename), {
                            actions: Platform.ui.openFileItem ? [{
                                label: Lang.string('file.open'),
                                click: () => {
                                    Platform.ui.openFileItem(filename);
                                }
                            }, {
                                label: Lang.string('file.openFolder'),
                                click: () => {
                                    Platform.ui.showItemInFolder(filename);
                                }
                            }] : null
                        });
                    }
                });
            }
        });
    }
    if (Platform.ui.openFileItem && dataType !== 'base64') {
        items.push({
            label: Lang.string('menu.image.open'),
            click: () => {
                if (url.startsWith('file://')) {
                    url = url.substr(7);
                }
                Platform.ui.openFileItem(url);
            }
        });
    }

    return items;
});

// 添加成员上下文菜单生成器
addContextMenuCreator('member', ({member}) => {
    return [{
        label: Lang.string('member.profile.view'),
        click: () => {
            MemberProfileDialog.show(member);
        }
    }];
});

/**
 * 绑定界面上链接点击事件
 * @param {string} type 链接目标类型
 * @param {function(target: string, element: Element)} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onAppLinkClick = (type, listener) => {
    return events.on(`${EVENT.app_link}.${type}`, listener);
};

/**
 * 触发界面上链接点击事件
 * @param {Element} element 触发元素
 * @param {string} type 链接目标类型
 * @param {string} target  链接目标
 * @param  {...any} params 其他参数
 * @return {void}
 */
export const emitAppLinkClick = (element, type, target, ...params) => {
    return events.emit(`${EVENT.app_link}.${type}`, target, element, ...params);
};

// 处理点击成员名称链接事件（弹出个人资料对话框）
onAppLinkClick('Member', target => {
    MemberProfileDialog.show(target);
});

/**
 * 自动清除拷贝成功提示计时器 ID
 * @type {number}
 * @private
 */
let clearCopyCodeTip = null;
if (Platform.clipboard && Platform.clipboard.writeText) {
    // 注册处理拷贝代码命令
    registerCommand('copyCode', context => {
        const element = context.targetElement;
        if (element) {
            if (clearCopyCodeTip) {
                clearTimeout(clearCopyCodeTip);
                clearCopyCodeTip = null;
            }
            const code = element.nextElementSibling.innerText;
            Platform.clipboard.writeText(code);
            element.setAttribute('data-hint', Lang.string('common.copied'));
            element.classList.add('hint--success');
            clearCopyCodeTip = setTimeout(() => {
                clearCopyCodeTip = null;
                element.setAttribute('data-hint', Lang.string('common.copyCode'));
                element.classList.remove('hint--success');
            }, 2000);
            return true;
        }
        return false;
    });
}

// 处理用户登录事件
Server.onUserLogin((user, loginError) => {
    if (!loginError && user.isFirstSignedToday) {
        Messager.show(Lang.string('login.signed'), {
            type: 'success',
            icon: 'calendar-check',
            autoHide: true,
        });
    }
    if (typeof Pace !== 'undefined') {
        Pace.stop();
    }
});

// 处理用户退出登录事件
Server.onUserLoginout((user, code, reason, unexpected) => {
    if (user) {
        let errorCode = null;
        if (reason === 'KICKOFF') {
            errorCode = 'KICKOFF';
        }
        if (errorCode) {
            Messager.show(Lang.error(errorCode), {
                type: 'danger',
                icon: 'alert',
                actions: [{
                    label: Lang.string('login.retry'),
                    click: () => {
                        Server.login(user);
                    }
                }]
            });
            if (Notice.requestAttention) {
                Notice.requestAttention();
            }
        }
    }
});

// 为 `<body>` 添加操作系统辅助类，例如 `'os-mac'` 或 `'os-win'`
document.body.classList.add(`os-${Platform.env.os}`);

/**
 * 在扩展应用中功能打开链接
 * @param {string} url 要打开的地址
 * @param {string} appName 应用名称
 * @return {void}
 */
export const openUrlInApp = (url, appName) => {
    executeCommandLine(`openInApp/${appName}/${encodeURIComponent(appName)}`, {appName, url});
};

/**
 * 在对话框中打开链接
 * @param {string} url 要打开的链接
 * @param {Object} options 选项
 * @param {function} callback 对话框显示后的回调函数
 * @return {void}
 */
export const openUrlInDialog = (url, options, callback) => {
    options = Object.assign({url}, options);
    WebViewDialog.show(url, options, callback);
};

// 注册在对话框中打开链接命令
registerCommand('openUrlInDialog', (context, url) => {
    if (!url && context.options && context.options.url) {
        url = context.options.url;
    }
    const options = context.options;
    if (url) {
        openUrlInDialog(url, options);
        return true;
    }
    return false;
});

/**
 * 在系统默认浏览器中打开链接
 * @param {stirng} url 要打开的链接
 * @return {void}
 */
export const openUrlInBrowser = url => {
    return Platform.ui.openExternal(url);
};

// 注册在系统默认浏览器中打开链接命令
registerCommand('openUrlInBrowser', (context, url) => {
    if (!url && context.options && context.options.url) {
        url = context.options.url;
    }
    if (url) {
        openUrlInBrowser(url);
        return true;
    }
    return false;
});

/**
 * 根据界面事件打开链接，自动选择打开的方式
 * @param {string} url 要打开的链接
 * @param {Element} targetElement 触发事件元素
 * @param {Event} event 界面事件对象
 * @returns {boolean} 如果返回 `true` 则打开成功，否则为打开失败
 */
export const openUrl = (url, targetElement, event) => {
    if (isWebUrl(url)) {
        if (global.ExtsRuntime) {
            const extInspector = global.ExtsRuntime.getUrlOpener(url, targetElement);
            if (extInspector && extInspector) {
                const openResult = extInspector.open(url);
                if (openResult === true || openResult === false) {
                    return openResult;
                } else if (typeof openResult === 'string') {
                    if (isWebUrl(openResult)) {
                        return openUrlInBrowser(openResult);
                    }
                    return openUrl(openResult, targetElement);
                }
            }
        }
        openUrlInBrowser(url);
        return true;
    } else if (url[0] === '@') {
        const params = url.substr(1).split('/').map(decodeURIComponent);
        emitAppLinkClick(targetElement, ...params);
        return true;
    } else if (url[0] === '!') {
        executeCommandLine(url.substr(1), {targetElement, event});
        return true;
    }
};

// 监听页面上的点击事件
document.addEventListener('click', e => {
    let {target} = e;
    while (target && !((target.classList && target.classList.contains('app-link')) || (target.tagName === 'A' && target.attributes.href))) {
        target = target.parentNode;
    }

    if (target && (target.tagName === 'A' || target.classList.contains('app-link')) && (target.attributes.href || target.attributes['data-url'])) {
        const link = (target.attributes['data-url'] || target.attributes.href).value;
        if (openUrl(link, target, e)) {
            e.preventDefault();
        }
    }
});

// 监听网络成功连接事件
window.addEventListener('online', () => {
    if (profile.user) {
        if (!Server.socket.isLogging) {
            Server.login(profile.user);
        }
    }
});

// 监听网络连接断开事件
window.addEventListener('offline', () => {
    if (profile.isUserOnline) {
        profile.user.markDisconnect();
        Server.socket.close(null, 'net_offline');
    }
});

/**
 * 检查拖拽结束计时任务 ID
 * @type {number}
 * @private
 */
let dragLeaveTask;

/**
 * 完成拖拽事件
 * @return {void}
 * @private
 */
const completeDragNDrop = () => {
    document.body.classList.remove('drag-n-drop-over-in');
    setTimeout(() => {
        document.body.classList.remove('drag-n-drop-over');
    }, 350);
};

// 监听界面上拖拽过程中事件
window.ondragover = e => {
    clearTimeout(dragLeaveTask);
    if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        document.body.classList.add('drag-n-drop-over');
        setTimeout(() => {
            document.body.classList.add('drag-n-drop-over-in');
        }, 10);
    }
    e.preventDefault();
    return false;
};

// 监听界面上拖拽离开
window.ondragleave = e => {
    clearTimeout(dragLeaveTask);
    dragLeaveTask = setTimeout(completeDragNDrop, 300);
    e.preventDefault();
    return false;
};

// 监听界面上拖拽完成
window.ondrop = e => {
    clearTimeout(dragLeaveTask);
    completeDragNDrop();
    if (DEBUG) {
        console.collapse('DRAG FILE', 'redBg', (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length ? e.dataTransfer.files[0].path : ''), 'redPale');
        console.log(e);
        console.groupEnd();
    }
    e.preventDefault();
    return false;
};

// 如果平台支持自主处理退出策略则询问用户如何退出
if (Platform.ui.onRequestQuit) {
    Platform.ui.onRequestQuit(closeReason => {
        if (closeReason !== 'quit') {
            const user = profile.user;
            if (user && !user.isUnverified) {
                const appCloseOption = user.config.appCloseOption;
                if (appCloseOption === 'minimize' || !Platform.ui.showQuitConfirmDialog) {
                    Platform.ui.hideWindow();
                    return false;
                } else if (appCloseOption !== 'close' && Platform.ui.showQuitConfirmDialog) {
                    Platform.ui.showQuitConfirmDialog((result, checked) => {
                        if (checked && result) {
                            user.config.appCloseOption = result;
                        }
                        if (result === 'close') {
                            Server.logout();
                        }
                        return result;
                    });
                    return false;
                }
            }
        }
        Server.logout();
    });
}

/**
 * 立即退出应用
 * @private
 * @type {function}
 */
let _quit = null;
if (Platform.ui.quit) {
    _quit = (delay = 1000, ignoreListener = true) => {
        if (ignoreListener) {
            Server.logout();
        }
        Platform.ui.quit(delay, ignoreListener);
    };
}

/**
 * 立即退出应用
 * @type {function}
 */
export const quit = _quit;

// 监听应用窗口最小化事件
if (Platform.ui.onWindowMinimize) {
    Platform.ui.onWindowMinimize(() => {
        const {userConfig} = profile;
        if (userConfig && userConfig.removeFromTaskbarOnHide) {
            Platform.ui.setShowInTaskbar(false);
        }
    });
}

// 监听应用窗口失去焦点事件
if (Platform.ui.onWindowBlur && Platform.ui.hideWindow) {
    Platform.ui.onWindowBlur(() => {
        const {userConfig} = profile;
        if (userConfig && userConfig.hideWindowOnBlur) {
            Platform.ui.hideWindow();
        }
    });
}

/**
 * 重新加载窗口
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const reloadWindow = () => {
    return modal.confirm(Lang.string('dialog.reloadWindowConfirmTip'), {title: Lang.string('dialog.reloadWindowConfirm')}).then(confirmed => {
        if (confirmed) {
            Server.logout();
            setTimeout(() => {
                Store.set('autoLoginNextTime', true);
                if (Platform.ui.reloadWindow) {
                    Platform.ui.reloadWindow();
                } else {
                    window.location.reload();
                }
            }, 1000);
        }
        return Promise.resolve(confirm);
    });
};

/**
 * 判断是否在下次启动自动登录
 * @returns {boolean} 如果返回 `true` 则为下次启动自动登录，否则为不自动登录
 */
export const isAutoLoginNextTime = () => {
    const autoLoginNextTime = Store.get('autoLoginNextTime');
    if (autoLoginNextTime) {
        Store.remove('autoLoginNextTime');
    }
    return autoLoginNextTime;
};

/**
 * 通过浏览器查询字符串传入的登录参数
 * @type {object}
 */
export const entryParams = getSearchParam();

/**
 * 触发界面准备就绪事件
 * @return {void}
 */
export const triggerReady = () => {
    events.emit(EVENT.ready);
};

/**
 * 绑定界面准备就绪事件
 * @param {funcion} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onReady = listener => {
    return events.on(EVENT.ready, listener);
};

/**
 * 设置应用窗口标题
 * @param {string} title 窗口标题
 * @return {void}
 */
export const setTitle = title => {
    document.title = title;
};

// 设置默认标题
setTitle(Lang.string('app.title'));

/**
 * 浏览器地址解析缓存
 * @private
 * @type {Object}
 */
const urlMetaCaches = {};

/**
 * 最大浏览器解析缓存大小
 * @type {number}
 * @private
 */
const maxUrlCacheSize = 20;

/**
 * 解析浏览器地址信息
 * @param {string} url 要解析的地址
 * @param {boolean} [disableCache=false] 是否禁止使用缓存
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const getUrlMeta = (url, disableCache = false) => {
    if (!Config.ui['chat.urlInspector']) {
        return Promise.resolve({url, title: url});
    }
    if (!disableCache) {
        const urlMetaCache = urlMetaCaches[url];
        if (urlMetaCache) {
            return Promise.resolve(urlMetaCache.meta);
        }
    }
    if (Platform.ui.getUrlMeta) {
        let extInspector = null;
        if (global.ExtsRuntime) {
            extInspector = global.ExtsRuntime.getUrlInspector(url);
        }
        const getUrl = () => {
            if (extInspector && extInspector.getUrl) {
                const urlResult = extInspector.getUrl(url);
                if (urlResult instanceof Promise) {
                    return urlResult;
                }
                return Promise.resolve(urlResult);
            }
            return Promise.resolve(url);
        };
        if (extInspector && extInspector.noMeta && extInspector.inspect) {
            return getUrl().then(url => {
                const cardMeta = extInspector.inspect(url);
                if (cardMeta instanceof Promise) {
                    return cardMeta;
                }
                return Promise.resolve(cardMeta);
            });
        }
        return getUrl().then(Platform.ui.getUrlMeta).then(meta => {
            const {favicon} = meta;
            let cardMeta = {
                url,
                title: meta.title,
                image: meta.image,
                subtitle: (meta.title && meta.title !== url) ? url : null,
                content: meta.description && meta.description.length > 200 ? `${meta.description.substring(0, 150)}...` : meta.description,
                icon: favicon ? favicon.href : null
            };
            if (meta.isImage) {
                cardMeta.contentUrl = url;
                cardMeta.contentType = 'image';
                cardMeta.icon = 'mdi-image text-green icon-2x';
            } else if (meta.isVideo) {
                cardMeta.contentUrl = url;
                cardMeta.contentType = 'video';
                cardMeta.clickable = 'title';
                cardMeta.icon = 'mdi-video text-red icon-2x';
            }
            if (cardMeta.image && cardMeta.image.startsWith('//')) {
                cardMeta.image = `https:${cardMeta.image}`;
            }
            if (cardMeta.icon && cardMeta.icon.startsWith('//')) {
                cardMeta.icon = `https:${cardMeta.icon}`;
            }
            if (extInspector && extInspector.inspect) {
                try {
                    cardMeta = extInspector.inspect(meta, cardMeta, url);
                } catch (err) {
                    if (DEBUG) {
                        console.error('Inspect url error', {
                            err,
                            meta,
                            cardMeta,
                            extInspector
                        });
                    }
                }
                if (cardMeta instanceof Promise) {
                    return cardMeta.then(cardMeta => {
                        cardMeta.provider = extInspector.provider;
                        return Promise.resolve(cardMeta);
                    });
                } else if (cardMeta) {
                    cardMeta.provider = extInspector.provider;
                    return Promise.resolve(cardMeta);
                }
            }

            // Save cache
            let cacheKeys = Object.keys(urlMetaCaches);
            if (cacheKeys.length > maxUrlCacheSize) {
                cacheKeys = cacheKeys.sort((x, y) => {
                    return x.time - y.time;
                });
                for (let i = 0; i < (cacheKeys.length - maxUrlCacheSize); ++i) {
                    delete urlMetaCaches[cacheKeys[i]];
                }
            }
            urlMetaCaches[url] = {meta: cardMeta, time: new Date().getTime()};

            return Promise.resolve(cardMeta);
        });
    }
    return Promise.resolve({url, title: url});
};

/**
 * 全局快捷键是否可用
 * @type {boolean}
 * @private
 */
let isGlobalShortcutDisabled = false;

/**
 * 全局快捷键表
 * @private
 * @type {Object}
 */
let globalHotkeys = null;

/**
 * 注册全局快捷键
 * @param {User} loginUser 当前登录的用户
 * @param {Error} loginError 登录错误信息
 * @return {void}
 * @private
 */
const registerShortcut = (loginUser, loginError) => {
    if (!Platform.shortcut) {
        return;
    }
    if (loginError) {
        return;
    }
    const {userConfig} = profile;
    if (userConfig) {
        // eslint-disable-next-line prefer-destructuring
        globalHotkeys = userConfig.globalHotkeys;
        Object.keys(globalHotkeys).forEach(name => {
            Platform.shortcut.registerGlobalShortcut(name, globalHotkeys[name], () => {
                if (!isGlobalShortcutDisabled) {
                    executeCommandLine(`shortcut.${name}`);
                } else if (DEBUG) {
                    console.log(`Global shortcut command '${name}' skiped.`);
                }
            });
        });
    }
};

/**
 * 取消注册全局快捷键
 * @return {void}
 * @private
 */
const unregisterGlobalShortcut = () => {
    if (!Platform.shortcut) {
        return;
    }
    if (globalHotkeys) {
        Object.keys(globalHotkeys).forEach(name => {
            Platform.shortcut.unregisterGlobalShortcut(name);
        });
        globalHotkeys = null;
    }
};

// 处理全局快捷键注册和反注册
if (Platform.shortcut) {
    profile.onUserConfigChange((change, config) => {
        if (change && Object.keys(change).some(x => x.startsWith('shortcut.'))) {
            registerShortcut();
        }
        if (config.needSave) {
            Server.socket.uploadUserSettings();
        }
    });
    Server.onUserLogin(registerShortcut);
    Server.onUserLoginout(unregisterGlobalShortcut);

    if (Platform.ui.showAndFocusWindow) {
        registerCommand('shortcut.focusWindowHotkey', () => {
            if (Platform.ui.hideWindow && Platform.ui.isWindowOpenAndFocus) {
                Platform.ui.hideWindow();
            } else {
                Platform.ui.showAndFocusWindow();
            }
        });
    }
}

// 注册显示上下文菜单命令
registerCommand('showContextMenu', (context, name) => {
    const {options, event} = context;
    showContextMenu(name, {options, event})
});

/**
 * 判断当前应用窗口是否是小窗口模式
 * @returns {boolean} 如果返回 `true` 则为是小窗口模式，否则为不是小窗口模式
 */
export const isSmallScreen = () => {
    return window.innerWidth < 768;
};

/**
 * 切换显示小窗口模式，实际是在 `<body>` 元素上切换添加 `'app-show-chats-menu'` 类，用于应用不同的 CSS 样式
 * @param {boolean} [toggle=null] 是否显示小窗口模式，如果为 `true` 则切换为小窗口模式，如果为 `false` 则取消切换小窗口模式，如果为其他值则根据当前的模式自动切换（到另一种模式）
 * @return {void}
 */
export const showMobileChatsMenu = (toggle = null) => {
    if (!isSmallScreen()) {
        return;
    }
    const {classList} = document.body;
    if (toggle === true) {
        classList.add('app-show-chats-menu');
    } else if (toggle === false) {
        classList.remove('app-show-chats-menu');
    } else {
        classList.toggle('app-show-chats-menu');
    }
};

/**
 * 禁用全局快捷键
 * @param {boolean} [disabled=true] 是否禁用全局快捷键，如果为 `false` 则为取消禁用，否则为禁用
 * @return {void}
 */
export const disableGlobalShortcut = (disabled = true) => {
    isGlobalShortcutDisabled = disabled;
    unregisterGlobalShortcut();
};

/**
 * 启用全局快捷键
 * @return {void}
 */
export const enableGlobalShortcut = () => {
    isGlobalShortcutDisabled = false;
    registerShortcut();
};

// 监听浏览器地址栏 hash 参数变更事件
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (DEBUG) {
        console.color('➜', 'orangeBg', hash.substr(1), 'orangePale');
    }
    if (hash.includes('/:filterType/')) {
        window.location.hash = hash.replace('/:filterType/', '/recents/');
    }
}, false);

export default {
    entryParams,
    get canQuit() {
        return !!Platform.ui.quit;
    },
    isSmallScreen,
    showMobileChatsMenu,
    disableGlobalShortcut,
    enableGlobalShortcut,
    onAppLinkClick,
    emitAppLinkClick,
    quit,
    showMessger: Messager.show,
    showContextMenu: ContextMenu.show,
    modal,
    reloadWindow,
    triggerReady,
    onReady,
    isAutoLoginNextTime,
    openUrl,
    getUrlMeta,
    openUrlInDialog,
    openUrlInBrowser,
    openUrlInApp
};
