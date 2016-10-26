"use strict"
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

module.exports = {
	//webContent发送main消息到main Process。callback是处理main Process返回消息的方法
	send: (message, callback) => {
		ipcRenderer.send('main', message);
		if(callback) ipcRenderer.once('main-reply', callback);
	},

	mainListener: (callback) => {
	    ipcRenderer.on('main', callback);
	},

	removeMainListener: (callback) => {
	    ipcRenderer.removeListener('main', callback);
	},

	initListener: (name, callback) => {
		ipcRenderer.on(name, callback);
	},

	removeListener: (name, callback) => {
		ipcRenderer.removeListener(name, callback);
	}
}