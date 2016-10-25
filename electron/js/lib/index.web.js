"use strict"

const core = require('./js/core.web.js');
const config = require('./js/config.web.js');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer


setTimeout(() => core.send('message from webContent', function(event, res) {
	console.log(res);
}), 3000)