import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import App from '../../core';
import _ChatView from './chat-view';
import withReplaceView from '../with-replace-view';

/**
 * ChatView 可替换组件形式
 * @type {Class<ChatView>}
 * @private
 */
const ChatView = withReplaceView(_ChatView);

/**
 * ChatsCache 组件 ，显示聊天缓存管理容器
 * @class ChatsCache
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import ChatsCache from './chats-cache';
 * <ChatsCache />
 */
export default class ChatsCache extends Component {
    /**
     * ChatsCache 对应的可替换类路径名称
     *
     * @type {String}
     * @static
     * @memberof ChatsCache
     */
    static replaceViewPath = 'chats/ChatsCache';

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
