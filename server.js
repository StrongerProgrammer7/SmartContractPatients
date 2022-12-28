//подключение библиотеки express
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv').config();
//подключения модуля: пути сервера
const pages = require('./routers/authRouters'); //page
const controller = require('./controller/auth'); //logic

//Решение проблемы с файлами требующим AborController (node js v16.x.x. эта проблема решена)
const {AbortController} = require('node-abort-controller');
global.AbortController = AbortController;
/******************* */
// Порт стандартный если есть или 3000
const PORT = process.env.PORT || 3000;

//использование экспресс
const app = express();
app.use(express.json());

//Статические файлы
app.use("/css",express.static(__dirname + "/public/css"));
app.use("/js",express.static(__dirname + "/public/js"));
app.use("/utils",express.static(__dirname + "/public/utils"));
app.use("/image",express.static(__dirname + "/public/image"));

app.engine('ejs', require('ejs-mate'));
app.set("view engine" , 'ejs');
app.set("views","./views");
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

//Разделение логики и фронта
app.use('/',pages); // при использовании модуля путей, для работы с сервером указывается сначала / затем название #/login
app.use("/api",controller); //для работы с сервером TODO: взаимодействие с web3Provider

//Начало работы сервера
const startServer = async function()
{
    try 
    {
        app.listen(PORT, () => console.log(`Server start on the port ${PORT}`));
    } catch (error) 
    {
        console.log(error);   
        console.error('Unable to connect to the server:', error); 
    }
}

startServer();