import chalk from 'chalk';

const logTimeStr = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s} `;
};

const colorArg = arg => {
    const typeOfArg = typeof arg;
    if (typeOfArg === 'number' || typeOfArg === 'boolean') {
        return chalk.yellow(arg.toString());
    }
    if (arg === null) {
        return chalk.bold('null');
    }
    if (arg === undefined) {
        return chalk.gray('undefined');
    }
    if (typeOfArg === 'string') {
        const strLength = arg.length;
        if (strLength > 4) {
            if (arg.startsWith('c:')) {
                if (strLength > 10) {
                    if (arg.startsWith('c:inverse|')) {
                        return chalk.inverse(colorArg(arg.substring(10)));
                    }
                    if (arg.startsWith('c:magenta|')) {
                        return chalk.magenta(colorArg(arg.substring(10)));
                    }
                    if (arg.startsWith('c:bgGreen|')) {
                        return chalk.bgGreen(colorArg(arg.substring(8)));
                    }
                }
                if (strLength > 9) {
                    if (arg.startsWith('c:italic|')) {
                        return chalk.italic(colorArg(arg.substring(9)));
                    }
                    if (arg.startsWith('c:yellow|')) {
                        return chalk.yellow(colorArg(arg.substring(9)));
                    }
                }
                if (strLength > 8) {
                    if (arg.startsWith('c:green|')) {
                        return chalk.green(colorArg(arg.substring(8)));
                    }
                    if (arg.startsWith('c:white|')) {
                        return chalk.white(colorArg(arg.substring(8)));
                    }
                    if (arg.startsWith('c:black|')) {
                        return chalk.black(colorArg(arg.substring(8)));
                    }
                    if (arg.startsWith('c:bgRed|')) {
                        return chalk.bgRed(colorArg(arg.substring(8)));
                    }
                }
                if (strLength > 7) {
                    if (arg.startsWith('c:cyan|')) {
                        return chalk.cyan(colorArg(arg.substring(7)));
                    }
                    if (arg.startsWith('c:blue|')) {
                        return chalk.blue(colorArg(arg.substring(7)));
                    }
                    if (arg.startsWith('c:gray|')) {
                        return chalk.gray(colorArg(arg.substring(7)));
                    }
                    if (arg.startsWith('c:bold|')) {
                        return chalk.bold(colorArg(arg.substring(7)));
                    }
                }
                if (strLength > 6) {
                    if (arg.startsWith('c:red|')) {
                        return chalk.red(colorArg(arg.substring(6)));
                    }
                    if (arg.startsWith('c:dim|')) {
                        return chalk.dim(colorArg(arg.substring(6)));
                    }
                }
            } else {
                if (arg.startsWith('**') && arg.endsWith('**')) {
                    return chalk.bold(colorArg(arg.substring(2, strLength - 2)));
                }
                if (arg.startsWith('__') && arg.endsWith('__')) {
                    return chalk.underline(colorArg(arg.substring(2, strLength - 2)));
                }
            }
        }
        if (strLength > 2) {
            if (arg.startsWith('*') && arg.endsWith('*')) {
                return chalk.italic(colorArg(arg.substring(1, strLength - 1)));
            }
            if (arg.startsWith('_') && arg.endsWith('_')) {
                return chalk.gray(colorArg(arg.substring(1, strLength - 1)));
            }
        }
    }
    return arg;
};

export const logInfo = (...args) => {
    if (typeof args[0] === 'function') {
        const name = args[1];
        console.info(`${chalk.cyan('● Info ')}`, chalk.gray(logTimeStr()), `─────────── ${name ? `${name} ` : ''}BEGIN ────────────────────┐`);
        args[0]();
        console.info(`└─────────────────────────── ${name ? `${name} ` : ''}END ──────────────────────┘`);
    } else {
        console.info(chalk.cyan('● Info '), chalk.gray(logTimeStr()), ...args.map(colorArg));
    }
};

export const logWarn = (...args) => {
    if (typeof args[0] === 'function') {
        const name = args[1];
        console.warn(`${chalk.cyan('● Warn ')}`, chalk.gray(logTimeStr()), `─────────── ${name ? `${name} ` : ''}BEGIN ────────────────────┐`);
        args[0]();
        console.warn(`└─────────────────────────── ${name ? `${name} ` : ''}END ──────────────────────┘`);
    } else {
        console.warn(chalk.yellow('● Warn '), chalk.gray(logTimeStr()), ...args.map(colorArg));
    }
};

export const logError = (...args) => {
    if (typeof args[0] === 'function') {
        const name = args[1];
        console.error(`${chalk.cyan('● Error')}`, chalk.gray(logTimeStr()), `─────────── ${name ? `${name} ` : ''}BEGIN ────────────────────┐`);
        args[0]();
        console.error(`└─────────────────────────── ${name ? `${name} ` : ''}END ──────────────────────┘`);
    } else {
        console.error(chalk.red('● Error'), chalk.gray(logTimeStr()), ...args.map(colorArg));
    }
};

export default {
    info: logInfo,
    warn: logWarn,
    error: logError,
};
