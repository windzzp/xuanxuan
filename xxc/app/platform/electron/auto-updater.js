import extractZip from 'extract-zip';
import uuid from 'uuid';
import fse from 'fs-extra';
import path from 'path';
import {downloadFile} from './net';
import env from './env';

/**
 * 从服务器下载更新版本
 * @param {User} user 当前用户
 * @param {FileData} file 要下载的文件对象
 * @param {function} onProgress 下载进度变更回调函数
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const downloadNewVersion = (user, file, onProgress) => {
    return downloadFile(user, file, progress => {
        if (onProgress) {
            onProgress(progress * 0.9 / 100);
        }
    }).then(file => new Promise((resolve, reject) => {
        const tmpPath = path.join(env.tmpPath, uuid());
        const {localPath} = file;
        if (onProgress) {
            onProgress(0.9);
        }
        extractZip(localPath, {dir: tmpPath}, err => {
            if (err) {
                err.code = 'UPDATER_UNZIP_ERROR';
                reject(err);
            } else {
                fse.removeSync(localPath);
                resolve(tmpPath);
            }
            if (onProgress) {
                onProgress(1);
            }
        });
    }));
};

export const quitAndInstall = () => {

};

export default {
    quitAndInstall,
    downloadNewVersion,
};
