/**
 * Created by jiangkai on 15/10/21.
 */
JET.verifyName = function(name, mode){
	var result=true;
	if(result || !mode || mode==="all" || mode==="reg"){
		result = !!/^[a-zA-Z_][\w\d_]*$/.exec(name);
	}
	if(result || mode==="all" || mode ==="empty"){
		result = !_.isEmpty(name) && name.trim()!=="";
	}
	if(result==='uname')
		result=false;
	return result;
};