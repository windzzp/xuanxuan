import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/button';
import SelectBox from '../../components/select-box';
import App from '../../core';
import Lang from '../../core/lang';
import {rem} from '../../utils/html-helper';
import Config from '../../config';

/**
 * ChatSendCode 组件 ，显示ChatSendCode界面
 * @class ChatSendCode
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example @lang jsx
 * import ChatSendCode from './chat-send-code';
 * <ChatSendCode />
 */
export default class ChatSendCode extends Component {
    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof ChatSendCode
     * @type {Object}
     */
    static propTypes = {
        onRequestClose: PropTypes.func,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof ChatSendCode
     * @static
     */
    static defaultProps = {
        onRequestClose: null,
    };

    /**
     * React 组件构造函数，创建一个 ChatCode 组件实例，会在装配之前被调用。
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
            language: '',
            code: '',
        };
    }

    /**
     * 处理发送代码按钮点击事件
     * @memberof ChatSendCode
     * @private
     * @return {void}
     */
    handleSubmitBtnClick = async () => {
        const {language, code} = this.state;
        const {chat, onRequestClose} = this.props;
        const codeLanguage = language.toLowerCase();
        const codeContent = `\`\`\`${codeLanguage}\n${code}\n\`\`\``;

        if (code === '') {
            onRequestClose();
            return;
        }

        onRequestClose();
        await App.im.server.sendTextMessage(codeContent, chat, true); // eslint-disable-line
        App.im.ui.activeChat(chat, 'recents');
    }

    /**
     * 处理待办属性变更事件
     * @param {string} name 属性名称
     * @param {string} val 属性值
     * @memberof TodoEditer
     * @private
     * @return {void}
     */
    handleCodeChange(name, val) {
        this.setState({[name]: val});
    }

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof ChatCode
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {onRequestClose} = this.props;
        const {language} = this.state;
        const codeLanguage = [
            {label: Lang.string('chat.sendCode.defaultLanguage'), value: ''},
            ...Config.ui['chat.sendCode.langs'],
        ];
        return (
            <div>
                <div style={{position: 'relative'}}>
                    <SelectBox
                        style={{width: rem(140), right: rem(8), top: rem(8)}}
                        value={language}
                        options={codeLanguage}
                        className="dock dock-right dock-top"
                        selectClassName="rounded"
                        onChange={this.handleCodeChange.bind(this, 'language')}
                    />
                    <textarea
                        className="textarea rounded code"
                        rows="16"
                        placeholder={`${Lang.string('chat.sendCode.content.placeholder')}`}
                        onChange={e => this.handleCodeChange('code', e.target.value)}
                    />
                </div>
                <div className="has-padding-v toolbar">
                    <Button className="primary btn-wide" label={Lang.string('chat.sendCode.sendBtnLabel')} onClick={this.handleSubmitBtnClick.bind(this)} /> &nbsp;
                    <Button className="primary-pale text-primary btn-wide" label={Lang.string('common.cancel')} onClick={onRequestClose} />
                </div>
            </div>
        );
    }
}