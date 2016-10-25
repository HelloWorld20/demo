"use strict"

const core = require('./js/core.web.js');
const config = require('./js/config.web.js');
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer
const dom = require('./js/dom.web.js');
const $ = dom.$;

let htmlFile = $('#uploadHtml')[0];
let qvgaFile = $("#uploadQvga")[0];
let reader = new FileReader();

htmlFile.addEventListener('change', readFileText, false)
qvgaFile.addEventListener('change', readFileText, false)

function readFileText() {
	let file = this.files[0];
		
	reader.readAsText(file);
	reader.onload = function(e) {
		console.log(e.target.result);
	}
}