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
let tConfig = require('./tConfig.json');

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

	    init( conf, function() {
	    	core.showMsg('成功', '获取生产线配置文件已完成，请前往指定目录查看生成的文件');
	    } );
	},

	//处理爬取文件
	handleGetFile: ( value ) => {
	    //保证传入的是一个配置对象
	    let conf = core.isObject(value) ? value : {};

	    getFile( conf, function() {
	    	core.showMsg('成功', '获取生产线配置文件已完成，请前往指定目录查看生成的文件');
	    });
	},

	//处理 模板上传
	handleUpload: ( value ) => {
	    //保证传入的是一个配置对象
	    let conf = core.isObject(value) ? value : {};

	    upload( conf, function() {
	    	core.showMsg('成功', '模板上传已完成，请前往投递平台查看上传结果');
	    } );
	}, 

	//覆盖总配置文件
	handleSetLocalConf: ( value ) => {

		let result = core.extend( tConfig, value );

		core.writeFile(__dirname+'/tConfig.json', JSON.stringify(result, null, 4), 'set default config file error...')
	}

}