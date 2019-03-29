import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route, Link} from 'react-router-dom';
import Config from '../../config';
import {rem, classes} from '../../utils/html-helper';
import Lang from '../../core/lang';
import Avatar from '../../components/avatar';
import App from '../../core';
import ROUTES from '../common/routes';
import UserSettingDialog from '../common/user-setting-dialog';
import _UserAvatar from '../common/user-avatar';
import _StatusDot from '../common/status-dot';
import _UserMenu from './user-menu';
import withReplaceView from '../with-replace-view';
import { reduceEachLeadingCommentRange } from 'typescript';

const {getCurrentWindow, process} = require('electron').remote;

const IS_WINDOWS_OS = process.platform === 'win32';

/**
 * UserMenu 可替换组件形式
 * @type {Class<UserMenu>}
 * @private
 */
const UserMenu = withReplaceView(_UserMenu);

/**
 * UserAvatar 可替换组件形式
 * @type {Class<UserAvatar>}
 * @private
 */
const UserAvatar = withReplaceView(_UserAvatar);

/**
 * StatusDot 可替换组件形式
 * @type {Class<StatusDot>}
 * @private
 */
const StatusDot = withReplaceView(_StatusDot);

/**
 * Navbar 组件 ，显示主导航界面
 * @class Navbar
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import Navbar from './navbar';
 * <Navbar />
 */
export default class Navbar extends Component {
    /**
     * Navbar 对应的可替换类路径名称
     *
     * @type {String}
     * @static
     * @memberof Navbar
     */
    static replaceViewPath = 'main/Navbar';

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof Navbar
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        userStatus: PropTypes.any,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof Navbar
     * @static
     */
    static defaultProps = {
        className: null,
        userStatus: null,
    };

    /**
     * React 组件构造函数，创建一个 Navbar 组件实例，会在装配之前被调用。
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
            showUserMenu: false,
            newMessageCount: 0,
        };
    }

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof Navbar
     * @return {void}
     */
    componentDidMount() {
        this.noticeUpdateHandler = App.notice.onNoticeUpdate(notice => {
            this.setState({newMessageCount: notice.notMuteCount});
        });

        this.dataChangeEventHandler = App.events.onDataChange(data => {
            if (data && data.members && data.members[App.profile.userId]) {
                this.forceUpdate();
            }
        });

        const hashFilters = window.location.hash.split('/');
        if (hashFilters[0] === '#') {
            this.lastFilterType = hashFilters[1];
        }
    }

    /**
     * React 组件生命周期函数：`componentWillUnmount`
     * 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，清理
    任何在componentDidMount环节创建的DOM元素。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentwillunmount
     * @private
     * @memberof Navbar
     * @return {void}
     */
    componentWillUnmount() {
        App.events.off(this.noticeUpdateHandler, this.dataChangeEventHandler);
    }

    /**
     * 处理点击个人头像事件
     * @memberof Navbar
     * @private
     * @return {void}
     */
    handleProfileAvatarClick = () => {
        this.setState({showUserMenu: true});
    };

    /**
     * 处理用户个人菜单面板请求关闭事件
     * @memberof Navbar
     * @private
     * @return {void}
     */
    handleUserMenuRequestClose = () => {
        this.setState({showUserMenu: false});
    };

    /**
     * 处理点击设置按钮像事件
     * @memberof Navbar
     * @private
     * @return {void}
     */
    handleSettingBtnClick = () => {
        UserSettingDialog.show();
    };

    /**
     * 处理导航条目点击事件
     * 这个点击的作用主要是判断如果是小屏幕显示模式则将聊天列表以抽屉的形式显示出来，点击主导航界面切换是由内部的 NavLink 路由实现，为防止界面还没切换无法正确显示抽屉形式列表，所以会延迟一定时间登录路由切换完成。
     *
     * @memberof Navbar
     * @private
     * @return {void}
     */
    handleMainNavItemClick = () => {
        setTimeout(() => {
            const hashFilters = window.location.hash.split('/');
            if (hashFilters[0] !== '#') {
                return;
            }
            const currentFilterType = hashFilters[1];
            if (this.lastFilterType && this.lastFilterType === currentFilterType) {
                App.ui.showMobileChatsMenu(true);
            }
            this.lastFilterType = currentFilterType;
        }, 200);
    };

    handleMinClick = () => {
        const window = getCurrentWindow();
        window.minimize();
    }

    handleMaxClick = () => {
        console.log('max!');
        const window = getCurrentWindow();
        if (!window.isMaximized()) {
            window.maximize();
        } else {
            window.unmaximize();
        }
    }

