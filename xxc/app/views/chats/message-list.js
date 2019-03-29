import React, {Component} from 'react';
import ReactChatView from 'react-chatview';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import _MessageListItem from './message-list-item'; // eslint-disable-line
import App from '../../core';
import platform from '../../platform';
import withReplaceView from '../with-replace-view';
import {saveChatMessages} from '../../core/im/im-chats';

/**
 * 平台提供的通用界面交互访问对象
 * @type {Object}
 * @private
 */
const platformUI = platform.access('ui');

/**
 * MessageListItem 可替换组件形式
 * @type {Class<MessageListItem>}
 * @private
 */
const MessageListItem = withReplaceView(_MessageListItem);

/**
 * 是否为浏览器平台
 * @type {boolean}
 * @private
 */
const isBrowser = platform.isType('browser');

/**
 * 是否为火狐浏览器
 * 因为火狐 bug，导致滚动条消失，所以需要判断是否为火狐浏览器 https://github.com/philipwalton/flexbugs/issues/108
 * @type {boolean}
 * @private
 */
const isFirefox = isBrowser && window.navigator.userAgent.includes('Firefox');

/**
 * MessageList 组件 ，显示聊天消息列表界面
 * @class MessageList
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import MessageList from './message-list';
 * <MessageList />
 */
