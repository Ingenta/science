AutoForm.addHooks(['addUploadExcelModalForm'], {
	onSuccess: function (operation, id) {
		$("#addUploadExcelModal").modal('hide');
		FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
		Meteor.call('parseExcel',id);
	}
}, true);