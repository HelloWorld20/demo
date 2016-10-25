"use strict"

const electron = require('electron');
const ipcMain = electron.ipcMain;

module.exports = {
	//读取前台传来的值，handleRes：处理信息的方法；reply：回执信息。
	get: (handleRes, reply) => {
		ipcMain.on('main', (event, res) => {
		    handleRes(event, res);
		    event.sender.send('main-reply', reply);
		})
	}
}
