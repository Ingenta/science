Template.Multiselect.onRendered(function() {
	var defaultSetting = {
		disableIfEmpty: true
	}
	var userData = Template.instance().data;
	var userSetting = userData && userData.setting;
	var setting = userSetting || defaultSetting;
	this.$('select').multiselect(setting);
});

Template.Multiselect.helpers({
	args: function() {
		data = Template.instance().data;
		selected = false;
		if (data.selected instanceof Array)
			selected = Boolean(data.selected.indexOf(this._id) > -1 );
		else
			selected = this._id === data.selected;
		return _.extend({}, this, {attrs: (selected ? 'selected' : '')});
	}
});