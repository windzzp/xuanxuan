import 'ion-sound';
import Config from '../../config';

/**
 * 初始化 ion-sound 声音播放模块
 * @param {string} soundPath 声音媒体文件路径
 * @return {void}
 */
const init = soundPath => {
    window.ion.sound({
        sounds: [
            {name: 'message'}
        ],
        multiplay: true,
        volume: 1,
        path: soundPath,
        preload: true,
    });
    if (DEBUG) {
        console.groupCollapsed('%cSOUND inited', 'display: inline-block; font-size: 10px; color: #689F38; background: #CCFF90; border: 1px solid #CCFF90; padding: 1px 5px; border-radius: 2px;');
        console.log('ion', window.ion);
        console.groupEnd();
    }
};

/**
 * 播放声音
 * @param {string} sound 声音名称
 * @return {void}
 */
export const playSound = sound => {
    window.ion.sound.play(typeof sound === 'string' ? sound : null);
};

// 初始化 ion-sound 声音播放模块
init(Config.media['sound.path']);

export default {
    play: playSound
};
