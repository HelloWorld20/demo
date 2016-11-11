/**
 * 生成原始配置文件
 */

"use strict"

const fs = require('fs');
const core = require('./lib/core.js')
const config = require('./lib/config.js');
const mkdir = require('./module/mkdir/mkdir.js');
const createDefault = require('./module/createDefault/createDefault.js');

module.exports = (function(){
	mkdir( config.fullName, createFiles );
})()

function createFiles() {
	createDefault.createConfigFiles();
	createDefault.createTempleteFiles();
	createDefault.createTemplateStorageFile();
}