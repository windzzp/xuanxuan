import chalk from 'chalk';

const logTimeStr = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
};

export const logInfo = (...args) => {
    if (typeof args[0] === 'function') {
        const name = args[1];
        logInfo(`─────────── ${name ? `${name} ` : ''}BEGIN ─────────┐`);
        args[0]();
        logInfo(`─────────── ${name ? `${name} ` : ''}END ───────────┘\n`);
    } else {
        console.info(chalk.cyan('● [Info]'), chalk.gray(logTimeStr()), ...args);
    }
};

export const logWarn = (...args) => {
    if (typeof args[0] === 'function') {
        const name = args[1];
        logWarn(`─────────── ${name ? `${name} ` : ''}BEGIN ─────────┐`);
        args[0]();
        logWarn(`─────────── ${name ? `${name} ` : ''}END ───────────┘\n`);
    } else {
        console.warn(chalk.yellow('● [Warn]'), chalk.gray(logTimeStr()), ...args);
    }
};

export const logError = (...args) => {
    if (typeof args[0] === 'function') {
        const name = args[1];
        logError(`─────────── ${name ? `${name} ` : ''}BEGIN ─────────┐`);
        args[0]();
        logError(`─────────── ${name ? `${name} ` : ''}END ───────────┘\n`);
    } else {
        console.error(chalk.red('● [Erro]'), chalk.gray(logTimeStr()), ...args);
    }
};

export default {
    info: logInfo,
    warn: logWarn,
    error: logError,
};
