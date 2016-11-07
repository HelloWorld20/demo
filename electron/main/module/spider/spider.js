/**
 * author: weijianghong
 * date: 2016-11-7
 * description: 根据提供的模板ID爬取投递平台上已经配置好的模板。
 */

"use strict"
const superagent = require('superagent');
const core = require('./js/core.js');
const localConfig = require('./js/config.js');
const mkdir = require('../mkdir/mkdir.js');

module.exports = (conf) => {

	mkdir( conf.fullName, init( conf ) );
}

let init = function ( conf ) {
	return function () {
		let config = core.extend(conf, localConfig);
		//先登录，获取set-cookie里的sessionID等值。
		superagent.post(config.loginServer)	
			.query(config.loginMessage)
			.end((err, res) => {
				core.handleError(err, 'login fail...');
				let cookie = res.headers['set-cookie'];
				if( !cookie ) throw new Error('系统未正确响应，登录时没有返回set-cookie');

				let cookieCombine = '';
				cookie.forEach( item => {
					cookieCombine += item;
					cookieCombine += ';';
				})
				
				if( config.yjmbID ) {
					//带入登录的sessionID拿到template模板。
					getTemplateFile( core, config, cookieCombine );
				} else {
					throw new Error('没有邮件模板ID')
				}

				if( config.yjfzzyID ) {
					//获取邮件封装资源；
					getConfigFile( core, config, cookieCombine );
				} else {
					throw new Error('没有邮件封装资源ID')
				}

				return true;
			})
	}
}


function getTemplateFile( core, config, cookieCombine ) {
	let fullName = config.fullName;
	superagent.post( config.templateView )
			.query( '.hdTemplateID=' + config.yjmbID )
			.set( 'cookie', cookieCombine )	//需要登录时的cookie
			.end((err, res) => {
				core.handleError(err, 'Get' + config.templateView + 'error!');

				let RecordSet = JSON.parse(res.text).RecordSet;
				if(!RecordSet) throw new Error("没有返回邮件模板内容，检查ID是否有误");

		        core.writeFile('./'+fullName+'/'+ fullName +'.html', core.str2Buff(JSON.parse(res.text).RecordSet.DataTemplate));
		        core.writeFile('./'+fullName+'/'+ fullName +'.qvga', core.str2Buff(JSON.parse(res.text).RecordSet.Qvga))
	    })
}

function getConfigFile( core, config, cookieCombine ) {
	let fullName = config.fullName;
	superagent.post(config.ResourceView)
			.query('.hdResourceID=' + config.yjfzzyID)
			.set('cookie', cookieCombine)	//需要登录时的cookie
			.end((err, res) => {
				core.handleError(err, 'Get' + config.ResourceView + 'error!')
				
				let RecordSet = JSON.parse(res.text).RecordSet;
				if(!RecordSet) throw new Error("没有返回邮件封装资源内容，检查ID是否有误");

		        core.writeFile('./'+fullName+'/ParseConfig.xml', core.str2Buff(RecordSet.ParseConfig));
		        core.writeFile('./'+fullName+'/ResourcePackageConfig.xml', core.str2Buff(RecordSet.ResourceConfig));
	    })
}