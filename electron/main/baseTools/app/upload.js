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
let uploadResouce = '';

//流程1：获取登录信息=>用模板名称去搜索模板列表=》取第一个模板ID=》获取模板详情，获得足够上传参数=>上传模板=》审核
//流程2：获取登录信息=》用封装资源名搜索封装资源列表=》获取第一个封装资源ID=》获取详情，获得参数=》上传封装资源=》审核


module.exports = ( conf, callback ) => {

	core.log('upload.js');

	//就在入口处和并配置文件；
	let confCombine = core.extend( config, conf );

	//邮件模板流程
	function* ProcessTpl() {
		console.time('upload')
		yield login();		//登录						
		yield getInfo();	//进入模板详情页，组成信息				
		yield upload();		//上传模板
		yield verify();		//审核
		return 'ending'
	}

	//封装资源流程
	function* ProcessResouce() {

	}

	let procTpl = ProcessTpl();

	readFile();

	//先读取要上传的文件名
	function readFile() {
		if( confCombine.uploadHtml ) {
			uploadHtml = core.buff2Str(fs.readFileSync( confCombine.uploadHtml ));
		}
		if( confCombine.uploadQvga ) {
			uploadQvga = core.buff2Str(fs.readFileSync( confCombine.uploadQvga ));
		}
		if( confCombine.uploadResouce ) {
			uploadResouce = core.buff2Str(fs.readFileSync( confCombine.uploadResouce ))
		}
		
		procTpl.next();
	}

	//获取登录session
	function login() {
		spider( entry , true);
	}

	//搜索模板列表，获取第一条记录的模板ID
	function entry( cookieCombine ) {
		core.log('get template list....');

		cookieCombineGlo = cookieCombine;
		superagent.post( confCombine.searchPageUrlTest )
				.set( 'cookie', cookieCombine )	//需要登录时的cookie
				.query( getListQuery( confCombine.tplName ) )
				.end( ( err, res ) => {
					core.handleError(err, 'get template ID fail...');

					let RecordSet = JSON.parse(res.text).RecordSet;
					//如果有两条记录
					if( RecordSet && RecordSet[1] ) {
						core.log('该模板文件名搜索出两条记录，请上投递平台核实邮件模板是否正确。')
					}
					if( RecordSet && RecordSet[0] ) {
						//暂时用全局变量存储传值
						TemplateIDGlo = RecordSet[0].TemplateID;
						core.log('获取模板列表成功;模板ID：' + TemplateIDGlo);

						procTpl.next();
					} else {
						//中断流程generator函数
						procTpl = null;
						core.log('没有找到对应的模板ID');
						return false;
					}

					return true;
				} )

	}

	//利用模板ID获取模板详细信息；
	function getInfo() {
		core.log('正在获取模板详情。。。');

		superagent.post( confCombine.templateViewTest )
				.set( 'cookie', cookieCombineGlo )
				.query( '.hdTemplateID=' + TemplateIDGlo )
				.end( (err, res) => {
					core.handleError(err, 'get template detail fail...');

					let RecordSet = JSON.parse(res.text).RecordSet;

					//对应的邮件封装资源ID，审核时用到；
					resourceIDGlo = RecordSet.ConvertResourceID;		
					queryMessageGlo =  getUploadQuery( RecordSet ,uploadHtml ,uploadQvga );

					procTpl.next();
				})
		
	}

	//合并模板信息，并上传修改模板；
	function upload() {
		core.log('正在上传模板详情。。。');

		superagent.post( confCombine.templateEditUrlTest )
				.set( 'cookie', cookieCombineGlo )
				.send( queryMessageGlo )
				.end( (err, res) => {
					core.handleError(err, 'upload files fail...');
	
					let ret = JSON.parse(res.text);

					if( ret.Result ) {
						core.log('upload template success....');

						procTpl.next();
					} else {
						core.log('upload template fail....');
						console.log(res.text);

					}

				} )
		
	}

	//审核
	function verify() {
		core.log('verifing....');
		superagent.post( confCombine.verifyUrlTest )
				.set( 'cookie', cookieCombineGlo )
				.send( 'ResourceID=' + resourceIDGlo )
				.end( ( err, res ) => {
					core.handleError(err, 'verify fail...');

					let ret = JSON.parse(res.text);

					if( ret.Result ) {
						core.log( 'verify success....' );
						if( core.isFunction(callback) ) callback();
						procTpl.next();
					} else {
						core.log('verify fail....');
						console.log(res.text);
					}
					//结束计时
					console.timeEnd('upload');
					core.log('upload at time: ' + new Date())
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



// .hdResourceID:4288
// .hdBusinessID:922
// .txtResourceConfig:%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22gb2312%22%3F%3E%0A%3CPackage%20name%3D%22%E8%B5%84%E6%BA%90%E5%8C%85%E9%85%8D%E7%BD%AE%22%3E%09%0A%20%20%3CResourceName%20name%3D%22%E8%B5%84%E6%BA%90%E5%90%8D%E7%A7%B0%22%3E%E5%AE%89%E5%BE%BD%E6%9C%88%E8%B4%A6%E5%8D%95%E6%9F%A5%E8%AF%A2%3C%2FResourceName%3E%0A%09%3CTemplateGroup%20name%3D%22%E6%A8%A1%E6%9D%BF%E7%BB%84%22%3E%0A%09%09%3CTemplate%20name%3D%22%E6%A8%A1%E6%9D%BF%22%3E%0A%09%09%09%3CTemplateName%20name%3D%22%E6%A8%A1%E6%9D%BF%E6%96%87%E4%BB%B6%E5%90%8D%E7%A7%B0%22%3E%E5%AE%89%E5%BE%BD%E6%9C%88%E8%B4%A6%E5%8D%95%E6%9F%A5%E8%AF%A2.html%3C%2FTemplateName%3E%0A%09%09%3C%2FTemplate%3E%0A%09%3C%2FTemplateGroup%3E%0A%3C%2FPackage%3E
// .txtParseConfig:%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22gb2312%22%3F%3E%0A%3CSTRINGTOXML%3E%0A%09%3CFixedNode%20Type%3D%22Reference%22%20MapField%3D%22to%3A%E9%82%AE%E7%AE%B1%E5%9C%B0%E5%9D%80%7Ctoname%3A%E5%AE%A2%E6%88%B7%E5%A7%93%E5%90%8D%7Cquerytime%3A%E6%9F%A5%E8%AF%A2%E6%97%B6%E9%97%B4%7Ctitle%3A%E9%82%AE%E4%BB%B6%E6%A0%87%E9%A2%98%22%3E%0A%09%09%3CDataSource%20Name%3D%22AH_HEADER%22%20Type%20%3D%20%22Fix%22%3E%0A%09%09%3C%2FDataSource%3E%0A%09%3C%2FFixedNode%3E%0A%09%3CFetchNode%20Key%3D%22info%22%3E%0A%09%09%3CGetItem%20ItemID%3D%22MONTHBILLCQ1%22%3E%0A%09%09%09%3CStringToXml%3E%0A%09%09%09%09%3CFixedNode%20Type%3D%22Reference%22%20MapField%3D%22BRAND%3A%E5%93%81%E7%89%8C%7CSUBSNAME%3A%E7%94%A8%E6%88%B7%E5%A7%93%E5%90%8D%22%3E%0A%09%09%09%09%09%3CDataSource%20Name%3D%22AH_INTRO%22%20Type%20%3D%20%22Fix%22%3E%0A%09%09%09%09%09%3C%2FDataSource%3E%0A%09%09%09%09%3C%2FFixedNode%3E%0A%09%09%09%3C%2FStringToXml%3E%0A%20%20%20%20%20%20%20%20%3C%2FGetItem%3E%0A%09%09%3CGetItem%20ItemID%3D%22MONTHBILLCQ1%22%3E%0A%09%09%09%3CStringToXml%3E%0A%09%09%09%09%3CFetchNode%20Key%3D%22CUST_FEE%22%3E%0A%09%09%09%09%09%3CFixedNode%20Type%3D%22Reference%22%20MapField%3D%22HF_FEE%3A%E8%AF%9D%E8%B4%B9%E8%B4%A6%E6%88%B7%E4%BD%99%E9%A2%9D%22%3E%0A%09%09%09%09%09%09%3CDataSource%20Name%3D%22AH_TEST%22%20Type%20%3D%20%22Fix%22%3E%3C%2FDataSource%3E%0A%09%09%09%09%09%3C%2FFixedNode%3E%0A%09%09%09%09%3C%2FFetchNode%3E%0A%09%09%09%3C%2FStringToXml%3E%0A%20%20%20%20%20%20%20%20%3C%2FGetItem%3E%0A%09%3C%2FFetchNode%3E%0A%3C%2FSTRINGTOXML%3E
// .txtRemark:
// .hdHttpUrl:
// .hdUrl0:
// .hdUrl1:
// .hdUrl2:
// .txtFilePath: