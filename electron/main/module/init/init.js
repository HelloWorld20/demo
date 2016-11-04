/**
 * author: weijianghong
 * date: 2016-10-18
 * description: 根据conifig.js文件快速生成关键文件。
 */

"use strict"
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var rimraf = require('rimraf');
var superagent = require('superagent');

const mkdir = require('../mkdir/mkdir.js');

let core = require('./js/core.js');
let localConfig = require('./js/config.js');


var createFiles = function (conf) {
	return function () {
		let config = core.extend( conf, localConfig );
		let deliveryTplId = config.yjmbID;
		var converted = {}
		for(var i in config) {
			//都转成了二进制了。
			converted[i] = iconv.encode(config[i], 'gb2312')
		}

		createConfigFiles(converted.fullName, config);

		createTemplateStorageFile(config.webUrl, config.wapUrl, config.fullName, config.sourceFileMap);

		createTempleteFiles(config.fullName, config);
	}
}



//生成配置文件ParseConfig.xml和ResourcePackageConfig.xml
function createConfigFiles(fullName, config) {
	if(!config.apiType) {
		new Error('没有指定接口类型');
		return;
	}
	var sourceFileMap = config.sourceFileMap;
	var apiType = config.apiType.toLowerCase();
	//不需要操作时，不用转码，直接写入文件。
	var parseConfigTpl = fs.readFileSync(sourceFileMap[apiType]);


	//读取默认的配置文件，然后用业务全称替换标记处。
	var sourceConfigTpl = fs.readFileSync(sourceFileMap['resourceConfig'])
	//转码
	var gbSourceConfig = iconv.decode(sourceConfigTpl, 'gb2312');
	fullName = iconv.decode(fullName, 'gb2312');
	//替换
	gbSourceConfig = gbSourceConfig.replace(/{{fullName}}/g, fullName);
	//还原
	var buffSourceConfig = iconv.encode(gbSourceConfig, 'gb2312');

	

	//输出
	fs.writeFileSync('./'+fullName+'/ParseConfig.xml', parseConfigTpl)
	fs.writeFileSync('./'+fullName+'/ResourcePackageConfig.xml', buffSourceConfig)
	if(apiType === 'bill') {
		var configBuff = fs.readFileSync(sourceFileMap['config'])
		fs.writeFileSync('./'+fullName+'/'+config.shortName+'.config', configBuff)
	}
}

//填充两个模板内容
function createTempleteFiles(fullName, config) {

	//爬取静态模板内容然后填充
	superagent.get(config.webUrl)
		.end(function(err, res) {
			core.handleError(err, '获取web模板错误，请检查wap模板地址是否有误');
			fs.writeFileSync('./'+fullName+'/'+ fullName +'.html', iconv.encode(res.text, 'gb2312'))
		})

	superagent.get(config.wapUrl)
		.end(function(err, res) {
			core.handleError(err, '获取wap模板错误，请检查wap模板地址是否有误');		
			fs.writeFileSync('./'+fullName+'/'+ fullName +'.qvga', iconv.encode(res.text, 'gb2312'))
		})
	return;	
}
//生成模板地址文件
function createTemplateStorageFile(webUrl, wapUrl, fullName, sourceFileMap) {
	var tpl = fs.readFileSync( sourceFileMap['tpl'] , {coding: 'UTF-8'}, function() {})

	var $ = cheerio.load(tpl);

	var result = '';

	if(webUrl) {
		$('#web').attr('href', webUrl);
		$('#web').html(webUrl);
	} else {
		$('#web').html('没有web模板地址');
	}
	
	if(wapUrl) {
		$('#wap').attr('href', wapUrl);
		$('#wap').html(wapUrl);
	} else {
		$('#wap').html('没有wap模板地址');
	}

	if(fullName) {
		$('#head').html(fullName)
	} else {
		$('#head').html("模板地址");
	}
	
	result = $("html").html();

	fs.writeFileSync('./'+fullName+'/模板地址.html', result, {coding: 'UTF-8'}, function() {})
}


module.exports = (config) => {

	mkdir( config.fullName, createFiles( config ) );

}



