"use strict"

const core = require('./js/core.web.js');
const config = require('./js/config.web.js');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const dom = require('./js/dom.web.js');
const $ = dom.$;


dom.initFileReader('#uploadHtml', (e) => {
	console.log(e.target.result);
})

dom.initFileReader('#uploadQvga', (e) => {
	console.log(e.target.result);
})




function initEvent() {
	core.initListener('path', (event, res) => {
		$("#path")[0].innerText = res;
	});

	$("#selectPath")[0].onclick = () => {
		console.log('click')
		core.send({method: 'dialog'});
	}
}

initEvent();