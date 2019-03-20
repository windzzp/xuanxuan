import events from '../events';
import profile from '../profile';
import chats, {getChat} from './im-chats';
import Lang from '../lang';
import Server, {deleteChatMessage} from './im-server';
import members from '../members';
import StringHelper, {formatBytes} from '../../utils/string-helper';
import DateHelper from '../../utils/date-helper';
import Modal from '../../components/modal';
import ContextMenu from '../../components/context-menu';
import ChatCommittersSettingDialog from '../../views/chats/chat-committers-setting-dialog';
import ChatsHistoryDialog from '../../views/chats/chats-history-dialog';
import ChatInviteDialog from '../../views/chats/chat-invite-dialog';
import ChatTipPopover from '../../views/chats/chat-tip-popover';
import ChatShareDialog from '../../views/chats/chat-share-dialog';
import EmojiPopover from '../../views/common/emoji-popover';
import HotkeySettingDialog from '../../views/common/hotkey-setting-dialog';
import Markdown from '../../utils/markdown';
import Emojione from '../../components/emojione';
import ChatChangeFontPopover from '../../views/chats/chat-change-font-popover';
import db from '../db';
import ChatAddCategoryDialog from '../../views/chats/chat-add-category-dialog';
import TodoEditorDialog from '../../views/todo/todo-editor-dialog';
import {createTodoFromMessage} from '../todo';
import {strip, linkify, escape} from '../../utils/html-helper';
import {
    addContextMenuCreator, getMenuItemsForContext, tryAddDividerItem, tryRemoveLastDivider
} from '../context-menu';
import ui from '../ui';
import {registerCommand, executeCommandLine, executeCommand} from '../commander';
import Config from '../../config';
import platform from '../../platform';
import ChatCacheInfo from './chat-cache-info.ts';
import {checkUploadFileSize} from './im-files';
import {showConfirmSendFilesDialog} from '../../views/chats/confirm-send-files-dialog';


/**
 * 当前激活的聊天实例 ID
 * @type {number}
 * @private
 */
let activedChatId = null;

/**
 * 当前激活过的聊天缓存
 * @type {Object<string, Chat>}
 * @private
 */
let activeCaches = {};

/**
 * 事件表
 * @type {Object<string, string>}
 * @private
 */
const EVENT = {
    activeChat: 'im.chats.activeChat',
    sendContentToChat: 'im.chats.sendContentToChat',
    suggestSendImage: 'im.chats.suggestSendImage',
    sendboxFocus: 'im.chat.sendbox.focus',
    showReeditHandle: 'im.message.showReedit',
};

/**
 * 在界面上激活聊天
 * @param {Chat|string} chat 聊天实例或者聊天 GID
 * @param {string} [menu] 要激活的菜单类型
 * @return {void}
 */
export const activeChat = (chat, menu) => {
    if ((typeof chat === 'string') && chat.length) {
        chat = chats.get(chat);
    }
    if (chat) {
        const urlHash = window.location.hash;
        if (menu) {
            if (!urlHash.endsWith(`/${menu}/${chat.gid}`)) {
                window.location.hash = `#/chats/${menu}/${chat.gid}`;
            }
        } else if (!urlHash.endsWith(`/${chat.gid}`)) {
            window.location.hash = `#/chats/recents/${chat.gid}`;
        }
    }
};

/**
 * 设置界面上激活的聊天
 * @param {Chat|string} chat 聊天实例或者聊天 GID
 * @return {void}
 */
export const setActiveChat = (chat) => {
    if ((typeof chat === 'string') && chat.length) {
        chat = chats.get(chat);
    }
    if (chat) {
        const cacheInfo = activeCaches[chat.gid];
        if (!cacheInfo) {
            activeCaches[chat.gid] = new ChatCacheInfo(chat.gid);
        } else {
            cacheInfo.active();
        }
        if (chat.noticeCount) {
            chat.muteNotice();
            chats.saveChatMessages(chat.messages, chat);
        }
        if (!activedChatId || chat.gid !== activedChatId) {
            if (activedChatId) {
                const oldActiveChatCacheInfo = activeCaches[activedChatId];
                if (oldActiveChatCacheInfo) {
                    oldActiveChatCacheInfo.active();
                }
            }
            activedChatId = chat.gid;
            events.emit(EVENT.activeChat, chat);
            ui.showMobileChatsMenu(false);
        }
    }
};

/**
 * 激活最后一个有更新的聊天
 * @return {void}
 */
export const activeLastChat = () => {
    const lastChat = chats.getLastRecentChat();
    if (lastChat) {
        activeChat(lastChat);
    }
};

/**
 * 判断给定的聊天是否是当前激活的聊天
 * @param {string} chatGid 聊天 GID
 * @returns {boolean} 如果返回 `true` 则为是当前激活的聊天，否则为不是当前激活的聊天
 */
