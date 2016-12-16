##双层柱状图
lua：

    p_fill_flow_trend('QL_GeneralFlowTrend')
配置格式：

    <Area Code="0400" Method="PrefixEqual">
        <DataSource Name="QL_GeneralFlowTrend" Type = "Mixed" SplitBy="~" MainFiled="月份:Key|区域码:AreaCode" MixedField="套餐内|套餐外">
        </DataSource>
    </Area>
数据格式：

    201311|0.00~0.00|040101
    201312|0.00~0.00|040102
    201401|0.00~0.00|040103
    201402|0.00~0.00|040104
    201403|0.00~0.00|040105
    201404|512.00~0.00|040106
效果：略
参考：重庆流量账单（账单）

##彩色环形饼图
lua：

    <img src="http://deliveryimg.mail.10086.cn/imageserv?<% r_echo(l_generate_qw_xf_circle_param('QL_AREA0101', 1, 2, l_get_value('QL_SHAREINFOXXX', '服务号码'))) %>" />
配置格式：
    
    <Area Code="010001|010002|010003|010004|010005|010006|010007" Method="Gather">
        <DataSource Name="QL_AREA0101" Type="Map" MapField="费用项目:Key|金额:Value|区域码:AreaCode" /> 
    </Area>
数据格式：

    套餐及固定费|46.00|010001
    语音通信费|36.00|010002
    上网费|20.00|010003
    短彩信费|6.00|010004
    其他费用|0.00|010005
