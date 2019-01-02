import React, {Component} from 'react';
import Button from '../../components/button';
import SelectBox from '../../components/select-box';
import App from '../../core';
import Lang from '../../core/lang';

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

        if(desc === '') {
            onRequestClose();
            return;
        }

        onRequestClose();
        App.im.ui.activeChat(chat, 'recents');
        await App.im.server.sendTextMessage(codeContent, chat, true); // eslint-disable-line
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
        const codeLanguage = [
            {label: Lang.string('common.default'), value: ''}, {label: 'C++', value: 'cpp'},
            {label: 'C#', value: 'csharp'}, {label: 'JavaScript', value: 'js'}, {label: 'TypeScript', value: 'ts'},
            'CSS', 'Diff', 'Ini', 'Java', 'Apache', 'Bash', 'JSON', 'Makefile', 'Perl', 'PHP', 'Python', 'Ruby', 'SQL', 'HTML'
        ];
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
            </div>
        )
    }
}