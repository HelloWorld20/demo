(function(win, doc){
	function flipIt(selector, SPEED, REPEAT) {
		let dom = doc.querySelectorAll(selector)
		// console.log(dom.length)
		// return;
		let len = dom.length;

		for(let i = 0; i < len; i++) {
			let text = dom[i].innerText
			REPEAT = REPEAT || 5
			SPEED = SPEED || 1000
			for(let j = 0; j < REPEAT; j++) {
				setTimeout(() => {
					dom[i].innerText = flip(text)
				}, Math.random() * SPEED + SPEED * j)
				
				setTimeout(() => {
					dom[i].innerText = text;
				}, SPEED * (REPEAT + 0.5))
			}
		}

		
	}

	function flip(str) {
		if(str.length <= 2) return str

		let arr = str.split('')
		let last = arr.pop()
		let first = arr.shift()
		
		let result = []
		result.push(first)
		let len = arr.length;

		for(let i = 0;  i < len; i++) {
			result.push(arr.splice(Math.floor(Math.random() * (len-i)), 1))
		}

		result.push(last)

		return result.join('')

	}

	win.flipIt = flipIt
})(window, document)