"use strict"

const {ipcRenderer} = require('electron');

const core = require('./app/lib/core.js');

//用于存储数据，以后要做成模块
let store = {}

let $ = core.$;
let $$ = core.$$;

let main = {
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

	initListenerOne: (name, callback) => {
		ipcRenderer.once(name, callback);
	},

	initListener: (name, callback) => {
		ipcRenderer.on(name, callback);
	},

	removeListener: (name, callback) => {
		ipcRenderer.removeListener(name, callback);
	},


	//////////////////////////////
	// 初始化切换选项卡功能；
	initTabs: function() {
		let nav = core.$('#nav');

		nav.onclick = function(e) {
			e.preventDefault();

			if(e.target.tagName !== 'A') return;

			let panes = $$('.tab-pane');
			let tabs = $$('#nav li');
			tabs.forEach(function( item ) {
				core.removeClass( item, 'active');
			})
			panes.forEach(function( item ) {
				core.addClass( item, 'hide');
			})

			core.addClass( e.target.parentNode, 'active' );

			let paneId = e.target.getAttribute('data-href');

			core.removeClass( $(paneId), 'hide');
		}
	},
	//禁止表单默认提交事件
	disableSubmit: function () {
		$$("form").forEach( item => {
			item.onsubmit = e => {
				e.preventDefault();
			}
		})
	},

	//挂载fileReader；
	initReader: function( target , callback) {
		let reader = new FileReader();

		//当input包含的file有改变时才会触发
		target.addEventListener('change', readFileText, false)
		
		function readFileText() {
			let file = this.files[0];
				
			reader.readAsText(file);
			reader.onload = function(e) {
				if( core.isFunction( callback ) ) callback(e.target.result);
			}
		}
	},

	//销毁fileReader
	destroyReader: selector => {
		$(selector).onchange = null;
	},

	//把页面内的配置数据转换成对象；
	getConfig: selector => {
		let domInputs = $$(selector);
		let config = {};
		domInputs.forEach( dom => {
			config[dom.getAttribute('name')] = dom.value;
		})

		return config;
	},

	handleReadHtml: res => {
		store.html = res;
	},

	handleReadQvga: res => {
		store.qvga = res;
	},

	//点击之后弹出文件夹对话框，然后返回路径
	initPathSelector: ( selector, callback ) => {
		$(selector).addEventListener('click', function() {
			main.send({method: 'dialog'});

			//路径包含在res里
			main.initListenerOne('path', (event, res) => {
				callback( res );
			});

		}, false)
	},
	//再来一个，点击弹出文件选择对话框，然后返回路径
	initFileSelector: ( selector, callback ) => {
		$(selector).addEventListener('click', function() {
			main.send({method: 'fileDialog'});

			//路径包含在res里
			main.initListenerOne('path', (event, res) => {
				callback( res );
			});

		}, false)
	}


}


// 入口
;(function(main) {

let htmlTpl, qvgaTpl;


main.initTabs();
main.disableSubmit();

//挂载fileReader
main.initReader( $("#uploadHtml") , main.handleReadHtml );
main.initReader( $("#uploadQvga") , main.handleReadQvga );



//初始化 选择文件夹 按钮
main.initPathSelector( '#selectPath', res => {
	console.log(res);
})

//初始化 选择文件 按钮,注意是文件，不是文件夹
main.initFileSelector( '#uploadHtml', res => {
	$("#uploadHtmlInput").setAttribute('value', res);
})
main.initFileSelector( '#uploadQvga', res => {
	$("#uploadQvgaInput").setAttribute('value', res);
})


//绑定一键生成初始文件按钮；
$("#init").onclick = function(e) {

	let initConf = main.getConfig( '#initPage tbody input' );

	main.send( {method: 'init', value: initConf} );

}
//绑定生产线爬取按钮；
$("#getFile").onclick = function(e) {

	let getFileConf = main.getConfig( '#getFilePage tbody input' );

	main.send( {method: 'getFile', value: getFileConf} );

}
//绑定一键上传邮件模板按钮；
$("#upload").onclick = function(e) {

	let uploadConf = main.getConfig( '#uploadFilePage tbody input' );

	main.send( {method: 'upload', value: uploadConf} );

}
})(main);
