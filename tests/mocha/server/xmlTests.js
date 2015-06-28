chai.should();
if (!(typeof MochaWeb === 'undefined')) {
    MochaWeb.testOnly(function () {
        describe("Given an article xml", function () {
            describe("When parsing a simple field", function () {
                it("should get the contents of a simple xpath", function () {
                    var testXml = "<book><author>Terry Pratchett</author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getSimpleValueByXPath("//author", doc);
                    result.should.equal("Terry Pratchett");
                });
            });
            describe("When parsing a field with xml inside that we dont want", function () {
                it("should get the contents of including inner xml without tags", function () {
                    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getValueByXPathIgnoringXml("//author", doc);
                    result.should.equal("Terry Pratchettesq.");
                });
            });
            describe("When parsing a field with xml inside that we want", function () {
                it("should get the contents of including inner xml with tags", function () {
                    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getValueByXPathIncludingXml("//author", doc);
                    result.should.equal("Terry Pratchett<sub>esq.</sub>");
                });
                it("should get the encode contents of including inner xml with tags", function () {
                    var testXml = "<book><author>Terry Pratchett<sub>&#x3B3;</sub></author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getValueByXPathIncludingXml("//author", doc);
                    result.should.equal("Terry Pratchett<sub>γ</sub>");
                });
            });
        });
    });
}
