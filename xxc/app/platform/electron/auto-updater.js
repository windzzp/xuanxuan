import extractZip from 'extract-zip';
import uuid from 'uuid';
import fse from 'fs-extra';
import path from 'path';
import {downloadFile, removeFileFromCache} from './net';
import env, {getElectronRootPath} from './env';
import {callRemote} from './remote';
import {getStoreItem, setStoreItem, removeStoreItem} from '../../utils/store';

/**
 * 自动更新数据对象在本地存储中的键名
 * @type {string}
 * @private
 */
const UPDATER_INSTALL_DATA = 'UPDATER_INSTALL_DATA';

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
        const tmpPath = path.join(env.tmpPath, file.gid || uuid());
        const {localPath} = file;
        if (onProgress) {
            onProgress(0.9);
        }
        process.noAsar = true; // see https://github.com/electron/electron/issues/9304
        fse.emptyDir(tmpPath).then(() => {
            if (onProgress) {
                onProgress(0.95);
            }
            return extractZip(localPath, {dir: tmpPath}, err => {
                process.noAsar = false;
                if (err) {
                    err.code = 'UPDATER_UNZIP_ERROR';
                    reject(err);
                } else {
                    removeFileFromCache(file);
                    resolve(tmpPath);
                }
                if (onProgress) {
                    onProgress(1);
                }
            });
        }).catch(reject);
    }));
};

/**
 * 拷贝升级程序
 * @param {String} platformID 平台识别字符串
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const copyUpdater = (platformID) => {
    const updaterFiles = {
        mac64: 'updater.mac',
        linux64: 'updater.linux64',
        linux32: 'updater.linux32',
        win64: 'updater.win64.exe',
        win32: 'updater.win32.exe',
    };
    const updaterFileName = updaterFiles[platformID];
    if (!updaterFileName) {
        return Promise.reject(new Error('Cannot find updater program.'));
    }
    let updaterFile = null;
    if (process.env.HOT) {
        updaterFile = path.resolve(env.appRoot, '../updater/bin', updaterFileName);
    } else {
        updaterFile = path.join(env.appPath, 'bin', updaterFileName);
    }
    const updaterDestPath = path.join(env.tmpPath, updaterFileName);
    return fse.copy(updaterFile, updaterDestPath, {overwrite: true}).then(() => Promise.resolve(updaterDestPath));
};

/**
 * 退出并安装升级
 * @param {{downloadFileID: string, downloadedPath: string}} updaterStatus 升级状态对象
 * @returns {Promise} 使用 Promise 异步返回处理结果
 */
export const quitAndInstall = (updaterStatus) => {
    const {downloadFileID, downloadedPath, name} = updaterStatus;
    return copyUpdater(downloadFileID).then(updaterFile => {
        const srcPath = path.join(downloadedPath, env.isOSX ? `${name}.app` : name);
        const appPath = getElectronRootPath();
        const runPath = env.isOSX ? appPath : env.isWindowsOS ? path.join(appPath, `${name}.exe`) : path.join(appPath, name);
        // 立即关闭所有应用窗口并退出程序
        const args = [`-src="${srcPath}"`, `-app="${appPath}"`, `-run="${runPath}"`];
        const quitTask = {
            type: 'execFile',
            file: updaterFile,
            args,
            command: `"${updaterFile}" ${args.join(' ')}`
        };
        setStoreItem(UPDATER_INSTALL_DATA, Object.assign(updaterStatus, {updaterFile, quitTask}));

        if (DEBUG) {
            localStorage.setItem('test.app.quit.task', JSON.stringify(quitTask));
        }
        return callRemote('quit', quitTask);
    });
};

/**
 * 删除上次自动更新时产生的文件
 * @return {void}
 */
const cleanLastUpdaterFiles = async () => {
    const updaterData = getStoreItem(UPDATER_INSTALL_DATA);
    if (updaterData) {
        const {updaterFile, downloadedPath} = updaterData;
        if (updaterFile) {
            await fse.remove(updaterFile);
        }
        if (downloadedPath) {
            process.noAsar = true;
            await fse.remove(downloadedPath);
            process.noAsar = false;
        }
        removeStoreItem(UPDATER_INSTALL_DATA);
    }
};

// 删除上次自动更新时产生的文件
if (!DEBUG) {
    cleanLastUpdaterFiles();
}

export default {
    quitAndInstall,
    downloadNewVersion,
    copyUpdater,
};
