import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import Lang from '../../core/lang';
import App from '../../core';
import _UserAvatar from '../common/user-avatar';
import withReplaceView from '../with-replace-view';
import {sendContentToChat} from '../../core/im/im-ui';
// import events from '../../core/events';

const UserAvatar = withReplaceView(_UserAvatar);

/**
 * MessageContentRetracted 组件 ，显示广播聊天消息条目
 * @class MessageContentRetracted
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import MessageContentRetracted from './message-content-retracted';
 * <MessageContentRetracted />
 */
export default class MessageContentRetracted extends Component {
    /**
     * MessageContentRetracted 对应的可替换类路径名称
     *
     * @type {String}
     * @static
     * @memberof MessageContentRetracted
     */
    static replaceViewPath = 'chats/MessageContentRetracted';

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof MessageContentRetracted
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.any,
        message: PropTypes.object.isRequired,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof MessageContentRetracted
     * @static
     */
    static defaultProps = {
        className: null,
        children: null,
    };

    // constructor(props) {
    //     super(props);
    //     // this.state = {
    //     //     displayReedit: 'hide'
    //     // };
    // }

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof MessageContentRetracted
     * @return {void}
     */
    componentDidMount() {
        // const {message} = this.props;
        // const {gid} = message;
        // const SHOW_TIME = 1000 * 60;
        // this.showReeditHandle = App.im.ui.onShowReeditHandle(gid, () => {
        //     this.setState({displayReedit: 'show'});
        //     this.showReeditTime = setTimeout(() => {
        //         this.setState({displayReedit: 'hide'});
        //     }, SHOW_TIME);
        // });
    }

    /**
     * React 组件生命周期函数：`componentWillUnmount`
     * 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，清理
    任何在componentDidMount环节创建的DOM元素。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentwillunmount
     * @private
     * @memberof MessageContentRetracted
     * @return {void}
     */
    componentWillUnmount() {
        // events.off(this.showReeditHandle);
        // clearTimeout(this.showReeditTime);
    }

    /**
     * 处理点击重新编辑
     * @private
     * @return {void}
     */
    handleReedit() {
        const {message} = this.props;
        const {isTextContent, content, cgid} = message;
        if (isTextContent && content) {
            return sendContentToChat(content, 'text', cgid);
        }
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof MessageContentRetracted
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            message,
            className,
            children,
            ...other
        } = this.props;
        // const {displayReedit} = this.state;
        const sender = message.getSender(App.members);
        return (
            <div className={classes('app-message-broadcast app-message-retracted has-padding-xs space-sm primary-pale flex-inline flex-middle row single muted', className)} {...other}>
                <UserAvatar user={sender} size={20} />
                <div className="content markdown-content">{Lang.format('chat.message.retracted', sender.displayName)}</div>
            </div>
        );
    }
}
