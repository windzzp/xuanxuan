import fs from 'fs';
import {formatDate} from '../app/utils/date-helper';

const lang = {
    config: '配置',
    statistic: '概要',
    usersInfo: '用户清单',
    loginType: '登录场景',
    loginUserCount: '登录用户数',
    onlineUserCount: '在线用户数',
    totalLoginTimes: '总共登录时间',
    closeTimes: '断开次数',
    reconnectTimes: '重连次数',
    requestTime: '发送数据统计（包含登录和消息）（ms）',
    responseTime: '接收数据统计（包含登录和消息）（ms）',
    sendMessageTime: '聊天数据统计（从发送-接收）（ms）',
    average: '平均耗时',
    min: '最小耗时',
    max: '最大耗时',
    total: '总耗时',
    totalTimes: '总执行次数',
    successTimes: '成功次数',
    loginTimes: '登录耗时',
    lastLoginTime: '最后登录日期',
};

/**
 * 将统计信息写入到html文件
 * @param {object} content 输出的内容
 * @param {string} source 统计信息的来源
 * @return {void}
 */
export const makeReport = (content, source) => {
    let tableHtml = '<table class="table table-bordered"><tbody>';
    tableHtml += getTableHtml(content);
    tableHtml += '</tbody></table>';

    let title = `<h3>统计：${lang[source]}，${formatDate()}</h3>`;
    let html = `<!DOCTYPE html>
                    <html>
                    <head>
                    <meta charset="utf-8" />
                    <title>${source}</title>
                    <style>
                        .table {width: 100%;border-spacing: 0;border-collapse: collapse;text-indent:8px;}
                        .table-bordered{border: 1px solid #ddd;}
                        .table td{line-height:30px;border: 1px solid #ddd;padding:0;border-top:0;border-left:0;min-width:150px;}
                        .table .table tr:last-child td{border-bottom:0;}
                        .table tr td:last-child{border-right:0;}
                    </style>
                    </head>
                    <body>${title}${tableHtml}</body>
                </html>`;
    fs.writeFile(`test/logs/${source}.html`, html, (error) => {
        if (error) {
            return console.error(error);
        }
        console.log(source, '写入成功');
    });
};

/**
 * 将内容处理成html格式
 * @param {object} content 输出的内容
 * @return {string} html 内容
 */
export const getTableHtml = (content) => {
    let tableHtml = '';
    Object.keys(content).forEach((element) => {
        if (content[element] instanceof Object) {
            tableHtml += `<tr><td>${lang[element] ? lang[element] : element}</td><td><table class='table'><tbody>`;
            tableHtml += getTableHtml(content[element]);
            tableHtml += '</tbody></table></td></tr>';
        } else {
            if (typeof content[element] === 'number') {
                content[element] = Math.floor(content[element]);
            }
            if (element === 'lastLoginTime') {
                content[element] = formatDate(content[element]);
            }
            tableHtml += `<tr><td>${lang[element] ? lang[element] : element}</td><td>${content[element]}</td></tr>`;
        }
    });
    return tableHtml;
};
