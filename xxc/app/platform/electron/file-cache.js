import fse from 'fs-extra';
import {createUserDataPath} from './ui';

/**
 * 文件缓存对象
 * @private
 * @type {Object}
 */
export const filesCache = {};

/**
 * 创建文件缓存路径
 * @param {{storageName: string}|FileData} file 文件对象
 * @param {{identify: string}|User} user 用户实例
 * @param {string} [storageType='image'] 缓存目录
 * @return {string} 创建文件缓存路径
 * @private
 */
export const createCachePath = (file, user, storageType = null) => {
    if (typeof file === 'string') {
        file = {storageName: file};
    }
    if (!storageType && file.storageType) {
        storageType = file.storageType;
    }
    return createUserDataPath(user, file.storageName, (storageType ? `${storageType}s` : 'images'));
};

/**
 * 检查文件是否已经缓存
 * @param {{localPath: string, path: string, gid: string}|FileData} file 文件对象
 * @param {{identify: string}|User} user 用户实例
 * @param {string} [dirName='image'] 缓存目录
 * @returns {Promise} 使用 Promise 异步返回处理结果
 * @private
 */
export const checkFileCache = (file, user, dirName = 'images') => {
    if (file.path) {
        return Promise.resolve(false);
    }
    if (file.localPath) {
        filesCache[file.gid] = file.localPath;
        return Promise.resolve(file.localPath);
    }
    let cachePath = filesCache[file.gid];
    if (cachePath) {
        file.localPath = cachePath;
        return Promise.resolve(cachePath);
    }
    cachePath = createCachePath(file, user, dirName);
    return fse.pathExists(cachePath).then(exists => {
        if (exists) {
            filesCache[file.gid] = cachePath;
            file.localPath = cachePath;
            return Promise.resolve(cachePath);
        }
        return Promise.resolve(false);
    });
};

/**
 * 从缓存中移除文件，如果文件存在会先尝试删除文件
 * @param {FileData|String} file 缓存文件路径或者缓存文件对象
 * @return {void}
 */
export const removeFileFromCache = file => {
    if (typeof file === 'string') {
        file = {localPath: file};
    }
    const {localPath, gid} = file;
    if (localPath) {
        fse.removeSync(localPath);
    }
    if (gid) {
        delete filesCache[gid];
    } else if (localPath) {
        const findGid = Object.keys(filesCache).find(x => filesCache[x] === localPath);
        if (findGid) {
            delete filesCache[findGid];
        }
    }
};