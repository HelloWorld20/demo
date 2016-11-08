//生成模板地址文件
"use strict"

const fs = require('fs');
const cheerio = require('cheerio');
const config = require('../../lib/config.js');

module.exports = {
	createTemplateStorageFile: () => {
		let webUrl = config.webUrl, 
			wapUrl = config.wapUrl, 
			fullName = config.fullName, 
			sourceFileMap = config.sourceFileMap;
		let tpl = fs.readFileSync( sourceFileMap['tpl'] , {coding: 'UTF-8'}, function() {})

		let $ = cheerio.load(tpl);

		let result = '';

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

		fs.writeFile('./'+fullName+'/模板地址.html', result, {coding: 'UTF-8'})
	}
}


