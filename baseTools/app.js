/**
 * 基础工具程序模块入口；
 */

"use strict"

const init = require('./app/init.js');
const getFile = require('./app/getFile.js');
const upload = require('./app/upload.js');

module.exports = (function() {
	init();
})()
