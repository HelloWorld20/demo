/**
 * author: weijianghong
 * date: 2016-11-4
 * description: 看情况生成文件夹，提供容错，
 * 		如果没有目标文件夹，则新建，如果有，则把目标文件夹改名备份，然后新建目标文件夹
 */

"use strict"

const fs = require('fs');
const rimraf = require('rimraf');

/**
 * [创建目标文件夹]
 * @param  {[type]}   fullName [文件夹名称]
 * @param  {Function} callback [新建完成后的回调函数]
 * @return {[type]}            [description]
 */
module.exports = ( fullName, callback ) => {
	//非异步版本有毛病。
	fs.stat('./'+fullName, function(err, stat){
	    if(stat) {
	    	fs.stat('./'+ fullName + '_oldVersion', function(err, stat) {
	    		if(stat) {	//有oldVersion
	    			//强制删除非空文件夹。
					rimraf('./'+ fullName + '_oldVersion', function(err) {
						fs.renameSync('./'+fullName, './'+ fullName + '_oldVersion');
		    			fs.mkdirSync('./'+ fullName);
		    			callback();
					})
	    		} else {
	    			//没有oldVersion的情况
	    			fs.renameSync('./'+fullName, './'+ fullName + '_oldVersion');
	    			fs.mkdirSync('./'+ fullName);
	    			callback()
	    		}
	    	})
	    } else {
	    	//第一次新建时
	    	fs.mkdirSync('./'+ fullName);
	    	callback();
	    }
	    
	});
	return true;
}

