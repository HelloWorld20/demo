"use strict"

const {ipcRenderer} = require('electron');

const core = require('./app/lib/core.js');
const config = require('./main/baseTools/app/config.js');

//用于存储数据，以后要做成模块
// let store = {}

let $ = core.$;
let $$ = core.$$;

let counter = 0;

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
		let nav = $('#nav');

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

	//初始化拖拽方法。只是要获取文件路径不需要readFile API
	initDrag: function( selector, isLight, callback ) {
		
		let elem = $(selector);
		elem.counter = 0;

		$(selector).ondragenter = e => {
			e.preventDefault();
			e.stopPropagation();

			if(!isLight) return;

			elem.counter++;
			core.addClass( elem, 'highLight' )
		};

		$(selector).ondragleave = e => {
			e.preventDefault();
			e.stopPropagation();

			if(!isLight) return;

			elem.counter--;
			if(elem.counter === 0) {
				core.removeClass( elem, 'highLight' )			
			}
		};

		$(selector).ondragover = e => {
			e.preventDefault();
			e.stopPropagation();
		};

		$(selector).ondrop = e => {
			e.preventDefault();
			e.stopPropagation();
			
			elem.counter--;
			if(elem.counter === 0) {
				core.removeClass( elem, 'highLight' )
			}
			if(core.isFunction(callback)) callback(e);
		}
		
	},

	//挂载fileReader；
	// initReader: function( target , callback) {
	// 	let reader = new FileReader();

	// 	//当input包含的file有改变时才会触发
	// 	target.addEventListener('change', readFileText, false)
		
	// 	function readFileText() {
	// 		let file = this.files[0];
				
	// 		reader.readAsText(file);
	// 		reader.onload = function(e) {
	// 			if( core.isFunction( callback ) ) callback(e.target.result);
	// 		}
	// 	}
	// },

	//销毁fileReader
	destroyReader: selector => {
		$(selector).onchange = null;
	},

	//把页面内的配置数据转换成对象；
	getConfig: selector => {
		let domInputs = $$(selector);
		let result = {};
		domInputs.forEach( dom => {
			result[dom.getAttribute('name')] = dom.value;
		})

		return result;
	},

	//把配置内容写入前端页面
	setConfig: function() {
		let config = this.getDefaultConf();
		for(let i in config) {
			let elems = $$('input[name="'+i+'"]')
			if(elems !== 0) {
				elems.forEach( item => {
					item.setAttribute('value', config[i])
				} )
			}
		}
	},

	//读取默认配置文件
	getDefaultConf: () => {
		return core.extend({}, config);
	},

	//设置默认配置文件
	setDefaultConf: function( conf ) {
		this.send( {method: 'setDefaultConf', value: conf} );
	},

	// handleReadHtml: res => {
	// 	console.log(res);
	// },

	// handleReadQvga: res => {
	// 	console.log(res);
	// },

	//点击之后弹出文件夹对话框，然后返回路径
	initPathSelector: ( selector, callback ) => {
		$(selector).addEventListener('click', function() {
			main.send({method: 'dialog'});

			//路径包含在res里
			main.initListenerOne('path', (event, res) => {
				if(core.isFunction(callback)) callback( res );
			});

		}, false)
	},
	//再来一个，点击弹出文件选择对话框，然后返回路径
	initFileSelector: ( selector, callback ) => {
		$(selector).addEventListener('click', function() {
			main.send({method: 'fileDialog'});

			//路径包含在res里
			main.initListenerOne('path', (event, res) => {
				if(core.isFunction(callback)) callback( res );
			});

		}, false)
	}


}


// 入口
;(function(main) {

let htmlTpl, qvgaTpl, initConf, getFileConf, uploadConf;



main.initTabs();
main.disableSubmit();
main.setConfig();		//页面加载时加载默认配置

main.setDefaultConf({name: 'wei', value: 5});

//初始化拖拽方法
main.initDrag('body', false, e => true); 	//禁止拖拽到其他地方时跳转
main.initDrag('#dropHtml', true, (e) => {
	//有个小坑，必须直接读取到e.dataTransfer.files才能看到文件内容。直接打印e看不到
	let filePath = e.dataTransfer.files[0].path;

	if( filePath && (filePath.slice(-5).toLowerCase()) === '.html') {
		$("#uploadHtmlInput").setAttribute('value', filePath);
	}
	return false;
});
main.initDrag('#dropQvga', true, (e) => {
	let filePath = e.dataTransfer.files[0].path;

	if( filePath && (filePath.slice(-5).toLowerCase()) === '.qvga') {
		$("#uploadQvgaInput").setAttribute('value', filePath);
	}
	return false;
});


// 挂载fileReader
// main.initReader( $("#uploadHtmlDrop") , main.handleReadHtml );
// main.initReader( $("#uploadQvgaDrop") , main.handleReadQvga );


//初始化 选择文件 按钮,注意是文件，不是文件夹
main.initFileSelector( '#uploadHtml', res => {
	$("#uploadHtmlInput").setAttribute('value', res);
})
main.initFileSelector( '#uploadQvga', res => {
	$("#uploadQvgaInput").setAttribute('value', res);
})

//页面加载时读取默认配置文件



//绑定一键生成初始文件按钮；
$("#init").onclick = function(e) {

	let conf = main.getConfig( '#initPage tbody input' );

	main.send( {method: 'init', value: conf} );

}
//绑定生产线爬取按钮；
$("#getFile").onclick = function(e) {

	let conf = main.getConfig( '#getFilePage tbody input' );

	main.send( {method: 'getFile', value: conf} );

}
//绑定一键上传邮件模板按钮；
$("#upload").onclick = function(e) {

	let conf = main.getConfig( '#uploadFilePage tbody input' );

	main.send( {method: 'upload', value: conf} );

}


})(main);
