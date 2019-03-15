/* eslint-disable react/no-danger */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import Lang from '../../core/lang';
import {
    getUpdaterStatus, onUpdaterStatusChanged, isUpdaterAvaliable, downloadNewVersion, quitAndInstall, skipNewVersion, notifyMeNextTime
} from '../../core/updater';
import events from '../../core/events';
import EmojioneIcon from '../../components/emojione-icon';
import Markdown from '../../utils/markdown';
import App from '../../core';

/**
 * UpdateGuide 组件 ，显示应用关于界面
 * @class UpdateGuide
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import UpdateGuide from './update-guide';
 * <UpdateGuide />
 */
export default class UpdateGuide extends Component {
    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof About
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        onRequestClose: PropTypes.func,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof About
     * @static
     */
    static defaultProps = {
        className: null,
        onRequestClose: null,
    };

    /**
     * React 组件构造函数，创建一个 UpdateGuide 组件实例，会在装配之前被调用。
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
            updaterStatus: getUpdaterStatus()
        };
    }

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof UpdateGuide
     * @return {void}
     */
    componentDidMount() {
        if (isUpdaterAvaliable()) {
            this.onUpdateStatusChangeHandler = onUpdaterStatusChanged(updaterStatus => {
                this.setState({updaterStatus});
            });
            const {updaterStatus} = this.state;
            if (updaterStatus.needUpdateForce && updaterStatus.status === 'ready') {
                downloadNewVersion();
            }
        }
    }

    /**
     * React 组件生命周期函数：`componentWillUnmount`
     * 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，清理
    任何在componentDidMount环节创建的DOM元素。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentwillunmount
     * @private
     * @memberof UpdateGuide
     * @return {void}
     */
    componentWillUnmount() {
        if (isUpdaterAvaliable()) {
            events.off(this.onUpdateStatusChangeHandler);
        }
    }

    /**
     * 处理点击提醒我下次升级按钮事件
     *
     * @memberof UpdateGuide
     * @return {void}
     */
    notifyMeNextTime = () => {
        notifyMeNextTime(App.user);
        const {onRequestClose} = this.props;
        if (onRequestClose) {
            onRequestClose();
        }
    }

    /**
     * 处理点击忽略当前版本按钮事件
     *
     * @memberof UpdateGuide
     * @return {void}
     */
    skipNewVersion = () => {
        skipNewVersion(App.user);
        const {onRequestClose} = this.props;
        if (onRequestClose) {
            onRequestClose();
        }
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof UpdateGuide
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            className,
            onRequestClose,
            ...other
        } = this.props;

        const {updaterStatus} = this.state;
        const {
            needUpdate,
            serverUrl,
            currentVersion,
            newVersion,
            updateInfo,
            progress,
            message,
            status,
            needUpdateForce,
        } = updaterStatus;

        let mainView = null;
        if (needUpdate) {
            // 需要升级
            const updateReadme = updateInfo.readme && Markdown(updateInfo.readme);
            const updateReadmeView = updateReadme ? (
                <details className="space-sm">
                    <summary className="strong space-sm text-primary state">{Lang.format('update.versionDetails', newVersion)}</summary>
                    <div style={{maxHeight: 400}} className="has-padding-sm primary-pale markdown-content scroll-y" dangerouslySetInnerHTML={{__html: updateReadme}} />
                </details>
            ) : null;
            if (isUpdaterAvaliable()) {
                // 客户端升级模块可用
                let updateProgressView = null;
                if (status === 'downloading' || status === 'downloaded') {
                    updateProgressView = (
                        <div className="progress has-padding-v space divider">
                            {progress > 0 && (
                                <div className="box rounded primary-pale relative space-xs">
                                    <div className="rounded bar primary dock dock-left" style={{width: `${progress * 100}%`, transition: 'all .4s'}} />
                                </div>
                            )}
                            <div className="title">{progress > 0 && <strong>{Math.floor(progress * 100)}% </strong>}<span className="text-primary small">{message}</span></div>
                        </div>
                    );
                } else if (status === 'downloadFail') {
                    updateProgressView = (
                        <div className="box danger-pale rounded text-danger space">
                            {message}
                        </div>
                    );
                }
                let buttonView = null;
                if (status === 'ready') {
                    buttonView = <button key="updateNow" type="button" className="btn primary btn-wide" onClick={downloadNewVersion}>{Lang.string('update.updateNow')}</button>;
                    if (!needUpdateForce) {
                        buttonView = [
                            buttonView,
                            <button key="notifyMeLater" type="button" className="btn text-primary btn-wide" onClick={this.notifyMeNextTime}>{Lang.string('update.notifyMeNextTime')}</button>,
                            <button key="skipThisVersion" type="button" className="btn text-danger btn-wide" onClick={this.skipNewVersion}>{Lang.string('update.skipThisVersion')}</button>,
                        ];
                    }
                } else if (status === 'downloaded') {
                    buttonView = <button type="button" className="btn primary btn-wide" onClick={quitAndInstall}>{Lang.string('update.restartToCompleteUpdate')}</button>;
                } else if (status === 'downloadFail') {
                    buttonView = <button type="button" className="btn primary btn-wide" onClick={downloadNewVersion}>{Lang.string('update.retryUpdate')}</button>;
                } else if (status === 'downloading' && !needUpdateForce) {
                    buttonView = <button type="button" className="btn primary btn-wide" onClick={onRequestClose}>{Lang.string('update.closeAndDownloadInBackground')}</button>;
                }
                mainView = (
                    <div>
                        <h3>{needUpdateForce ? Lang.format('update.clientRequiredUpdateToLoginServer', serverUrl) : Lang.string('update.message.newVersionAvaliable')}</h3>
                        <p>{Lang.format('update.versionsFormat', newVersion, currentVersion)}</p>
                        {updateProgressView}
                        {updateReadmeView}
                        {buttonView && <div className="text-center has-padding-v toolbar">{buttonView}</div>}
                    </div>
                );
            } else {
                // 客户端升级模块不可用时，提示联系管理员进行升级
                mainView = (
                    <div>
                        <h3>{needUpdateForce ? Lang.format('update.clientRequiredUpdateToLoginServer', serverUrl) : Lang.string('update.message.newVersionAvaliable')}</h3>
                        <p>{Lang.format('update.versionsFormat', newVersion, currentVersion)}</p>
                        {updateReadmeView}
                        <p>{Lang.string('update.contactAdminToUpdate')}</p>
                        <div className="text-center has-padding-v">
                            <button type="button" className="btn primary btn-wide" onClick={needUpdateForce ? onRequestClose : this.skipNewVersion}>{Lang.string('common.close')}</button>
                        </div>
                    </div>
                );
            }
        } else {
            // 如果不需要升级
            mainView = (
                <div>
                    <EmojioneIcon name=":thumbsup:" className="text-center space" />
                    <h3>{Lang.string('update.message.alreadyNew')}</h3>
                    <div className="text-center has-padding-v">
                        <button type="button" className="btn primary btn-wide" onClick={onRequestClose}>{Lang.string('common.close')}</button>
                    </div>
                </div>
            );
        }

        return (
            <div
                {...other}
                className={classes('app-update-guide has-padding-v', className)}
            >
                {mainView}
            </div>
        );
    }
}