export const isActiveChat = chatGid => activedChatId === chatGid;

/**
 * 绑定聊天激活事件
 * @param {Funcion} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onActiveChat = listener => events.on(EVENT.activeChat, listener);

/**
 * 检查聊天缓存是否变更
 * @returns {boolean} 如果返回 `true` 则为有聊天缓存变更，否则为没有聊天缓存变更
 */
export const isChatsCacheChanged = () => {
    const now = new Date().getTime();
    return Object.keys(activeCaches).some(cgid => {
        if (cgid === activedChatId) {
            return false;
        }
        const cacheInfo = activeCaches[cgid];
        if (DEBUG && cacheInfo.isExpired(now, Config.ui['chat.cacheLife'])) {
            console.log('check cache', cacheInfo.gid, cacheInfo);
        }
        return cacheInfo.isExpired(now, Config.ui['chat.cacheLife']);
    });
};

/**
 * 保存聊天缓存在界面上的状态，以便于恢复界面
 * @param {string} cgid 聊天 gid
 * @param {{draft?: any, scrollPos?: number}} newState 新的状态
 * @return {void}
 */
export const setChatCacheState = (cgid, newState) => {
    const cacheInfo = activeCaches[cgid];
    if (cacheInfo) {
        cacheInfo.keepState(newState);
    }
};

/**
 * 取出聊天缓存在界面上保存的状态
 * @param {string} cgid 聊天 gid
 * @param {string} stateName 状态名称，可以为 `'draft'` 或 `'scrollPos'`
 * @return {any}
 */
export const takeOutChatCacheState = (cgid, stateName) => {
    const cacheInfo = activeCaches[cgid];
    if (cacheInfo) {
        return cacheInfo.takeOutState(stateName);
    }
};

/**
 * 尝试激活聊天并获取缓存中的聊天消息 GID 列表
 * @param {?string} activeChatId 要激活的聊天 ID
 * @return {string[]} 聊天消息 GID 列表
 */
export const getActivedCacheChatsGID = (activeChatId) => {
    if (activeChatId && getChat(activeChatId)) {
        const cacheInfo = activeCaches[activeChatId];
        if (!cacheInfo) {
            activeCaches[activeChatId] = new ChatCacheInfo(activeChatId);
        } else {
            cacheInfo.active();
        }
    }
    const now = new Date().getTime();
    return Object.keys(activeCaches).filter(cgid => {
        if (cgid !== activedChatId) {
            const cacheInfo = activeCaches[cgid];
            if (cacheInfo.isCleaned) {
                return false;
            }
            if (cacheInfo.isExpired(now, Config.ui['chat.cacheLife'])) {
                const chat = getChat(cacheInfo.cgid);
                if (chat) {
                    chat.deleteCache();
                }
                cacheInfo.clean();
                if (DEBUG) {
                    console.collapse('Chat cache cleaned', 'tealBg', chat.getDisplayName({members, user: profile.user}), 'tealPale');
                    console.log('cache', cacheInfo);
                    console.groupEnd();
                }
                return false;
            }
        }
        return true;
    });
};

/**
 * 向聊天发送框添加内容
 * @param {string|FileData} content 文本或图片文件内容
 * @param {string} type 内容类型，可以为 `'text'` 或 `'image'`
 * @param {string} cgid 聊天 GID
 * @param {boolean} clear 是否清空输入框之前的内容
 * @return {void}
 */
export const sendContentToChat = (content, type = 'text', cgid = null, clear = false) => {
    if (!cgid) {
        cgid = activedChatId;
    }
    if (type === 'file') {
        Server.sendFileMessage(content, chats.get(cgid));
    } else {
        return events.emit(`${EVENT.sendContentToChat}.${cgid}`, {content, type, clear});
    }
};

/**
 * 一次性向聊天发送多个文件
 * @param {FileList|File[]} fileList 要发送的文件
 * @param {string} [cgid=null] 聊天 gid
 * @return {void}
 */
export const sendFilesToChat = (fileList, cgid = null) => {
    if (!fileList || !fileList.length) {
        return;
    }
    let hasError = false;
    let hasEmptyFile = false;
    let fileTypeError = false;
    let isAllImageFiles = true;
    const files = [];
    for (let i = 0; i < fileList.length; ++i) {
        const file = fileList[i];
        if (file.type !== '' && checkUploadFileSize(file.size)) {
            files.push(file);
            if (!file.type.startsWith('image/')) {
                isAllImageFiles = false;
            }
        } else {
            hasError = true;
            if (file.type === '') fileTypeError = true;
            if (!fileTypeError && file.size <= 0) hasEmptyFile = true;
        }
    }
    if (files.length) {
        if (isAllImageFiles) {
            sendContentToChat(files, 'image', cgid);
        } else {
            showConfirmSendFilesDialog(files).then(result => result && files.forEach(file => sendContentToChat(file, 'file', cgid))); // eslint-disable-line
        }
    }
    if (hasError) {
        if (fileTypeError) {
            executeCommand('showMessager', Lang.error('UPLOAD_FILE_IS_TYPE_ERROR'), {type: 'warning'});
        } else if (hasEmptyFile) {
            executeCommand('showMessager', Lang.error('UPLOAD_FILE_IS_ZEOR_SIZE'), {type: 'warning'});
        } else {
            executeCommand('showMessager', Lang.error({code: 'UPLOAD_FILE_IS_TOO_LARGE', formats: formatBytes(profile.user.uploadFileSize)}), {type: 'warning'});
        }
    }
};

