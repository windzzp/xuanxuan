import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import Avatar from '../../components/avatar';
import Lang from '../../core/lang';
import App from '../../core';

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

        const sender = message.getSender(App.members);

        return (<div className={classes('app-message-broadcast has-padding-xs space-sm primary-pale flex-inline flex-middle row single', className)} {...other}>
            <Avatar className="avatar-sm flex-none" icon="bell text-secondary" />
            <div className="content markdown-content">{Lang.format('chat.message.retracted', sender.displayName)}</div>
        </div>);
    }
}
