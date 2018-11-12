import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import App from '../../core';
import {ChatView} from './chat-view';
import replaceViews from '../replace-views';

/**
 * ChatsCache 组件 ，显示聊天缓存管理容器
 * @class ChatsCache
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example @lang jsx
 * import ChatsCache from './chats-cache';
 * <ChatsCache />
 */
export default class ChatsCache extends Component {
    /**
     * 获取 ChatsCache 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<ChatsCache>}
     * @readonly
     * @static
     * @memberof ChatsCache
     * @example <caption>可替换组件类调用方式</caption> @lang jsx
     * import {ChatsCache} from './chats-cache';
     * <ChatsCache />
     */
    static get ChatsCache() {
        return replaceViews('chats/chat-caches', ChatsCache);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof ChatsCache
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        chatId: PropTypes.any,
        children: PropTypes.any,
        filterType: PropTypes.any,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof ChatsCache
     * @static
     */
    static defaultProps = {
        className: null,
        chatId: null,
        children: null,
        filterType: false,
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof ChatsCache
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            chatId,
            filterType,
            className,
            children,
            ...other
        } = this.props;

        App.im.ui.activeChat(chatId);

        return (
            <div
                {...other}
                className={classes('app-chats-cache', className)}
            >
                {
                    App.im.ui.getActivedCacheChatsGID().map(cgid => {
                        if (cgid) {
                            return <ChatView key={cgid} chatGid={cgid} hidden={!App.im.ui.isActiveChat(cgid)} />;
                        }
                        if (DEBUG) {
                            console.warn('Cannot render undefined chat cache.');
                        }
                        return null;
                    })
                }
                {children}
            </div>
        );
    }
}