registerCommand('sendContentToChat', (context, content) => {
    const {options} = context;
    sendContentToChat(content || options.content, options.type, options.cgid, options.clear);
});

/**
 * 绑定聊天发送框接收到新内容事件
 * @param {string} cgid 聊天 GID
 * @param {funcion} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onSendContentToChat = (cgid, listener) => events.on(`${EVENT.sendContentToChat}.${cgid}`, listener);

// 添加聊天工具栏右键菜单生成器
addContextMenuCreator('chat.toolbar', context => {
    let {chat, showSidebarIcon = 'auto'} = context;
    const items = [];
    if (!chat.isRobot) {
        items.push({
            id: 'star',
            className: chat.star ? 'app-chat-star-icon stared' : 'app-chat-star-icon ',
            icon: 'star-outline',
            label: Lang.string(chat.star ? 'chat.toolbor.unstar' : 'chat.toolbor.star'),
            click: () => {
                Server.toggleChatStar(chat);
            }
        });
    }
    if (chat.canInvite(profile.user)) {
        items.push({
            id: 'invite',
            icon: 'account-multiple-plus',
            label: Lang.string('chat.toolbor.invite'),
            click: () => {
                ChatInviteDialog.show(chat);
            }
        });
    }
    if (!Config.ui['chat.disableChatHistory']) {
        items.push({
            id: 'history',
            icon: 'history',
            label: Lang.string('chat.toolbor.history'),
            click: () => {
                ChatsHistoryDialog.show(chat);
            }
        });
    }
    if (chat.isRobot) {
        showSidebarIcon = false;
    }
    if (showSidebarIcon === 'auto') {
        showSidebarIcon = profile.userConfig.isChatSidebarHidden(chat.gid, chat.isOne2One);
    }
    if (showSidebarIcon) {
        items.push({
            id: 'sidebar',
            icon: 'book-open',
            label: Lang.string('chat.toolbor.sidebar'),
            click: () => {
                profile.userConfig.setChatSidebarHidden(chat.gid, false);
            }
        });
    }
    const moreItems = getMenuItemsForContext('chat.toolbar.more', {chat});
    if (moreItems && moreItems.length) {
        items.push({
            id: 'more',
            icon: 'dots-horizontal',
            label: Lang.string('chat.toolbor.more'),
            click: e => {
                ContextMenu.show({x: e.pageX, y: e.pageY, direction: 'bottom-left'}, moreItems);
            }
        });
    }
    items[items.length - 1].hintPosition = 'bottom-left';
    return items;
});

/**
 * 请求开始截屏操作
 * @param {boolean} [hiddenWindows=false] 是否隐藏窗口再截屏
 * @return {void}
 */
export const captureAndCutScreenImage = (hiddenWindows = false) => {
    if (platform.has('screenshot')) {
        const captureScreenChatId = activedChatId;
        platform.access('screenshot').captureAndCutScreenImage(0, hiddenWindows).then(image => {
            activeChat(captureScreenChatId);
            return image && sendContentToChat(image, 'image', captureScreenChatId);
        }).catch(error => {
            if (DEBUG) {
                console.warn('Capture screen image error: ', error);
            }
        });
    } else {
        throw new Error(`The platform(${platform.type}) not support capture screenshot.`);
    }
};

/**
 * 创建截屏按钮右键菜单项清单
 * @return {Object[]} 右键菜单项清单
 */
export const createCatureScreenContextMenuItems = () => {
    if (!platform.has('screenshot')) {
        throw new Error(`The platform(${platform.type}) not support take screenshots.`);
    }
    const items = [{
        id: 'captureScreen',
        label: Lang.string('chat.sendbox.toolbar.captureScreen'),
        click: () => {
            captureAndCutScreenImage();
        }
    }, {
        id: 'hideAndCaptureScreen',
        label: Lang.string('imageCutter.hideCurrentWindowAndCaptureScreen'),
        click: () => {
            captureAndCutScreenImage(true);
        }
    }, {
        type: 'separator'
    }, {
        id: 'captureScreenHotSetting',
        label: Lang.string('imageCutter.setGlobalHotkey'),
        click: () => {
            HotkeySettingDialog.show(Lang.string('imageCutter.setGlobalHotkey'), profile.userConfig.captureScreenHotkey, newHotKey => {
                profile.userConfig.captureScreenHotkey = newHotKey;
            });
        }
    }];
    return items;
};

