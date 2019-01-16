const chalk = require('chalk');
const program = require('commander');
const path = require('path');
const fse = require('fs-extra');

program
    .option('-l, --langs <langs>', '需要检查的语言项', 'zh-cn,zh-tw,en')
    .option('-c, --copy', '是否复制没有的语言配置项')
    .option('-f, --formatMain', '是否格式主要语言文件')
    .parse(process.argv);

const {formatMain, copy: copyFromMain} = program;
const langs = program.langs.split(',');
const mainLang = langs[0];
const mainLangData = fse.readJSONSync(path.join(__dirname, '../app/lang/', `${mainLang}.json`), {throws: false});
const mainLangPairs = [];
let lastPairNamePrefix = null;
Object.keys(mainLangData).map(name => ({name, value: mainLangData[name]})).sort((x, y) => {
    return x.name > y.name ? 1 : -1;
}).forEach((pair, index) => {
    const namePrefix = pair.name.split('.')[0];
    if (index && lastPairNamePrefix !== namePrefix) {
        mainLangPairs.push('space');
    }
    lastPairNamePrefix = namePrefix;
    mainLangPairs.push(pair);
});

const saveLangData = (file, pairs, data) => {
    console.log(`${chalk.yellow('→')} 检查 ${chalk.underline(file)}`);
    const lines = ['{'];
    pairs.forEach((pair, index) => {
        if (pair === 'space') {
            lines.push('');
        } else {
            const isLastPair = index === (pairs.length - 1);
            const dataValue = data && data[pair.name];
            const value = dataValue === undefined ? pair.value : dataValue;
            if (dataValue === undefined) {
                console.log(`${chalk.red('𐄂')} 缺失 “${chalk.bold(pair.name)}” 属性值，使用默认值 “${chalk.bold(value)}”`);
            }
            lines.push(`    "${pair.name}": "${value.replace(/"/g, '\\"')}"${isLastPair ? '' : ','}`);
        }
    });
    lines.push('}\n');

    if (copyFromMain) {
        fse.writeFileSync(file, lines.join('\n'));
        console.log(`${chalk.green('✓')} 更新语言文件 ${chalk.underline(file)}\n`);
    } else {
        console.log();
    }
};
langs.forEach(lang => {
    if (lang === mainLang && !formatMain) {
        return;
    }
    const langFile = path.join(__dirname, '../app/lang/', `${lang}.json`);
    if (fse.existsSync(langFile)) {
        const langData = fse.readJSONSync(langFile, {throws: false});
        saveLangData(langFile, mainLangPairs, langData);
    } else {
        saveLangData(langFile, mainLangPairs);
    }
});
