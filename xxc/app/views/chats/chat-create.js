import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import Avatar from '../../components/avatar';
import Lang from '../../core/lang';
import {ChatCreateGroups} from './chat-create-groups';
import {ChatJoinPublic} from './chat-join-public';
import replaceViews from '../replace-views';

/**
 * ChatCreate 组件 ，显示创建聊天界面
 * @class ChatCreate
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import ChatCreate from './chat-create';
 * <ChatCreate />
 */
export default class ChatCreateView extends PureComponent {
    /**
     * 获取 ChatCreate 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<ChatCreate>}
     * @readonly
     * @static
     * @memberof ChatCreate
     * @example <caption>可替换组件类调用方式</caption>
     * import {ChatCreate} from './chat-create';
     * <ChatCreate />
     */
    static get ChatCreateView() {
        return replaceViews('chats/chat-create', ChatCreateView);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof ChatCreate
     * @type {Object}
     */
    static propTypes = {
        onRequestClose: PropTypes.func,
        className: PropTypes.string,
        children: PropTypes.any,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof ChatCreate
     * @static
     */
    static defaultProps = {
        onRequestClose: null,
        className: null,
        children: null,
    };

    /**
     * React 组件构造函数，创建一个 ChatCreate 组件实例，会在装配之前被调用。
     * @see https://react.docschina.org/docs/react-component.html#constructor
     * @param {Object?} props 组件属性对象
     * @constructor
     */
    constructor(props) {
        super(props);

        /**
         * React 组件状态对象
         * @see https://react.docschina.org/docs/state-and-lifecycle.html
         * @type {object}
         */
        this.state = {
            type: 'normal'
        };
    }

    /**
     * 变更要创建的聊天类型
     *
     * @param {string} type 要创建的聊天类型
     * @memberof ChatCreateView
     * @return {void}
     */
    changeType(type) {
        this.setState({type});
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof ChatCreate
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            className,
            children,
            onRequestClose,
            ...other
        } = this.props;

        return (
            <div
                {...other}
                className={classes('app-chat-create dock-bottom row single', className)}
            >
                <div className="primary-pale column single flex-none">
                    <div className="list-item divider flex-none">
                        <Avatar icon="arrow-right" iconClassName="text-muted icon-2x" />
                        <div className="title">{Lang.string('chat.create.chatTypeTip')}</div>
                    </div>
                    <div className="scroll-y flex-auto lighten">
                        <div className="list compact app-chat-create-types-menu">
                            <a onClick={this.changeType.bind(this, 'normal')} className={'item' + (this.state.type === 'normal' ? ' white text-primary' : '')}>
                                <Avatar icon="account-multiple-outline" iconClassName="text-blue icon-2x" />
                                <div className="title">{Lang.string('chat.create.chatType.normal')}</div>
                            </a>
                            <a onClick={this.changeType.bind(this, 'public')} className={'item' + (this.state.type === 'public' ? ' white text-primary' : '')}>
                                <Avatar icon="access-point" iconClassName="text-green icon-2x" />
                                <div className="title">{Lang.string('chat.create.chatType.public')}</div>
                            </a>
                        </div>
                    </div>
                </div>
                {this.state.type === 'normal' ? <ChatCreateGroups onRequestClose={onRequestClose} /> : <ChatJoinPublic onRequestClose={onRequestClose} />}
                {children}
            </div>
        );
    }
}