export default class MessageList extends Component {
    /**
     * MessageList 对应的可替换类路径名称
     *
     * @type {String}
     * @static
     * @memberof MessageList
     */
    static replaceViewPath = 'chats/MessageList';

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof MessageList
     * @type {Object}
     */
    static propTypes = {
        messages: PropTypes.array.isRequired,
        stayBottom: PropTypes.bool,
        staticUI: PropTypes.bool,
        showDateDivider: PropTypes.any,
        className: PropTypes.string,
        font: PropTypes.object,
        listItemProps: PropTypes.object,
        children: PropTypes.any,
        listItemCreator: PropTypes.func,
        header: PropTypes.any,
        onScroll: PropTypes.func,
        sleepUrlCard: PropTypes.bool,
        inverse: PropTypes.bool,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof MessageList
     * @static
     */
    static defaultProps = {
        showDateDivider: 0,
        stayBottom: true,
        staticUI: false,
        className: null,
        font: null,
        listItemProps: null,
        children: null,
        listItemCreator: null,
        header: null,
        onScroll: null,
        sleepUrlCard: null,
        inverse: false
    };

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof MessageList
     * @return {void}
     */
    componentDidMount() {
        this.onChatActiveHandler = App.im.ui.onActiveChat(chat => {
            if (chat.noticeCount && this.isScrollBottom) {
                chat.muteNotice();
                saveChatMessages(chat.messages, chat);
            }
            if (this.lastMessage && (this.waitNewMessage || this.isScrollBottom) && this.lastMessage.cgid === chat.gid) {
                this.waitNewMessage = null;
                this.scrollToBottom(500);
            }
        });
        window.addEventListener('focus', this.onFocus);
    }

    /**
     * React 组件生命周期函数：`componentDidUpdate`
     * componentDidUpdate()会在更新发生后立即被调用。该方法并不会在初始化渲染时调用。
     *
     * @param {Object} prevProps 更新前的属性值
     * @param {Object} prevState 更新前的状态值
     * @see https://doc.react-china.org/docs/react-component.html#componentDidUpdate
     * @private
     * @memberof MessageList
     * @return {void}
     */
    componentDidUpdate() {
        const {stayBottom} = this.props;
        if (stayBottom) {
            const {messages} = this.props;
            const newMessage = this.checkHasNewMessages(messages);
            if (newMessage) {
                if (App.im.ui.isActiveChat(newMessage.cgid)) {
                    const chat = App.im.chats.get(newMessage.cgid);
                    if (newMessage.isSender(App.profile.userId) || this.isScrollBottom) {
                        if (platformUI.isWindowFocus) {
                            chat.muteNotice();
                            saveChatMessages(chat.messages, chat);
                        }
                        this.scrollToBottom(100);
                    }
                } else {
                    this.waitNewMessage = newMessage;
                }
            }
        }
    }

    /**
     * React 组件生命周期函数：`componentWillUnmount`
     * 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，清理
    任何在componentDidMount环节创建的DOM元素。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentwillunmount
     * @private
     * @memberof MessageList
     * @return {void}
     */
    componentWillUnmount() {
        App.events.off(this.onChatActiveHandler);
        window.removeEventListener('focus', this.onFocus);
    }

    /**
     * 设置滚动位置
     * @param {number} scrollTop 滚动条距离顶部的距离
     * @return {void}
     */
    scrollTo(scrollTop) {
        this.element.scrollTop = scrollTop;
    }

    /**
     * 将消息列表滚动到底部
     *
     * @memberof MessageList
     * @return {void}
     */
    scrollToBottom = () => {
        this.scrollTo(this.element.scrollHeight - this.element.clientHeight);
    }

    /**
     * 将消息列表滚动到顶部
     *
     * @memberof MessageList
     * @return {void}
     */
    scrollToTop = () => {
        this.scrollTo(0);
    }

    /**
     * 检查消息列表是否有新的消息
     *
     * @param {ChatMessage[]} messages 消息列表
     * @returns {boolean} 如果返回 `true` 则为有新的消息，否则为没有有新的消息
     * @memberof MessageList
     */
    checkHasNewMessages(messages) {
        const {lastMessage} = this;
        const thisLastMessage = messages && messages.length ? messages[messages.length - 1] : null;
        this.lastMessage = thisLastMessage;
        if (lastMessage !== thisLastMessage && thisLastMessage && ((!lastMessage && thisLastMessage) || thisLastMessage.date > lastMessage.date || thisLastMessage.id > lastMessage.id)) {
            return thisLastMessage;
        }
        return false;
    }

    /**
     * 检查消息列表是否有已显示的旧的消息
     *
     * @param {ChatMessage[]} messages 消息列表
     * @returns {boolean} 如果返回 `true` 则为有已显示的旧的消息，否则为没有有已显示的旧的消息
     * @memberof MessageList
     */
    checkHasNewOlderMessages(messages) {
        const {lastFirstMessage} = this;
        const thisFirstMessage = messages && messages.length ? messages[0] : null;
        this.lastFirstMessage = thisFirstMessage;
        if (thisFirstMessage && lastFirstMessage && (thisFirstMessage.date < lastFirstMessage.date || thisFirstMessage.id < lastFirstMessage.id)) {
            return lastFirstMessage;
        }
    }

    /**
     * 处理消息列表滚动事件
     * @param {Event} e 事件对象
     * @memberof MessageList
     * @private
     * @return {void}
     */
    handleScroll = e => {
        const {target} = e;
        if (!target.classList.contains('app-message-list')) {
            return;
        }
        if (isFirefox) {
            const {onScroll} = this.props;
            if (onScroll) {
                onScroll({isAtTop: true}, e);
            }
            return;
        }
        const scrollInfo = {
            scrollHeight: target.scrollHeight,
            scrollTop: target.scrollTop,
            target,
            isAtTop: target.scrollTop === 0,
            isAtBottom: (target.scrollHeight - target.scrollTop) <= (target.clientHeight + 40)
        };

        this.scrollInfo = scrollInfo;
        const {onScroll} = this.props;
        if (onScroll) {
            onScroll(scrollInfo, e);
        }
    }

    /**
     * 获取是否滚动到底部
     * @memberof MessageList
     * @type {boolean}
     */
    get isScrollBottom() {
        return this.scrollInfo ? this.scrollInfo.isAtBottom : true;
    }

    /**
     * 处理聚焦事件
     * @memberof MessageList
     * @private
     * @return {void}
     */
    onFocus = () => {
        if (this.isScrollBottom) {
            const {messages} = this.props;
            if (messages.length) {
                const chat = App.im.chats.get(messages[0].cgid);
                if (chat.noticeCount && App.im.ui.isActiveChat(messages[0].cgid)) {
                    chat.muteNotice();
                    saveChatMessages(chat.messages, chat);
                }
            }
        }
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof MessageList
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            messages,
            className,
            showDateDivider,
            font,
            stayBottom,
            children,
            listItemProps,
            listItemCreator,
            staticUI,
            header,
            onScroll,
            sleepUrlCard,
            inverse,
            ...other
        } = this.props;

        let lastMessage = null;
        const messagesView = [];
        if (messages && messages.length) {
            const handleEachMessage = message => {
                const messageListItem = listItemCreator ? listItemCreator(message, lastMessage) : <MessageListItem id={`message-${message.gid}`} staticUI={staticUI} font={font} showDateDivider={showDateDivider} lastMessage={lastMessage} key={message.gid} message={message} {...listItemProps} sleepUrlCard={sleepUrlCard} />;
                lastMessage = message;
                if (isFirefox || inverse) {
                    messagesView.push(messageListItem);
                } else {
                    messagesView.unshift(messageListItem);
                }
            };
            if (inverse) {
                for (let i = messages.length - 1; i >= 0; --i) {
                    handleEachMessage(messages[i]);
                }
            } else {
                for (let i = 0; i < messages.length; ++i) {
                    handleEachMessage(messages[i]);
                }
            }
        }

        if (isFirefox) {
            return (
                <ReactChatView
                    flipped
                    className={classes('app-message-list flex column single', className, {'app-message-list-static': staticUI})}
                    ref={e => {this.element = e;}}
                    onInfiniteLoad={this.handleScroll}
                >
                    {messagesView}
                    {header}
                </ReactChatView>
            );
        }

        return (
            <div
                {...other}
                className={classes('app-message-list flex', className, {'app-message-list-static': staticUI, 'column-reverse': !inverse, 'column single': inverse})}
                onScroll={this.handleScroll}
                ref={e => {this.element = e;}}
            >
                {messagesView}
                {header}
            </div>
        );
    }
}
