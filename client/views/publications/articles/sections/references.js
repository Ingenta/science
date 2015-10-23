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
			return Blaze.toHTMLWithData(Template.referenceLinkTemplate,{href:this.href,name:this.doi || this.title});
		}else if(this.doi){
			return Blaze.toHTMLWithData(Template.referenceLinkTemplate,{href:"http://dx.doi.org/"+this.doi,name:this.doi});
		}
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