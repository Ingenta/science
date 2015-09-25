Science.Cookies = Cookie;

Science.Cookies.getObj = function (key) {
	if (!key)
		return;
	var val = Science.Cookies.get(key);
	return val && JSON.parse(val);
};

Science.Cookies.setObj = function (key, val) {
	if (!key)
		throw new Error("can't set cookie with out a key");
	Science.Cookies.set(key, JSON.stringify(val));
};

Science.Cookies.queue = function (key, obj, max, equalFunc) {
	if (!key) {
		throw new Error("Must set key!!");
	}
	if (obj && max) {
		var queueArr = Science.Cookies.getObj(key) || [];
		var func = equalFunc || _.isEqual;

		if (!_.isEmpty(queueArr)) {
			if (func(queueArr[0], obj))
				return queueArr;
		}
		queueArr = _.filter(queueArr, function (o) {
			return !func(o, obj);
		});
		queueArr = _.union([obj], queueArr);
		while (queueArr.length > max) {
			queueArr = _.initial(queueArr);
		}
		Science.Cookies.setObj(key, queueArr);
		return queueArr;
	} else {
		return Science.Cookies.getObj(key);
	}
}