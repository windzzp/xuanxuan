import React from 'react';
import {showConfirm} from '../../components/modal';
import Lang from '../../core/lang';
import Avatar from '../../components/avatar';
import getFileIcon from '../../utils/mdi-file-icon';
import FileData from '../../core/models/file-data';
import {formatBytes} from '../../utils/string-helper';

/**
 * 显示确认发送文件对话框
 * @param {Arrray} files 要发送的文件清单
 * @param {function} callback 显示完成后的回调函数
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const showConfirmSendFilesDialog = (files, callback) => {
    const content = (
        <div className="list">
            {
                files.map(file => {
                    if (!(file instanceof FileData)) {
                        file = FileData.create(file);
                    }
                    const {name, extName} = file;
                    return (
                        <div className="item row flex-middle single" key={file.path}>
                            <Avatar skin={{code: extName, pale: true}} className="flex-none" icon={getFileIcon(extName)} />
                            <div className="sub-content">
                                <div className="title">{name}</div>
                                <span className="muted small">{formatBytes(file.size)}</span>
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
    return showConfirm(content, {
        title: <strong>{Lang.format('chat.confirmSendFiles.format', files.length)}</strong>
    }, callback);
};

export default {
    show: showConfirmSendFilesDialog,
};
