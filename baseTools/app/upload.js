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

/**
 * 搜索邮件模板时传的参数
 * 
 * .hdCompanyID:0
.hdBusinessID:0
.hdResourceID:0
.hdBusinessTypeID:0
.txtTemplateID:
.txtTemplateName:%E6%B2%B3%E5%8C%971008611%E8%AF%9D%E8%B4%B9%E6%9F%A5%E8%AF%A2
.txtSender:
.txtStartDate:
.txtEndDate:
CurPage:0
PageSize:20
 */

"use strict"


const fs = require('fs');
const superagent = require('superagent');

const core = require('./lib/core.js');
const config = require('./lib/config.js');

const spider = require('./module/spider/spider.js');

let TemplateID = -1;
let cookieCombineGlo = '';

//流程：获取登录信息=>用模板名称去搜索模板列表=》取第一个模板ID=》获取模板详情，获得足够上传参数=>再上传信息！！

//上传模板时需要传递的信息。
function getUploadQuery( source, webTpl, wapTpl ) {
	let result = {};
	result['.hdTemplateID'] = source.TemplateID ;
	result['.hdResourceID'] = source.ConvertResourceID;
	result['.hdOrigResourceID'] = source.OrigResourceID;
	result['.hdCompanyID'] = source.CompanyID;
	result['.hdBusinessID'] = source.BusinessID;
	result['.txtTemplateName'] = source.TemplateName;
	result['.hdUploadType'] = source.UploadType;
	result['.txtWapScript'] = source.WapScript;
	result['.txtRemark'] = source.Remark;
	result['.txtSynUrl'] = source.SynUrl;
	result['.txtPath'] = source.Path;
	result['.txtQvgaUrl'] = source.QvgaUrl;
	result['.txtCode'] = webTpl ? webTpl : source.DataTemplate;
	result['.txtQvga'] = wapTpl ? wapTpl : source.Qvga;

	return result;
}

//搜索邮件模板时需要的参数
function getListQuery( value ) {
	let result = {};

	result['.hdCompanyID'] = 0
	result['.hdBusinessID'] = 0
	result['.hdResourceID'] = 0
	result['.hdBusinessTypeID'] = 0
	result['.txtTemplateID:'] = ''
	result['.txtTemplateName'] = escape( value )
	result['.txtSender:'] = null
	result['.txtStartDate:'] = null
	result['.txtEndDate:'] = null
	result['CurPage'] = 0
	result['PageSize'] = 20

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
		spider( search , true);
		// spider( search )
	}

	function search( cookieCombine ) {
		console.log('search');
		console.log( cookieCombine );
		cookieCombineGlo = cookieCombine;
		superagent.post( config.searchPageUrlTest )
				.set( 'cookie', cookieCombine )	//需要登录时的cookie
				.query( getListQuery( '河北1008611话费查询热线节点' ) )
				.end( ( err, res ) => {
					core.handleError(err, 'login fail...');

					let firstLog = JSON.parse(res.text).RecordSet[0];
					if( firstLog ) {
						//暂时用全局变量存储传值
						TemplateID = firstLog.TemplateID;

						proc.next();
					} else {
						//中断流程generator函数
						proc = null;
						console.log('没有找到对应的模板ID');
						return false;
					}

					return true;
				} )

	}

	function getId() {
		console.log('getId', TemplateID);
		setTimeout( () => {
			proc.next();
		}, 2000)
	}

	function getInfo() {
		console.log('getInfo');
		return;
		superagent.post( config.templateViewTest )
				.set( 'cookie', cookieCombineGlo )
				.set('Referer', 'http://192.168.19.115:8000/delivery/pages/template/EditTemplate.aspx?TemplateID=5234')
				.set('Accept', 'application/json')
				.query( '.hdTemplateID=' + config.yjmbID )
				.end( (err, res) => {
					core.handleError(err, 'login fail...');

					let RecordSet = JSON.parse(res.text).RecordSet;

					console.log(res.text)

					setTimeout( () => {
						proc.next();
					}, 1000)
				})
		
	}

	function upload() {
		console.log('upload');
	}

})();