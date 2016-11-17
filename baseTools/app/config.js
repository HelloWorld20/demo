module.exports = {
	fullName: '湖南流量账单',	//业务全称
	shortName: 'hnllzd',	//业务简称
	webUrl: 'http://fun.mail.10086.cn/bills/gz/351114/index.html',		//web模板地址
	wapUrl: 'http://fun.mail.10086.cn/bills/gz/351114/wap.html',	//wap模板地址
	//获取设计稿模板时需要。设计稿模板页面可能是utf-8或者gb2312的。需区别对待。如果乱码检查下这个参数。
	charset: 'utf-8', 		
	//如果要拉取投递平台上的邮件模板，则填入邮件模板ID
	yjmbID: '21837',	
	//如果要拉取投递平台上的邮件封装资源，则填入邮件封装资源ID	
	yjfzzyID: '14102',	
	tplName: '河北1008611话费查询热线节点',		//上传邮件模板时需要用到的模板名称。
	confName: '河北1008611话费查询热线节点', 	//上传邮件模板时需要用到的封装资源名称。
	apiType: 'bill',	//投递方式：ng：NGBOSS邮件下发；bill：账单类型；api_0：api接口且infoType为0；api_2：api接口且infoType为2；
	sourceFileName: '',	//数据文件名
	
	uploadHtml: 'E:/delivery/api类/NG/hn0001/hn0001.html',		//待上传的HTML文件路径
	uploadQvga: 'E:/delivery/api类/NG/hn0001/hn0001.qvga',		//待上传的Qvga文件路径

	sourceFileMap: {
		resourceConfig: './tpl/ResourcePackageConfigTpl.xml',
		bill: './tpl/ParseConfig_bill.xml',
		ng: './tpl/ParseConfig_ng.xml',
		api_0: './tpl/ParseConfig_api_0.xml',
		api_2: './tpl/ParseConfig_api_2.xml',
		tpl: './tpl/tpl.html',
		config: './tpl/config.xml'
	},
	username: 'weijianghong',		//投递平台的用户名
	password: 'B0AA38EEB4DA24AC7A89A51656320621',	//投递平台的密码的32位MD5加密

	loginMessage: '.UserLogin%2520.txtUserName=weijianghong&.UserLogin%2520.txtPassword=B0AA38EEB4DA24AC7A89A51656320621',	//登录投递平台需要的登录账号密码信息。
	loginServer: 'http://delivery.mail.10086.cn:9000/Services/Login.ashx',	//处理登录信息地址
	templateView: 'http://delivery.mail.10086.cn:9000/delivery/Services/Template/TemplateView.ashx',	//模板详情请求地址
	ResourceView: 'http://delivery.mail.10086.cn:9000/delivery/Services/EncapsulateMailResource/EncapsulateMailResourceView.ashx',

	loginMessageTest: '.UserLogin%2520.txtUserName=weijianghong&.UserLogin%2520.txtPassword=WJHmail139!',//登录测试线需要的信息
	loginServerTest: 'http://192.168.19.115:8000/Services/Login.ashx', 		//测试线登陆服务
	templateEditUrlTest: 'http://192.168.19.115:8000/delivery/Services/Template/TemplateEdit.ashx',	//修改邮件模板上传路径	
	searchPageUrlTest: 'http://192.168.19.115:8000/delivery/Services/Template/TemplateList.ashx', 		//搜索页面服务地址
	templateViewTest: 'http://192.168.19.115:8000/delivery/Services/Template/TemplateView.ashx', 		//测试线模板详情页
	verifyUrlTest: 'http://192.168.19.115:8000/delivery/Services/EncapsulateMailResource/EncapsulateMailResourceAudit.ashx', 		//测试线审核邮件
}