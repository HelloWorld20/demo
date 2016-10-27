"use strict"

const core = require('./js/core.web.js');
const config = require('./js/config.web.js');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const dom = require('./js/dom.web.js');
const $ = dom.$;

let store = {
	config: {},
	webTpl: '',
	wapTpl: ''
}

function init() {
	
	dom.initFileReader('#uploadHtml', (e) => {
		store.webTpl = e.target.result;
	})

	dom.initFileReader('#uploadQvga', (e) => {
		store.wapTpl = e.target.result;
	})	

	//阻止表单默认事件
	$("form")[0].onsubmit = function(e) {
		e.preventDefault();
	}

}


function initEvent() {
	//监听path事件
	core.initListener('path', (event, res) => {
		$("#path")[0].innerText = res;
	});

	$("#selectPath")[0].onclick = () => {
		core.send({method: 'dialog'});
	}

	$("#save")[0].onclick = () => {
		store.config = dom.getConfig("#config tbody input");
	}

	$("#init")[0].onclick = () => {
		core.send({method: 'init'})
	}
}

init();
initEvent();