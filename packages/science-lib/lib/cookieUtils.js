Science.Cookies = Cookie;

Science.Cookies.getObj=function(key) {
	if(!key)
		return;
	var val = Science.Cookies.get(key);
	return val && JSON.parse(val);
};

Science.Cookies.setObj=function(key,val){
	if(!key)
		throw new Error("can't set cookie with out a key");
	Science.Cookies.set(key,JSON.stringify(val));
};