// eslint-disable-next-line import/no-unresolved
import {env, fs as fse} from 'Platform';
import path from 'path';
import Config, {updateConfig} from '../../config';
import Lang from '../../lang';

/**
 * 内置扩展清单
 * @type {Object[]}
 */
const exts = [{
    name: 'home',
    displayName: Lang.string('exts.home.label'),
    description: Lang.string('exts.home.desc'),
    buildIn: {
        fixed: true,
        asDefault: true,
    },
    type: 'app',
    appIcon: 'mdi-apps',
    appAccentColor: '#3f51b5',
    appType: 'insideView',
}, {
    name: 'extensions',
    displayName: Lang.string('exts.extensions.label'),
    description: Lang.string('exts.extensions.desc'),
    buildIn: {},
    type: 'app',
    appIcon: 'mdi-puzzle',
    appAccentColor: '#00c853',
    appType: 'insideView',
}, {
    name: 'themes',
    displayName: Lang.string('exts.themes.label'),
    description: Lang.string('exts.themes.desc'),
    buildIn: {},
    type: 'app',
    appIcon: 'mdi-airballoon',
    appAccentColor: '#f50057',
    appType: 'insideView',
}, {
    name: 'files',
    displayName: Lang.string('exts.files.label'),
    description: Lang.string('exts.files.desc'),
    buildIn: {},
    type: 'app',
    appIcon: 'mdi-folder',
    appAccentColor: '#ff9100',
    appType: 'insideView',
}];

/**
 * 从运行时配置中加载内置扩展
 * @type {Object[]}
 * @private
 */
const internals = Config.exts && Config.exts.internals;
if (Array.isArray(internals) && internals.length) {
    exts.push(...internals);
}

/**
 * 内置扩展存储根路径
 * @type {string}
 * @private
 */
const buildInsPath = path.join(process.env.HOT ? env.appRoot : env.appPath, 'build-in');

/**
 * 内置扩展清单文件路径：`extensions.json`
 * @type {string}
 * @private
 */
const buildInsFile = path.join(buildInsPath, 'extensions.json');

/**
 * 内置扩展清单文件读取的内置扩展列表
 * @type {Object[]}
 * @private
 */
const buildIns = fse.readJsonSync(buildInsFile, {throws: false});

if (buildIns && Array.isArray(buildIns)) {
    buildIns.forEach(extConfig => {
        if (typeof extConfig === 'string') {
            const extPkgPath = path.join(buildInsPath, extConfig, 'package.json');
            const extPkg = fse.readJsonSync(extPkgPath, {throws: false});
            if (extPkg && extPkg.name === extConfig) {
                extConfig = extPkg;
            }
        }
        if (extConfig && (typeof extConfig === 'object')) {
            extConfig.buildIn = {
                localPath: path.join(buildInsPath, extConfig.name)
            };
            exts.push(extConfig);
            if (DEBUG) {
                console.collapse('Extension local', 'greenBg', extConfig.name, 'greenPale');
                console.log('ext', extConfig);
                console.groupEnd();
            }
        }
    });
}

/**
 * 内置扩展存储根路径内的运行时配置文件路径
 * @type {string}
 * @private
 */
const buildInConfigFile = path.join(buildInsPath, 'config.json');

/**
 * 内置扩展存储根路径内的运行时配置
 * @type {string}
 * @private
 */
const buildInConfig = fse.readJsonSync(buildInConfigFile, {throws: false});

// 更新扩展的运行时配置
if (buildInConfig) {
    updateConfig(buildInConfig);
}

export default exts;
