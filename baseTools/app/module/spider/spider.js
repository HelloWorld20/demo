/**
 * description：登录获取cookie模块
 * author: weijianghong
 * date: 2016-11-8
 */

"use strict"

const superagent = require('superagent');
const config = require('../../lib/config.js');
const core = require('../../lib/core.js');

module.exports = (callback) => {

	superagent.post(config.loginServer)	
			.query(config.loginMessage)
			.end((err, res) => {
				core.handleError(err, 'login fail...');
				let cookie = res.headers['set-cookie'];
				if( !cookie ) throw new Error('系统未正确响应，登录时没有返回set-cookie');

				//组合cookie
				let cookieCombine = '';
				cookie.forEach( item => {
					cookieCombine += item;
					cookieCombine += ';';
				})
				
				//如果参数是函数，生成的组合cookie传给回调函数
				if( core.isFunction( callback ) )  callback( cookieCombine );

			})
}