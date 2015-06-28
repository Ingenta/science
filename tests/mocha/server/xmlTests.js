if (!(typeof MochaWeb === 'undefined')) {
    MochaWeb.testOnly(function () {
        describe("Given an article xml", function () {
            describe("When parsing a simple field", function () {
                it("should get the contents of a simple xpath", function () {
                    var testXml = "<book><author>Terry Pratchet</author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var title = ScienceXML.getSimpleValueByXPath("//author", doc);
                    chai.assert("Terry Pratchett", title);
                });
            });
            describe("When parsing a field with xml inside that we dont want", function () {
                it("should get the contents of including inner xml without tags", function () {
                    var testXml = "<book><author>Terry Pratchet<sub>esq.</sub></author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var title = ScienceXML.getValueByXPathIgnoringXml("//author", doc);
                    chai.assert("Terry Pratchettesq.", title);
                });
            });
            describe("When parsing a field with xml inside that we want", function () {
                it("should get the contents of including inner xml with tags", function () {
                    var testXml = "<book><author>Terry Pratchet<sub>esq.</sub></author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var title = ScienceXML.getValueByXPathIncludingXml("//author", doc);
                    chai.assert("Terry Pratchett<sub>esq.</sub>.", title);
                });
            });
        });
    });
}
