module.exports = {
	fullName: '广东集团客户明细账单',	//业务全称
	shortName: 'gdjtmx',	//业务简称
	webUrl: 'http://fun.mail.10086.cn/10086/ah/351011/ah0001.html',		//web模板地址
	wapUrl: 'http://fun.mail.10086.cn/10086/ah/351011/ah0001_wap.html',	//wap模板地址
	//如果要拉取投递平台上的邮件模板，则填入邮件模板ID
	yjmbID: '',	
	//如果要拉取投递平台上的邮件封装资源，则填入邮件封装资源ID	
	yjfzzyID: '',	
	apiType: 'bill',	//投递方式：ng：NGBOSS邮件下发；bill：账单类型；api_0：api接口且infoType为0；api_2：api接口且infoType为2；
	sourceFileName: '',	//数据文件名
	sourceFileMap: {
		resourceConfig: './main/tpl/ResourcePackageConfigTpl.xml',
		bill: './main/tpl/ParseConfig_bill.xml',
		ng: './main/tpl/ParseConfig_ng.xml',
		api_0: './main/tpl/ParseConfig_api_0.xml',
		api_2: './main/tpl/ParseConfig_api_2.xml',
		tpl: './main/tpl/tpl.html',
		config: './main/tpl/config.xml'
	},
	loginMessage: '.UserLogin%2520.txtUserName=weijianghong&.UserLogin%2520.txtPassword=B0AA38EEB4DA24AC7A89A51656320621',	//登录投递平台需要的登录账号密码信息。
	loginServer: 'http://delivery.mail.10086.cn:9000/Services/Login.ashx',	//处理登录信息地址

	templateView: 'http://delivery.mail.10086.cn:9000/delivery/Services/Template/TemplateView.ashx',	//模板详情页地址
	ResourceView: 'http://delivery.mail.10086.cn:9000/delivery/Services/EncapsulateMailResource/EncapsulateMailResourceView.ashx'
}