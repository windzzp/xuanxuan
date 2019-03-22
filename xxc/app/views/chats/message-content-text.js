import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import Lang, {onLangChange} from '../../core/lang';
import Config from '../../config';
import {linkMentionsInText} from '../../core/members';
import {renderChatMessageContent} from '../../core/im/im-ui';
import events from '../../core/events';

/**
 * MessageContentText 组件 ，显示聊天消息文本内容界面
 * @class MessageContentText
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import MessageContentText from './message-content-text';
 * <MessageContentText />
 */
export default class MessageContentText extends Component {
    /**
     * MessageContentText 对应的可替换类路径名称
     *
     * @type {String}
     * @static
     * @memberof MessageContentText
     */
    static replaceViewPath = 'chats/MessageContentText';

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof MessageContentText
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        message: PropTypes.object.isRequired,
        contentConverter: PropTypes.func,
        fontSize: PropTypes.any
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof MessageContentText
     * @static
     */
    static defaultProps = {
        className: null,
        contentConverter: null,
        fontSize: null
    };

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof MessageContentText
     * @return {void}
     */
    componentDidMount() {
        this.onLangChangeHandler = onLangChange(() => {
            this.forceUpdate();
        });
    }

    /**
     * React 组件生命周期函数：`shouldComponentUpdate`
     * 让React知道当前状态或属性的改变是否不影响组件的输出。默认行为是在每一次状态的改变重渲，在大部分情况下你应该依赖于默认行为。
     *
     * @param {Object} nextProps 即将更新的属性值
     * @param {Object} nextState 即将更新的状态值
     * @returns {boolean} 如果返回 `true` 则继续渲染组件，否则为 `false` 而后的 `UNSAFE_componentWillUpdate()`，`render()`， 和 `componentDidUpdate()` 将不会被调用
     * @memberof MessageContentText
     */
    shouldComponentUpdate(nextProps) {
        return nextProps.className !== this.props.className || nextProps.contentConverter !== this.props.contentConverter || nextProps.message !== this.props.message || nextProps.message.content !== this.props.message.content || nextProps.fontSize !== this.props.fontSize;
    }

    /**
     * React 组件生命周期函数：`componentWillUnmount`
     * 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，清理
    任何在componentDidMount环节创建的DOM元素。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentwillunmount
     * @private
     * @memberof MessageContentText
     * @return {void}
     */
    componentWillUnmount() {
        events.off(this.onLangChangeHandler);
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof MessageContentText
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            message,
            className,
            contentConverter,
            fontSize,
            ...other
        } = this.props;

        const content = message.renderedTextContent(renderChatMessageContent, Config.ui['chat.denyShowMemberProfile'] ? null : linkMentionsInText, contentConverter);
        const contentVerify = content.replace(/^<(?:.|\n)*?>/gm, '').replace(/<(?:.|\n)*?>/gm, '').replace(/<\/[a-z0-9]+>$/gm, '').trim();

        return (
            <div
                {...other}
                className={classes('app-message-content-text markdown-content', className, {
                    'is-content-block': message.isBlockContent
                })}
                dangerouslySetInnerHTML={{__html: contentVerify.length ? content : '<small class="text-gray">' + Lang.string('chat.message.invisible') + '</small>'}}
            />
        );
    }
}
