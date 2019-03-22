import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    Editor,
    EditorState,
    RichUtils,
    AtomicBlockUtils,
    convertToRaw,
    CompositeDecorator,
    Modifier
} from 'draft-js';
import Emojione from '../../components/emojione';
import timeSequence from '../../utils/time-sequence';
import Lang from '../../core/lang';
import {getMentionsMatchRegex, guessMember} from '../../core/members';

/**
 * DraftJS Atomic 组件
 * @param {Object} props React 组件属性
 * @return {ReactNode|string|number|null|boolean} React 渲染内容
 * @private
 */
// eslint-disable-next-line react/prop-types
const AtomicComponent = ({block, contentState}) => {
    const key = block.getEntityAt(0);
    if (!key) {
        return null;
    }
    const entity = contentState.getEntity(key);
    const type = entity.getType();
    if (type === 'image') {
        const data = entity.getData();
        return (
            <img
                className="draft-editor-image"
                src={data.src}
                alt={data.alt || ''}
            />
        );
    }
    return null;
};

/**
 * 使用正则表达式查找内容
 * @param {Regex} regex 正则表达式
 * @param {Object} contentBlock 内容块
 * @param {function} callback 回调函数
 * @return {void}
 * @private
 */
const findWithRegex = (regex, contentBlock, callback) => {
    const text = contentBlock.getText();
    let matchArr;
    let start;
    // eslint-disable-next-line no-cond-assign
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
    }
};

/**
 * @所有人文本
 * @type {string}
 * @private
 */
let langAtAll = null;

/**
 * DraftJS CompositeDecorator 对象
 * @type {CompositeDecorator}
 * @private
 */