// 添加发送框工具栏菜单项目生成器
addContextMenuCreator('chat.sendbox.toolbar', context => {
    const {chatGid, openMessagePreview} = context;
    const {userConfig} = profile;
    const items = [{
        id: 'emoticon',
        icon: 'mdi-emoticon',
        label: Lang.string('chat.sendbox.toolbar.emoticon'),
        click: e => {
            EmojiPopover.show({
                x: e.pageX, y: e.pageY, target: e.target, placement: 'top'
            }, emoji => {
                sendContentToChat(`${Emojione.convert(emoji.unicode || Emojione.emojioneList[emoji.shortname].uc_base)} `);
            });
        }
    }];
    if (profile.user.isVersionSupport('fileServer')) {
        items.push({
            id: 'image',
            icon: 'mdi-image',
            label: Lang.string('chat.sendbox.toolbar.image'),
            click: () => {
                platform.access('dialog').showOpenDialog({
                    filters: [
                        {name: 'Images', extensions: ['jpg', 'png', 'gif']},
                    ]
                }, files => {
                    if (files && files.length) {
                        sendContentToChat(files[0], 'image', chatGid);
                    }
                });
            }
        }, {
            id: 'file',
            icon: 'mdi-file-outline',
            label: Lang.string('chat.sendbox.toolbar.file'),
            click: () => {
                platform.access('dialog').showOpenDialog(null, files => {
                    if (files && files.length) {
                        Server.sendFileMessage(files[0], chats.get(chatGid));
                    }
                });
            }
        });
    }
    if (platform.has('screenshot') && userConfig) {
        items.push({
            id: 'captureScreen',
            icon: 'mdi-content-cut rotate-270 inline-block',
            label: `${Lang.string('chat.sendbox.toolbar.captureScreen')} ${(userConfig.captureScreenHotkey || '')} (${Lang.string('chat.sendbox.toolbar.moreOptions')})`,
            click: () => {
                captureAndCutScreenImage();
            },
            contextMenu: e => {
                ContextMenu.show({x: e.pageX, y: e.pageY}, createCatureScreenContextMenuItems(chats.get(chatGid)));
                e.preventDefault();
            }
        });
    }

    if (Config.ui['chat.sendCode.enable']) {
        items.push({
            id: 'code',
            icon: 'mdi-code-tags',
            label: Lang.string('chat.sendbox.toolbar.code'),
            click: () => {
                executeCommandLine(`showChatSendCodeDialog/${chatGid}`);
            }
        });
    }

    items.push({
        id: 'setFontSize',
        icon: 'mdi-format-size',
        label: Lang.string('chat.sendbox.toolbar.setFontSize'),
        click: e => {
            ChatChangeFontPopover.show({
                x: e.pageX, y: e.pageY, target: e.target, placement: 'top'
            });
        }
    });
    if (Config.ui['chat.sendMarkdown']) {
        const sendMarkdown = userConfig && userConfig.sendMarkdown;
        items.push({
            id: 'markdown',
            icon: sendMarkdown ? 'mdi-markdown icon-2x' : 'mdi-markdown icon-2x',
            label: Lang.string(sendMarkdown ? 'chat.sendbox.toolbar.markdown.enabled' : 'chat.sendbox.toolbar.markdown.disabled') + (sendMarkdown ? ` (${Lang.string('chat.sendbox.toolbar.moreOptions')})` : ''),
            className: sendMarkdown ? 'selected text-green' : '',
            click: () => {
                userConfig.sendMarkdown = !userConfig.sendMarkdown;
            },
            contextMenu: sendMarkdown ? e => {
                const menuItems = [{
                    label: Lang.string('chat.sendbox.toolbar.previewDraft'),
                    click: openMessagePreview,
                    icon: 'mdi-file-find',
                    disabled: !openMessagePreview
                }];

                const mdHintUrl = Config.ui['markdown.hintUrl'];
                if (mdHintUrl) {
                    menuItems.push({
                        icon: 'mdi-help-circle',
                        label: Lang.string('chat.sendbox.toolbar.markdownGuide'),
                        url: platform.isType('browser') ? mdHintUrl : `!openUrlInDialog/${encodeURIComponent(mdHintUrl)}/?size=lg&insertCss=${encodeURIComponent('.wikistyle>p:first-child{display:none!important}')}`
                    });
                }

                ui.showContextMenu({
                    x: e.pageX, y: e.pageY, target: e.target, placement: 'top'
                }, menuItems);
                e.preventDefault();
            } : null
        });
    }
    if (userConfig && userConfig.showMessageTip) {
        items.push({
            id: 'tips',
            icon: 'mdi-comment-question-outline',
            label: Lang.string('chat.sendbox.toolbar.tips'),
            click: e => {
                ChatTipPopover.show({
                    x: e.pageX, y: e.pageY, target: e.target, placement: 'top'
                });
            }
        });
    }

    return items;
});

