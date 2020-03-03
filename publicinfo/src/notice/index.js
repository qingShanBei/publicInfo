import React from 'react';

import ReactDOM from 'react-dom';

import * as serviceWorker from '../serviceWorker';

import App from './App';
import { ConfigProvider } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

ReactDOM.render( <ConfigProvider locale={zh_CN}><App /></ConfigProvider>, document.getElementById('root'));

serviceWorker.register();
