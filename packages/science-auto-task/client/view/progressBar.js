Template.taskLoadIcon.helpers({
	isDoiReg:function(){
		return this.type == 'doi_register';
	},
	isSending:function(){
		return this.status == 'sending';
	}
})