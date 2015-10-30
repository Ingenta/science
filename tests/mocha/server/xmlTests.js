chai.should();
if (!(typeof MochaWeb === 'undefined')) {
    MochaWeb.testOnly(function () {
        describe("XML", function () {
            //describe("When collecting the labels and titles for each section", function () {
            //    it("should get title", function () {
            //        var testXml = "<article><body><sec id='s1'><title>abc<title><label>def<label><p>123</p><p>456</p><p>789</p></sec></body></article>";
            //        var result = {};
            //        var doc = ScienceXML.xmlStringToXmlDoc(testXml);
            //        var result = ScienceXML.getFullText(result, doc);
            //        result.sections.title.should.equal("abc");
            //    });
            //});
            describe("When validating an bad xml string", function () {
                it("should return errors", function () {
                    var testXml = "<book><a/uth/or></art/icbook>";
                    var errors = ScienceXML.validateXml(testXml);
                    errors.length.should.not.equal(0);
                });
            });
            describe("When parsing a simple field", function () {
                it("should get the contents of a simple xpath", function () {
                    var testXml = "<book><author>Terry Pratchett</author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getValueByXPathIncludingXml("//author", doc);
                    result.should.equal("Terry Pratchett");
                });
            });
            describe("When parsing a simple field", function () {
                it("should get the contents of a simple xpath removing newline for space", function () {
                    var testXml = "<book><author>Terry\r\nPratchett</author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getSimpleValueByXPath("//author", doc);
                    result.should.equal("Terry Pratchett");
                });
            });
            describe("When parsing a simple field", function () {
                it("should get the contents of a simple xpath removing newline for space", function () {
                    var testXml = "<book><author>Terry\nPratchett</author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getSimpleValueByXPath("//author", doc);
                    result.should.equal("Terry Pratchett");
                });
            });
            describe("When parsing a field with xml inside that we dont want", function () {
                it("should get the contents of including inner xml without tags", function () {
                    var testXml = "<book><author>Terry Pratchett<sub> esq.</sub></author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getValueByXPathIgnoringXml("//author", doc);
                    result.should.equal("Terry Pratchett esq.");
                });
            });
            describe("When parsing a field with xml inside that we want", function () {
                it("should get the contents of including inner xml with tags", function () {
                    var testXml = "<book><author>Terry Pratchett<sub> esq.</sub></author><article-title>Witches abroad</article-title></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getValueByXPathIncludingXml("//author", doc);
                    result.should.equal("Terry Pratchett<sub> esq.</sub>");
                });
                it("should get the encode contents of including inner xml with tags", function () {
                    var testXml = "<book><author>Terry Pratchett<sub>&#x3B3;</sub></author></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var result = ScienceXML.getValueByXPathIncludingXml("//author", doc);
                    result.should.equal("Terry Pratchett<sub>γ</sub>");
                });
            });
            describe("When parsing an article abstract", function () {
                it("should replace the italic tag with the html i tag", function () {
                    var abstractContent = "<p>Dana-Farber and Scripps Florida scientists have <italic>identified</italic> an alternative mechanism by which PPAR<sub>&#x3B3;</sub> agonists could exert their antidiabetic effects. The findings provide a rationale for a renewed look at compounds previously dismissed due to poor agonist activity but that now may offer therapeutic benefits with the potential for fewer side effects than marketed PPAR<sub>&#x3B3;</sub> agonists.</p>";
                    var abstractResult = "<p>Dana-Farber and Scripps Florida scientists have <i>identified</i> an alternative mechanism by which PPAR<sub>γ</sub> agonists could exert their antidiabetic effects. The findings provide a rationale for a renewed look at compounds previously dismissed due to poor agonist activity but that now may offer therapeutic benefits with the potential for fewer side effects than marketed PPAR<sub>γ</sub> agonists.</p>";
                    var testXml = "<book><author>Terry Pratchett<sub>esq.</sub></author><title>Witches abroad<sup>1</sup></title><abstract abstract-type='editor'>" + abstractContent + "</abstract></book>";
                    var doc = ScienceXML.xmlStringToXmlDoc(testXml);
                    var results = {};
                    var result = ScienceXML.getAbstract(results, doc);
                    result.abstract.should.equal(abstractResult);
                });
            });
        });
    });
}
