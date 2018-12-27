import React, {PureComponent} from 'react';
import Config, {getSpecialVersionName} from '../../config';
import DateHelper from '../../utils/date-helper';
import replaceViews from '../replace-views';
import platform from '../../platform';

/**
 * package.json 内容
 * @type {Object}
 * @private
 */
const PKG = Config.pkg;

/**
 * BuildInfo 组件 ，显示构建信息
 * @class BuildInfo
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {PureComponent}
 * @example
 * import BuildInfo from './build-info';
 * <BuildInfo />
 */
export default class BuildInfo extends PureComponent {
    /**
     * 获取 BuildInfo 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<BuildInfo>}
     * @readonly
     * @static
     * @memberof BuildInfo
     * @example <caption>可替换组件类调用方式</caption>
     * import {BuildInfo} from './build-info';
     * <BuildInfo />
     */
    static get BuildInfo() {
        return replaceViews('common/build-info', BuildInfo);
    }

    /**
     * 处理点击事件
     * @memberof BuildInfo
     * @private
     * @return {void}
     */
    handleClick = () => {
        const now = new Date().getTime();
        if (!this.lastClickTime) {
            this.lastClickTime = now;
        }

        if (!this.clickTimes) {
            this.clickTimes = 1;
        } else if (now - this.lastClickTime < 400) {
            this.clickTimes += 1;
            this.lastClickTime = now;
            if (this.clickTimes >= 5) {
                platform.call('ui.openDevTools');
            }
        } else {
            this.clickTimes = 0;
            this.lastClickTime = 0;
        }
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof BuildInfo
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const specialVersion = getSpecialVersionName();
        return <div onClick={this.handleClick} {...this.props}>v{PKG.version}{PKG.distributeTime ? (` (${DateHelper.format(PKG.distributeTime, 'YYYYMMDDHHmm')})`) : null}{PKG.buildVersion ? `.${PKG.buildVersion}` : null} {specialVersion ? (` for ${specialVersion}`) : ''} {DEBUG ? '[debug]' : ''}</div>;
    }
}
