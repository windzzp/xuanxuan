/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from './modal';

const clickTime = null;

export default class ImageKeyMouse extends Component {
    /**
     * React 组件属性类型检查
     * @see https://react.docschina.org/docs/typechecking-with-proptypes.html
     * @static
     * @memberof AdvanceImageViewer
     * @type {Object}
     */
    static propTypes = {
        src: PropTypes.string,
    };

    /**
     * React 组件默认属性
     * @see https://react.docschina.org/docs/react-component.html#defaultprops
     * @type {object}
     * @memberof AdvanceImageViewer
     * @static
     */
    static defaultProps = {
        src: null
    };

    constructor(props) {
        super(props);
        this.state = {
            x: 'px',
            y: 'px',
            zoom: 0,
            isDrag: null
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('click', this.handleClick);
        // document.addEventListener('mousemove', this.handleDrag.onmouseup);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('click', this.handleClick);
        // document.removeEventListener('mousemove', this.handleDrag.onmouseup);
    }

    /**
     * 处理键盘 ESC 事件，退出图片浏览
     * @param {event} e 键盘事件对象
     * @return {void}
     */

    handleKeyDown = (e) => {
        if (e.keyCode === 27) {
            Modal.hide();
        }
    };

    /**
     * 鼠标滚轮放大图片
     * @param {event} e 鼠标滚轮事件对象
     * @return {void}
     */

    mouseonWheel = (e) => {
        const {wheelDelta} = e.nativeEvent;
        let {zoom: originalzoom} = this.state;
        let zoom = parseInt(originalzoom, 10) || 100;
        zoom += wheelDelta / 12;
        const scale = zoom / 100;
        if (zoom >= 40) {
            originalzoom = `${zoom}%`;
            this.setState({
                zoom: originalzoom,
                scale
            });
        }
    }

    /**
     * 鼠标拖动图片
     * @param {event} e 拖拽事件对象
     * @return {void}
     */

    handleDrag = event => {
        let isDrag = false;
        event.preventDefault();
        const disx = event.pageX - event.target.offsetLeft;
        const disy = event.pageY - event.target.offsetTop;

        document.onmousemove = (evevt) => {
            console.log('onmousemove');
            isDrag = true;
            this.setState({
                x: evevt.pageX - disx,
                y: evevt.pageY - disy,
            });
        };

        document.onmouseup = (evevt) => {
            console.log('onmouseup');
            document.onmousemove = null;
            document.onmousedown = null;
            if (isDrag) {
                this.setState({
                    x: evevt.pageX - disx,
                    y: evevt.pageY - disy,
                    isDrag: false
                });
            } else {
                this.setState({
                    isDrag: true
                });
            }
        };
    }

    /**
     * 双击图片还原
     * @param {void}
     * @return {void}
     */

    handleDbclick = () => {
        clearTimeout(window.clickTime);
        this.setState({
            zoom: 0,
            scale: 1,
            x: 'auto',
            y: 'auto',
        });
    }

    /**
     * 单击图片隐藏
     * @param {event} e 点击事件对象
     * @return {void}
     */

    handleClick = (e) => {
        e.stopPropagation();
        clearTimeout(window.clickTime);
        window.clickTime = setTimeout(() => {
            const {isDrag} = this.state;
            if (isDrag) {
                Modal.hide();
            }
        }, 250);
    }

    render() {
        const {scale, x, y} = this.state;
        const style = {
            transform: `scale(${scale})`,
            position: 'absolute',
            top: y,
            left: x
        };
        const {src} = this.props;
        return (
            <div className="keymouse">
                <img
                    style={style}
                    src={src}
                    alt={src}
                    onKeyDown={this.handleKeyDown}
                    onWheel={this.mouseonWheel}
                    onMouseDown={this.handleDrag.bind(this)}
                    onClick={this.handleClick.bind(this)}
                    onDoubleClick={this.handleDbclick.bind(this)}
                />
            </div>
        );
    }
}
