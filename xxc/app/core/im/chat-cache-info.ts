// 界面上的聊天缓存默认寿命，30分钟，在没有激活的状态超过此时间会从界面上移除
export const DEFAULT_CACHE_LIFE_TIME = 30 * 60 * 1000;

/**
 * 聊天缓存信息类
 */
export default class ChatCacheInfo {
    /**
     * 所属的聊天 GID
     *
     * @type {string}
     * @memberof ChatCacheInfo
     */
    readonly cgid: string;

    /**
     * 存储聊天在界面上上次激活的时间
     *
     * @private
     * @type {number}
     * @memberof ChatCacheInfo
     */
    private _activeTime: number;

    /**
     * 存储界面状态
     *
     * @private
     * @type {{draft?: any, scrollPos?: number}}
     * @memberof ChatCacheInfo
     */
    private _state: {draft?: any, scrollPos?: number, loadingLimit?: number};

    /**
     * 获取聊天在界面上上次激活的时间
     *
     * @readonly
     * @type {number}
     * @memberof ChatCacheInfo
     */
    get activeTime(): number {
        return this._activeTime;
    }

    /**
     * 创建一个 ChatCacheInfo 类
     * @param {string} cgid
     * @param {number} [activeTime]
     * @memberof ChatCacheInfo
     */
    constructor(cgid: string, activeTime?: number) {
        this.cgid = cgid;
        this._activeTime = activeTime || new Date().getTime();
    }

    /**
     * 将当前聊天标记为激活，更新上次激活时间
     * @return {void}
     */
    active(): void {
        this._activeTime = new Date().getTime();
    }

    /**
     * 判断当前缓存是否过期
     * @param {number} [now] 作为比较值的当前时间戳
     * @param {number} life 缓存最长存活时间（距离上次被激活的时间，单位毫秒）
     * @return {boolean}
     * @memberof ChatCacheInfo
     */
    isExpired(now?: number, life: number = DEFAULT_CACHE_LIFE_TIME): boolean {
        const {_activeTime: activeTime} = this;
        return activeTime && (now - activeTime) >= life;
    }

    /**
     * 标记缓存已被清理
     * @return {void}
     */
    clean(): void {
        this._activeTime = null;
    }

    /**
     * 判断当前缓存是否被清理
     * @type {boolean}
     * @memberof ChatCacheInfo
     */
    get isCleaned(): boolean {
        return !this._activeTime;
    }

    /**
     * 保存聊天缓存在界面上的状态，以便于回复界面
     * @param {{draft?: any, scrollPos?: number}} newState 新的状态
     * @return {void}
     */
    keepState(newState: {draft?: any, scrollPos?: number, loadingLimit?: number}): void {
        if (!this._state) {
            this._state = {};
        }
        Object.assign(this._state, newState);
    }

    /**
     * 取出聊天缓存在界面上保存的状态
     * @param {string} stateName 状态名称，可以为 `'draft'` 或 `'scrollPos'`
     * @return {any}
     */
    takeOutState(stateName: string): any {
        const {_state: state} = this;
        if (state) {
            let stateValue;
            switch (stateName) {
                case 'draft':
                    stateValue = state.draft;
                    delete state.draft;
                    break;
                case 'scrollPos':
                    stateValue = state.scrollPos;
                    delete state.scrollPos;
                    break;
                case 'loadingLimit':
                    stateValue = state.loadingLimit;
                    delete state.loadingLimit;
                    break;
                default:
                    break;
            }
            return stateValue;
        }
    }
}
