import fse from 'fs-extra';
import Path from 'path';
import network, {downloadFile as downloadFileOrigin, uploadFile as uploadFileOrigin} from '../common/network';
import {checkFileCache, createCachePath, filesCache} from './file-cache';

/**
 * 下载文件
 * @param {string} url 文件下载地址
 * @param {string} fileSavePath 文件保存路径
 * @param {function(progresss: number)} onProgress 下载进度变更事件回调函数
 * @returns {Promise} 使用 Promise 异步返回处理文件下载结果
 */
export const downloadFileWithRequest = (url, fileSavePath, onProgress) => {
    return downloadFileOrigin(url, null, onProgress).then(fileBuffer => {
        const buffer = Buffer.from(new Uint8Array(fileBuffer));
        return fse.outputFile(fileSavePath, buffer);
    });
};

/**
 * 下载并保存文件到本地缓存
 * @param {User} user 用户实例
 * @param {FileData} file 文件对象
 * @param {function(progresss: number)} onProgress 下载进度变更事件回调函数
 * @returns {Promise} 使用 Promise 异步返回处理文件下载结果
 */
export const downloadFile = (user, file, onProgress) => checkFileCache(file, user).then(cachePath => {
    const url = file.url || file.makeUrl(user);
    const fileSavePath = file.path || createCachePath(file, user);
    if (cachePath) {
        if (DEBUG) {
            console.collapse('HTTP DOWNLOAD', 'blueBg', url, 'bluePale', 'Cached', 'greenPale');
            console.log('file', file);
            console.groupEnd();
        }
        if (fileSavePath !== cachePath) {
            return fse.copy(cachePath, fileSavePath).then(() => {
                return Promise.resolve(file);
            });
        }
        return Promise.resolve(file);
    }

    fse.ensureDirSync(Path.dirname(fileSavePath));
    return downloadFileWithRequest(url, fileSavePath, onProgress).then(() => {
        if (DEBUG) {
            console.collapse('HTTP DOWNLOAD', 'blueBg', url, 'bluePale', 'OK', 'greenPale');
            console.log('file', file);
            console.groupEnd();
        }
        file.localPath = fileSavePath;
        filesCache[file.gid] = file.localPath;
        return Promise.resolve(file);
    });
});

/**
 * 上传文件
 * @param {User} user 用户实例
 * @param {FileData} file 文件对象
 * @param {function(progresss: number)} onProgress 上传进度变更事件回调函数
 * @param {boolean} [copyCache=false] 是否将原始文件拷贝到缓存目录
 * @returns {Promise} 使用 Promise 异步返回处理上传文件结果
 */
export const uploadFile = (user, file, onProgress, copyCache = false) => {
    const {originFile} = file;
    if (!originFile) {
        return console.warn('Upload file fail, cannot get origin file object.', file);
    }
    const serverUrl = user.uploadUrl;
    const form = new FormData();
    form.append('file', file.originData, file.name);
    form.append('userID', user.id);
    form.append('gid', file.cgid);
    file.form = form;

    return uploadFileOrigin(file, serverUrl, xhr => {
        xhr.setRequestHeader('ServerName', user.serverName);
        xhr.setRequestHeader('Authorization', user.token);
    }, onProgress).then(remoteData => {
        const finishUpload = () => {
            if (DEBUG) {
                console.collapse('HTTP UPLOAD Request', 'blueBg', serverUrl, 'bluePale', 'OK', 'greenPale');
                console.log('files', file);
                console.log('remoteData', remoteData);
                console.groupEnd();
            }
            return Promise.resolve(remoteData);
        };
        if (copyCache) {
            const copyPath = createCachePath(file, user, copyCache === true ? 'images' : copyCache);
            file.localPath = copyPath;

            if (originFile.blob) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.readyState === 2) {
                            const buffer = Buffer.from(reader.result);
                            fse.outputFile(copyPath, buffer)
                                .then(finishUpload)
                                .then(resolve)
                                .catch(reject);
                        }
                    };
                    reader.readAsArrayBuffer(file.blob);
                });
            }
            if (originFile.path) {
                return fse.copy(originFile.path, copyPath).then(finishUpload);
            }
        }
        return finishUpload();
    }).catch(error => {
        if (DEBUG) {
            console.error('Upload file error', error, file);
        }
        return Promise.reject(error);
    });
};

export default Object.assign({}, network, {
    uploadFile,
    downloadFile,
    checkFileCache
});
