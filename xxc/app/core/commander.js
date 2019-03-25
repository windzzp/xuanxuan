import {getSearchParam} from '../utils/html-helper';

/**
 * 用于保存命令的公共上下文参数数据
 * (Save current shared context)
 *
 * @ignore
 * @private
 */
const context = {};

/**
 * 用于保存注册的命令
 * (Save registered commands)
 *
 * @ignore
 * @private
 */
const commands = {};

/**
 * 设置当前命令上下文参数
 * (Set Command context data)
 *
 * @param {any} data 上下文参数 (Command context data)
 * @return {void}
 */
export const setCommandContext = (data) => {
    if (data) {
        if (typeof data !== 'object') {
            data = {data};
        }
        Object.assign(context, data);
    }
};

/**
 * 获取当前命令上下文参数
 * (Get current command context data)
 *
 * @param {Object[]} [newContexts=null] 新的上下文参数 (New command context)
 * @return {Object} 上下文参数对象
 */
export const getCommandContext = (...newContexts) => Object.assign({}, context, ...newContexts);

/**
 * 执行命令
 * (Execute command)
 *
 * @param {string|Object} command 命令名称或命令对象 (Command name or command object)
 * @param {Object} context 上下文参数对象 (Command context object)
 * @param {...string} params 命令参数 (Command params)
 * @return {Promise<any, Error>} 通过 Promise 返回命令执行结果 (Return result with Promise)
 */
export const executeCommandWithContext = (command, context, ...params) => {
    let commandName = null;
    if (typeof command !== 'object') {
        commandName = command;
        command = commands[commandName];
    } else {
        commandName = command && command.name;
    }
    if (command) {
        if (!command.func) {
            if (DEBUG) {
                console.collapse('Command.execute', 'redBg', commandName, 'redPale', 'command func not found', 'redBg');
                console.log('command', command);
                console.log('params', params);
                console.groupEnd();
            }
            return;
        }

        let searchOptions = null;
        if (params && params.length && typeof params[params.length - 1] === 'object') {
            searchOptions = params[params.length - 1];
        }
        const commandContext = getCommandContext(searchOptions ? {options: searchOptions} : null, context);
        if (command.context) {
            const typeOfCommandContext = typeof command.context;
            if (typeOfCommandContext === 'function') {
                Object.assign(commandContext, command.context(commandContext, ...params));
            } else if (typeOfCommandContext === 'object') {
                Object.assign(commandContext, command.context);
            } else {
                Object.assign(commandContext, {data: command.context});
            }
        }

        const result = command.func(commandContext, ...params);

        if (DEBUG) {
            console.collapse('Command.execute', 'redBg', commandName, 'redPale');
            console.log('context', commandContext);
            console.log('command', command);
            console.log('params', params);
            console.log('result', result);
            console.log('searchOptions', searchOptions);
            console.groupEnd();
        }

        if (result instanceof Promise) {
            return result;
        }
        if (result instanceof Error) {
            return Promise.reject(result);
        }
        return Promise.resolve(result);
    }
    return Promise.reject(new Error(`Unknown command '${commandName}'.`));
};

/**
 * 执行命令
 * (Execute command)
 *
 * @param {string|Object} command 命令名称或命令对象 (Command name or command object)
 * @param {...string} params 命令参数 (Command params)
 * @return {Promise<any, Error>} 通过 Promise 返回命令执行结果 (Return result with Promise)
 */
export const executeCommand = (command, ...params) => executeCommandWithContext(command, null, ...params);

/**
 * 根据命令文本字符串执行命令
 * (Execute command from command text string)
 *
 * @param {string} commandLine 命令文本字符串 (Command text string)
 * @param {object} [commandContext=null] 命令上下文参数 (Command context data)
 * @return {Promise<any, Error>} 通过 Promise 返回命令执行结果 (Return result with Promise)
 */
export const executeCommandLine = (commandLine, commandContext = null) => {
    if (commandLine.includes('|')) {
        return Promise.all(commandLine.split('|').map(cLine => executeCommandLine(cLine, commandContext)));
    }
    const params = commandLine.split('/').map((p, idx) => {
        if (p[0] === '?' && idx === (params.length - 1)) {
            return getSearchParam(null, p);
        }
        return decodeURIComponent(p);
    });
    return executeCommandWithContext(params.shift(), commandContext, ...params);
};

/**
 * 创建命令对象
 * (Register a command)
 *
 * @param {string|object} name 命令名称或者命令配置对象 (Command name or command config object)
 * @param {?function(context: object, params: any)} [func=null] 命令操作函数 (Command function)
 * @param {?(object|function(context: object, params: any))} [commandContext=null] 命令上下文参数 (Command context data)
 * @return {{name: string, func: function, context: ?object}} 返回创建的命令对象
 */
export const createCommandObject = (name, func = null, commandContext = null) => {
    const command = typeof name === 'object' ? Object.assign({}, name) : {name};
    if (typeof func === 'function') {
        command.func = func;
    }
    if (commandContext) {
        command.context = commandContext;
    }
    return command;
};

/**
 * 注册命令
 * (Register a command)
 *
 * @param {string|object} name 命令名称或者命令配置对象 (Command name or command config object)
 * @param {?function(context: object, params: any)} [func=null] 命令操作函数 (Command function)
 * @param {?object|function(context: object, params: any)} [commandContext=null] 命令上下文参数 (Command context data)
 * @return {boolean} 如果为 true，则命令注册成功；否则注册失败，通常失败的原因是已有相同名称的命令注册过 (If return true, then register success, else fail)
 */
export const registerCommand = (name, func = null, commandContext = null) => {
    const command = createCommandObject(name, func, commandContext);
    if (commands[command.name]) {
        if (DEBUG) {
            console.wran(`Command register failed, because the command '${command.name}' is already registered.`);
        }
        return false;
    }
    commands[command.name] = command;
    return true;
};

/**
 * 取消注册命令
 * (Unregister command)
 *
 * @param {string} name 命令名称 (Command name)
 * @return {boolean} 如果为 true，表示成功取消注册命令；否则取消注册失败，通常失败的原因是该名称的命令从没有注册过，或者已经被取消 (If return true, then unregister success，else fail)
 */
export const unregisterCommand = name => {
    if (commands[name]) {
        delete commands[name];
        return true;
    }
    return false;
};

export default {
    executeCommand,
    executeCommandLine,
    setCommandContext,
    registerCommand,
    unregisterCommand
};
