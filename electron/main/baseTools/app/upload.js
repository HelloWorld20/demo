/**
 * description：上传模板到测试线
 * author：weijianghong
 * date：2016-11-16
 */

"use strict"


const fs = require('fs');
const superagent = require('superagent');
const iconv = require('iconv-lite');

const core = require('./lib/core.js');
const config = require('./config.js');

const spider = require('./module/spider.js');

//以下都是为了异步传值的全局变量。暂时这么用
let TemplateIDGlo = -1;
let cookieCombineGlo = '';
let queryMessageGlo = {};
let resourceIDGlo = -1;
let uploadHtml = '';
let uploadQvga = '';

//流程：获取登录信息=>用模板名称去搜索模板列表=》取第一个模板ID=》获取模板详情，获得足够上传参数=>上传模板=》审核


module.exports = () => {

	console.log('upload.js')
	//流程
	function* Process() {
		console.time('upload: ')
		yield login();		//登录						
		yield getInfo();	//进入模板详情页，组成信息				
		yield upload();		//上传模板
		yield verify();		//审核
		return 'ending'
	}

	let proc = Process();

	readFile();

	//先读取要上传的文件名
	function readFile() {
		uploadHtml = core.buff2Str(fs.readFileSync( config.uploadHtml || '' ));
		uploadQvga = core.buff2Str(fs.readFileSync( config.uploadQvga || '' ));

		proc.next();
	}

	//获取登录session
	function login() {
		spider( search , true);
	}

	//搜索模板列表，获取第一条记录的模板ID
	function search( cookieCombine ) {
		console.log('正在获取模板列表。。。');

		cookieCombineGlo = cookieCombine;
		superagent.post( config.searchPageUrlTest )
				.set( 'cookie', cookieCombine )	//需要登录时的cookie
				.query( getListQuery( config.tplName ) )
				.end( ( err, res ) => {
					core.handleError(err, 'get template ID fail...');

					let RecordSet = JSON.parse(res.text).RecordSet;
					//如果有两条记录
					if( RecordSet && RecordSet[1] ) {
						console.log('该模板文件名搜索出两条记录，请上投递平台核实邮件模板是否正确。')
					}
					if( RecordSet && RecordSet[0] ) {
						//暂时用全局变量存储传值
						TemplateIDGlo = RecordSet[0].TemplateID;
						console.log('获取模板列表成功;模板ID：' + TemplateIDGlo);

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

	//利用模板ID获取模板详细信息；
	function getInfo() {
		console.log('正在获取模板详情。。。');

		superagent.post( config.templateViewTest )
				.set( 'cookie', cookieCombineGlo )
				.query( '.hdTemplateID=' + TemplateIDGlo )
				.end( (err, res) => {
					core.handleError(err, 'get template detail fail...');

					let RecordSet = JSON.parse(res.text).RecordSet;

					//对应的邮件封装资源ID，审核时用到；
					resourceIDGlo = RecordSet.ConvertResourceID;		
					queryMessageGlo =  getUploadQuery( RecordSet ,uploadHtml ,uploadQvga );

					proc.next();
				})
		
	}

	//合并模板信息，并上传修改模板；
	function upload() {
		console.log('正在上传模板详情。。。');

		superagent.post( config.templateEditUrlTest )
				.set( 'cookie', cookieCombineGlo )
				.send( queryMessageGlo )
				.end( (err, res) => {
					core.handleError(err, 'upload files fail...');
	
					let ret = JSON.parse(res.text);

					if( ret.Result ) {
						console.log('上传模板成功。。。');

						proc.next();
					} else {
						console.log('上传模板失败。。。');
						console.log(res.text);

					}

				} )
		
	}

	//审核
	function verify() {
		console.log('正在审核。。。');
		return;
		superagent.post( config.verifyUrlTest )
				.set( 'cookie', cookieCombineGlo )
				.send( 'ResourceID=' + resourceIDGlo )
				.end( ( err, res ) => {
					core.handleError(err, 'verify fail...');

					let ret = JSON.parse(res.text);

					if( ret.Result ) {
						console.log( '审核成功。。。' );
						proc.next();
					} else {
						console.log('审核失败。。。');
						console.log(res.text);
					}
					//结束计时
					console.timeEnd('upload: ');
				} )
	}


	//上传模板时需要传递的信息。
	function getUploadQuery( source, webTpl, wapTpl ) {
		let result = "";

		result += '.hdTemplateID=' + encodeURIComponent(source.TemplateID );
		result += '&';
		result += '.hdResourceID=' + encodeURIComponent(source.ConvertResourceID);
		result += '&';
		result += '.hdOrigResourceID=' + encodeURIComponent(source.OrigResourceID);
		result += '&';
		result += '.hdCompanyID=' + encodeURIComponent(source.CompanyID);
		result += '&';
		result += '.hdBusinessID=' + encodeURIComponent(source.BusinessID);
		result += '&';
		result += '.hdUploadType=' + '0' //source.UploadType;
		result += '&';
		result += '.txtRemark=' + encodeURIComponent(source.Remark);
		result += '&';
		result += '.txtSynUrl=' + encodeURIComponent(source.SynUrl);
		result += '&';
		result += '.txtPath=' + encodeURIComponent(source.Path);
		result += '&';
		result += '.txtWapScript=' + encodeURIComponent(source.WapScript);
		result += '&';
		result += '.txtQvgaUrl=' + encodeURIComponent(source.QvgaUrl);
		result += '&';
		result += '.txtTemplateName=' + encodeURIComponent(source.TemplateName);
		result += '&';
		result += '.txtCode=' + ( webTpl ? encodeURIComponent(webTpl) : encodeURIComponent(source.DataTemplate));
		result += '&';
		result += '.txtQvga=' +( wapTpl ? encodeURIComponent(wapTpl) : encodeURIComponent(source.Qvga));

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
		result['PageSize'] = 2

		return result;
	}


};



