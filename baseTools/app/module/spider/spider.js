/**
 * description：登录获取cookie模块
 * author: weijianghong
 * date: 2016-11-8
 */

"use strict"

const superagent = require('superagent');
const config = require('../../lib/config.js');
const core = require('../../lib/core.js');

module.exports = (callback, isTest) => {
	let loginServer = '',
		loginMessage = ''

	if( isTest ) {
		//测试线地址
		loginMessage = config.loginMessageTest;
		loginServer = config.loginServerTest;
	} else {
		loginMessage = config.loginMessage;
		loginServer = config.loginServer;
	}

	superagent.post(loginServer)	
			.query(loginMessage)
			.end((err, res) => {
				core.handleError(err, 'login fail...');
				let cookie = res.headers['set-cookie'];
				if( !cookie ) throw new Error('系统未正确响应，登录时没有返回set-cookie');
				
				//组合cookie
				let cookieCombine = '';
				//cookie里只需要LoggedName和ASP.NET_SessionId就可以，多点无所谓；
				cookieCombine = cookie[0] + '; LoggedName=' + config.username; 

				//如果参数是函数，生成的组合cookie传给回调函数
				if( core.isFunction( callback ) )  callback( cookieCombine );

			})
}

//B0AA38EEB4DA24AC7A89A51656320621
//B0AA38EEB4DA24AC7A89A51656320621