/**
 * Created by jiangkai on 15/10/22.
 */
var contentType={
	"journal":"J",
	"book":"M",
	"news":"N"
}
Template.singleReferenceTemplate.helpers({
	formatAuthors:function(){
		var authorStr="";
		_.each(this.authors,function(author){
			authorStr += author.surName + " " + author.givenName + ", "
		});
		if(this.etal){
			authorStr+="et al. ";
		}else{
			if(authorStr.length>2){
				authorStr=authorStr.substr(0,authorStr.length-2)+". ";
			}
		}
		return authorStr;
	},
	formatTitle:function(){
		return this.title && (this.title + ". ");
	},
	formatContentType:function(){
		if(this.type && contentType[this.type]){
			return "["+contentType[this.type.toLowerCase().trim()] + "]. ";
		}
		return ". "
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
	formatSource:function(){
		var sourceArr=[];
		//publisher part begin
		var publisher = [];
		this.publisherLoc && publisher.push(this.publisherLoc.trim());
		this.publisherName && publisher.push(this.publisherName.trim());
		publisher = publisher.join(": ");
		publisher && sourceArr.push(publisher && (publisher));
		//publisher part end;
		this.source && sourceArr.push(this.source.trim());
		this.year && sourceArr.push(this.year.trim());
		//volume & issue part begin
		var content = "";
		if(this.volume){
			content+=this.volume.trim();
		}
		if(this.issue){
			content+="("+this.issue.trim()+")";
		}
		content && sourceArr.push(content);
		return _.isEmpty(sourceArr) || sourceArr.join(", ");
	},
	formatRange:function(){
		var content= "";
		if(this.firstPage){
			content+=this.firstPage;
		}
		if(this.lastPage){
			content+= content?("-"+this.lastPage):this.lastPage;
		}
		return content && (": "+content + "")
	}
})