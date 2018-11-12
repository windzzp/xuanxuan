import Config from '../../config';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import {formatKeyDecoration} from '../../utils/shortcut';
import Icon from '../../components/icon';
import Lang from '../../lang';
import App from '../../core';
import replaceViews from '../replace-views';
import {getMenuItemsForContext} from '../../core/context-menu';

/**
 * ChatSendboxToolbar 组件 ，显示聊天发送框工具栏界面
 * @class ChatSendboxToolbar
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example @lang jsx
 * import ChatSendboxToolbar from './chat-sendbox-toolbar';
 * <ChatSendboxToolbar />
 */
export default class ChatSendboxToolbar extends PureComponent {
    /**
     * 获取 ChatSendboxToolbar 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<ChatSendboxToolbar>}
     * @readonly
     * @static
     * @memberof ChatSendboxToolbar
     * @example <caption>可替换组件类调用方式</caption> @lang jsx
     * import {ChatSendboxToolbar} from './chat-sendbox-toolbar';
     * <ChatSendboxToolbar />
     */
    static get ChatSendboxToolbar() {
        return replaceViews('chats/chat-sendbox-toolbar flex', ChatSendboxToolbar);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof ChatSendboxToolbar
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        chatGid: PropTypes.string,
        userConfigChangeTime: PropTypes.number,
        sendButtonDisabled: PropTypes.bool,
        onSendButtonClick: PropTypes.func,
        onPreviewButtonClick: PropTypes.func
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof ChatSendboxToolbar
     * @static
     */
    static defaultProps = {
        className: null,
        chatGid: null,
        sendButtonDisabled: true,
        onSendButtonClick: null,
        onPreviewButtonClick: null,
        userConfigChangeTime: null,
    };

    /**
     * 处理发送按钮右键菜单事件
     * @param {Event} e 事件对象
     * @memberof ChatSendboxToolbar
     * @private
     * @return {void}
     */
    handleSendBtnContextMenu = e => {
        const currentHotKey = formatKeyDecoration(App.profile.userConfig.sendMessageHotkey);
        let itemsChecked = false;
        const items = [{
            label: Lang.string('chat.sendbox.changeHotkeyTip'),
            disabled: true
        }];
        Config.ui['hotkey.sendMessageOptions'].forEach(x => {
            x = formatKeyDecoration(x);
            if (currentHotKey === x) {
                itemsChecked = true;
            }
            items.push({
                label: x,
                click: () => {
                    App.profile.userConfig.sendMessageHotkey = x;
                },
                checked: currentHotKey === x
            });
        });
        if (!itemsChecked) {
            items.push({
                label: currentHotKey,
                checked: true
            });
        }

        App.ui.showContextMenu({x: e.clientX, y: e.clientY}, items);
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof ChatSendboxToolbar
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {className, chatGid, sendButtonDisabled, onPreviewButtonClick, onSendButtonClick, userConfigChangeTime, ...other} = this.props;
        return (<div className={classes('app-chat-sendbox-toolbar flex', className)} {...other}>
            <div className="flex flex-middle flex-auto toolbar flex-wrap">
                {
                    getMenuItemsForContext('chat.sendbox.toolbar', {chatGid, openMessagePreview: sendButtonDisabled ? null : onPreviewButtonClick, sendContent: App.im.ui.sendContentToChat}).map((item, idx) => {
                        if (item === 'divider') {
                            return <div key={item.id || idx} className="divider" />;
                        }
                        return <div key={item.id || idx} className="hint--top has-padding-sm" data-hint={item.label} onContextMenu={item.contextMenu} onClick={item.click}><button className={classes('btn iconbutton rounded', item.className)} type="button">{Icon.render(item.icon)}</button></div>;
                    })
                }
            </div>
            <div className="toolbar flex flex-none flex-middle">
                <div className="hint--top-left has-padding-sm" data-hint={`${Lang.string('chat.sendbox.toolbar.send')} (${App.profile.userConfig.sendMessageHotkey} - ${Lang.string('chat.sendbox.toolbar.changeHotkeyTip')})`} onClick={onSendButtonClick}>
                    <button
                        onContextMenu={this.handleSendBtnContextMenu}
                        className={classes('btn iconbutton rounded', {
                            muted: sendButtonDisabled,
                            'text-primary': !sendButtonDisabled
                        })}
                        type="button"
                    >
                        <Icon className="icon-2x" name="keyboard-return" />
                    </button>
                </div>
            </div>
        </div>);
    }
}
