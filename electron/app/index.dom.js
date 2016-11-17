"use strict"

const core = require('./app/lib/core.js');

//用于存储数据，以后要做成模块
let store = {}


let $ = core.$;
let main = {
	// 初始化切换选项卡功能；
	initTabs: function() {
		let nav = document.querySelectorAll('#nav');

		nav[0].onclick = function(e) {
			e.preventDefault();

			if(e.target.tagName !== 'A') return;

			let panes = document.querySelectorAll('.tab-pane');
			let tabs = document.querySelectorAll('#nav li');
			tabs.forEach(function( item ) {
				core.removeClass( item, 'active');
			})
			panes.forEach(function( item ) {
				core.addClass( item, 'hide');
			})

			core.addClass( e.target.parentNode, 'active' );

			let paneId = e.target.getAttribute('data-href');

			core.removeClass( $(paneId)[0], 'hide');
		}
	},
	//禁止表单默认提交事件
	disableSubmit: function () {
		$("form").forEach( item => {
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
		$(selector)[0].onchange = null;
	},

	//把页面内的配置数据转换成对象；
	getConfig: selector => {
		let domInputs = $(selector);
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
	}


}


// 入口
;(function(main) {


let getFileConf, uploadConf, initConf, htmlTpl, qvgaTpl;

main.initTabs();
main.disableSubmit();

//挂载fileReader
main.initReader( $("#uploadHtml")[0] , main.handleReadHtml );
main.initReader( $("#uploadQvga")[0] , main.handleReadQvga );

//三个表的配置内容
getFileConf = main.getConfig( '#getFilePage tbody input' );
uploadConf = main.getConfig( '#uploadPage tbody input' );
initConf = main.getConfig( '#initPage tbody input' );

})(main);
