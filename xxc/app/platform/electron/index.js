
import fs from 'fs-extra';
import sound from '../common/sound';
import env from './env';
import screenshot from './screenshot';
import contextmenu from './contextmenu';
import remote from './remote';
import EventEmitter from './event-emitter';
import image from './image';
import ui from './ui';
import notify from './notify';
import shortcut from './shortcut';
import dialog from './dialog';
import net from './net';
import crypto from './crypto';
import Socket from './socket';
import clipboard from './clipboard';
import webview from './webview';
import buildIn from './build-in';

if (process.type !== 'renderer') {
    throw new Error('platform/electron/index.js must run in renderer process.');
}

export const init = ({config, lang}) => {
    if (config) {
        // 初始化 ion-sound 声音播放模块
        sound.init(config.media['sound.path']);

        ui.init(config, lang);
    }
    if (lang) {
        contextmenu.setLangObj(lang);
    }
};

const platform = {
    type: 'electron',
    init,
    env,
    screenshot,
    contextmenu,
    EventEmitter,
    remote,
    image,
    ui,
    shortcut,
    dialog,
    fs,
    sound,
    net,
    crypto,
    Socket,
    notify,
    clipboard,
    webview,
    buildIn,
};

if (DEBUG) {
    global.$.Platform = platform;
}

export default platform;