/**
 * 显示重命名聊天对话框
 * @param {Chat} chat 要重命名的聊天
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const chatRenamePrompt = chat => {
    return Modal.prompt(Lang.string('chat.rename.title'), chat.name, {
        placeholder: Lang.string('chat.rename.newTitle'),
    }).then(newName => {
        if (chat.name !== newName) {
            Server.renameChat(chat, newName);
        }
    });
};

/**
 * 显示确认退出聊天对话框
 * @param {Chat} chat 要退出的聊天
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const chatExitConfirm = chat => {
    return Modal.confirm(Lang.format('chat.group.exitConfirm', chat.getDisplayName({members, user: profile.user}))).then(result => {
        if (result) {
            Server.exitChat(chat);
        }
    });
};

/**
 * 显示确认解散聊天对话框
 * @param {Chat} chat 要解散的聊天
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const chatDismissConfirm = chat => {
    return Modal.confirm(Lang.format('chat.group.dismissConfirm', chat.getDisplayName({members, user: profile.user}))).then(result => {
        if (result) {
            return Server.dimissChat(chat).then(theChat => {
                if (theChat) {
                    activeLastChat();
                }
                return Promise.resolve(theChat);
            });
        }
        return result;
    });
};

// 添加聊天上下文菜单生成器
addContextMenuCreator('chat.menu', context => {
    const {chat, menuType = null, viewType = null} = context;
    const menu = [];
    if (chat.isOne2One) {
        menu.push(...getMenuItemsForContext('member', {member: chat.getTheOtherOne({members, user: profile.user})}));
        tryAddDividerItem(menu);
    }

    if (!chat.isRobot) {
        menu.push({
            label: Lang.string(chat.star ? 'chat.toolbor.unstar' : 'chat.toolbor.star'),
            click: () => {
                Server.toggleChatStar(chat);
            }
        });

        if (profile.user.isVersionSupport('muteChat')) {
            menu.push({
                label: Lang.string(chat.mute ? 'chat.toolbar.cancelMute' : 'chat.toolbar.mute'),
                click: () => {
                    Server.toggleMuteChat(chat);
                }
            });
        }
    }

    if (chat.canRename(profile.user)) {
        menu.push({
            label: Lang.string('common.rename'),
            click: () => {
                chatRenamePrompt(chat);
            }
        });
    }

    if (chat.canMakePublic(profile.user)) {
        menu.push({
            label: Lang.string(chat.public ? 'chat.public.setPrivate' : 'chat.public.setPublic'),
            click: () => {
                Server.toggleChatPublic(chat);
            }
        });
    }

    if (chat.canDismiss(profile.user)) {
        tryAddDividerItem(menu);
        menu.push({
            label: Lang.string('chat.group.dismiss'),
            click: () => {
                chatDismissConfirm(chat);
            }
        });
    }

    if (chat.canExit(profile.user)) {
        tryAddDividerItem(menu);
        menu.push({
            label: Lang.string('chat.group.exit'),
            click: () => {
                chatExitConfirm(chat);
            }
        });
    }

    if (!chat.isDismissed && !chat.isRobot) {
        tryAddDividerItem(menu);
        if (viewType === 'category' && (menuType === 'contacts' || menuType === 'groups')) {
            menu.push({
                label: Lang.string('chats.menu.group.add'),
                click: () => {
                    ChatAddCategoryDialog.show(chat);
                }
            });
        }
        if (chat.canHide && profile.user.isVersionSupport('hideChat')) {
            menu.push({
                label: Lang.string(chat.hidden ? 'chat.toolbar.cancelHide' : 'chat.toolbar.hide'),
                click: () => {
                    Server.toggleHideChat(chat);
                }
            });
        }
    }

    if (platform.has('clipboard.writeText')) {
        tryAddDividerItem(menu);
        menu.push({
            label: Lang.string('chat.copyChatGID'),
            click: () => {
                platform.call('clipboard.writeText', chat.gid);
            }
        });
    }

    return tryRemoveLastDivider(menu);
});

// 添加聊天工具栏更多菜单生成器
addContextMenuCreator('chat.toolbar.more', ({chat}) => {
    if (chat.isOne2One) return [];
    const menu = [];
    if (profile.user.isVersionSupport('muteChat') && !chat.isRobot) {
        menu.push({
            label: Lang.string(chat.mute ? 'chat.toolbar.cancelMute' : 'chat.toolbar.mute'),
            click: () => {
                Server.toggleMuteChat(chat);
            }
        });
    }
    if (chat.canRename(profile.user)) {
        menu.push({
            label: Lang.string('common.rename'),
            click: () => {
                chatRenamePrompt(chat);
            }
        });
    }

    if (chat.canMakePublic(profile.user)) {
        menu.push({
            label: Lang.string(chat.public ? 'chat.public.setPrivate' : 'chat.public.setPublic'),
            click: () => {
                Server.toggleChatPublic(chat);
            }
        });
    }

    if (chat.canSetCommitters(profile.user)) {
        menu.push({
            label: Lang.string('chat.committers.setCommitters'),
            click: () => {
                ChatCommittersSettingDialog.show(chat);
            }
        });
    }

    if (chat.canDismiss(profile.user)) {
        if (menu.length) {
            menu.push({type: 'separator'});
        }
        menu.push({
            label: Lang.string('chat.group.dismiss'),
            click: () => {
                chatDismissConfirm(chat);
            }
        });
    }

    if (chat.canExit(profile.user)) {
        if (menu.length) {
            menu.push({type: 'separator'});
        }
        menu.push({
            label: Lang.string('chat.group.exit'),
            click: () => {
                chatExitConfirm(chat);
            }
        });
    }
    return menu;
});

// 添加聊天成员上下文件菜单生成器
addContextMenuCreator('chat.member', ({member, chat}) => {
    const menu = [];
    if (member.account !== profile.userAccount && chat.isGroupOrSystem) {
        const one2OneGid = chats.getOne2OneChatGid([member, profile.user]);
        menu.push({
            label: Lang.string(`chat.atHim.${member.gender}`, Lang.string('chat.atHim')),
            click: () => {
                sendContentToChat(`@${member.displayName} `);
            }
        });

        if (!Config.ui['chat.denyChatFromMemberProfile']) {
            menu.push({
                label: Lang.string('chat.sendMessage'),
                url: `#/chats/recents/${one2OneGid}`
            });
        }
    }

    tryAddDividerItem(menu);
    menu.push(...getMenuItemsForContext('member', {member}));

    if (chat.canKickOff(profile.user, member)) {
        tryAddDividerItem(menu);
        menu.push({
            label: Lang.string('chat.kickOffFromGroup'),
            click: () => {
                return Modal.confirm(Lang.format('chat.kickOffFromGroup.confirm', member.displayName)).then(result => {
                    if (result) {
                        return Server.kickOfMemberFromChat(chat, member);
                    }
                    return Promise.reject();
                });
            }
        });
    }
    return menu;
});

/**
 * 将文本中的 `@member` 转换为 HTML 链接
 * @param {string} text 文本内容
 * @param {{format: string}} param1 格式化选项
 * @return {string} 转换后的文本
 */
