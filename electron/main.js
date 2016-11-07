// 载入electron模块
const {app,BrowserWindow,ipcMain,dialog}=require("electron");
// 创建应用程序对象

// 创建一个浏览器窗口，主要用来加载HTML页面

// 声明一个BrowserWindow对象实例

const core = require('./main/core.js');
const spider = require('./main/module/spider/spider.js');
const initDefalt = require('./main/module/init/init.js');


let mainWindow;

function init() {
    //挂载main传输事件，接收method，进行处理
    core.get(function(event, res) {
        let method = res.method;
        let value = res.value;

        if(method === 'dialog') {   //打开选择文件夹对话框
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
        } else if(method === 'init') {  //初始化原始文件

            initFiles( value );

        } else if(method === 'spider') {    //投递平台爬取文件

            initSpider( value );

        } else if(method === '') {

        }

    })
    
}

//构造spider 需要的参数，然后调用。
function initSpider( value ) {

    spider( value );
}

//构造生成原始文件需要的参数，然后调用。
function initFiles( value ) {

    initDefalt( value )
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

    //自己写的方法流程入口；
    init();

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


