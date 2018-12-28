import React, {Component} from 'react';
import Button from '../../components/button';
import SelectBox from '../../components/select-box';
import App from '../../core';
import Lang from '../../core/lang';

const codeLanguage = [
    {label: Lang.string('common.default'), value: ''}, {label: 'C++', value: 'cpp'},
    {label: 'C#', value: 'csharp'}, {label: 'JavaScript', value: 'js'}, {label: 'TypeScript', value: 'ts'},
    'CSS', 'Diff', 'Ini', 'Java', 'Apache', 'Bash', 'JSON', 'Makefile', 'Perl', 'PHP', 'Python', 'Ruby', 'SQL', 'HTML'
];

export default class ChatCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: '',
            desc: '',
        };
    }

    handleSubmitBtnClick = async () => {
        const {language, desc} = this.state;
        const {chat, onRequestClose} = this.props;
        const codeLanguage = language.toLowerCase();
        const codeContent = '```' + codeLanguage + '\n' + desc + '\n```';
        const textChatMessage = App.im.server.createTextChatMessage(codeContent, chat);
        if(desc === '') {
            onRequestClose();
            return;
        }

        textChatMessage.contentType = 'text';
        onRequestClose();
        App.im.ui.activeChat(chat, 'recents');
        await App.im.server.sendChatMessage(textChatMessage, chat); // eslint-disable-line
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

    render() {
        const {language} = this.state;
        return (
            <div>
                <div className="desc" style={{position: 'relative'}}>
                    <SelectBox
                        style={{width: '120px'}}
                        value={language}
                        options={codeLanguage}
                        className="dock dock-right dock-top"
                        onChange={this.handleCodeChange.bind(this, 'language')}
                    />
                    <textarea
                        className="textarea rounded"
                        rows="16"
                        placeholder={`${Lang.string('chat.sendbox.toolbar.code.content')}`}
                        onChange={e => this.handleCodeChange('desc', e.target.value)}
                    />
                </div>
                <div className="has-padding-v toolbar">
                    <Button className="primary btn-wide" label={Lang.string('chat.sendbox.toolbar.code')} onClick={this.handleSubmitBtnClick.bind(this)} /> &nbsp;
                    <Button className="primary-pale text-primary btn-wide" label={Lang.string('common.cancel')} onClick={this.props.onRequestClose} />
                </div>
            </div>
        )
    }
}