/**
 * 生成原始配置文件
 */

"use strict"

const fs = require('fs');
const core = require('./lib/core.js');
const config = require('./config.js');
const mkdir = require('./module/mkdir.js');
const createDefault = require('./module/createDefault.js');

/**
 * [生成原始配置文件]
 * @param  {[object]} conf [自定义配置文件]
 * @return {[type]}      [description]
 */
module.exports = ( conf ) => {
	console.log('init.js');

	//就在入口处和并配置文件；
	let confCombine = core.extend( config, temp );

	mkdir( confCombine.fullName, () => {
		createFiles( confCombine )
	});

}

function createFiles( conf ) {
	createDefault.createConfigFiles( conf );
	createDefault.createTempleteFiles( conf );
	createDefault.createTemplateStorageFile( conf );
}