/**
 * main线程核心函数
 */

"use strict"

const electron = require('electron');
const ipcMain = electron.ipcMain;
const iconv = require('iconv-lite');
const fs = require('fs');

module.exports = {
	//读取前台传来的值，handleRes：处理信息的方法；reply：回执信息。
	get: (handleRes, reply) => {
		ipcMain.on('main', (event, res) => {
		    handleRes(event, res);
		    if(reply) event.sender.send('main-reply', reply);
		})
	},
	//字符串转换成二进制。
	str2Buff: (str) => {
		return iconv.encode(str, 'gb2312')
	},
	//二进制转化成gb2312编码的字符串。
	buff2Str: (buff) => {
		return iconv.decode(buff, 'gb2312')
	},

	loadFile: (filePath, errMsg) => {
		if(!errMsg) {
			errMsg = 'loadFile error...'
		}
		fs.readFileSync(filePath, {}, function(err) {
			if(err) {
				console.log(errMsg);
				throw new Error('loadFile Error: ' + err);
			} else {
				return true;
			}
		})
	},

	writeFile: (filePath, content, errMsg) => {
		if(!errMsg) {
			errMsg = 'writeFile error...'
		}
		fs.writeFileSync(filePath, content, {}, function(err) {
			if(err) {
				console.log(errMsg);
				throw new Error('loadFile Error: ' + err);
			} else {
				return true;
			}
		})
	},


	handleError: (err, msg) => {
		if(err) {
			console.error(err);
			throw new Error('[Custom isError: ' + msg + ']')
		}
	},

	extend: function( target, options ) {
	    let result = new Object();  //return一个新对象，隔断引用

	    for( let property in target ) {

	        if( this.isObject( target[ property ] || this.isArray( target[ property ] ) ) ) {
	            //如果属性是对象和对象则递归调用，防止直接赋值引用。
	            result[ property ] = this.extend( {}, target[ property ] );  
	        } else {
	            result[ property ] = target[ property ];
	        }
	        
	    }

	    for( let property in options ) {

	        if( this.isObject( options[ property ] || this.isArray( target[ property ] ) ) ) {
	            //如果属性是对象和对象则递归调用，防止直接赋值引用。
	            result[ property ] = this.extend( {}, options[ property ] );
	        } else {
	            result[ property ] = options[ property ];
	        }
	        
	    }

	    return result;
	},
	/**
	 * [ajax 网上抄的，]
	 * @param  {[type]} type    [get/post]
	 * @param  {[type]} url     [description]
	 * @param  {[type]} data    [description]
	 * @param  {[type]} success [description]
	 * @param  {[type]} failed  [description]
	 * @return {[type]}         [description]
	 */
	ajax: function( type, url, data, success, failed ){
	    // 创建ajax对象
	    var xhr = null;
	    if(window.XMLHttpRequest){
	        xhr = new XMLHttpRequest();
	    } else {
	        xhr = new ActiveXObject('Microsoft.XMLHTTP')
	    }
	 
	    var type = type.toUpperCase();
	    // 用于清除缓存
	    var random = Math.random();
	 
	    if(typeof data == 'object'){
	        var str = '';
	        for(var key in data){
	            str += key+'='+data[key]+'&';
	        }
	        data = str.replace(/&$/, '');
	    }
	 
	    if(type == 'GET'){
	        if(data){
	            xhr.open('GET', url + '?' + data, true);
	        } else {
	            xhr.open('GET', url + '?t=' + random, true);
	        }
	        xhr.send();
	 
	    } else if(type == 'POST'){
	        xhr.open('POST', url, true);
	        // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
	        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	        xhr.send(data);
	    }
	 
	    // 处理返回数据
	    xhr.onreadystatechange = function(){
	        if(xhr.readyState == 4){
	            if(xhr.status == 200 || xhr.status == 304){
	                success(xhr.responseText);
	            } else {
	                if(failed){
	                    failed(xhr.status);
	                }
	            }
	        }
	    }
	},

	isArray: obj => {
    return Object.prototype.toString.call( obj ) === '[object Array]'
	},

	isFunction: obj => {
	    return Object.prototype.toString.call( obj ) === '[object Function]';
	},

	isObject: obj => {
	    return Object.prototype.toString.call( obj ) === '[object Object]';
	}
}
