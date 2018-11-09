#!/usr/bin/env node

const chalk = require('chalk');
const program = require('commander');
const path = require('path');
const fse = require('fs-extra');

const defualtConversions = {
    upperCase(text) {
        return text.toUpperCase();
    },
    lowerCase(text) {
        return text.toLowerCase();
    },
};

function replaceConfig(content, config, conversions, prefixKey) {
    for (var key in config) {
        if (config.hasOwnProperty(key)) {
            var value = config[key];
            if (typeof value === 'function') {
                value = value();
            }
            if (typeof value === 'object' && value !== null) {
                content = replaceConfig(content, value, conversions, key);
            } else {
                var regStr = '\\$\\{(' + ((prefixKey !== undefined && prefixKey !== null) ? (prefixKey + '\\.') : '') + key + ':?[\\w:]*)\\}';
                content = content.replace(new RegExp(regStr, 'g'), function(_, match) {
                    var matchArr = match.split(':');
                    var result = (value === null || value === undefined) ? '' : value;
                    if (matchArr.length > 1) {
                        for (var i = 1; i < matchArr.length; ++i) {
                            var conversionName = matchArr[i];
                            var conversion = conversions[conversionName] || defualtConversions[conversionName];
                            if (typeof conversion === 'function') {
                                result = conversion(value);
                            }
                        }
                    }
                    return result;
                });
            }
        }
    }
    return content;
}

program
    .option('-c, --config <config>', '配置文件路径')
    .option('-s, --src <src>', '原文件路径')
    .option('-d, --dest <src>', '生成文件路径')
    .option('-t, --toc', '是否加入 toc 目录')
    .parse(process.argv);

let {src, dest} = program;
src = path.resolve(__dirname, src);
const fileName = path.basename(src);
if (!dest) {
    const fileNameArr = fileName.split('.');
    if (fileNameArr.length > 1) {
        fileNameArr[fileNameArr.length - 2] = fileNameArr[fileNameArr.length - 2] + '-convert';
    } else {
        fileNameArr[fileNameArr.length - 1] = fileNameArr[fileNameArr.length - 1] + '-convert';
    }
    dest = path.join(path.dirname(src), fileNameArr.join('.'));
}

const configFile = program.config;
const config = fse.readJsonSync(configFile, {throws: false});

let content = fse.readFileSync(src, {encoding: 'utf-8'});
content = replaceConfig(content, config, defualtConversions);

const lines = content.split('\n');
if (program.toc && !content.includes('[TOC]')) {
    lines.splice(lines[0].startsWith('# ') ? 1 : 0, 0, '\n[TOC]');
}
lines.forEach((line, index) => {
    if (line.startsWith('?> ') || line.startsWith('!> ')) {
        lines[index] = '>' + line.substr(2);
    }
});
content = lines.join('\n');

fse.outputFileSync(dest, content, {encoding: 'utf-8'});

console.log(chalk.green('✓ ' + chalk.underline(dest)));
