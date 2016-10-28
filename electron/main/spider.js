/**
 * author: weijianghong
 * date: 2016-10-24
 * description: 根据提供的模板ID爬取投递平台上已经配置好的模板。
 */

"use strict"
let superagent = require('superagent');

module.exports = (core, config) => {
	let fullName = config.fullName;
	//先登录，获取set-cookie里的sessionID等值。
	superagent.post(config.loginServer)	
		.query(config.loginMessage)
		.end((err, res) => {
			core.handleError(err, 'login fail...');

			let cookie = res.headers['set-cookie'];
			if(!cookie) throw new Error('登录时没有返回set-cookie');

			let cookieCombine = '';
			cookie.forEach( item => {
				cookieCombine += item;
				cookieCombine += ';';
			})
			//带入登录的sessionID拿到template模板。
			superagent.post(config.templateView)
				.query('.hdTemplateID=' + config.yjmbID)
				.set('cookie', cookieCombine)	//需要登录时的cookie
				.end((err, res) => {
					core.handleError(err, 'Get' + config.templateView + 'error!')
					
			        core.writeFile('./'+fullName+'/'+ fullName +'.html', core.str2Buff(JSON.parse(res.text).RecordSet.DataTemplate));
			        core.writeFile('./'+fullName+'/'+ fullName +'.qvga', core.str2Buff(JSON.parse(res.text).RecordSet.Qvga))
		    })
		})
}