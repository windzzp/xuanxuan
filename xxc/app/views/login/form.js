import Platform from 'Platform';
import Config from '../../config';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import InputControl from '../../components/input-control';
import Checkbox from '../../components/checkbox';
import Modal from '../../components/modal';
import Icon from '../../components/icon';
import Lang from '../../lang';
import HTML from '../../utils/html-helper';
import StringHelper from '../../utils/string-helper';
import App from '../../core';
import User from '../../core/profile/user';
import SwapUserDialog from './swap-user-dialog';
import replaceViews from '../replace-views';
import Button from '../../components/button';
import {isPasswordWithMD5Flag} from '../../core/profile/user';

/**
 * 将服务器地址转换为简单形式
 * @param {string} serverUrl 服务器地址
 * @return {string} 服务器地址
 * @private
 */
const simpleServerUrl = serverUrl => {
    if (serverUrl) {
        if (!serverUrl.startsWith('http://') && !serverUrl.startsWith('https://')) {
            serverUrl = `https://${serverUrl}`;
        }
        try {
            const simpleServer = new URL(serverUrl);
            if (simpleServer.port === '11443') {
                serverUrl = serverUrl.replace(':11443', '');
            }
        } catch (e) {
            if (DEBUG) {
                console.error('Cannot parse url ', serverUrl, e);
            }
        }
    }
    return serverUrl;
};

/**
 * Form 组件 ，显示登录表单界面
 * @class Form
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {PureComponent}
 * @example @lang jsx
 * import Form from './form';
 * <Form />
 */
