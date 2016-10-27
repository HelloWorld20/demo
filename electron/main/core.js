"use strict"

const electron = require('electron');
const ipcMain = electron.ipcMain;
var iconv = require('iconv-lite');
var fs = require('fs');

module.exports = {
	//读取前台传来的值，handleRes：处理信息的方法；reply：回执信息。
	get: (handleRes, reply) => {
		ipcMain.on('main', (event, res) => {
		    handleRes(event, res);
		    if(reply) event.sender.send('main-reply', reply);
		})
	},
	//字符串转换成二进制。
	str2Buff: (str) => {
		return iconv.encode(str, 'gb2312')
	},
	//二进制转化成gb2312编码的字符串。
	buff2Str: (buff) => {
		return iconv.decode(buff, 'gb2312')
	},

	loadFile: (filePath, errMsg) => {
		if(!errMsg) {
			errMsg = 'loadFile error...'
		}
		fs.readFileSync(filePath, {}, function(err) {
			if(err) {
				console.log(errMsg);
				throw new Error('loadFile Error: ' + err);
			} else {
				return true;
			}
		})
	},

	writeFile: (filePath, content, errMsg) => {
		if(!errMsg) {
			errMsg = 'writeFile error...'
		}
		fs.writeFileSync(filePath, content, {}, function(err) {
			if(err) {
				console.log(errMsg);
				throw new Error('loadFile Error: ' + err);
			} else {
				return true;
			}
		})
	},

	handleError: (err, msg) => {
		if(err) {
			console.error(err);
			throw new Error('[Custom isError: ' + msg + ']')
		}
	}
}
