"use strict"


let $ = document.querySelectorAll;

module.exports = {
	$: (selector) => document.querySelectorAll(selector),

	initFileReader: (selector, callback) => {
		let reader = new FileReader();
		document.querySelectorAll(selector)[0].onchange = function() {
			if(!this.files[0]) return; 
			let file = this.files[0];
			reader.readAsText(file);
			reader.onload = function(e) {
				callback(e);
			}
		}
	},

	destroyFileReader: (selector) => {
		$(selector)[0].onchange = null;
	},
}