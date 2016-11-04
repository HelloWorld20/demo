"use strict"

const fs = require('fs');

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

