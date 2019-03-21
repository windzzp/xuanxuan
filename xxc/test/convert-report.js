import program from 'commander';
import fse from 'fs-extra';
import path from 'path';
import {createHTMLReport} from './report';

// 处理命令行参数
program
    .alias('npm run convert-test-report --')
    .option('-s, --sourceFile <sourceFile>', '原始数据路径')
    .option('-f, --outputFile <outputFile>', '输出路径')
    .option('-t, --reportType <reportType>', '报告类型', 'html')
    .parse(process.argv);


const convert = () => {
    const {reportType, sourceFile} = program;
    let {outputFile} = program;
    if (!outputFile) {
        if (sourceFile.toLowerCase().endsWith('.json')) {
            outputFile = `${sourceFile.substr(0, sourceFile.length - 4)}.${reportType}`;
        } else {
            outputFile = `${sourceFile}.${reportType}`;
        }
    }
    const data = fse.readJSONSync(path.resolve(__dirname, (sourceFile)));
    if (reportType === 'html') {
        createHTMLReport(data, path.resolve(__dirname, outputFile));
    }
};

convert();
