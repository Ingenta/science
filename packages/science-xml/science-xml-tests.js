Tinytest.add('Given valid xml, When title is not missing, Should return title', function (test) {
    var testXml = "<book><author>Terry Pratchett</author><article-title>Witches abroad</article-title></book>";
    var xmlDom = new dom();
    var results = {};
    var doc = xmlDom.parseFromString(testXml);
    results = ScienceXML.getTitle(results, doc);
    test.equal("Witches abroad", results.title);
});
Tinytest.add('Given valid xml, When title is missing, Should return error', function (test) {
    var testXml = "<book><author>Terry Pratchett</author></book>";
    var xmlDom = new dom();
    var results = {};
    var doc = xmlDom.parseFromString(testXml);
    results = ScienceXML.getTitle(results, doc);
    test.equal(results.errors[0],"No title found");
});

Tinytest.add('Given valid xml, and xpath, When author is not missing, Should return author', function (test) {
    var testXml = "<book><author>Terry Pratchett</author><article-title>Witches abroad</article-title></book>";
    var xmlDom = new dom();
    var doc = xmlDom.parseFromString(testXml);
    var title = ScienceXML.getSimpleValueByXPath("//author", doc);
    test.equal("Terry Pratchett", title);
});


Tinytest.add('Given valid xml, and xpath, When author is not missing and has xml inside, Should return author', function (test) {
    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><article-title>Witches abroad</article-title></book>";
    var xmlDom = new dom();
    var doc = xmlDom.parseFromString(testXml);
    var title = ScienceXML.getValueByXPathIgnoringXml("//author", doc);
    test.equal("Terry Pratchettesq.", title);
})

Tinytest.add('Given valid xml, and xpath, When author is not missing and has xml inside, Should return author with xml', function (test) {
    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><article-title>Witches abroad</article-title></book>";
    var xmlDom = new dom();
    var doc = xmlDom.parseFromString(testXml);
    var title = ScienceXML.getValueByXPathIncludingXml("//author", doc);
    test.equal("Terry Pratchett<sub>esq.</sub>", title);
});

Tinytest.add('Given valid xml, and xpath, When title is not missing and has xml inside, Should return title with xml', function (test) {
    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><title>Witches abroad<sup>1</sup></title></book>";
    var xmlDom = new dom();
    var doc = xmlDom.parseFromString(testXml);
    var title = ScienceXML.getValueByXPathIncludingXml("//title", doc);
    test.equal("Witches abroad<sup>1</sup>", title);
});