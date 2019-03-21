import fse from 'fs-extra';
import path from 'path';
import {formatDate} from '../app/utils/date-helper';

export const formatString = (str, ...args) => {
    let result = str;
    if (args.length > 0) {
        let reg;
        if (args.length === 1 && (typeof args[0] === 'object')) {
            // eslint-disable-next-line prefer-destructuring
            args = args[0];
            Object.keys(args).forEach(key => {
                if (args[key] !== undefined) {
                    reg = new RegExp(`({\\$\\$${key}})`, 'g');
                    result = result.replace(reg, args[key]);
                }
            });
        } else {
            for (let i = 0; i < args.length; i++) {
                if (args[i] !== undefined) {
                    reg = new RegExp(`({\\$\\$[${i}]})`, 'g');
                    result = result.replace(reg, args[i]);
                }
            }
        }
    }
    return result;
};

const getLoginTypeText = config => {
    const {
        timeForLogin1, timeForLogin2, timeForLogin3, range
    } = config;
    const userCount = range[1] - range[0] + 1;
    if (timeForLogin1) {
        return `采用随机登录策略：尽量在 ${(timeForLogin1 / 60000).toFixed(1)} 分钟内，安排 ${userCount} 个用户在随机的时间点进行登录操作。`;
    } else if (timeForLogin2) {
        return `采用集中登录策略：尽量在 ${(timeForLogin2 / 60000).toFixed(1)} 分钟内，安排 ${userCount} 个用户尽可能早的进行登录操作。`;
    } else if (timeForLogin3) {
        return `采用持续登录策略：每隔 ${(timeForLogin3 / 1000).toFixed(1)} 秒登录一个用户，直到所有 ${userCount} 个用户都登录到系统。`;
    }
};

export const createJSONReport = (data, fileName) => {
    fse.outputJSONSync(fileName, data);
};

export const createHTMLReport = (data, fileName) => {
    const template = fse.readFileSync(path.resolve(__dirname, './report-template.html'), {encoding: 'utf-8'});
    const {config} = data;
    fse.outputFileSync(fileName, formatString(template, Object.assign({
        reportName: data.name,
        data: JSON.stringify(data),
        reportTimeText: formatDate(data.reportTime),
        startTestTimeText: formatDate(data.startTestTime),
        loginTypeText: getLoginTypeText(config),
        rangeText: `${config.account}${config.range[0]}~${config.account}${config.range[1]}`,
        xxcVersion: config.pkg.version,
        account: config.account,
        serverUrl: config.serverUrl,
        socketPort: config.socketPort,
        password: config.password,
    }, config)));
};
