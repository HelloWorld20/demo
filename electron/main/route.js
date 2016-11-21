/**
 * description：处理渲染进程传过来的命令方法合集
 * author: weijianghong
 * date: 2016-11-20
 */

"use strict"

const core = require('./lib/core.js');

const {dialog}=require("electron");
const init = require('./baseTools/app/init.js');
const getFile = require('./baseTools/app/getFile.js');
const upload = require('./baseTools/app/upload.js');
let config = require('./baseTools/app/config.js');

module.exports = {
	test: ( value ) => {
		console.log('test: ', value);
	},

	//弹出 选取文件夹 对话框，返回文件夹路径
	handleDialog: ( event, mainWindow ) => {
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
	},

	//弹出 选取文件 对话框，返回文件路径
	handleFileDialog: ( event, mainWindow ) => {
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
	},

	//处理 一键生成初始化文件
	handleInit: ( value ) => {
	    //保证传入的是一个配置对象
	    let conf = core.isObject(value) ? value : {}

	    init( conf );
	},

	//处理爬取文件
	handleGetFile: ( value ) => {
	    //保证传入的是一个配置对象
	    let conf = core.isObject(value) ? value : {};

	    getFile( conf );
	},

	//处理 模板上传
	handleUpload: ( value ) => {
	    //保证传入的是一个配置对象
	    let conf = core.isObject(value) ? value : {};

	    upload( conf );
	}, 

	//覆盖总配置文件
	handleSetDefaultConf: ( value ) => {
		console.log( 'handleSetDefaultConf', value);
		let result = core.extend( config , value );
		console.log(__dirname+'/baseTools/app/config.js');
		console.log(config.get('name'))
		config.set('name', 'wulijiao');
		console.log(config.get('name'))
		// core.writeFile(__dirname+'/baseTools/app/config.js', result, 'set default config file error...')
	}

}