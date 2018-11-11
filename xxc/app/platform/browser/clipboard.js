import clipboard from 'clipboard-js'; // 考虑升级到 https://github.com/lgarron/clipboard-polyfill

/**
 * 将文本复制到剪切板
 * @param {string} text 要复制的文本
 * @return {void}
 */
export const writeText = text => {
    clipboard.copy(text);
};

/**
 * 将 HTML 文本复制到剪切板
 * @param {string} html 要复制的 HTML 文本
 * @return {void}
 */
export const writeHTML = html => {
    clipboard.copy({'text/html': html});
};

export default {
    writeText,
    // readText: clipboard.readText,
    writeHTML,
    // readHTML: clipboard.readHTML,
    // readImage: clipboard.readImage,
    // saveImage,
};
