/* eslint-disable react/no-unused-state */
/* eslint-disable no-useless-concat */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
/* eslint-disable vars-on-top */
/* eslint-disable space-before-blocks */
/* eslint-disable func-names */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, {Component} from 'react';
import Modal from './modal';

export default class ImageKeyMouse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: '' + 'px',
            y: '' + 'px',
            zoom: 0,
            ifDrag: null
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.esconKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.esconKeyDown);
    }

    /**
     * 键盘ESC事件,退出图片浏览
     */

    esconKeyDown = (e) => {
        if (e.keyCode == 27) {
            Modal.hide();
        }
    };

    /**
     * 鼠标滚轮放大图片
     */

    mouseonWheel = (e) => {
        const wheelDelta = e.nativeEvent.wheelDelta;
        let originalzoom = this.state.zoom;
        let zoom = parseInt(originalzoom, 10) || 100;
        zoom += wheelDelta / 12;
        const scale = zoom / 100;
        if (zoom >= 40) {
            originalzoom = `${zoom}%`;
            this.setState({
                zoom: originalzoom,
                scale
            });
            return false;
        }
    }

    /**
     * 鼠标拖动图片
     */

    handleDrag = event => {
        let ifDrag = false;
        event.preventDefault();
        event.stopPropagation();
        const disx = event.pageX - event.target.offsetLeft;
        const disy = event.pageY - event.target.offsetTop;
        const _this = this;

        document.onmousemove = function (evevt){
            ifDrag = true;
            _this.setState({
                x: evevt.pageX - disx,
                y: evevt.pageY - disy,
            });
        };

        document.onmouseup = function (evevt){
            if (ifDrag) {
                document.onmousemove = null;
                document.onmousedown = null;
                _this.setState({
                    x: evevt.pageX - disx,
                    y: evevt.pageY - disy,
                    ifDrag: false
                });
            } else {
                _this.setState({
                    ifDrag: true
                });
            }
        };
    }

    /**
     * 双击图片还原
     */

    handleDbclick = () => {
        this.setState({
            zoom: 0,
            scale: 1,
            x: 'auto',
            y: 'auto'
        });
    }

    handleclick = (e) => {
        e.stopPropagation();
        const ifDrag = this.state.ifDrag;
        if (ifDrag) {
            Modal.hide();
        }
    }

    render() {
        const style = {
            transform: `scale(${this.state.scale})`,
            position: 'absolute',
            top: this.state.y,
            left: this.state.x
        };

        return (
            <div className="keymouse">
                <img style={style} src={this.props.src} alt={this.props.src} onKeyDown={this.esconKeyDown} onWheel={this.mouseonWheel} onMouseDown={this.handleDrag.bind(this)} onClick={this.handleclick.bind(this)} onDoubleClick={this.handleDbclick.bind(this)} />
            </div>
        );
    }
}
