import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import App from '../../core';
import {ChatListItem} from './chat-list-item';
import replaceViews from '../replace-views';
import {showContextMenu} from '../../core/context-menu';

/**
 * MenuRecentList 组件 ，显示最近聊天列表界面
 * @class MenuRecentList
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import MenuRecentList from './menu-recent-list';
 * <MenuRecentList />
 */
export default class MenuRecentList extends Component {
    /**
     * 获取 MenuRecentList 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<MenuRecentList>}
     * @readonly
     * @static
     * @memberof MenuRecentList
     * @example <caption>可替换组件类调用方式</caption>
     * import {MenuRecentList} from './menu-recent-list';
     * <MenuRecentList />
     */
    static get MenuRecentList() {
        return replaceViews('chats/menu-recent-list', MenuRecentList);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof MenuRecentList
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        filter: PropTypes.string,
        children: PropTypes.any,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof MenuRecentList
     * @static
     */
    static defaultProps = {
        className: null,
        filter: null,
        children: null,
    };

    /**
     * 处理聊天右键菜单事件
     * @param {Event} event 事件对象
     * @memberof MenuRecentList
     * @private
     * @return {void}
     */
    handleItemContextMenu = (event) => {
        const chat = App.im.chats.get(event.currentTarget.attributes['data-gid'].value);
        showContextMenu('chat.menu', {
            event,
            chat,
            menuType: this.props.filter,
            viewType: ''
        });
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof MenuRecentList
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            filter,
            className,
            children,
            ...other
        } = this.props;

        const chats = App.im.chats.getRecents();
        let hasActiveChatItem = false;
        const activeChat = App.im.ui.currentActiveChat;
        const chatItemsView = chats.map(chat => {
            if (activeChat && activeChat.gid === chat.gid) {
                hasActiveChatItem = true;
            }
            return <ChatListItem onContextMenu={this.handleItemContextMenu} data-gid={chat.gid} key={chat.gid} filterType={filter} chat={chat} className="item" />;
        });
        if (!hasActiveChatItem && activeChat) {
            chatItemsView.splice(0, 0, <ChatListItem onContextMenu={this.handleItemContextMenu} data-gid={activeChat.gid} key={activeChat.gid} filterType={filter} chat={activeChat} className="item" />);
        }

        return (<div className={classes('app-chats-menu-list list scroll-y', className)} {...other}>
            {chatItemsView}
            {children}
        </div>);
    }
}
