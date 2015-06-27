if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Given some xml, when parsing a field", function(){
      it("should get the contents of a simple xpath", function(){
        var testXml = "<book><author>Terry Pratchet</author><article-title>Witches abroad</article-title></book>";
        var doc =  ScienceXML.xmlStringToXmlDoc(testXml);
        var title = ScienceXML.getSimpleValueByXPath("//author", doc);
        chai.assert("Terry Pratchett", title);
      });
    });
  });
}