    handleClsClick = () => {
        const window = getCurrentWindow();
        window.close();
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof Navbar
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            className,
            userStatus,
            ...other
        } = this.props;

        const navbarWidth = Config.ui['navbar.width'];
        const {userConfig} = App.profile;
        const isAvatarOnTop = userConfig && userConfig.avatarPosition === 'top';
        const {showUserMenu, newMessageCount} = this.state;
        const {ExtsRuntime} = global;

        /**
         * 导航项目列表
         * @type {{to: string, label: string, icon: string, activeIcon: string}[]}
         * @private
         */
        const navbarItems = [
            {
                to: ROUTES.chats.recents.__, label: Lang.string('navbar.chats.label'), icon: 'comment-processing-outline', activeIcon: 'comment-processing'
            }, {
                to: ROUTES.chats.groups.__, label: Lang.string('navbar.groups.label'), icon: 'comment-multiple-outline', activeIcon: 'comment-multiple'
            }, {
                to: ROUTES.chats.contacts.__, label: Lang.string('navbar.contacts.label'), icon: 'account-group-outline', activeIcon: 'account-group'
            },
        ];

        const dotView = <div className="label label-sm dock-right dock-top circle red badge">{newMessageCount}</div>;

        const navbarItemsView = navbarItems.map(item => (
            <div className="nav-item hint--right" data-hint={item.label} key={item.to} onClick={this.handleMainNavItemClick}>
                <Route path={item.to}>
                    {
                        ({match, location}) => {
                            const isActive = location.pathname.startsWith(item.to);
                            return (
                                <Link className={classes('block', {active: isActive})} to={item.to}>
                                    <Avatar size={Config.ui['navbar.width']} icon={match ? item.activeIcon : item.icon} />
                                </Link>
                            );
                        }
                    }
                </Route>
                {(item.to === ROUTES.chats.recents.__ && newMessageCount > 0) ? dotView : null}
            </div>
        ));

        return (
            <div
                className={classes('app-navbar', className, {
                    'with-avatar-on-top': true
                })}
                style={{
                    backgroundImage: `url(${Config.media['image.path']}navBackground.svg)`,
                }}
                {...other}
            >
                <nav
                    className="inline-block dock-left has-padding app-nav-profile"
                >
                    <div className="has-padding app-company-name">传说中的大测试公司</div>
                    <div className="app-profile">
                        <a className="inline-block relative app-profile-avatar dock-left" onClick={this.handleProfileAvatarClick}>
                            <UserAvatar className="avatar-lg relative" style={{margin: rem((navbarWidth - 30) / 2)}} size={28} user={App.profile.user} />
                            {/* <StatusDot status={App.profile.userStatus} /> */}
                        </a>
                        <div className="inline-block relative dock-right app-profile-name">{/* App.profile.user.displayName */}TEST Toast</div>
                    </div>
                    {/* {showUserMenu && <UserMenu className="dock-left" style={{left: rem(navbarWidth)}} onRequestClose={this.handleUserMenuRequestClose} />} */}
                </nav>
                <nav className="inline-block dock-left app-nav-main">
                    {navbarItemsView}
                </nav>
                {ExtsRuntime && ExtsRuntime.ExtsNavbarView && (
                    <nav className="inline-block app-nav-exts dock-right">
                        <ExtsRuntime.ExtsNavbarView />
                    </nav>
                )}
                <nav className="inline-block app-nav-search dock-right">
                    <i className="icon mdi mdi-magnify" />
                    <input placeholder="搜索" />
                </nav>
                {
                    isAvatarOnTop && (
                        <nav className="dock-bottom">
                            <div className="hint--right" data-hint={Lang.string('common.settings')}>
                                <a className="block" onClick={this.handleSettingBtnClick}><Avatar size={navbarWidth} icon="settings" /></a>
                            </div>
                        </nav>
                    )
                }
                {
                    IS_WINDOWS_OS && (
                        <nav className="inline-block app-nav-windows-control dock-right dock-top">
                            <div id="min-window-btn" className="inline-block"><a onClick={this.handleMinClick} className="icon mdi mdi-window-minimize" /></div>
                            <div id="max-window-btn" className="inline-block"><a onClick={this.handleMaxClick} className="icon mdi mdi-window-maximize" /></div>
                            <div id="cls-window-btn" className="inline-block"><a onClick={this.handleClsClick} className="icon mdi mdi-window-close" /></div>
                        </nav>
                    )
                }
            </div>
        );
    }
}
