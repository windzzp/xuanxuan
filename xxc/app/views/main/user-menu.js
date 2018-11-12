import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Platform from 'Platform';
import HTML from '../../utils/html-helper';
import Icon from '../../components/icon';
import ClickOutsideWrapper from '../../components/click-outside-wrapper';
import Lang from '../../lang';
import App from '../../core';
import {StatusDot} from '../common/status-dot';
import User from '../../core/profile/user';
import UserProfileDialog from '../common/user-profile-dialog';
import AboutDialog from '../common/about-dialog';
import UserSettingDialog from '../common/user-setting-dialog';
import UserChangePasswordDialog from '../common/user-change-password-dialog';
import replaceViews from '../replace-views';

/**
 * 用户状态名称清单
 * @type {string[]}
 * @private
 */
const allStatus = [
    User.STATUS.getName(User.STATUS.online),
    User.STATUS.getName(User.STATUS.busy),
    User.STATUS.getName(User.STATUS.away),
];

/**
 * 当前系统平台是否为浏览器
 * @type {boolean}
 * @private
 */
const isBrowser = Platform.type === 'browser';

export default class UserMenu extends Component {
    /**
     * 获取 UserMenu 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<UserMenu>}
     * @readonly
     * @static
     * @memberof UserMenu
     * @example <caption>可替换组件类调用方式</caption> @lang jsx
     * import {UserMenu} from './user-menu';
     * <UserMenu />
     */
    static get UserMenu() {
        return replaceViews('main/user-menu', UserMenu);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof UserMenu
     * @type {Object}
     */
    static propTypes = {
        onRequestClose: PropTypes.func,
        children: PropTypes.any,
        className: PropTypes.string
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof UserMenu
     * @static
     */
    static defaultProps = {
        onRequestClose: null,
        children: null,
        className: null,
    };

    /**
     * 处理点击切换状态事件
     * @param {string} status 要切换的状态名称
     * @memberof UserMenu
     * @private
     * @return {void}
     */
    handleStatusClick(status) {
        App.server.changeUserStatus(status);
        this.requestClose();
    }

    /**
     * 处理点击退出登录（注销）条目事件
     * @memberof UserMenu
     * @private
     * @return {void}
     */
    handleLogoutClick = () => {
        App.server.logout();
        this.requestClose();
    }

    /**
     * 处理点击退出条目事件
     * @memberof UserMenu
     * @private
     * @return {void}
     */
    handleExitClick = () => {
        App.ui.quit();
    }

    /**
     * 处理请求关闭个人菜单事件
     * @memberof UserMenu
     * @private
     * @return {void}
     */
    requestClose = () => {
        if (this.props.onRequestClose) {
            this.props.onRequestClose();
        }
    }

    /**
     * 处理点击个人资料条目事件
     * @memberof UserMenu
     * @private
     * @return {void}
     */
    handleUserProfileItemClick = () => {
        UserProfileDialog.show();
        this.requestClose();
    };

    /**
     * 处理点击关于条目事件
     * @memberof UserMenu
     * @private
     * @return {void}
     */
    handleAboutItemClick = () => {
        AboutDialog.show();
        this.requestClose();
    };

    /**
     * 处理点击设置条目事件
     * @memberof UserMenu
     * @private
     * @return {void}
     */
    handleSettingItemClick = () => {
        UserSettingDialog.show();
        this.requestClose();
    };

    /**
     * 处理点击修改密码条目事件
     * @memberof UserMenu
     * @private
     * @return {void}
     */
    handleChangePasswordClick = () => {
        UserChangePasswordDialog.show();
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof UserMenu
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            onRequestClose,
            className,
            children,
            ...other
        } = this.props;

        const {user} = App.profile;
        const userStatus = user && user.status;
        const userStatusName = userStatus && User.STATUS.getName(userStatus);
        const isSupportChangePassword = !user.ldap;

        return (<ClickOutsideWrapper
            {...other}
            onClickOutside={onRequestClose}
            className={HTML.classes('app-usermenu layer text-dark list', className)}
        >
            {
                allStatus.map(statusName => {
                    return (<a key={statusName} onClick={this.handleStatusClick.bind(this, statusName)} className="item flex-middle">
                        <StatusDot status={statusName} />
                        <div className="title">{Lang.string(`member.status.${statusName}`)}</div>
                        {userStatusName === statusName && <Icon name="check" className="text-green" />}
                    </a>);
                })
            }
            <div className="divider" />
            <a className="item" onClick={this.handleUserProfileItemClick}><div className="title">{Lang.string('usermenu.openProfile')}</div></a>
            {isSupportChangePassword ? <a className="item" onClick={this.handleChangePasswordClick}><div className="title">{Lang.string('usermenu.changePassword')}</div></a> : null}
            <div className="divider" />
            <a className="item" onClick={this.handleAboutItemClick}><div className="title">{Lang.string('usermenu.about')}</div></a>
            <a className="item" onClick={this.handleSettingItemClick}><div className="title">{Lang.string('usermenu.setting')}</div></a>
            {isBrowser ? null : <a className="item" href="#/exts/app/themes" onClick={this.requestClose}><div className="title">{Lang.string('exts.themes.label')}</div></a>}
            <a className="item" onClick={this.handleLogoutClick}><div className="title">{Lang.string('usermenu.logout')}</div></a>
            {App.ui.canQuit && <a className="item" onClick={this.handleExitClick}><div className="title">{Lang.string('usermenu.exit')}</div></a>}
            {children}
        </ClickOutsideWrapper>);
    }
}
