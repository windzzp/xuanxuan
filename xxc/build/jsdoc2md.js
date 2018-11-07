import jsdoc2md from 'jsdoc-to-markdown';
import fse from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const outputDirRoot = path.join(__dirname, '../../docs/client/api/');
const inputDirRoot = path.join(__dirname, '../app');
const configFile = path.join(__dirname, './jsdoc.json');

console.log('inputDirRoot', chalk.underline(inputDirRoot));
console.log('outputDirRoot', chalk.underline(outputDirRoot));
console.log('configFile', chalk.underline(configFile));

const outputDoc = dir => {
    // const templateData = jsdoc2md.getTemplateDataSync({files: path.join(inputDirRoot, dir, '**/*.js')});
    // console.log(templateData);
    let template;
    try {
        template = fse.readFileSync(path.join(outputDirRoot, `${dir}.hbs`), {encoding: 'utf-8'});
    } catch (_) {
        template = [
            `# \`${dir}\``,
            '',
            `模块 \`${dir}\` 的所有原始文件都可以在 [\${repository.clientSourceRoot}app/${dir}](\${repository.sourceUrl}\${repository.clientSourceRoot}app/${dir}) 目录下找到。`,
            '',
            '{{>main}}'
        ].join('\n');
    }
    try {
        const mdContent = jsdoc2md.renderSync({
            configure: configFile,
            files: path.join(inputDirRoot, dir, '*.js'),
            plugin: ['dmd-plugin-zh-cn'],
            template,
            separators: true,
            'name-format': true,
            // 'member-index-format': 'list', // grouped, list
        });
        const outputFile = path.join(outputDirRoot, `${dir}.md`);
        fse.outputFileSync(outputFile, mdContent, {encoding: 'utf-8'});
        console.log('Output', chalk.underline(outputFile));
    } catch (error) {
        console.error(error);
    }
    // console.log(mdContent);
};

outputDoc('components');
outputDoc('utils');
