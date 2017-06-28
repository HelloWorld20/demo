/*
 * 彩蛋，触发条件：上上下下左右左右BA。只能用键盘触发。修改触发条件：修改getKey方法return的Array。
 */

(function(win, doc){
	function EasterEgg(callback) {
		var key = getKey();
		var input = [];
		doc.addEventListener('keydown', function(e) {
			input.push(e.keyCode);
			if(isPreEqual(key, input)) {
				if(input.length === key.length) {

					if(isFunction(callback)) callback();
					
					input.length = 0;
				}
			} else {
				input.length = 0;
			}
		})
	}

	function isPreEqual(one, two) {
		if(!isArray(one) || !isArray(two) ) return false;
		var len = one.length < two.length ? one.length : two.length;

		for(var i = 0; i < len; i++) {
			if(one[i] !== two[i])
				return false;
		}

		return true;
	}

	function isArray(tar) {
		return Object.prototype.toString.call(tar) === '[object Array]'
	}
	function isFunction(tar) {
		return Object.prototype.toString.call(tar) === '[object Function]'
	}

	function getKey () {
		//键盘触发的keyCode顺序；上上下下左右左右BA
		return new Array(38,38,40,40,37,39,37,39,66,65)
	}

	win.EasterEgg = EasterEgg
})(window, document)

//目前只支持键盘彩蛋。
// EasterEgg(function() {
// 	console.log('运行彩蛋')
// });