const draftDecorator = new CompositeDecorator([{
    strategy: (contentBlock, callback/* , contentState */) => {
        findWithRegex(Emojione.regUnicode, contentBlock, callback);
    },
    // eslint-disable-next-line react/prop-types
    component: ({decoratedText, offsetKey, children}) => {
        const unicode = decoratedText.trim();
        const map = Emojione.mapUnicodeCharactersToShort();
        const emoji = Emojione.emojioneList[map[unicode]];
        if (emoji) {
            const emojionePngPath = `${Emojione.imagePathPNG + emoji.uc_base}.${Emojione.imageType}`;
            const backgroundImage = `url(${emojionePngPath}) left top / contain no-repeat`;
            const spanStyle = {
                width: 16,
                height: 16,
                display: 'inline-block',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                background: backgroundImage,
                textAlign: 'right',
                verticalAlign: 'bottom',
                position: 'relative',
                top: -2,
                fontSize: '16px',
                color: 'transparent'
            };
            return (<span title={unicode} data-offset-key={offsetKey} style={spanStyle}>{children}</span>);
        }
        return (<span data-offset-key={offsetKey}>{children}</span>);
    }
}, {
    strategy: (contentBlock, callback/* , contentState */) => {
        findWithRegex(getMentionsMatchRegex() || /@[\u4e00-\u9fa5_\w]+[，。,./\s:@\n]/g, contentBlock, callback);
    },
    // eslint-disable-next-line react/prop-types
    component: ({decoratedText, offsetKey, children}) => {
        const guess = decoratedText.substr(1).trim().replace(/[，。,./\s:@\n]/g, '');
        if (guess) {
            if (!langAtAll) {
                langAtAll = Lang.string('chat.message.atAll');
            }
            if (guess === 'all' || guess === langAtAll) {
                return <span title={langAtAll} className="at-all text-primary" data-offset-key={offsetKey}>{children}</span>;
            }
            const member = guessMember(guess);
            if (member && member.id) {
                return (<a className="app-link text-primary" href={`@Member/${member.id}`} title={`@${member.displayName}`} data-offset-key={offsetKey}>{children}</a>);
            }
        }
        return children;
    }
}, {
    strategy: (contentBlock, callback/* , contentState */) => {
        findWithRegex(/(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g, contentBlock, callback);
    },
    // eslint-disable-next-line react/prop-types
    component: ({decoratedText, offsetKey, children}) => (<a className="text-primary" data-offset-key={offsetKey} href={decoratedText}>{children}</a>)
}]);

/**
 * DrafJS blockRendererFn 回调函数
 * @param {Object} contentBlock 内容块对象
 * @private
 * @return {Object} 内容对象
 */
const blockRendererFn = (contentBlock) => {
    const type = contentBlock.getType();
    let result = null;

    if (type === 'atomic') {
        result = {
            component: AtomicComponent,
            editable: true,
        };
    }

    return result;
};

/**
 * DraftEditor 组件 ，显示消息编辑器界面
 * @class DraftEditor
 * @see https://react.docschina.org/docs/components-and-props.html
 * @extends {Component}
 * @example
 * import DraftEditor from './draft-editor';
 * <DraftEditor />
 */
export default class DraftEditor extends PureComponent {
    /**
     * DraftEditor 对应的可替换类路径名称
     *
     * @type {String}
     * @static
     * @memberof DraftEditor
     */
    static replaceViewPath = 'common/DraftEditor';

    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof DraftEditor
     * @type {Object}
     */
    static propTypes = {
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        handleKey: PropTypes.bool,
        onReturnKeyDown: PropTypes.func,
        onPastedText: PropTypes.func,
        onPastedFiles: PropTypes.func,
        defaultState: PropTypes.any,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof DraftEditor
     * @static
     */
    static defaultProps = {
        placeholder: null,
        onChange: null,
        onReturnKeyDown: null,
        onPastedText: null,
        onPastedFiles: null,
        handleKey: false,
        defaultState: null,
    };

    /**
     * React 组件构造函数，创建一个 DraftEditor 组件实例，会在装配之前被调用。
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
            editorState: props.defaultState || EditorState.createEmpty(draftDecorator),
        };

        this.onChange = this.onChange.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handlePastedText = this.handlePastedText.bind(this);
        this.handlePastedFiles = this.handlePastedFiles.bind(this);
    }

    /**
     * React 组件生命周期函数：`componentDidCatch`
     * 在组件被渲染时发生错误时调用。
     *
     * @see https://zh-hans.reactjs.org/docs/react-component.html#componentdidcatch
     * @param {Error} error 错误对象
     * @param {String} info 错误信息
     * @private
     * @memberof DraftEditor
     * @return {void}
     */
    componentDidCatch(error, info) {
        this.forceUpdate();
        if (DEBUG) {
            console.warn('DraftEditor throwed a error', error, info);
        }
    }

    /**
     * React 组件生命周期函数：`componentWillUnmount`
     * 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，清理
    任何在componentDidMount环节创建的DOM元素。
     *
     * @see https://doc.react-china.org/docs/react-component.html#componentwillunmount
     * @private
     * @memberof DraftEditor
     * @return {void}
     */
    componentWillUnmount() {
        if (this.lastFocusTimer) {
            clearTimeout(this.lastFocusTimer);
            this.lastFocusTimer = null;
        }
    }

    /**
     * 获取 DraftJS editorState 对象
     * @return {Object} editorState 对象
     */
    getEditorState() {
        const {editorState} = this.state;
        return editorState;
    }

    /**
     * 获取输入框文本内容
     *
     * @return {string} 输入框文本内容
     * @memberof DraftEditor
     */
    getContent() {
        const {editorState} = this.state;
        return editorState.getCurrentContent().getPlainText();
    }

    /**
     * 清空输入框文本内容
     *
     * @return {void}
     * @memberof DraftEditor
     */
    clearContent() {
        this.onChange(EditorState.createEmpty(draftDecorator));
    }

    /**
     * 向输入框添加文本内容
     *
     * @param {string} content 文本内容
     * @param {boolean} asNewLine 是否添加到新的一行
     * @param {function} callback 回调函数
     * @memberof DraftEditor
     * @return {void}
     */
    appendContent(content, asNewLine, callback) {
        if (content !== null && content !== undefined) {
            const {editorState} = this.state;
            const selection = editorState.getSelection();
            const contentState = editorState.getCurrentContent();
            let newContentState = null;
            // 判断是否有选中，有则替换，无则插入
            const selectionEnd = selection.getEndOffset();
            const selectionStart = selection.getStartOffset();
            if (selectionEnd === selectionStart) {
                newContentState = Modifier.insertText(contentState, selection, content);
            } else {
                newContentState = Modifier.replaceText(contentState, selection, content);
            }
            const newEditorState = EditorState.push(editorState, newContentState, 'insert-fragment');
            this.onChange(newEditorState, callback);
        }
    }

    /**
     * 向输入框添加 Emoji 表情
     *
     * @param {Object|{shortname: string}} emoji Emojione 表情对象
     * @param {function} callback 回调函数
     * @memberof DraftEditor
     * @return {void}
     */
    appendEmojione(emoji, callback) {
        this.appendContent(Emojione.shortnameToUnicode(emoji.shortname), callback);
    }

    /**
     * 向输入框添加图片
     *
     * @param {FileData|Blob|File|{path: string}|{url:string}} image 图片
     * @param {function} callback 回调函数
     * @memberof DraftEditor
     * @return {void}
     */
    appendImage(image, callback) {
        const {editorState} = this.state;
        const contentState = editorState.getCurrentContent();
        let imageSrc = image.path || image.url;
        if (!imageSrc) {
            if (image.blob) {
                imageSrc = URL.createObjectURL(image.blob);
            } else if (image instanceof Blob || image instanceof File) {
                imageSrc = URL.createObjectURL(image);
            }
        } else if (!imageSrc.startsWith('http://') && !imageSrc.startsWith('https://')) {
            imageSrc = `file://${imageSrc}?t=${new Date().getTime()}`;
        }
        const contentStateWithEntity = contentState.createEntity(
            'image',
            'IMMUTABLE',
            {src: imageSrc, alt: image.name || '', image}
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            editorState,
            {currentContent: contentStateWithEntity}
        );
        this.onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '), callback);
    }

    /**
     * 获取输入框内容列表
     * @memberof DraftEditor
     * @return {{type: string, content: string, image: Object}[]} 内容列表
     */
    getContentList() {
        const contents = [];
        const {editorState} = this.state;
        const contentState = editorState.getCurrentContent();
        const raw = convertToRaw(contentState);
        let thisTextContent = '';
        raw.blocks.forEach(block => {
            if (block.type === 'atomic') {
                if (thisTextContent.length && thisTextContent.trim().length) {
                    contents.push({type: 'text', content: thisTextContent});
                    thisTextContent = '';
                }
                if (block.entityRanges && block.entityRanges.length) {
                    contents.push({type: 'image', image: raw.entityMap[block.entityRanges[0].key].data.image});
                }
            } else {
                if (thisTextContent.length) {
                    thisTextContent += '\n';
                }
                thisTextContent += block.text;
            }
        });
        if (thisTextContent.length && thisTextContent.trim().length) {
            contents.push({type: 'text', content: thisTextContent});
            thisTextContent = '';
        }
        return contents;
    }

    /**
     * 激活输入框
     * @param {number} [delay=100] 延迟事件，单位毫秒
     * @return {void}
     */
    focus(delay = 100) {
        if (this.lastFocusTimer) {
            clearTimeout(this.lastFocusTimer);
            this.lastFocusTimer = null;
        }
        this.lastFocusTimer = setTimeout(() => {
            this.editor.focus();
            this.lastFocusTimer = null;
        }, delay);
    }

    /**
     * 处理输入框值变更事件
     * @param {EditorState} editorState DraftJS EditorState 对象
     * @param {function} callback 回调函数
     * @memberof DraftEditor
     * @private
     * @return {void}
     */
    onChange(editorState, callback) {
        const contentState = editorState.getCurrentContent();
        this.setState({editorState}, () => {
            if (callback) {
                callback(contentState);
            }
            const {onChange} = this.props;
            if (onChange) {
                onChange(contentState);
            }
        });
    }

    /**
     * 处理键盘命令事件
     * @param {string} command 命令名称
     * @memberof DraftEditor
     * @private
     * @return {void}
     */
    handleKeyCommand(command) {
        const {handleKey} = this.props;
        if (!handleKey) {
            return;
        }
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    /**
     * 处理回车键按下事件
     * @param {Event} e 事件对象
     * @memberof DraftEditor
     * @private
     * @return {void}
     */
    handleReturn(e) {
        const {onReturnKeyDown} = this.props;
        if (onReturnKeyDown) {
            return onReturnKeyDown(e);
        }
        return 'not-handled';
    }

    /**
     * 处理粘贴文本事件
     * @param {string} text 要粘贴的纯文本
     * @param {string} html 要粘贴的 HTML 文本
     * @memberof DraftEditor
     * @private
     * @return {void}
     */
    handlePastedText(text, html) {
        const {onPastedText} = this.props;
        if (onPastedText) {
            onPastedText(text, html);
        } else {
            this.appendContent(text || html);
        }
        return 'handled';
    }

    /**
     * 处理粘贴文件事件
     * @param {Blob[]} files 文件列表
     * @memberof DraftEditor
     * @private
     * @return {void}
     */
    handlePastedFiles(files) {
        const {onPastedFiles} = this.props;
        if (onPastedFiles) {
            onPastedFiles(files);
        } else {
            const date = new Date();
            files.forEach(blob => {
                if (blob.type.startsWith('image/')) {
                    this.appendImage({
                        lastModified: date.getTime(),
                        lastModifiedDate: date,
                        name: `clipboard-image-${timeSequence()}.png`,
                        size: blob.size,
                        blob,
                        type: blob.type
                    });
                }
            });
        }
        return 'handled';
    }

    getSelectedBlocks = () => {
        const {editorState} = this.state;
        const selectionState = editorState.getSelection();
        const contentState = editorState.getCurrentContent();

        const startKey = selectionState.getStartKey();
        const endKey = selectionState.getEndKey();
        const isSameBlock = startKey === endKey;
        const startingBlock = contentState.getBlockForKey(startKey);
        const selectedBlocks = [startingBlock];

        if (!isSameBlock) {
            let blockKey = startKey;

            while (blockKey !== endKey) {
                const nextBlock = contentState.getBlockAfter(blockKey);
                selectedBlocks.push(nextBlock);
                blockKey = nextBlock.getKey();
            }
        }

        return selectedBlocks;
    };

    handleCompositionStart = () => {
        if (this.getSelectedBlocks().length > 1) {
            const {editorState} = this.state;
            // if multi blocks in selection, remove selection range when composition start
            const nextEditorState = EditorState.push(
                editorState,
                Modifier.removeRange(editorState.getCurrentContent(), editorState.getSelection(), 'backward'),
                'remove-range'
            );

            this.setState({
                editorState: nextEditorState
            });
        }
    };

    /**
     * React 组件生命周期函数：Render
     * @private
     * @see https://doc.react-china.org/docs/react-component.html#render
     * @see https://doc.react-china.org/docs/rendering-elements.html
     * @memberof DraftEditor
     * @return {ReactNode|string|number|null|boolean} React 渲染内容
     */
    render() {
        const {
            placeholder,
            onReturnKeyDown,
            onPastedFiles,
            onPastedText,
            handleKey,
            defaultState,
            ...other
        } = this.props;

        const {editorState} = this.state;

        return (
            <div {...other} onCompositionStart={this.handleCompositionStart} onClick={() => {this.focus(0);}}>
                <Editor
                    ref={e => {this.editor = e;}}
                    placeholder={placeholder}
                    editorState={editorState}
                    onChange={this.onChange}
                    handleKeyCommand={this.handleKeyCommand}
                    handleReturn={this.handleReturn}
                    blockRendererFn={blockRendererFn}
                    handlePastedText={this.handlePastedText}
                    handlePastedFiles={this.handlePastedFiles}
                />
            </div>
        );
    }
}
