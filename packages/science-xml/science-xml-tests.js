Tinytest.add('Given valid xml When author is missing Should return error', function (test) {
  var testXml = "<book><author>Terry Pratchett</author><title>Witches abroad</title></book>";
  var result = getAuthorName(testXml);
  test.equal("Terry Pratchett", result);
});