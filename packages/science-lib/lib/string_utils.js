Science.escapeRegEx = function (string) {
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

Science.replaceSubstrings = function(string, find, replace) {
	return string.replace(new RegExp(Science.escapeRegEx(find), 'g'), replace);
};

Science.joinStrings = function(stringArray, join) {
	var sep = join || ", ";
	var res = "";
	_.each(stringArray, function(str) {
		if(str) {
			if(res)
				res = res + sep;
			res = res + str;
		}		
	});
	return res;
};
