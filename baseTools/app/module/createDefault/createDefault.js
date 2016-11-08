/**
 * 生成原始配置文件。
 * author: weijianghong
 * date: 2016-10-18
 */
"use strict"

const fs = require('fs');
const superagent = require('superagent');
const config = require('../../lib/config.js');
const core = require('../../lib/core.js');


module.exports = {

	//生成配置文件ParseConfig.xml和ResourcePackageConfig.xml
	createConfigFiles: () => {
		let fullName = config.fullName;
		if(!config.apiType) {
			new Error('没有指定接口类型');
			return;
		}
		let sourceFileMap = config.sourceFileMap;
		let apiType = config.apiType.toLowerCase();
		//不需要操作时，不用转码，直接写入文件。
		let parseConfigTpl = fs.readFileSync(sourceFileMap[apiType]);


		//读取默认的配置文件，然后用业务全称替换标记处。
		let sourceConfigTpl = fs.readFileSync(sourceFileMap['resourceConfig'])
		//转码
		let gbSourceConfig = core.buff2Str(sourceConfigTpl);
		// fullName = core.buff2Str(fullName);
		//替换
		gbSourceConfig = gbSourceConfig.replace(/{{fullName}}/g, fullName);
		//还原
		let buffSourceConfig = core.str2Buff(gbSourceConfig);

		//输出
		fs.writeFile('./'+fullName+'/ParseConfig.xml', parseConfigTpl, function() {})
		fs.writeFile('./'+fullName+'/ResourcePackageConfig.xml', buffSourceConfig, function() {})
		if(apiType === 'bill') {
			let configBuff = fs.readFileSync(sourceFileMap['config'])
			fs.writeFile('./'+fullName+'/'+config.shortName+'.config', configBuff, function() {})
		}
	},

	//填充两个模板内容
	createTempleteFiles: () => {
		let fullName = config.fullName;
		//爬取静态模板内容然后填充
		superagent.get(config.webUrl)
			.end(function(err, res) {
				core.handleError(err, '获取web模板错误，请检查wap模板地址是否有误');
				fs.writeFile('./'+fullName+'/'+ fullName +'.html', core.str2Buff(res.text), function() {})
			})

		superagent.get(config.wapUrl)
			.end(function(err, res) {
				core.handleError(err, '获取wap模板错误，请检查wap模板地址是否有误');		
				fs.writeFile('./'+fullName+'/'+ fullName +'.qvga', core.str2Buff(res.text), function() {})
			})
		return;	
	}
}

