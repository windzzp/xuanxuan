import all from './exts';
import ui from './ui';
import manager from './manager';
import themes from './themes';

const exts = {
    all,
    ui,
    manager,
    themes,
};

if (DEBUG) {
    $.exts = exts;
}

export default exts;
