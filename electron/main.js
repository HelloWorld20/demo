/**
 * description：electron后台进程。
 */
"use strict"

// 载入electron模块
const {app,BrowserWindow,ipcMain,dialog}=require("electron");


const core = require('./main/lib/core.js');

const init = require('./main/baseTools/app/init.js');
const getFile = require('./main/baseTools/app/getFile.js');
const upload = require('./main/baseTools/app/upload.js')


let mainWindow;

//自定义方法入口
function entry() {

    //监听前端页面传过来的方法。分开处理请求
    core.get( (event, res) => {
        let method = res.method;
        let value = res.value;

        if(method === 'dialog') {   //打开选择文件夹对话框
            handleDialog( event );
        } else if (method === 'fileDialog') {
            handleFileDialog( event );
        } else if (method === 'init') {     //初始化关键文件
            handleInit( value );
        } else if (method === 'upload') {       //上传文件
            handleUpload( value );
        } else if (method === 'getFile') {      //爬取文件
            handleGetFile( value );
        } else if (method === 'test' ) {        //测试
            test( value );
        } else if (method === '' ) {

        }

    })
    
}

function test( value ) {

    
}

//弹出 选取文件夹 对话框，返回文件夹路径
function handleDialog( event ) {
    dialog.showOpenDialog(mainWindow, {
        properties: [ 'openDirectory' ],
        defaultPath: __dirname
    }, function(path) {
        if(path) {
            event.sender.send('path', path);
        } else {
            event.sender.send('path', 'please select a path')
        }
    })
}

//弹出 选取文件 对话框，返回文件路径
function handleFileDialog ( event ) {
    dialog.showOpenDialog(mainWindow, {
        properties: [ 'openFile' ],
        defaultPath: __dirname
    }, function(path) {
        if(path) {
            event.sender.send('path', path);
        } else {
            event.sender.send('path', 'please select a path')
        }
    })
}
//处理 一键生成初始化文件
function handleInit( value ) {
    //保证传入的是一个配置对象
    let conf = core.isObject(value) ? value : {}

    init( conf );
}

//处理爬取文件
function handleGetFile( value ) {
    //保证传入的是一个配置对象
    let conf = core.isObject(value) ? value : {};

    getFile( conf );
}

//处理 模板上传
function handleUpload( value ) {
    //保证传入的是一个配置对象
    let conf = core.isObject(value) ? value : {};

    upload( conf );
}


// 定义一个创建浏览器窗口的方法
function createWindow(){
    // 创建一个浏览器窗口对象，并指定窗口的大小
    mainWindow=new BrowserWindow({
        width:1000,
        height:700
    });

    // 通过浏览器窗口对象加载index.html文件，同时也是可以加载一个互联网地址的
    mainWindow.loadURL('file://'+__dirname+'/index.html'); 
    // 同时也可以简化成：mainWindow.loadURL('./index.html');

    // 监听浏览器窗口对象是否关闭，关闭之后直接将mainWindow指向空引用，也就是回收对象内存空间
    mainWindow.on("closed",function(){
        mainWindow = null;
    });

    mainWindow.openDevTools();
    //自己写的方法流程入口；
    entry();

}

// 监听应用程序对象是否初始化完成，初始化完成之后即可创建浏览器窗口
app.on("ready",createWindow);

// 监听应用程序对象中的所有浏览器窗口对象是否全部被关闭，如果全部被关闭，则退出整个应用程序。该
app.on("window-all-closed",function(){
    // 判断当前操作系统是否是window系统，因为这个事件只作用在window系统中
    if(process.platform!="darwin"){
        // 退出整个应用程序
        app.quit();
    }
});

// 监听应用程序图标被通过点或者没有任何浏览器窗口显示在桌面上，那我们应该重新创建并打开浏览器窗口，避免Mac OS X系统回收或者销毁浏览器窗口
app.on("activate",function(){
    if(mainWindow===null){
        createWindow();
    }
});


