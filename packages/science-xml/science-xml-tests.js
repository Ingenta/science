
Tinytest.add('Given valid xml, and xpath, When title is not missing, has attributes and has xml inside, Should return title with xml', function (test) {
    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><title id='1'>Witches abroad<sup>1</sup></title></book>";
    var xmlDom = new dom();
    var doc = xmlDom.parseFromString(testXml);
    var title = ScienceXML.getValueByXPathIncludingXml("//title", doc);
    test.equal("Witches abroad<sup>1</sup>", title);
});

Tinytest.add('Given valid xml, and xpath, When issn is not missing, Should return issn', function (test) {
    var testXml = "<book><issn pub-type='ppub'>123-123123</issn><author>Terry Pratchett</author><article-title>Witches abroad</article-title></book>";
    var xmlDom = new dom();
    var doc = xmlDom.parseFromString(testXml);
    var issn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='ppub']", doc);
    test.equal("123-123123", issn);
});