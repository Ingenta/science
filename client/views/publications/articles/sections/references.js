/**
 * Created by jiangkai on 15/10/22.
 */
var contentType={
	"journal":"J",
	"book":"M",
	"news":"N"
}
Template.singleReferenceTemplate.helpers({
	contentType:function(){
		return this.type && ("["+contentType[this.type.toLowerCase().trim()] + "]");
	},
	link:function(){
		if(this.href){
			return Blaze.toHTMLWithData(Template.referenceLinkTemplate,{href:this.href,name:"CrossRef"});
		}//else if(this.doi){
		//	return Blaze.toHTMLWithData(Template.referenceLinkTemplate,{href:"http://dx.doi.org/"+this.doi,name:"CrossRef"});
		//}
	},
	googleScholar:function(){
		var href="http://scholar.google.com/scholar_lookup?";
		var paramsStrArr=[];
		this.title && paramsStrArr.push("title="+this.title);
		if(!_.isEmpty(this.authors)){
			_.each(this.authors,function(author){
				paramsStrArr.push("author="+author.givenName + " " + author.surName);
			})
		}
		this.year && paramsStrArr.push("publication_year="+this.year);
		this.source && paramsStrArr.push("journal="+this.source);
		this.volume && paramsStrArr.push("volume="+this.volume);
		this.issue && paramsStrArr.push("issue="+this.issue);
		this.firstPage && this.lastPage && paramsStrArr.push("pages="+this.firstPage+"-"+this.lastPage);
		if(_.isEmpty(paramsStrArr))
			return;

		var queryStr = paramsStrArr.join("&");
		return Blaze.toHTMLWithData(Template.referenceLinkTemplate,{href:href+queryStr,name:"Google Scholar"});
	},
	formatJournal:function(){
		return this.source && (this.source + ", ")
	},
	formatYear:function(){
		return this.year && (this.year + ", ")
	},
	formatVolIssue:function(){
		var content = "";
		if(this.volume){
			content+=this.volume;
		}
		if(this.issue){
			content+="("+this.issue+")";
		}
		return content;
	},
	formatRange:function(){
		var content= "";
		if(this.firstPage){
			content+=this.firstPage;
		}
		if(this.lastPage){
			content+= content?("-"+this.lastPage):this.lastPage;
		}
		return content && (":"+content + ".")
	}
})