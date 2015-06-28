Tinytest.add('Given valid xml, and xpath, When issn is not missing, Should return issn', function (test) {
    var testXml = "<book><issn pub-type='ppub'>123-123123</issn><author>Terry Pratchett</author><article-title>Witches abroad</article-title></book>";
    var xmlDom = new dom();
    var doc = xmlDom.parseFromString(testXml);
    var issn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='ppub']", doc);
    test.equal("123-123123", issn);
});