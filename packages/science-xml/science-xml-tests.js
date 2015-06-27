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

Tinytest.add('Given valid xml, and xpath, When title is not missing, has attributes and has xml inside, Should return title with xml', function (test) {
    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><title id='1'>Witches abroad<sup>1</sup></title></book>";
    var xmlDom = new dom();
    var doc = xmlDom.parseFromString(testXml);
    var title = ScienceXML.getValueByXPathIncludingXml("//title", doc);
    test.equal("Witches abroad<sup>1</sup>", title);
});

Tinytest.add('Given valid xml, and xpath, When abstract is not missing and has xml inside, Should return abstract with xml and encoded tags', function (test) {
    var abstractContent = "<p>Dana-Farber and Scripps Florida scientists have identified an alternative mechanism by which PPAR<sub>&#x3B3;</sub> agonists could exert their antidiabetic effects. The findings provide a rationale for a renewed look at compounds previously dismissed due to poor agonist activity but that now may offer therapeutic benefits with the potential for fewer side effects than marketed PPAR<sub>&#x3B3;</sub> agonists.</p>";
    var abstractResult = "<p>Dana-Farber and Scripps Florida scientists have identified an alternative mechanism by which PPAR<sub>γ</sub> agonists could exert their antidiabetic effects. The findings provide a rationale for a renewed look at compounds previously dismissed due to poor agonist activity but that now may offer therapeutic benefits with the potential for fewer side effects than marketed PPAR<sub>γ</sub> agonists.</p>";
    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><title>Witches abroad<sup>1</sup></title><abstract abstract-type='editor'>"+abstractContent+"</abstract></book>";
    var xmlDom = new dom();
    var results = {};
    var doc = xmlDom.parseFromString(testXml);
    results = ScienceXML.getAbstract(results, doc);
    test.equal(results.abstract, abstractResult);
});

Tinytest.add('Given valid xml, and xpath, When abstract is not missing, has 2 paragraphs and has xml inside, Should return abstract with xml and encoded tags', function (test) {
    var abstractContent = "<p>Dana-Farber and Scripps Florida scientists have identified an alternative mechanism by which PPAR<sub>&#x3B3;</sub> agonists could exert their antidiabetic effects. The findings provide a rationale for a renewed look at compounds previously dismissed due to poor agonist activity but that now may offer therapeutic benefits with the potential for fewer side effects than marketed PPAR<sub>&#x3B3;</sub> agonists.</p>";
    var abstractResult = "<p>Dana-Farber and Scripps Florida scientists have identified an alternative mechanism by which PPAR<sub>γ</sub> agonists could exert their antidiabetic effects. The findings provide a rationale for a renewed look at compounds previously dismissed due to poor agonist activity but that now may offer therapeutic benefits with the potential for fewer side effects than marketed PPAR<sub>γ</sub> agonists.</p>";
    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><title>Witches abroad<sup>1</sup></title><abstract abstract-type='editor'>"+abstractContent+abstractContent+"</abstract></book>";
    var xmlDom = new dom();
    var results = {};
    var doc = xmlDom.parseFromString(testXml);
    results = ScienceXML.getAbstract(results, doc);
    test.equal(results.abstract, abstractResult+abstractResult);
});

Tinytest.add('Given valid xml, and xpath, When issn is not missing, Should return issn', function (test) {
    var testXml = "<book><issn pub-type='ppub'>123-123123</issn><author>Terry Pratchett</author><article-title>Witches abroad</article-title></book>";
    var xmlDom = new dom();
    var doc = xmlDom.parseFromString(testXml);
    var issn = ScienceXML.getSimpleValueByXPath("//issn[@pub-type='ppub']", doc);
    test.equal("123-123123", issn);
});