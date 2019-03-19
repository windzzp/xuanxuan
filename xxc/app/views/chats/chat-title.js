import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Platform from '../../platform';
import {classes} from '../../utils/html-helper';
import Icon from '../../components/icon';
import Lang, {isJustLangSwitched} from '../../core/lang';
import App from '../../core';
import _ChatAvatar from './chat-avatar';
import _StatusDot from '../common/status-dot';
import MemberProfileDialog from '../common/member-profile-dialog';
import Config from '../../config';
import withReplaceView from '../with-replace-view';
import {onChatTypingChange, msgSendInterval} from '../../core/im/im-chat-typing';
import events from '../../core/events';


/**
 * ChatAvatar 可替换组件形式
 * @type {Class<ChatAvatar>}
 * @private
 */
const ChatAvatar = withReplaceView(_ChatAvatar);

/**
 * StatusDot 可替换组件形式
 * @type {Class<StatusDot>}
 * @private
 */
const StatusDot = withReplaceView(_StatusDot);

/**
 * ChatTitle 组件 ，显示聊天界面标题
 * @class ChatTitle
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import ChatTitle from './chat-title';
 * <ChatTitle />
 */
export default class ChatTitle extends Component {
    /**
     * ChatMessages 对应的可替换类路径名称
     *
     * @type {String}
     * @static
     * @memberof ChatMessages
     */
    static replaceViewPath = 'chats/chat-title';

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof ChatTitle
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        chat: PropTypes.object,
        children: PropTypes.any,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof ChatTitle
     * @static
     */
    static defaultProps = {
        className: null,
        chat: null,
        children: null,
    };

    /**
     * React 组件构造函数，创建一个 ChatTitle 组件实例，会在装配之前被调用。
     * @see https://react.docschina.org/docs/react-component.html#constructor
     * @param {Object?} props 组件属性对象
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            typing: false,
        };
    }

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof ChatTitle
     * @return {void}
     */
    componentDidMount() {
        const {chat} = this.props;
        if (chat.isOne2One) {
            this.onChatTypingHandler = onChatTypingChange(chat.gid, (typing) => {
                if (this.lastTypeTimer) {
                    clearTimeout(this.lastTypeTimer);
                    this.lastTypeTimer = null;
                }
                if (typing) {
                    this.lastTypeTimer = setTimeout(() => {
                        this.setState({typing: false});
                        this.lastTypeTimer = null;
                    }, msgSendInterval);
                }
                this.setState({typing});
            });
        }
    }

    /**
     * React 组件生命周期函数：`shouldComponentUpdate`
     * 让React知道当前状态或属性的改变是否不影响组件的输出。默认行为是在每一次状态的改变重渲，在大部分情况下你应该依赖于默认行为。
     *
     * @param {Object} nextProps 即将更新的属性值
     * @param {Object} nextState 即将更新的状态值
     * @returns {boolean} 如果返回 `true` 则继续渲染组件，否则为 `false` 而后的 `UNSAFE_componentWillUpdate()`，`render()`， 和 `componentDidUpdate()` 将不会被调用
     * @memberof ChatTitle
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (isJustLangSwitched()
            || nextState.typing !== this.state.typing
            || this.props.className !== nextProps.className
            || this.props.children !== nextProps.children
            || this.props.chat !== nextProps.chat || this.lastChatUpdateId !== nextProps.chat.updateId
            || (nextProps.chat.isOne2One && nextProps.chat.getTheOtherOne(App).updateId !== this.lastOtherOneUpdateId)
        );
    }

    /**
     * React 组件生命周期函数：`componentWillUnmount`
     * 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，清理
    任何在componentDidMount环节创建的DOM元素。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentwillunmount
     * @private
     * @memberof ChatTitle
     * @return {void}
     */
    componentWillUnmount() {
        if (this.onChatTypingHandler) {
            events.off(this.onChatTypingHandler);
        }
        if (this.lastTypeTimer) {
            clearTimeout(this.lastTypeTimer);
            this.lastTypeTimer = null;
        }
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof ChatTitle
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            chat,
            className,
            children,
            ...other
        } = this.props;
        const {typing} = this.state;
        const denyShowMemberProfile = Config.ui['chat.denyShowMemberProfile'];
        const chatName = chat.getDisplayName(App, true);
        const theOtherOne = chat.isOne2One ? chat.getTheOtherOne(App) : null;
        const onTitleClick = (!denyShowMemberProfile && theOtherOne) ? MemberProfileDialog.show.bind(null, theOtherOne, null) : null;
        this.lastOtherOneUpdateId = theOtherOne && theOtherOne.updateId;
        this.lastChatUpdateId = chat.updateId;

        let chatNoticeView = null;

        if (Config.ui['chat.showNoticeOnChatTitle']) {
            const {noticeCount} = chat;
            if (noticeCount) {
                chatNoticeView = <div className={classes('label circle label-sm', chat.isMuteOrHidden ? 'blue' : 'red')}>{noticeCount > 99 ? '99+' : noticeCount}</div>;
            }
        }

        const showStatusDot = theOtherOne && !Config.ui['chat.hideStatusDot'];

        const hideChatAvatar = Config.ui['chat.hideChatAvatar'];
        let chatAvatarView = null;
        if (!hideChatAvatar) {
            const avatarClickable = !denyShowMemberProfile && theOtherOne;
            chatAvatarView = <ChatAvatar chat={chat} size={24} className={avatarClickable ? 'state' : ''} onClick={onTitleClick} />;
        }

        let typingView = null;
        if (typing) {
            typingView = <small className="muted small">{Lang.string('chat.one2one.typing')}</small>;
        }

        return (
            <div className={classes('chat-title heading', className)} {...other}>
                {chatAvatarView}
                {showStatusDot && <StatusDot status={theOtherOne.status} />}
                {
                    (!denyShowMemberProfile && theOtherOne) ? <a className="strong rounded title flex-none text-primary" onClick={onTitleClick}>{chatName}</a> : <strong className="title flex-none">{chatName}</strong>
                }
                {(theOtherOne && !showStatusDot) ? <span className="muted">[{Lang.string(`member.status.${theOtherOne.statusName}`)}]</span> : null}
                {chat.public && <div className="hint--bottom" data-hint={Lang.string('chat.public.label')}><Icon className="text-green" name="access-point" /></div>}
                {chat.mute && <div className="hint--bottom" data-hint={Lang.string('chat.mute.label')}><Icon className="text-brown" name="bell-off" /></div>}
                {chat.isDismissed && <div className="small label rounded dark">{Lang.string('chat.group.dismissed')}</div>}
                {chat.isDeleteOne2One && <div className="small label rounded dark">{Lang.string('chat.deleted')}</div>}
                {chatNoticeView}
                {typingView}
                <div className="flex-auto" />
                {children}
            </div>
        );
    }
}