export const linkMembersInText = (text, {format = '<a class="app-link {className}" data-url="@Member/{id}">@{displayName}</a>'}) => {
    if (text && text.indexOf('@') > -1) {
        const langAtAll = Lang.string('chat.message.atAll');
        const {userAccount} = profile;
        text = text.replace(/@(#?\d+|[\d\w\u4e00-\u9fa5]+)/g, (mentionAt, mention) => {
            const m = members.guess(mention);
            if (m) {
                return StringHelper.format(format, {
                    displayName: m.displayName,
                    id: m.id,
                    account: m.account,
                    className: m.account === userAccount ? 'at-me' : '',
                });
            }
            if (mention === 'all' || mention === langAtAll) {
                return `<span class="at-all">@${langAtAll}</span>`;
            }
            return mentionAt;
        });
    }
    return text;
};

/**
 * 转换消息内容回调函数
 * @type {string}
 * @private
 */
let onRenderChatMessageContentListener = null;

/**
 * 将聊天消息内容转换为适合显示的 HTML 文本
 * @param {string} messageContent 聊天消息内容
 * @param {{renderMarkdown: boolean}} param1 转换选项
 * @return {string} 转换后的聊天消息内容文本
 */
export const renderChatMessageContent = (messageContent, {renderMarkdown = false}) => {
    if (typeof messageContent === 'string' && messageContent.length) {
        if (renderMarkdown) {
            messageContent = Markdown(messageContent);
        } else {
            messageContent = linkify(escape(messageContent).replace(/<br>/g, '\n'));
        }
        messageContent = Emojione.toImage(messageContent);
        if (onRenderChatMessageContentListener) {
            messageContent = onRenderChatMessageContentListener(messageContent);
        }
    }
    return messageContent;
};

/**
 * 绑定转换消息内容事件
 * @param {Funcion} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onRenderChatMessageContent = listener => {
    onRenderChatMessageContentListener = listener;
};

/**
 * 根据成员清单创建讨论组
 * @param {Set<number>|number[]} groupMembers 聊天成员
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const createGroupChat = (groupMembers) => {
    return Modal.prompt(Lang.string('chat.create.newChatNameTip'), '', {
        inputProps: {placeholder: Lang.string('chat.rename.newTitle')},
        onSubmit: newName => {
            if (!newName) {
                Modal.alert(Lang.string('chat.rename.newTitleRequired'));
                return false;
            }
        }
    }).then(newName => {
        if (newName) {
            return Server.createChatWithMembers(groupMembers, {name: newName});
        }
        return Promise.reject(false);
    });
};

/**
 * 重命名讨论组
 * @param {{id: number, title: string}} group 要重命名的讨论组
 * @param {string} type 讨论组类型
 * @param {string} newCategoryName 新的讨论组名称
 * @return {void}
 */
