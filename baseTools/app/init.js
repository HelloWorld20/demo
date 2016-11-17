/**
 * 生成原始配置文件
 */

"use strict"

const fs = require('fs');
const config = require('./config.js');
const mkdir = require('./module/mkdir.js');
const createDefault = require('./module/createDefault.js');

module.exports = (function(){
	mkdir( config.fullName, createFiles );
})()

function createFiles() {
	createDefault.createConfigFiles();
	createDefault.createTempleteFiles();
	createDefault.createTemplateStorageFile();
}