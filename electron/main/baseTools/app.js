/**
 * 基础工具程序模块入口；
 */

"use strict"

const init = require('./app/init.js');
const getFile = require('./app/getFile.js');
const upload = require('./app/upload.js');

module.exports = (function() {
	getFile();
})()

// no such file or directory, open E:\demo\demo\electron\main\baseTools\tpl\ParseConfig_bill.xml