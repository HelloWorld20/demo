/**
 * description：从生产线上爬取文件
 * author：weijianghong
 * date：2016-11-08
 */

"use strict"

const superagent = require('superagent');
const config = require('./config.js');

const spider = require('./module/spider.js');
const mkdir = require('./module/mkdir.js');
const getFile = require('./module/getFile.js');
const createTemplateStorageFile = require('./module/createDefault.js').createTemplateStorageFile;

module.exports = (function() {
	console.log('getFile.js entry');
	
	//先创建目录，回调函数执行爬虫程序
	mkdir( config.fullName, runSpider )


	function runSpider() {
		//爬取程序，需要传入回调函数，回调函数填充spider程序登录获得的关键cookie值
		spider( entry )
	}

})();


function entry( cookieCombine ) {
	
	if( config.yjmbID ) {
		//带入登录的sessionID拿到template模板。
		getFile.getTemplateFile( cookieCombine );
	} else {
		throw new Error('没有邮件模板ID')
	}

	if( config.yjfzzyID ) {
		//获取邮件封装资源；
		getFile.getConfigFile( cookieCombine );
	} else {
		throw new Error('没有邮件封装资源ID')
	}
	//生成“模板地址.html”文件
	createTemplateStorageFile();

}


			