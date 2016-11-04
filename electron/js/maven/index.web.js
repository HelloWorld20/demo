"use strict"

const core = myRequire('./js/core.web.js');
const config = myRequire('./js/config.web.js');
const electron = myRequire('electron');
const ipcRenderer = electron.ipcRenderer;

const dom = myRequire('./js/dom.web.js');
const $ = dom.$;

function init() {
	
	dom.initFileReader('#uploadHtml', (e) => {
		store.webTpl = e.target.result;
	})

	dom.initFileReader('#uploadQvga', (e) => {
		store.wapTpl = e.target.result;
	})	

	//阻止表单默认事件
	$("form").forEach( item => {
		item.onsubmit = function(e) {
			e.preventDefault();
		}
	})

}


function initEvent() {
	//监听path事件
	core.initListener('path', (event, res) => {
		$("#path")[0].innerText = res;
	});

	//
	$("#selectPath")[0].onclick = () => {
		core.send({method: 'dialog'});
	}

	//
	$("#init")[0].onclick = () => {
		let conf = dom.getConfig("#defaultConf tbody input");

		core.send({method: 'init', value: conf})
	}

	//
	$("#spider")[0].onclick = () => {
		let conf = dom.getConfig("#spiderConf tbody input");

		core.send({method: 'spider', value: conf});
	}
}

init();
initEvent();