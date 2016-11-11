/**
 * 上传模板到测试线
 */
//放弃，搁置，流程太复杂

//上传邮件模板需要的内容
//这些值都藏在邮件模板详情页面templateView里。
//就是对应的className，直接$(".name").val()就出来
//要上传的参数名  => 对应获取的参数名
/*.hdTemplateID:5233  =>  TemplateID
.hdResourceID:4209  =>  ConvertResourceID
.hdOrigResourceID:0  =>  OrigResourceID
.hdCompanyID:16  =>  CompanyID
.hdBusinessID:915  =>  BusinessID
.txtTemplateName:%B9  =>  TemplateName
.hdUploadType:0  =>  UploadType
.txtWapScript:  =>  WapScript(wap模板)
.txtRemark:  =>  Remark
.txtCode:html%3E  =>  web模板
.txtSynUrl:  =>  SynUrl
.txtPath:  =>  Path
.txtQvga:html%3E  =>  wap模板
.txtQvgaUrl:  =>  QvgaUrl*/

"use strict"


const fs = require('fs');
const superagent = require('superagent');

const core = require('./lib/core.js');
const config = require('./lib/config.js');

const spider = require('./module/spider/spider.js');

//流程：获取登录信息=>用模板名称去搜索模板列表=》取第一个模板ID=》进入模板详情页=>再上传信息！！
function entry( cookieCombine ) {
	superagent.post( config.templateView )
			.query( '.hdTemplateID=' + config.yjmbID )
			.set( 'cookie', cookieCombine )	//需要登录时的cookie
			.end((err, res) => {
				core.handleError(err, 'Get' + config.templateView + 'error!');
				return;
				let RecordSet = JSON.parse(res.text).RecordSet;
				if(!RecordSet) throw new Error("没有返回邮件模板内容，检查ID是否有误");

				let queryCombine = getQuery( RecordSet );
				

				return;
		        
	    })
}

function getQuery( source, webTpl, wapTpl ) {
	let result = {};
	result.hdTemplateID = source.TemplateID ;
	result.hdResourceID = source.ConvertResourceID;
	result.hdOrigResourceID = source.OrigResourceID;
	result.hdCompanyID = source.CompanyID;
	result.hdBusinessID = source.BusinessID;
	result.txtTemplateName = source.TemplateName;
	result.hdUploadType = source.UploadType;
	result.txtWapScript = source.WapScript;
	result.txtRemark = source.Remark;
	result.txtSynUrl = source.SynUrl;
	result.txtPath = source.Path;
	result.txtQvgaUrl = source.QvgaUrl;
	result.txtCode = webTpl ? webTpl : source.DataTemplate;
	result.txtQvga = wapTpl ? wapTpl : source.Qvga;

	return result;
}


module.exports = (function() {
	console.log('upload.js')
	//流程
	function* Process() {
				
		yield login();		//登录
		// yield search();		//根据邮件模板名称搜索				
		yield getId();		//获取第一条记录ID（如果不止一条，可以做个提示）			
		yield getInfo();	//进入模板详情页，组成信息				
		yield upload();		//上传模板
		return 'ending'
	}

	let proc = Process();

	proc.next();

	function login() {
		spider( search );
	}

	function search( cookieCombine ) {
		console.log('search');
		proc.next();
	}

	function getId() {
		console.log('getId');
		setTimeout( () => {
			proc.next();
		}, 2000)
	}

	function getInfo() {
		console.log('getInfo');
		setTimeout( () => {
			proc.next();
		}, 3000)
	}

	function upload() {
		console.log('upload');
	}

})();