var xmlstr = "<nodea> <nodeb>node b content</nodeb> node a content </nodea>";
var xmlstr1 = '<caption>\n'+
                '<p xml:lang="zh-Hans">\n'+
                    '<bold>\n'+
                        '<xref ref-type="fig" rid="TBL15">表1</xref>\n'+
                    '</bold>\n'+
                    '<x></x>\n'+
                    '模型计算参数\n'+
                '</p>\n'+
                '<p xml:lang="en">\n'+
                    '<bold>Table 1</bold>\n'+
                    '<x></x>\n'+
                    'Nominal parameter values\n'+
                '</p>\n'+
             '</caption>';
var dom = new Science.Dom().parseFromString(xmlstr1)


Tinytest.add('提取节点中的内容', function(test) {
    var nb=Science.XPath.ParseHelper.getSimpleVal("//caption/p[@lang='zh-Hans']",dom)
    console.log(nb)
    test.equal(nb,"模型计算参数")
});