export default class LoginForm extends PureComponent {
    /**
     * 获取 Form 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<Form>}
     * @readonly
     * @static
     * @memberof LoginForm
     * @example <caption>可替换组件类调用方式</caption> @lang jsx
     * import {Form} from './form';
     * <Form />
     */
    static get LoginForm() {
        return replaceViews('login/form', LoginForm);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof LoginForm
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof LoginForm
     * @static
     */
    static defaultProps = {
        className: null,
    };

    /**
     * React 组件构造函数，创建一个 Form 组件实例，会在装配之前被调用。
     * @see https://react.docschina.org/docs/react-component.html#constructor
     * @param {Object?} props 组件属性对象
     * @constructor
     */
    constructor(props) {
        super(props);

        const lastSavedUser = App.profile.getLastSavedUser();
        const entryParams = App.ui.entryParams;

        /**
         * React 组件状态对象
         * @see https://react.docschina.org/docs/state-and-lifecycle.html
         * @type {object}
         */
        const state = {
            serverUrl: Config.ui.serverUrl || '',
            account: '',
            password: '',
            rememberPassword: true,
            autoLogin: false,
            message: '',
            submitable: false,
            logining: false,
        };

        if (entryParams && entryParams.server) {
            state.serverUrl = entryParams.server;
            state.account = entryParams.account || '';
            state.password = entryParams.password || '';
            state.ldap = entryParams.ldap;
        } else if (lastSavedUser) {
            if (!Config.ui.serverUrl) {
                state.serverUrl = lastSavedUser.serverUrl || lastSavedUser.server || '';
            }
            state.account = lastSavedUser.account || '';
            state.password = lastSavedUser.rememberPassword ? lastSavedUser.password : '';
            state.rememberPassword = lastSavedUser.rememberPassword;
            state.autoLogin = lastSavedUser.autoLogin;
            state.ldap = lastSavedUser.ldap;
        }

        if (state.serverUrl) {
            state.serverUrl = simpleServerUrl(state.serverUrl);
        }

        state.submitable = StringHelper.isNotEmpty(state.serverUrl) && StringHelper.isNotEmpty(state.account) && StringHelper.isNotEmpty(state.password);

        if (state.autoLogin && state.submitable) {
            state.logining = true;
        }

        this.state = state;
    }

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof LoginForm
     * @return {void}
     */
    componentDidMount() {
        if (this.state.submitable && (this.state.autoLogin || App.ui.isAutoLoginNextTime())) {
            this.login();
        }
    }

    /**
     * 登录到服务器
     *
     * @return {void}
     * @memberof LoginForm
     */
    login() {
        App.server.login({
            server: this.state.serverUrl,
            account: this.state.account,
            password: this.state.password,
            rememberPassword: this.state.rememberPassword,
            autoLogin: this.state.autoLogin,
            ldap: this.state.ldap,
        }).then(() => {
            this.setState({logining: false});
        }).catch(error => {
            if (DEBUG) {
                console.error('Login failed with error:', error);
            }
            this.setState({message: error ? Lang.error(error) : null, logining: false});
        });
    }

    /**
     * 处理输入框变更事件
     *
     * @param {string} field 输入框 ID
     * @param {string} value 输入框值
     * @memberof LoginForm
     * @return {void}
     * @private
     */
    handleInputFieldChange(field, value) {
        const userState = {
            account: this.state.account,
            password: this.state.password,
            serverUrl: this.state.serverUrl,
            message: ''
        };
        userState[field] = value;
        userState.submitable = StringHelper.isNotEmpty(userState.serverUrl) && StringHelper.isNotEmpty(userState.account) && StringHelper.isNotEmpty(userState.password);

        this.setState(userState);
    }

    /**
     * 处理记住密码复选框变更事件
     * @param {boolean} rememberPassword 是否记住密码
     * @memberof LoginForm
     * @private
     * @return {void}
     */
    handleRememberPasswordChanged = rememberPassword => {
        this.setState({
            rememberPassword,
            ldap: rememberPassword ? false : this.state.ldap,
            autoLogin: !rememberPassword ? false : this.state.autoLogin
        });
    }

    /**
     * 处理自动登录复选框变更事件
     * @param {boolean} autoLogin 是否自动登录
     * @memberof LoginForm
     * @private
     * @return {void}
     */
    handleAutoLoginChanged = autoLogin => {
        this.setState({
            autoLogin,
            ldap: autoLogin ? false : this.state.ldap,
            rememberPassword: autoLogin ? true : this.state.rememberPassword
        });
    }

    /**
     * 变更 LDAP 设置
     *
     * @param {boolean} ldap 是否启用 LDAP
     * @memberof LoginForm
     * @return {void}
     */
    changeLDAP(ldap) {
        this.setState({
            ldap,
            rememberPassword: ldap ? false : this.state.rememberPassword,
            autoLogin: ldap ? false : this.state.autoLogin,
        });
        if (ldap && isPasswordWithMD5Flag(this.state.password)) {
            this.handleInputFieldChange('password', '');
        }
    }

    /**
     * 处理 LDAP 复选框变更事件
     * @param {boolean} ldap 是否启用 LDAP
     * @memberof LoginForm
     * @private
     * @return {void}
     */
    handleLDAPChanged = ldap => {
        if (ldap && !this.hasShowedLDAPConfirm) {
            Modal.confirm(Lang.string('login.ldap.confirm'), {
                actions: [
                    {type: 'cancel'},
                    {type: 'submit', label: Lang.string('common.continue')},
                ],
                style: {maxWidth: 500},
            }).then(result => {
                if (result) {
                    this.changeLDAP(ldap);
                }
                this.hasShowedLDAPConfirm = true;
            }).catch(error => {
                if (DEBUG) {
                    console.error('Modal.confirm error', error);
                }
            });
        } else {
            this.changeLDAP(ldap);
        }
    }

    /**
     * 处理点击登录按钮事件
     * @memberof LoginForm
     * @private
     * @return {void}
     */
    handleLoginBtnClick = () => {
        this.setState({
            logining: true,
            message: '',
        }, () => {
            const {serverUrl} = this.state;
            if (serverUrl.toLowerCase().startsWith('http://')) {
                Modal.confirm((<div>
                    <h4>{Lang.format('login.nonSecurity.confirm', serverUrl)}</h4>
                    <div className="text-gray">{Lang.string('login.nonSecurity.detail')}</div>
                </div>), {
                    actions: [
                        {type: 'cancel'},
                        {type: 'submit', label: Lang.string('login.nonSecurity.btn'), className: 'danger-pale text-danger'},
                    ],
                    style: {maxWidth: 500},
                    className: 'app-login-nonSecurity-dialog',
                }).then(result => {
                    if (result) {
                        this.login();
                    } else {
                        this.setState({
                            logining: false,
                            message: '',
                        });
                    }
                }).catch(error => {
                    if (DEBUG) {
                        console.error('Modal.confirm error', error);
                    }
                });
            } else {
                this.login();
            }
        });
    };

    /**
     * 处理点击切换用户按钮事件
     * @memberof LoginForm
     * @private
     * @return {void}
     */
    handleSwapUserBtnClick = () => {
        const {serverUrl, account} = this.state;
        const identify = (serverUrl && account) ? User.createIdentify(serverUrl, account) : null;
        SwapUserDialog.show(identify, user => {
            const newState = {
                serverUrl: simpleServerUrl(user.serverUrl),
                account: user.account,
                password: user.passwordMD5WithFlag,
                message: ''
            };
            newState.submitable = StringHelper.isNotEmpty(newState.serverUrl) && StringHelper.isNotEmpty(newState.account) && StringHelper.isNotEmpty(newState.password);
            this.setState(newState);
        });
    };

    /**
     * 处理服务器地址变更事件
     * @param {string} val 服务器地址
     * @memberof LoginForm
     * @private
     * @return {void}
     */
    handleServerUrlChange = val => {
        this.handleInputFieldChange('serverUrl', val);
    };

    /**
     * 处理用户名变更事件
     * @param {string} val 用户名
     * @memberof LoginForm
     * @private
     * @return {void}
     */
    handleAccountChange = val => {
        this.handleInputFieldChange('account', val);
    };

    /**
     * 处理密码变更事件
     * @param {string} val 密码
     * @memberof LoginForm
     * @private
     * @return {void}
     */
    handlePasswordChange = val => {
        this.handleInputFieldChange('password', val);
    };

    /**
     * 处理点击更多设置按钮事件
     * @param {Event} e 事件对象
     * @memberof LoginForm
     * @private
     * @return {void}
     */
    handleSettingBtnClick = e => {
        const isOpenAtLogin = Platform.ui.isOpenAtLogin();
        App.ui.showContextMenu({x: e.clientX, y: e.clientY}, [{
            label: Lang.string('login.openAtLogin'),
            checked: isOpenAtLogin,
            click: () => {
                Platform.ui.setOpenAtLogin(!isOpenAtLogin);
            }
        }]);
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof LoginForm
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            className,
            ...other
        } = this.props;

        if (!this.serverSwitchBtn) {
            this.serverSwitchBtn = <div data-hint={Lang.string('login.swapUser')} className="hint--top app-login-swap-user-btn dock-right dock-top"><button onClick={this.handleSwapUserBtnClick} type="button" className="btn iconbutton rounded"><Icon name="account-switch" /></button></div>;
        }

        return (<div className={HTML.classes('app-login-form', className)} {...other}>
            {this.state.message && <div className="app-login-message danger box">{this.state.message}</div>}
            {Config.ui.serverUrl ? null : <InputControl
                value={this.state.serverUrl}
                autoFocus
                disabled={this.state.logining}
                label={Lang.string('login.serverUrl.label')}
                placeholder={Lang.string('login.serverUrl.hint')}
                onChange={this.handleServerUrlChange}
                className="relative app-login-server-control"
            >
                {this.serverSwitchBtn}
            </InputControl>}
            <InputControl
                value={this.state.account}
                disabled={this.state.logining}
                label={Lang.string('login.account.label')}
                placeholder={Lang.string('login.account.hint')}
                onChange={this.handleAccountChange}
            />
            <InputControl
                value={this.state.password}
                disabled={this.state.logining}
                className="space"
                label={Lang.string('login.password.label')}
                inputType="password"
                onChange={this.handlePasswordChange}
            />
            <button
                type="button"
                disabled={!this.state.submitable || this.state.logining}
                className={HTML.classes('btn block rounded space-sm', this.state.submitable ? 'primary' : 'gray')}
                onClick={this.handleLoginBtnClick}
            >
                {Lang.string(this.state.logining ? 'login.btn.logining' : 'login.btn.label')}
            </button>
            <div className="row">
                <Checkbox disabled={this.state.logining} checked={this.state.rememberPassword} onChange={this.handleRememberPasswordChanged} className="cell" label={Lang.string('login.rememberPassword')} />
                <Checkbox disabled={this.state.logining} checked={this.state.autoLogin} onChange={this.handleAutoLoginChanged} className="cell" label={Lang.string('login.autoLogin')} />
                <Checkbox disabled={this.state.logining} checked={this.state.ldap} onChange={this.handleLDAPChanged} className="cell" label={'LDAP'} />
                {Platform.ui.isOpenAtLogin ? <div data-hint={Lang.string('login.moreLoginSettings')} className="hint--top"><Button className="iconbutton rounded" icon="settings-box" onClick={this.handleSettingBtnClick} /></div> : null}
            </div>
        </div>);
    }
}
