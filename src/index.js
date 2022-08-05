import * as $ from 'jquery'; //import 'jquery'

const Post = require('./Post');

import './styles/saas.scss'
import './styles/test.scss'
import './babel.js'
import "core-js";

// const json = require('./assets/json'); // у файла json не прописываю расширение, когда прописываю путь
// const xml = require('./assets/data.xml');
// const csv = require('./assets/data.csv');

const WebpackLogo = require('@/assets/webpack-logo.png');

const post = new Post('Webpack Post Title', WebpackLogo); // Запрос POST обычно отправляется через форму HTML и приводит к изменению на сервере

$('pre').addClass('code').html(post.toString()); // я обращаюсь к jquery, забрать тег 'pre' и в качестве html сюда вставить post.toString()  

// console.log('Post to String:', post.toString()); // наш post был реализован: он показан в консоли  в виде строки, верно указывается дата и title, на 1:26: 57 Минин удаляет эту строку , т к подключил jquery

// console.log(json); // проверка
// console.log(Post); // проверка
// console.log('XML:', xml); // проверка
// console.log('CSV:', csv); // проверка