export const renameChatCategory = (group, type = 'contact', newCategoryName = null) => {
    if (newCategoryName === null) {
        return Modal.prompt(Lang.string('chats.menu.group.renameTip'), group.title).then(name => {
            return renameChatCategory(group, type, name);
        });
    }
    if (newCategoryName !== group.title) {
        if (group.id) {
            const isContactType = type === 'contact';
            const renameChats = chats.query(x => ((isContactType ? x.isOne2One : x.isGroupOrSystem) && x.category === group.id), false);
            return Server.setChatCategory(renameChats, newCategoryName).then(() => {
                const categoriesConfigName = isContactType ? 'contactsCategories' : 'groupsCategories';
                const categories = profile.user.config[categoriesConfigName];
                if (!categories[newCategoryName]) {
                    categories[newCategoryName] = categories[group.id];
                }
                delete categories[group.id];
                profile.user.config[categoriesConfigName] = categories;
            });
        } else {
            profile.user.config[type === 'contact' ? 'contactsDefaultCategoryName' : 'groupsDefaultCategoryName'] = newCategoryName;
        }
    }
};

// 添加讨论组上下文菜单生成器
addContextMenuCreator('chat.group', ({group, type = 'contact'}) => {
    const menus = [];
    if (!group.system) {
        menus.push({
            label: Lang.string('chats.menu.group.rename'),
            click: () => {
                renameChatCategory(group, type);
            }
        });
    }
    if (group.id && !group.system) {
        menus.push({
            label: Lang.string('chats.menu.group.delete'),
            click: () => {
                const defaultCategoryName = profile.user.config[type === 'contact' ? 'contactsDefaultCategoryName' : 'groupsDefaultCategoryName'] || Lang.string('chats.menu.group.default');
                return Modal.confirm(Lang.format('chats.menu.group.delete.tip.format', defaultCategoryName), {
                    title: Lang.format('chats.menu.group.delete.confirm.format', group.title)
                }).then(result => result && renameChatCategory(group, type, ''));
            }
        });
    }
    return menus;
});

// 添加文本消息上下文菜单生成器
addContextMenuCreator('message.text', ({message}) => {
    const items = [];
    if (message.isTextContent && platform.has('clipboard.writeText')) {
        items.push({
            icon: 'mdi-content-copy',
            label: Lang.string('chat.message.copy'),
            click: () => {
                let copyHtmlText = message.isPlainTextContent ? message.content : null;
                let copyPlainText = message.content;
                if (copyHtmlText === null) {
                    const contentElement = document.getElementById(`message-content-${message.gid}`);
                    if (contentElement) {
                        copyHtmlText = contentElement.innerHTML;
                        copyPlainText = contentElement.innerText;
                    }
                }
                if (copyHtmlText === undefined) {
                    copyHtmlText = message.renderedTextContent(renderChatMessageContent, Config.ui['chat.denyShowMemberProfile'] ? null : linkMembersInText);
                }
                const clipboard = platform.access('clipboard');
                if (clipboard.write) {
                    clipboard.write({text: message.isPlainTextContent ? copyHtmlText : strip(copyHtmlText), html: copyHtmlText});
                } else if (clipboard.writeHTML) {
                    clipboard.writeHTML(copyHtmlText);
                } else if (clipboard.writeText) {
                    clipboard.writeText(copyPlainText);
                }
            }
        });
        if (!message.isPlainTextContent) {
            items.push({
                icon: 'mdi-markdown',
                label: Lang.string('chat.message.copyMarkdown'),
                click: () => {
                    platform.call('clipboard.writeText', message.content);
                }
            });
        }
    }
    if (Config.ui['todo.enable'] && !Config.ui['chat.simpleChatView'] && profile.user.isVersionSupport('todo')) {
        if (items.length) {
            items.push('divider');
        }
        items.push({
            label: Lang.string('todo.create'),
            icon: 'mdi-calendar-check',
            click: (item, idx, e) => {
                TodoEditorDialog.show(createTodoFromMessage(message));
                e.preventDefault();
            }
        });
    }
    items.push({
        label: Lang.string('chat.share'),
        icon: 'mdi-share-outline',
        click: () => {
            ChatShareDialog.show(message);
        }
    });
    return items;
});


export const onShowReeditHandle = (gid, listener) => events.on(`${EVENT.showReeditHandle}.${gid}`, listener);

