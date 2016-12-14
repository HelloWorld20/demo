/**
 * description：处理渲染进程传过来的命令方法合集
 * author: weijianghong
 * date: 2016-11-20
 */

"use strict"

const core = require('./lib/core.js');
const {dialog}=require("electron");
const iconv = require('iconv-lite');

const init = require('./baseTools/app/init.js');
const getFile = require('./baseTools/app/getFile.js');
const upload = require('./baseTools/app/upload.js');
const sendMail =require('./baseTools/app/sendMail.js');

let tConfig = require('./tConfig.json');

module.exports = {
	test: ( value ) => {
		core.log('test: ', value);
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

	//处理，发送邮件组件
	handleSendMail: ( value ) => {
		//保证传入的是一个配置对象
	    let conf = core.isObject(value) ? value : {};

	    sendMail( conf, function() {
	    	core.showMsg('成功', '邮件发送已完成。');
	    })
	},

	//覆盖总配置文件
	handleSetLocalConf: ( value ) => {
		let result = core.extend( tConfig, value );

		core.writeFile(__dirname+'/tConfig.json', JSON.stringify(result, null, 4), 'set default config file error...')
	},

	/**
	 * [处理eml文件，转换成html]
	 * @param  {[type]} value [eml文件路径]
	 * @return {[type]}       [html文件内容]
	 */
	handleConverEml: (value) => {
		let eml = core.loadFile(value, 'read eml file fail....');

		let emlArr = escape(iconv.decode(eml, 'utf-8')).split('%0D%0A');

		let flagBlank = false;
		let flagText = false;
		
		let result = "";
		emlArr.forEach(item => {

			if( item.indexOf('text/html') !== -1 ) {	//找到开始的关键字
				flagText = !flagText;
			}
			//如果找到text/html之后再找到空格之后就可以读值了。
			if(flagText && item === "") {		
				flagBlank = !flagBlank;
			}


			if(flagBlank && flagText) {
				//开始读取值
				result += unescape(item)
			}

			//如果再遇到空白
			if(flagBlank && flagText && item === "") {				
				return;
			}

		})

		let resultGbBuff = iconv.encode(result, 'base64');

		core.writeFile('./test.html', resultGbBuff, "convert eml to html fail....");

		core.log('html邮件生成完成。。。');

	}
	

}