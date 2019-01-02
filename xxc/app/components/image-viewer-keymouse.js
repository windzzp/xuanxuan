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

    render() {      
        return (
            <div className="keymouse">
                <img src={this.props.src} alt={this.props.src} onKeyDown={this.esconKeyDown} />
            </div>
        );
    }
}