// 添加撤回按钮
addContextMenuCreator('message.text,message.image,message.file,message.url', context => {
    const items = [];
    if (!profile.user.isVersionSupport('retractChatMessage')) {
        return items;
    }

    const {message} = context;
    if (message && message.canDelete(profile.userId)) {
        items.push({
            label: Lang.string('chat.message.retract'),
            icon: 'undo-variant',
            click: () => {
                const {
                    isTextContent, content, cgid, gid
                } = message;
                return deleteChatMessage(message).then(() => {
                    if (isTextContent && content) {
                        sendContentToChat(content, 'text', cgid);
                        setTimeout(() => {
                            events.emit(`${EVENT.showReeditHandle}.${gid}`);
                        }, 200);
                    }
                    return Promise.resolve();
                });
            }
        });
    }
    return items;
});

// 添加转发按钮
addContextMenuCreator('message.image,message.file,message.url,message.share', context => {
    const {message} = context;
    const items = [{
        label: Lang.string('chat.share'),
        icon: 'mdi-share-outline',
        click: () => {
            ChatShareDialog.show(message);
        }
    }];
    return items;
});

addContextMenuCreator('image,emoji', ({message}) => {
    const items = [];
    if (message) {
        items.push({
            label: Lang.string('chat.share'),
            icon: 'mdi-share-outline',
            click: () => {
                ChatShareDialog.show(message);
            }
        });
    }
    return items;
});

// 绑定用户切换事件
profile.onSwapUser(user => {
    activedChatId = null;
    activeCaches = {};
});

// 绑定聊天列表初始化事件
chats.onChatsInit(initChats => {
    if (!activedChatId) {
        const lastActiveChat = chats.getLastActiveChat();
        if (lastActiveChat) {
            activedChatId = lastActiveChat && lastActiveChat.gid;
            lastActiveChat.makeActive();
            if (window.location.hash.startsWith('#/chats/')) {
                window.location.hash = `#/chats/recents/${activedChatId}`;
            }
        }
    }
    if (!db.database.isExists) {
        Server.fetchChatsHistory('all', DateHelper.getTimeBeforeDesc('oneMonth'));
        if (DEBUG) {
            console.color('Fetch all history for new database', 'greenPale');
        }
    }
});

// 如果平台支持截图，绑定截图全局快捷键
if (platform.has('screenshot')) {
    registerCommand('shortcut.captureScreenHotkey', () => {
        captureAndCutScreenImage();
    });
}

// 如果平台支持读取剪切板图片则绑定推荐发送剪切板图片命令
if (platform.has('clipboard.getNewImage')) {
    registerCommand('suggestClipboardImage', () => {
        if (!profile.userConfig.listenClipboardImage) {
            return;
        }
        const newImage = platform.call('clipboard.getNewImage');
        if (newImage) {
            events.emit(EVENT.suggestSendImage, newImage);
        }
    });
}

/**
 * 绑定推荐发送剪切板图片事件
 * @param {Funcion} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onSuggestSendImage = (listener) => events.on(EVENT.suggestSendImage, listener);

/**
 * 激活聊天发送框并可以选择性的发送文本内容到聊天发送框
 * @param {Chat} chat 聊天实例
 * @param {string} [sendboxContent=null] 要发送到聊天框的内容
 * @return {void}
 */
export const emitChatSendboxFocus = (chat, sendboxContent = null) => {
    events.emit(EVENT.sendboxFocus, chat, sendboxContent);
    if (profile.userConfig.listenClipboardImage && StringHelper.isEmpty(sendboxContent)) {
        executeCommandLine('suggestClipboardImage');
    }
};

/**
 * 绑定聊天发送框激活事件
 * @param {funcion} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onChatSendboxFocus = (listener) => {
    return events.on(EVENT.sendboxFocus, listener);
};

/**
 * 获取当前激活对聊天 GID
 * @return {string} 当前激活对聊天 GID
 */
export const getCurrentActiveChatGID = () => activedChatId;

/**
 * 获取当前激活的聊天对象
 * @return {Chat} 当前激活的聊天对象
 */
export const getcurrentActiveChat = () => activedChatId && chats.get(activedChatId);

export default {
    activeChat,
    setActiveChat,
    activeLastChat,
    onActiveChat,
    isActiveChat,
    getActivedCacheChatsGID,
    linkMembersInText,
    renderChatMessageContent,
    chatExitConfirm,
    chatRenamePrompt,
    createGroupChat,
    sendContentToChat,
    onSendContentToChat,
    onShowReeditHandle,
    onRenderChatMessageContent,
    onSuggestSendImage,
    emitChatSendboxFocus,
    onChatSendboxFocus,
    isChatsCacheChanged,
    setChatCacheState,
    takeOutChatCacheState,

    get currentActiveChatId() {
        return activedChatId;
    },

    get currentActiveChat() {
        return activedChatId && chats.get(activedChatId);
    },
};
