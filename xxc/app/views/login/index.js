import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Config from '../../config';
import HTML from '../../utils/html-helper';
import {LoginForm} from './form';
import {BuildInfo} from '../common/build-info';
import PoweredInfo from '../common/powered-info';
import App from '../../core';
import replaceViews from '../replace-views';
import pkg from '../../package.json';

/**
 * LoginIndex 组件 ，显示登录界面
 * @class LoginIndex
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {PureComponent}
 * @example
 * import LoginIndex from './index';
 * <LoginIndex />
 */
export default class LoginIndex extends PureComponent {
    /**
     * 获取 LoginIndex 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<LoginIndex>}
     * @readonly
     * @static
     * @memberof LoginIndex
     * @example <caption>可替换组件类调用方式</caption>
     * import {LoginIndex} from './index';
     * <LoginIndex />
     */
    static get LoginIndex() {
        return replaceViews('login/index', LoginIndex);
    }

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof LoginIndex
     * @static
     */
    static defaultProps = {
        className: null,
        userStatus: null,
        children: null,
    };

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof LoginIndex
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        userStatus: PropTypes.any,
        children: PropTypes.any,
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof LoginIndex
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            className,
            userStatus,
            children,
            ...other
        } = this.props;

        let showPoweredBy = Config.ui['app.showPoweredBy'];
        if (showPoweredBy === 'auto') {
            showPoweredBy = pkg.name !== 'xuanxuan';
        }

        return (<div className={HTML.classes('app-login center-content', className)} {...other}>
            <section>
                <header className="text-center space-sm">
                    <img src={`${Config.media['image.path']}logo-inverse.png`} alt="logo" />
                </header>
                <LoginForm className="rounded layer has-padding-xl" />
                {App.ui.entryParams.loginTip && <div className="app-login-tip small text-center has-padding-v muted text-white">{App.ui.entryParams.loginTip}</div>}
                {children}
            </section>
            <BuildInfo className="dock-right dock-bottom small has-padding text-white muted" />
            {showPoweredBy && <PoweredInfo className="dock-left dock-bottom small strong has-padding text-white muted" />}
        </div>);
    }
}