效果：![彩色环形饼图](http://deliveryimg.mail.10086.cn/imageserv?charttype=1002&data=zNeyzbywucy2qLfRPTQzO9Pv0vTNqNDFt9E9MzM7yc/N+LfRPTE5O7bMssrQxbfRPTU7xuTL+7fR08M9MDs=&id=&timestamp=1479777803&sign=3bbea081420fd09f69b928e313de50a4)
参考：全国季度账单（账单）

##彩色折线图
lua：

    <img src="http://deliveryimg.mail.10086.cn/imageserv?<% r_echo(l_generate_qw_jd_histogram_param('QL_AREA0200', 1, 2, l_get_value('QL_SHAREINFO', '服务号码'))) %>" />
配置格式：

    <Area Code="0200" Method="PrefixEqual">
        <DataSource Name="QL_AREA0200" Type = "Map" MapField="费用项目:Key|金额:Value|区域码:AreaCode">
        </DataSource>
    </Area>
数据格式：

    201601|201.50|020001
    201602|278.00|020002
    201603|387.50|020003

说明：上面的方法只能画3个，9个数据的方法`l_generate_qw_qn_histogram_param`

效果：![彩色折线图](http://deliveryimg.mail.10086.cn/imageserv?charttype=1005&data=MdTCPTIwMS41MNSqOzLUwj0yNzguMDDUqjsz1MI9Mzg3LjUw1Ko7NNTCPTI0MC4wMNSqOzXUwj00NTIuMDDUqjs21MI9MTk5LjAw1Ko7N9TCPTEwMC4wMNSqOzjUwj0xMjguMDDUqjs51MI9MjM5LjAw1Ko7MTDUwj0xODkuMDDUqjsxMdTCPTE2OS4wMNSqOzEy1MI9MjAxLjAw1Ko7&id=13580554545&timestamp=1481166984&sign=5f7e40aeeff997a65caa718f35e32b01)
参考：全国季度账单（账单）

##NGBOSS接口添加附件
lua: 无
配置格式：

ResourcePackageConfig.xml文件：

    <AttachmentSource name="附件源名称">ATTACHMENT</AttachmentSource>

ParseConfig.xml文件：

    <FetchNode Key="info">
        <GetItem ItemID="01">
          <StringToXml>
            <FetchDynamicNode AttributeName="name">
              <DataSource Name="ATTACHMENT" Type="Fix">
              </DataSource>
            </FetchDynamicNode>
          </StringToXml>
        </GetItem>
    </FetchNode>

数据格式：

    <ITEM>
        <ID>001</ID>
        <TYPE>application/attachment</TYPE>
        <VALUE>
            <![CDATA[
            <accessory name="邮件附件列表"">
                <file name="附件名称1.pdf">BASE64</file>
                <file name="附件名称2.doc">BASE64</file>
                <file name="附件名称3.xsl">BASE64</file>
                <file name="附件名称N.pdf">BASE64</file>
                <file name="附件名称s.txt">ZmlsZTovLy9DOi9Vc2Vycy93aG8vRG9jdW1lbnRzL1RlbmNlbnQlMjBGaWxlcy8xNjI0MTM2NjIxL0ZpbGVSZWN2LyVFNSU5MiU4QyVFNSU4QyU4NSVFNyU5NCVCNSVFNSVBRCU5MCVFNSU4OCVCOCVFOCVCNSU4NCVFOSU4NyU5MSVFNSU4RiU5OCVFNSU4QSVBOCVFNiU4RiU5MCVFOSU4NiU5Mi5odG1s</file>
            </accessory>
            ]]>
        </VALUE>
    </ITEM>

说明：
如果是图片类型，base64值不要带上`data:image/jpg;base64,`前缀;
好像10086API也可以添加附件，但是没找到旧参考;

数据格式：略

效果：略

参考：浙江电子发票个人（NG）

##NGBOSS格式混账单

说明：太复杂了，直接看备份吧

参考：gx1002账单查询（账单）

##NGBOSS格式混xml
lua: 无

配置格式：

    <GetItem ItemID="MONTHBILLCQ1">
        <!-- 关键是StringToXml -->
        <StringToXml>
            <!-- 可以多层FetchNode，逐层递进获取 -->
            <FetchNode Key="CUST_FEE">
                <FixedNode Type="Reference" MapField="HF_FEE:话费账户余额">
                    <DataSource Name="AH_FEE" Type="Fix"></DataSource>
                </FixedNode>
            </FetchNode>
        </StringToXml>
    </GetItem>
    <GetItem ItemID="MONTHBILLCQ1">
        <StringToXml>
            <!-- 可以多层FetchNode，逐层递进获取 -->
            <FetchNode Key="USER_REMAIN">
                <FetchNode Key="ROW">
                    <FetchMultiseriateNode ColumnNames="FREE_VALUE_ACOUNT|UESD_VALUE_ACOUNT|REMAIN_VALUE_ACOUNT|AVERAGE">
                        <DataSource Name="AH_REMAIN" Type="Mixed" SplitBy="~" MainFiled="总量:Key" MixedField="已用|可用|日均">
                        </DataSource>
                    </FetchMultiseriateNode>
                </FetchNode>
            </FetchNode>
        </StringToXml>
    </GetItem>

数据格式：

    <ITEM>
        <ID>MONTHBILLCQ1</ID>
        <TYPE>text/plain</TYPE>
        <VALUE><![CDATA[
            <MONTHBILLCQ1 name="月帐单查询">
                <BRAND name="品牌">全球通</BRAND>
                <SUBSNAME name="用户姓名">地方三</SUBSNAME>
                <CUST_FEE name="用户当前余额">
                    <HF_FEE name="话费账户余额">45.80</HF_FEE >
                </CUST_FEE>
                <USER_REMAIN name="用户当前流量剩余量">
                    <ROW>
                        <FREE_VALUE_ACOUNT name="总量">7268M</FREE_VALUE_ACOUNT>
                        <UESD_VALUE_ACOUNT name="已用">0M</UESD_VALUE_ACOUNT>
                        <REMAIN_VALUE_ACOUNT name="可用">7268M</REMAIN_VALUE_ACOUNT>
                        <AVERAGE name="日均">0M</AVERAGE>
                        <FREE_VALUE_ACOUNT name="总量">0分</FREE_VALUE_ACOUNT>
                        <UESD_VALUE_ACOUNT name="已用">0分</UESD_VALUE_ACOUNT>
                        <REMAIN_VALUE_ACOUNT name="可用">0分</REMAIN_VALUE_ACOUNT>
                        <AVERAGE name="日均">0分</AVERAGE>
                    </ROW>
                </USER_REMAIN>
            </MONTHBILLCQ1>]]>
        </VALUE>
    </ITEM>

说明：详情参见线上业务；

效果：略

参考：重庆流量账单查询、重庆月账单查询（NG）

##一个业务带多份模板
lua: 无

配置格式：

ResourcePackageConfig.xml文件：

    <?xml version="1.0" encoding="gb2312"?>
    <Package name="资源包配置">  
      <ResourceName name="资源名称">北京全年趣味账单</ResourceName>
        <FieldName>品牌</FieldName>
        <TemplateGroup name="模板组">
            <Template name="模板">
                <TemplateName name="模板文件名称">全球通.html</TemplateName>
                <FieldValue name="模板映射关系字段值">全球通</FieldValue>
                <WapScriptFileName name="wap生成脚本文件名">全球通.scr</WapScriptFileName>
                <QvgaTemplateName name="QVGA模板文件名">全球通.qvga</QvgaTemplateName>
                <IsDefault name="默认使用">1</IsDefault>
            </Template>
            <Template name="模板">
                <TemplateName name="模板文件名称">动感地带.html</TemplateName>
                <FieldValue name="模板映射关系字段值">动感地带</FieldValue>
                <WapScriptFileName name="wap生成脚本文件名">动感地带.scr</WapScriptFileName>
                <QvgaTemplateName name="QVGA模板文件名">动感地带.qvga</QvgaTemplateName>
                <IsDefault name="默认使用">0</IsDefault>
            </Template>
            <Template name="模板">
                <TemplateName name="模板文件名称">神州行.html</TemplateName>
                <FieldValue name="模板映射关系字段值">神州行</FieldValue>
                <WapScriptFileName name="wap生成脚本文件名">神州行.scr</WapScriptFileName>
                <QvgaTemplateName name="QVGA模板文件名">神州行.qvga</QvgaTemplateName>
                <IsDefault name="默认使用">0</IsDefault>
            </Template>
        </TemplateGroup>
    </Package>

数据格式：略

说明：详情参见线上业务；

效果：略

参考：北京年度趣味账单（账单）

##LUA判断文字是否存在
lua：

    r_echo( l_cond_show(l_not_exist_string_show(l_get_value('QL_AREA0500','金额'),"nil") .. " == nil","%s","<!--") )

配置格式：略
数据格式：略
效果：略
参考：全国季度账单（账单）

##LUA解析纯xml方法

方法定义：

    -- 获取标签内内容。
    function get_value(source)
        local temp = string.match(source,">.*<");
        local value = string.sub(temp, 2, string.len(temp) - 1)
        
        return value;
    end

    -- 切分标签，返回结果是key从1开始的table
    -- source: 要解析的原始xml； tagName：要切分的xml标签名，大小写敏感
    -- 返回存放切分好的标签table，返回table长度
    function split(source, tagName)
        local temp = source
        local result = {}
        local len = 0
        
        while(string.find(temp, "<" .. tagName .. " ")) do
            s1,s2 = string.find(temp, "<" .. tagName .. " ");
            e1,e2 = string.find(temp, "</" .. tagName .. ">");
        
            -- if </tag> before <tag>
            if s2 > e1 then
                return false;
            end
        
            center = string.sub(temp, s1, e2);
        
            temp = string.sub(temp, e2);
            
            len = len + 1
            -- result = result .. "   " .. center;
            table.insert(result, len, center)
        end
        return result, len;
        
    end

使用方法：

    --返回标签table和table长度
    result, len = split(str, 'HALF_YEAR_FEE');
    -- 遍历table，打印
    table.foreachi(result, function(i, v) print (i, "->",v) end)
    --读取单个标签内内容
    get_value(result[1])

说明：这方法放在模板下经常不奏效，不知道为什么。直接用控制台执行是可以的