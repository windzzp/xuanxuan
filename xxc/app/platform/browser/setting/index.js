import system from './system.json';
import {updateConfig} from '../../../config';

// 更新平台特有配置
const config = updateConfig({system});

export default config;
