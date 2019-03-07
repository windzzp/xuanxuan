import compareVersions from 'compare-versions';
import platform from '../platform';
import events from './events';
import pkg from '../package.json';
import Lang from './lang';
import profile from './profile';
import FileData from './models/file-data';

/**
 * 事件名称表
 * @type {Object<string, string>}
 * @private
 */
const EVENT = {
    status_change: 'updater.status.changed'
};

/**
 * 升级状态存储对象
 * @type {{status: string, progress: number}}
 * @private
 */
let updaterStatus = null;

/**
 * 存储平台是否支持自动升级
 * @type {boolean}
 * @private
 */
let isPlatformUpdaterAvaliable = null;

/**
 * 升级是否可用
 * @return {boolean} 如果为 `true` 则为升级可用，否则为升级不可用
 */
export const isUpdaterAvaliable = () => {
    if (isPlatformUpdaterAvaliable === null) {
        isPlatformUpdaterAvaliable = platform.has('autoUpdater.quitAndInstall') && platform.has('autoUpdater.downloadNewVersion');
    }
    return isPlatformUpdaterAvaliable;
};

/**
 * 绑定升级状态变更事件
 * @param {funcion} listener 事件回调函数
 * @return {Symbol} 使用 `Symbol` 存储的事件 ID，用于取消事件
 */
export const onUpdaterStatusChanged = listener => events.on(EVENT.status_change, listener);

/**
 * 出发状态变更事件
 * @param {Object} changes 状态变更对象
 * @return {void}
 * @private
 */
const emitStatusChange = (changes) => {
    if (changes && updaterStatus) {
        Object.assign(updaterStatus, changes);
    }
    events.emit(EVENT.status_change, updaterStatus);
};

/**
 * 获取升级状态
 * @return {{status: string, progress: number}} 升级状态对象
 */
export const getUpdaterStatus = () => Object.assign({}, updaterStatus);

/**
 * 设置用户客户端升级信息
 * @param {User} user 当前登录的用户对象
 * @return {{status: string, progress: number}} 升级状态对象
 */
export const checkClientUpdateInfo = user => {
    const currentVersion = pkg.version;
    const {clientUpdate} = user;
    const newVersion = clientUpdate && clientUpdate.version;
    updaterStatus = {
        name: pkg.name,
        user: user.identify,
        status: 'ready',
        progress: 0,
        currentVersion,
        newVersion,
        serverUrl: user.serverUrl,
        skipped: newVersion === user.config.skippedVersion
    };
    let needUpdate = false;
    if (newVersion && compareVersions(currentVersion, newVersion) < 0) {
        needUpdate = clientUpdate.strategy || 'optional';
    }
    const needUpdateForce = needUpdate === 'force';
    const needUpdateOptional = needUpdate && !needUpdateForce;

    const downloadFileID = `${platform.env.os}${platform.env.arch.includes('64') ? '64' : '32'}`;
    const downloadUrl = clientUpdate && clientUpdate.downloads && clientUpdate.downloads[downloadFileID];

    return Object.assign(updaterStatus, {
        needUpdate,
        needUpdateForce,
        needUpdateOptional,
        updateInfo: clientUpdate,
        downloadUrl,
        downloadFileID,
        message: Lang.string(needUpdate ? 'update.message.newVersionAvaliable' : 'update.message.alreadyNew')
    });
};

/**
 * 立即尝试下载新版本
 * @return {{status: string, progress: number}} 升级状态对象
 */
export const downloadNewVersion = () => {
    if (isUpdaterAvaliable() && updaterStatus && updaterStatus.user === profile.user.identify && updaterStatus.needUpdate && updaterStatus.status !== 'downloading' && updaterStatus.status !== 'downloaded') {
        const {downloadUrl, downloadFileID, newVersion} = updaterStatus;
        if (!downloadUrl) {
            emitStatusChange({
                status: 'downloadFail',
                progress: 1,
                message: Lang.string('update.message.downloadUrlNotAvaliable')
            });
        } else {
            emitStatusChange({
                status: 'downloading',
                progress: 0.001,
                message: Lang.string('update.message.downloading')
            });
            platform.call('autoUpdater.downloadNewVersion', profile.user, FileData.create({
                name: `${pkg.name}.${newVersion}.${downloadFileID}.zip`,
                url: downloadUrl,
                gid: `${pkg.name}.${newVersion}.${downloadFileID}`,
                storageType: 'cache'
            }), progress => {
                if ((progress - updaterStatus.progress) > 0.01) {
                    emitStatusChange({
                        status: 'downloading',
                        progress,
                        message: Lang.string(progress >= 0.9 ? 'update.message.unziping' : 'update.message.downloading')
                    });
                }
            }).then(downloadedPath => emitStatusChange({
                status: 'downloaded',
                progress: 1,
                downloadedPath,
                message: Lang.string('update.message.downloaded')
            })).catch(error => emitStatusChange({
                status: 'downloadFail',
                progress: 1,
                message: Lang.error(error),
            }));
        }
    }
    return updaterStatus;
};

/**
 * 忽略当前提示的版本
 * @param {User} user 当前登录的用户对象
 * @returns {boolean} 如果返回 `true` 则为操作成功，否则为操作失败
 */
export const skipNewVersion = user => {
    if (updaterStatus && updaterStatus.needUpdateOptional) {
        user.config.skippedVersion = updaterStatus.newVersion;
        return true;
    }
    return false;
};

/**
 * 清除忽略当前版本提示
 * @param {User} user 当前登录的用户对象
 * @returns {boolean} 如果返回 `true` 则为操作成功，否则为操作失败
 */
export const notifyMeNextTime = user => {
    if (updaterStatus && updaterStatus.needUpdateOptional) {
        user.config.skippedVersion = null;
        return true;
    }
    return false;
};

/**
 * 退出并开始安装新版本
 * @return {void}
 */
export const quitAndInstall = () => {
    if (!updaterStatus || updaterStatus.status !== 'downloaded') {
        return downloadNewVersion.then(quitAndInstall);
    }
    return platform.call('autoUpdater.quitAndInstall', updaterStatus);
};
