Template.taskLoadIcon.helpers({
	isSending:function(){
		return this.status == 'sending';
	}
})

Template.taskProgressBar.helpers({
	rate:function(type){
		var v = this[type] || 0;
		var f = this["failed"] || 0;
		var r = Math.round(v / (this.total+f+this.processing) * 100) ;
		return r > 0 && r < 1 ? 1 : r;
	}
})