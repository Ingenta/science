Tinytest.add('Given valid xml When title is not missing Should return title', function (test) {
    var testXml = "<book><author>Terry Pratchett</author><article-title>Witches abroad</article-title></book>";
    var xmlDom = new dom();
    var results = {};
    var doc = xmlDom.parseFromString(testXml);
    results = ScienceXML.getTitle(results, doc);
    test.equal("Witches abroad", results.title);
});
Tinytest.add('Given valid xml When title is missing Should return error', function (test) {
    var testXml = "<book><author>Terry Pratchett</author></book>";
    var xmlDom = new dom();
    var results = {};
    var doc = xmlDom.parseFromString(testXml);
    results = ScienceXML.getTitle(results, doc);
    test.equal(results.errors[0],"No title found");
});