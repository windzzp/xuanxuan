import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {classes} from '../../utils/html-helper';
import Avatar from '../../components/avatar';
import Button from '../../components/button';
import Icon from '../../components/icon';
import Lang from '../../core/lang';
import Exts from '../../exts';
import App from '../../core';
import {formatDate} from '../../utils/date-helper';

export default class ExtensionListItem extends Component {
    /**
     * ExtensionListItem 对应的可替换类路径名称
     *
     * @type {String}
     * @static
     * @memberof ExtensionListItem
     */
    static replaceViewPath = 'exts/ExtensionListItem';

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof ExtensionListItem
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        extension: PropTypes.object.isRequired,
        onSettingBtnClick: PropTypes.func,
        showType: PropTypes.bool,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof ExtensionListItem
     * @static
     */
    static defaultProps = {
        className: null,
        onSettingBtnClick: null,
        showType: true,
    };

    /**
     * 处理重新载入按钮点击事件
     * @param {Event} e 事件对象
     * @memberof ExtensionListItem
     * @private
     * @return {void}
     */
    handleReloadBtnClick = e => {
        e.preventDefault();
        e.stopPropagation();
        const {extension} = this.props;
        Exts.manager.reloadDevExtension(extension);
        App.ui.showMessger(Lang.string('ext.extensions.reloadFinish'), {type: 'success'});
    };

    /**
     * 处理显示扩展文件夹按钮点击事件
     * @param {Event} e 事件对象
     * @memberof ExtensionListItem
     * @private
     * @return {void}
     */
    handleShowFolderBtnClick = e => {
        e.preventDefault();
        e.stopPropagation();
        const {extension} = this.props;
        return Exts.ui.showDevFolder(extension);
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof ExtensionListItem
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            extension,
            className,
            onSettingBtnClick,
            showType,
            ...other
        } = this.props;

        const {
            isDev, disabled, avaliable, isRemote, downloadProgress,
        } = extension;

        let typeLabelView = null;
        if (showType && (!isRemote || avaliable)) {
            typeLabelView = <span className="app-ext-list-item-type-label" style={{color: Exts.ui.typeColors[extension.type]}}>#{Lang.string(`ext.type.${extension.type}`)}</span>;
        }

        let actionsView = null;
        if (isDev) {
            actionsView = (
                <div className="toolbar row flex-none">
                    <div className="hint--top" data-hint={Lang.string('ext.extensions.reload')}><Button onClick={this.handleReloadBtnClick} icon="reload" className="iconbutton rounded" /></div>
                    <div className="hint--top" data-hint={Lang.string('ext.extensions.showFolder')}><Button onClick={this.handleShowFolderBtnClick} icon="folder-outline" className="iconbutton rounded" /></div>
                    <div className="hint--top" data-hint={Lang.string('ext.extensions.moreActions')}><Button onClick={onSettingBtnClick} icon="dots-vertical" className="iconbutton rounded" /></div>

                </div>
            );
        } else {
            actionsView = <Button onClick={onSettingBtnClick} icon="dots-vertical" className="iconbutton rounded" />;
        }

        return (
            <a className={classes('app-ext-list-item', className, {'app-ext-list-item-dev': isDev})} {...other}>
                <Avatar className={classes('rounded shadow-1 flex-none', {'align-self-start': isDev, grayscale: !avaliable})} auto={extension.icon} skin={{code: extension.accentColor}} />
                <div className="content">
                    <div className="title">
                        <strong>{extension.displayName}</strong>
                        {extension.buildIn ? <span data-hint={Lang.string('ext.buildIn.hint')} className="hint--top hint--md app-ext-list-item-buildIn-label"> <Icon name="star-circle icon-sm text-yellow" /></span> : null}
                        {isRemote ? <span data-hint={Lang.string('ext.remote.hint')} className="hint--top hint--md app-ext-list-item-remote-label"> <Icon name="shield-check icon-sm text-green" /></span> : null}
                        &nbsp; <small className="text-gray">{extension.version ? `v${extension.version}` : ''}</small>
                    </div>
                    <div className={classes('small space-xs', {'text-ellipsis': isDev})} title={extension.description || ''}>
                        {isRemote && downloadProgress && !extension.isRemoteLoaded ? extension.loadRemoteFailed ? (<span data-hint={extension.getError('download')} className="hint--top hint--md text-danger"><Icon name="information-outline icon-sm" />{Lang.string('ext.installFail')}&nbsp; </span>) : (<span><Icon name="loading muted spin icon-sm" /> <span className="text-info">{Lang.format('ext.downloading', Math.floor(downloadProgress * 100))}%</span>&nbsp; </span>) : null}
                        {extension.description}
                    </div>
                    <div className="small row flex-middle">
                        {isDev ? <span><small className="label primary circle">{Lang.string('ext.extensions.developing')}</small> &nbsp;</span> : null}
                        {disabled ? <span><span className="label circle dark">{Lang.string('ext.disabled')}</span>&nbsp; </span> : null}
                        {!disabled && !avaliable ? <span><span className="label circle dark">{Lang.string('ext.unavailable')}</span>&nbsp; </span> : null}
                        {extension.needRestart && <span className="hint--top relative" style={{zIndex: 10}} data-hint={Lang.string('ext.extension.needRestartTip')}><small className="label circle warning">{Lang.string('ext.extension.needRestart')}</small> &nbsp;</span>}
                        {typeLabelView}
                        <span className="text-gray">{extension.author ? `@${extension.authorName}` : ''}</span>
                    </div>
                    {isDev && (
                        <div className="has-padding small infos">
                            <ul className="no-margin">
                                <li><strong>{Lang.string('ext.extension.loadPath')}</strong>: <span className="code">{extension.localPath}</span></li>
                                <li><strong>{Lang.string('ext.extension.installTime')}</strong>: <span className="code">{formatDate(extension.installTime, 'yyyy-MM-dd hh:mm:ss')}</span> &nbsp; <strong>{Lang.string('ext.extension.updateTime')}</strong>: <span className="code">{formatDate(extension.updateTime, 'yyyy-MM-dd hh:mm:ss')}</span></li>
                                {extension.loadTime ? <li><strong>{Lang.string('ext.extension.loadTime')}</strong>: <span className={`code${extension.loadTime > 50 ? ' text-red' : ''}`}>{extension.loadTime}ms</span></li> : null}
                            </ul>
                        </div>
                    )}
                    {(isDev && extension.hasError) && (
                        <div className="has-padding small errors">
                            <div>{Lang.string('ext.extension.pkgHasError')}</div>
                            <ul className="no-margin">
                                {
                                    extension.errors.map(error => <li key={error.name}><strong className="code">{error.name}</strong>: {error.error}</li>)
                                }
                            </ul>
                        </div>
                    )}
                </div>
                {actionsView}
            </a>
        );
    }
}
