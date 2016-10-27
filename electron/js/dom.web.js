"use strict"

module.exports = {
	$: (selector) => document.querySelectorAll(selector),

	initFileReader: (selector, callback) => {
		let reader = new FileReader();
		$(selector)[0].onchange = function() {
			if(!this.files[0]) return; 
			let file = this.files[0];
			reader.readAsText(file);
			reader.onload = function(e) {
				callback(e);
			}
		}
	},

	destroyFileReader: selector => {
		$(selector)[0].onchange = null;
	},

	getConfig: selector => {
		let domInputs = $(selector);
		let config = {};
		domInputs.forEach( dom => {
			config[dom.getAttribute('name')] = dom.value;
		})

		return config;
	}
}