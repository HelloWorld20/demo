"use strict"
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

module.exports = {
	//webContent发送main消息到main Process。callback是处理main Process返回消息的方法
	send: (message, callback) => {
		ipcRenderer.send('main', message);
		ipcRenderer.once('main-reply', callback);
	},

	mainListener: (callback) => {
	    ipcMain.on('main', callback);
	},

	removeMainListener: (callback) => {
	    ipcMain.removeListener('main', callback);
	}
}