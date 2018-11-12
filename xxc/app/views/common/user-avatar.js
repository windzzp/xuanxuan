import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../components/avatar';
import HTML from '../../utils/html-helper';
import App from '../../core';
import {StatusDot} from './status-dot';
import replaceViews from '../replace-views';

/**
 * UserAvatar 组件 ，显示用户头像界面
 * @class UserAvatar
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example @lang jsx
 * import UserAvatar from './user-avatar';
 * <UserAvatar />
 */
export default class UserAvatar extends Component {
    /**
     * 获取 UserAvatar 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<UserAvatar>}
     * @readonly
     * @static
     * @memberof UserAvatar
     * @example <caption>可替换组件类调用方式</caption> @lang jsx
     * import {UserAvatar} from './user-avatar';
     * <UserAvatar />
     */
    static get UserAvatar() {
        return replaceViews('common/user-avatar', UserAvatar);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof UserAvatar
     * @type {Object}
     */
    static propTypes = {
        user: PropTypes.object,
        className: PropTypes.string,
        showStatusDot: PropTypes.bool,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof UserAvatar
     * @static
     */
    static defaultProps = {
        className: null,
        showStatusDot: null,
        user: null,
    };

    /**
     * React 组件生命周期函数：`shouldComponentUpdate`
     * 让React知道当前状态或属性的改变是否不影响组件的输出。默认行为是在每一次状态的改变重渲，在大部分情况下你应该依赖于默认行为。
     *
     * @param {Object} nextProps 即将更新的属性值
     * @param {Object} nextState 即将更新的状态值
     * @returns {boolean} 如果返回 `true` 则继续渲染组件，否则为 `false` 而后的 `UNSAFE_componentWillUpdate()`，`render()`， 和 `componentDidUpdate()` 将不会被调用
     * @memberof UserAvatar
     */
    shouldComponentUpdate(nextProps) {
        return nextProps.className !== this.props.className || nextProps.user !== this.props.user || !nextProps.user || !this.props.user || nextProps.user.status !== this.props.user.status || nextProps.user.avatar !== this.props.user.avatar || nextProps.user.realname !== this.props.user.realname;
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof UserAvatar
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            user,
            className,
            showStatusDot,
            ...other
        } = this.props;

        let statusDot = null;
        if (showStatusDot) {
            statusDot = <StatusDot status={user.status} />;
        }

        if (!user) {
            return <Avatar className={HTML.classes('circle user-avatar', className)} icon="account" {...other}>{statusDot}</Avatar>;
        }

        const avatarImageSrc = user.getAvatar(App.user && App.user.server);
        if (avatarImageSrc) {
            return <Avatar className={HTML.classes('circle user-avatar', className)} image={avatarImageSrc} imageClassName="circle" {...other}>{statusDot}</Avatar>;
        }
        const name = user.realname || user.account;
        if (name && name.length) {
            return <Avatar skin={{code: user.id || name, textColor: '#fff'}} className={HTML.classes('circle user-avatar', className)} label={name[0].toUpperCase()} {...other}>{statusDot}</Avatar>;
        }
        return <Avatar skin={{code: user.id, textColor: '#fff'}} className={HTML.classes('circle user-avatar', className)} icon="account" {...other}>{statusDot}</Avatar>;
    }
}
