import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import Icon from '../../components/icon';
import Lang from '../../lang';
import App from '../../core';
import {ChatAvatar} from './chat-avatar';
import {StatusDot} from '../common/status-dot';
import MemberProfileDialog from '../common/member-profile-dialog';
import replaceViews from '../replace-views';
import Config from '../../config';
import Platform from 'Platform';

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
     * 获取 ChatTitle 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<ChatTitle>}
     * @readonly
     * @static
     * @memberof ChatTitle
     * @example <caption>可替换组件类调用方式</caption>
     * import {ChatTitle} from './chat-title';
     * <ChatTitle />
     */
    
    static get ChatTitle() {
        return replaceViews('chats/chat-title', ChatTitle);
    }

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
     * React 组件生命周期函数：`shouldComponentUpdate`
     * 让React知道当前状态或属性的改变是否不影响组件的输出。默认行为是在每一次状态的改变重渲，在大部分情况下你应该依赖于默认行为。
     *
     * @param {Object} nextProps 即将更新的属性值
     * @param {Object} nextState 即将更新的状态值
     * @returns {boolean} 如果返回 `true` 则继续渲染组件，否则为 `false` 而后的 `UNSAFE_componentWillUpdate()`，`render()`， 和 `componentDidUpdate()` 将不会被调用
     * @memberof ChatTitle
     */
    shouldComponentUpdate(nextProps) {
        return (this.props.className !== nextProps.className ||
            this.props.children !== nextProps.children ||
            this.props.chat !== nextProps.chat || this.lastChatUpdateId !== nextProps.chat.updateId ||
            (nextProps.chat.isOne2One && nextProps.chat.getTheOtherOne(App).updateId !== this.lastOtherOneUpdateId)
        );
    }
    
    /**
     * 复制ID
    */

    copyId = () => {
        let gid = this.props.chat.gid;
        if (Platform.clipboard && Platform.clipboard.writeText) {
            Platform.clipboard.writeText(gid);
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

        const denyShowMemberProfile = Config.ui['chat.denyShowMemberProfile'];
        const chatName = chat.getDisplayName(App, true);
        const theOtherOne = chat.isOne2One ? chat.getTheOtherOne(App) : null;
        const onTitleClick = (!denyShowMemberProfile && theOtherOne) ? MemberProfileDialog.show.bind(null, theOtherOne, null) : null;
        this.lastOtherOneUpdateId = theOtherOne && theOtherOne.updateId;
        this.lastChatUpdateId = chat.updateId;

        let chatNoticeView = null;
        const hideChatAvatar = Config.ui['chat.hideChatAvatar'];

        if (Config.ui['chat.showNoticeOnChatTitle']) {
            const {noticeCount} = chat;
            if (noticeCount) {
                chatNoticeView = <div className={classes('label circle label-sm', chat.isMuteOrHidden ? 'blue' : 'red')}>{noticeCount > 99 ? '99+' : noticeCount}</div>;
            }
        }

        const showStatusDot = theOtherOne && !Config.ui['chat.hideStatusDot'];

        return (<div className={classes('chat-title heading', className)} {...other}>
            {
                (!denyShowMemberProfile && theOtherOne) ? <ChatAvatar chat={chat} size={24} className={theOtherOne ? 'state' : ''} onClick={onTitleClick} /> : <div className="hint--bottom-right has-padding-smhint--bottom" data-hint={chat.gid.slice(0,4) + '...点击复制'} onClick={this.copyId}><ChatAvatar chat={chat} size={24} className={theOtherOne ? 'state' : ''} /></div>
            }
            {/* {hideChatAvatar ? null : <ChatAvatar chat={chat} size={24} className={theOtherOne ? 'state' : ''} onClick={onTitleClick} />} */}
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
            <div className="flex-auto" />
            {children}
        </div>);
    }
}
