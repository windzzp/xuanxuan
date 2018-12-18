import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Platform from 'Platform';
import {classes} from '../../utils/html-helper';
import timeSequence from '../../utils/time-sequence';
import replaceViews from '../replace-views';
import {openUrl} from '../../core/ui';

/**
 * 获取当前平台是否为 Electron 平台
 * @type {boolean}
 * @private
 */
const isElectron = Platform.type === 'electron';

/**
 * 默认注入 JS 代码
 * @type {string}
 * @private
 */
const defaultInjectJS = "window.callXXCCommand = function(command, options) {var url = command + '/'; if (options) {url += '?'; }for (const name in options) {if (options.hasOwnProperty(name)) {if (url[url.length - 1] !== '?') url += '&'; url += 'name=' + encodeURIComponent(options[name]); }}window.open('xxc:' + url, '_blank');}";

/**
 * Webview 组件 ，显示 Webview 界面
 * @class Webview
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import Webview from './webview';
 * <Webview />
 */
export default class WebView extends Component {
    /**
     * 获取 Webview 组件的可替换类（使用可替换组件类使得扩展中的视图替换功能生效）
     * @type {Class<Webview>}
     * @readonly
     * @static
     * @memberof Webview
     * @example <caption>可替换组件类调用方式</caption>
     * import {Webview} from './webview';
     * <Webview />
     */
    static get WebView() {
        return replaceViews('common/webview', WebView);
    }

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof Webview
     * @type {Object}
     */
    static propTypes = {
        className: PropTypes.string,
        onLoadingChange: PropTypes.func,
        onPageTitleUpdated: PropTypes.func,
        src: PropTypes.string.isRequired,
        insertCss: PropTypes.string,
        executeJavaScript: PropTypes.string,
        onExecuteJavaScript: PropTypes.func,
        onNavigate: PropTypes.func,
        onDomReady: PropTypes.func,
        injectForm: PropTypes.any,
        useMobileAgent: PropTypes.bool,
        hideBeforeDOMReady: PropTypes.bool,
        style: PropTypes.object,
        type: PropTypes.string,
        modalId: PropTypes.string,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof Webview
     * @static
     */
    static defaultProps = {
        className: null,
        onLoadingChange: null,
        onPageTitleUpdated: null,
        insertCss: null,
        executeJavaScript: null,
        onExecuteJavaScript: null,
        onNavigate: null,
        injectForm: null,
        onDomReady: null,
        useMobileAgent: false,
        hideBeforeDOMReady: true,
        style: null,
        modalId: null,
        type: 'auto'
    };

    /**
     * React 组件构造函数，创建一个 Webview 组件实例，会在装配之前被调用。
     * @see https://react.docschina.org/docs/react-component.html#constructor
     * @param {Object?} props 组件属性对象
     * @constructor
     */
    constructor(props) {
        super(props);

        /**
         * Webview ID
         * @type {string}
         * @private
         */
        this.webviewId = `webview-${timeSequence()}`;

        const {type} = props;

        /**
         * 是否使用 Electron 内置 Webview 实现
         * @type {boolean}
         * @private
         */
        this.isWebview = (type === 'auto' && isElectron) || type === 'webview';

        /**
         * 是否使用 iframe 实现 Webview
         * @type {boolean}
         * @private
         */
        this.isIframe = !this.isWebview;

        /**
         * React 组件状态对象
         * @see https://react.docschina.org/docs/state-and-lifecycle.html
         * @type {object}
         */
        this.state = {
            errorCode: null,
            errorDescription: null,
            domReady: false
        };
    }

    /**
     * React 组件生命周期函数：`componentDidMount`
     * 在组件被装配后立即调用。初始化使得DOM节点应该进行到这里。若你需要从远端加载数据，这是一个适合实现网络请
    求的地方。在该方法里设置状态将会触发重渲。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentDidMount
     * @private
     * @memberof Webview
     * @return {void}
     */
    componentDidMount() {
        const {webview} = this;
        if (webview) {
            if (this.isWebview) {
                webview.addEventListener('did-start-loading', this.handleLoadingStart);
                webview.addEventListener('did-finish-load', this.handleLoadingStop);
                webview.addEventListener('did-stop-loading', this.handleLoadingStop);
                webview.addEventListener('page-title-updated', this.handlePageTitleChange);
                webview.addEventListener('did-fail-load', this.handleLoadFail);
                webview.addEventListener('new-window', this.handleNewWindow);
                webview.addEventListener('dom-ready', this.handleDomReady);
                webview.addEventListener('will-navigate', this.handleWillNavigate);
            } else if (this.isIframe) {
                const {iframe} = webview;
                let firstLoad = true;
                iframe.onload = () => {
                    if (iframe.contentWindow.document.readyState !== 'loading') {
                        this.handleDomReady();
                        this.handleLoadingStop();
                    } else {
                        this.handleLoadingStart();
                        if (firstLoad) {
                            firstLoad = true;
                            iframe.contentWindow.document.addEventListener('DOMContentLoaded', e => {
                                this.handleDomReady();
                            });
                        }
                    }
                };
                if (iframe.contentWindow.document.readyState !== 'loading') {
                    this.handleDomReady();
                }
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
     * @memberof Webview
     * @return {void}
     */
    componentWillUnmount() {
        const {webview} = this;
        if (webview) {
            if (this.isWebview) {
                webview.removeEventListener('did-start-loading', this.handleLoadingStart);
                webview.removeEventListener('did-stop-loading', this.handleLoadingStop);
                webview.removeEventListener('page-title-updated', this.handlePageTitleChange);
                webview.removeEventListener('did-fail-load', this.handleLoadFail);
                webview.removeEventListener('new-window', this.handleNewWindow);
                webview.removeEventListener('dom-ready', this.handleDomReady);
                webview.removeEventListener('will-navigate', this.handleWillNavigate);
            } else if (this.isIframe) {
                const {iframe} = webview;
                if (iframe) {
                    iframe.onoad = null;
                }
            }
        }
    }

    /**
     * 获取 Webview 对象
     * @memberof Webview
     * @type {Object}
     */
    get webview() {
        let webview = document.getElementById(this.webviewId);
        if (webview && this.isIframe) {
            webview = {
                contentWindow: webview.contentWindow,
                iframe: webview,
                reload() {
                    webview.contentWindow.location.reload();
                },
                insertCSS(css) {
                    const {document} = webview.contentWindow;
                    const styleEle = document.createElement('style');
                    styleEle.innerHTML = css;
                    document.head.appendChild(styleEle);
                },
                executeJavaScript(code, userGesture, callback) {
                    const {document} = webview.contentWindow;
                    const scriptEle = document.createElement('script');
                    scriptEle.innerHTML = code;
                    document.body.appendChild(scriptEle);
                    if (callback) {
                        callback();
                    }
                },
                stop() {
                    webview.contentWindow.stop();
                }
            };
        }
        return webview;
    }

    /**
     * 重新载入 Webview
     *
     * @memberof WebView
     * @return {void}
     */
    reloadWebview() {
        const {webview} = this;
        if (webview) {
            webview.reload();
        }
    }

    /**
     * 处理导航到其他页面事件
     * @param {Event} e 事件对象
     * @memberof Webview
     * @private
     * @return {void}
     */
    handleWillNavigate = e => {
        const {onNavigate} = this.props;
        if (onNavigate) {
            onNavigate(e.url, e);
        }
    }

    /**
     * 处理在新窗口打开事件
     * @param {Event} e 事件对象
     * @memberof Webview
     * @private
     * @return {void}
     */
    handleNewWindow = e => {
        let {url} = e;
        const {modalId} = this.props;
        url = url.replace('closeModal', `closeModal/${modalId}`);
        openUrl(url, null, e, {modalId});
    };

    /**
     * 处理页面标题变更事件
     * @param {Event} e 事件对象
     * @memberof Webview
     * @private
     * @return {void}
     */
    handlePageTitleChange = e => {
        const {onPageTitleUpdated} = this.props;
        if (onPageTitleUpdated) {
            onPageTitleUpdated(e.title, e.explicitSet);
        }
    };

    /**
     * 处理开始加载事件
     * @memberof Webview
     * @private
     * @return {void}
     */
    handleLoadingStart = () => {
        const {onLoadingChange} = this.props;
        if (onLoadingChange) {
            onLoadingChange(true);
        }
        this.setState({
            errorCode: null,
            errorDescription: null,
            // domReady: false
        });
    };

    /**
     * 处理加载失败事件
     * @param {Event} e 事件对象
     * @memberof Webview
     * @private
     * @return {void}
     */
    handleLoadFail = (e) => {
        const {errorCode, errorDescription, validatedURL} = e;
        const {onLoadingChange} = this.props;
        if (onLoadingChange) {
            onLoadingChange(false, errorCode, errorDescription, validatedURL);
        }
        this.setState({
            errorCode,
            errorDescription,
            domReady: true,
        });
        if (DEBUG) {
            console.error('Cannot load webview', e);
        }
    };

    /**
     * 处理停止加载事件
     * @memberof Webview
     * @private
     * @return {void}
     */
    handleLoadingStop = () => {
        const {onLoadingChange} = this.props;
        if (onLoadingChange) {
            onLoadingChange(false);
        }
        this.setState({
            domReady: true
        });
    };

    /**
     * 处理 Dom 加载完毕事件
     * @memberof Webview
     * @private
     * @return {void}
     */
    handleDomReady = () => {
        const {webview} = this;
        const {onDomReady} = this.props;
        const {insertCss, executeJavaScript, onExecuteJavaScript} = this.props;
        if (insertCss) {
            webview.insertCSS(insertCss);
            if (DEBUG) {
                console.log('Webview.insertCSS', insertCss);
            }
        }
        if (executeJavaScript) {
            webview.executeJavaScript(executeJavaScript, false, onExecuteJavaScript);
            if (DEBUG) {
                console.log('Webview.executeJavaScript', executeJavaScript);
            }
        }
        webview.executeJavaScript(defaultInjectJS, false);
        let {injectForm} = this.props;
        if (injectForm) {
            if (typeof injectForm === 'string') {
                injectForm = JSON.parse(injectForm);
            }
            const injectScriptLines = ['(function(){'];
            Object.keys(injectForm).forEach((key) => {
                if (key && key[0] !== '$') {
                    let keyValue = injectForm[key];
                    if (keyValue) {
                        keyValue = keyValue.replace(/`/g, '\\`');
                    }
                    injectScriptLines.push(
                        `document.querySelectorAll('${key}').forEach(ele => {if(ele.tagName === 'INPUT' || ele.tagName === 'SELECT' || ele.tagName === 'TEXTAREA') {ele.value = \`${keyValue}\`;}});`
                    );
                }
            });
            ['click', 'submit', 'focus', 'input', 'paste'].forEach(key => {
                const eventSelector = injectForm[`$${key}`];
                if (eventSelector) {
                    injectScriptLines.push(
                        `document.querySelectorAll('${eventSelector}').forEach(ele => {ele.dispatchEvent(new Event('${key}'));});`
                    );
                }
            });

            injectScriptLines.push('}());');
            const injectScriptCode = injectScriptLines.join('\n');
            if (DEBUG) {
                console.log('Webview.injectForm', {injectForm, injectScriptCode});
            }
            webview.executeJavaScript(injectScriptCode, false, () => {
                if (DEBUG) {
                    console.log('Webview.injectForm.finish', injectForm);
                }
            });
        }
        if (onDomReady) {
            onDomReady();
        }

        const {contextmenu} = Platform;
        if (this.isWebview && contextmenu && (contextmenu.showInputContextMenu || contextmenu.showSelectionContextMenu)) {
            const webContents = webview.getWebContents();
            if (webContents) {
                webContents.on('context-menu', (e, props) => {
                    const {selectionText, isEditable} = props;
                    if (isEditable) {
                        if (contextmenu.showInputContextMenu) {
                            contextmenu.showInputContextMenu();
                        }
                    } else if (selectionText && selectionText.trim() !== '') {
                        if (contextmenu.showSelectionContextMenu) {
                            contextmenu.showSelectionContextMenu();
                        }
                    }
                });
            }
        }

        this.setState({domReady: true, loading: false});
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof Webview
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            className,
            onLoadingChange,
            onPageTitleUpdated,
            src,
            style,
            useMobileAgent,
            hideBeforeDOMReady,
            ...options
        } = this.props;

        let webviewHtml = '';
        const {isWebview} = this;
        const {errorCode, errorDescription, domReady} = this.state;
        if (isWebview) {
            webviewHtml = `<webview id="${this.webviewId}" src="${src}" class="dock fluid-v fluid" ${options && options.nodeintegration ? 'nodeintegration' : ''} ${options && options.preload ? (` preload="${options.preload}"`) : ''} />`;
        } else {
            webviewHtml = `<iframe sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-scripts allow-same-origin" id="${this.webviewId}" src="${src}" scrolling="auto" allowtransparency="true" hidefocus frameborder="0" class="dock fluid-v fluid no-margin" />`;
        }
        if (errorCode) {
            webviewHtml += `<div class="dock box gray"><h1>ERROR ${errorCode}</h1><h2>${src}</h2><div>${errorDescription}</div></div>`;
        }

        return (
            <div
                className={classes('webview fade', className, {in: !hideBeforeDOMReady || domReady})}
                dangerouslySetInnerHTML={{__html: webviewHtml}} // eslint-disable-line
                style={style}
            />
        );
    }
}
