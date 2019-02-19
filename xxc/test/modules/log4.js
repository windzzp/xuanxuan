import log4js from 'log4js';
import fs from 'fs';

fs.unlink('./test/logs/test.log', (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('删除test.log文件成功');
});

fs.unlink('./test/logs/main.log', (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('删除main.log文件成功');
});

log4js.configure({
    appenders: {
        test: {type: 'file', filename: './test/logs/test.log'},
        main: {type: 'file', filename: './test/logs/main.log'}
    },
    categories: {
        default: {appenders: ['test', 'main'], level: 'all'},
        test: {appenders: ['test'], level: 'all'},
        main: {appenders: ['main'], level: 'all'}
    }
});
export const testLog = log4js.getLogger('test');
export const mainLog = log4js.getLogger('main');
