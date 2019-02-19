export default class User {
    constructor(account, password, activeLevel = 0.5) {
        this.account = account;
        this.password = password;
        this.activeLevel = activeLevel;
    }

    /**
     * 获取用户登录的服务器地址（以字符串形式）
     *
     * @readonly
     * @memberof User
     * @type {string}
     */
    get serverUrl() {
        const {server} = this;
        return server && server.toString();
    }

    /**
     * 获取然之服务器地址
     *
     * @memberof User
     * @type {string}
     */
    get ranzhiUrl() {
        if (this._ranzhiUrl === undefined) {
            this._ranzhiUrl = this.$get('ranzhiUrl') || `http://${this.server.hostname}`;
        }
        return this._ranzhiUrl;
    }

    /**
     * 设置然之服务器地址
     *
     * @memberof User
     * @param {string} url 然之服务器地址
     */
    set ranzhiUrl(url) {
        this._ranzhiUrl = url;
    }

    /**
     * 获取 XXD 服务器端口号
     *
     * @readonly
     * @memberof User
     * @type {string}
     */
    get webServerPort() {
        const {server} = this;
        return server ? server.port : '';
    }

    /**
     * 获取要登录的 XXD 服务器名称
     *
     * @readonly
     * @memberof User
     * @type {string}
     */
    get serverName() {
        const {server} = this;
        if (server) {
            // eslint-disable-next-line no-nested-ternary
            return server.username ? server.username : (server.pathname ? server.pathname.substr(1) : '');
        }
        return '';
    }

    /**
     * 获取请求 XXD 服务器信息 URL 地址
     *
     * @readonly
     * @memberof User
     * @type {string}
     */
    get webServerInfoUrl() {
        const {server} = this;
        return server ? `${server.origin}/serverInfo` : '';
    }

    /**
     * 获取 Socket 服务器端口
     *
     * @memberof User
     * @type {string}
     */
    get socketPort() {
        return this._socketPort || '';
    }

    /**
     * 设置 Socket 服务器端口
     *
     * @memberof User
     */
    set socketPort(port) {
        this._socketPort = port;
    }

    /**
     * 获取 Socket 服务连接地址
     *
     * @memberof User
     * @type {string}
     */
    get socketUrl() {
        if (this._socketUrl) {
            return this._socketUrl;
        }
        const {serverUrl} = this;
        if (serverUrl) {
            const url = new URL(serverUrl);
            url.protocol = (this.isVersionSupport('wss') && url.protocol === 'https:') ? 'wss:' : 'ws:';
            url.pathname = '/ws';
            url.port = this.socketPort;
            return url.toString();
        }
        return '';
    }

    /**
     * 设置Socket 服务器连接地址
     *
     * @param {string} url Socket 服务器连接地址
     * @memberof User
     */
    set socketUrl(url) {
        this._socketUrl = url;
    }

    /**
     * 创建一个用于测试的用户
     */
    static next(config, activeLevel = 0.5) {
        const {account, password} = config;
        return new User(account.replace('$', config.accountID++), password, activeLevel);
    };
}
