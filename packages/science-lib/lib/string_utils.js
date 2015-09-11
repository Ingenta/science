Science.escapeRegEx = function (string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

Science.replaceSubstrings = function (string, find, replace) {
    if (string===undefined)return string;
    return string.replace(new RegExp(Science.escapeRegEx(find), 'g'), replace);
};

Science.clearTags = function(string){
    return string && string.replace(new RegExp("</?[^>]*?>", 'g'), "");
}

Science.joinStrings = function (stringArray, join) {
    var sep = join || ", ";
    var res = "";
    _.each(stringArray, function (str) {
        if (str) {
            if (res)
                res = res + sep;
            res = res + str;
        }
    });
    return res;
};

Science.ipToNumber = function(ip){
    var sum = 0;
    var arr = ip.split('.');
    arr.reverse().forEach(function (a, index) {
        sum += (a*(Math.pow(256,index)));
    });
    return sum;
}


var stringifyPrimitive = function(v) {
    switch (typeof v) {
        case 'string':
            return v;

        case 'boolean':
            return v ? 'true' : 'false';

        case 'number':
            return isFinite(v) ? v : '';

        default:
            return '';
    }
};

Science.queryStringify = function(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
        obj = undefined;
    }

    //if (typeof obj === 'object') {
    //    return Object.keys(obj).map(function(k) {
    //        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
    //        if (Array.isArray(obj[k])) {
    //            return obj[k].map(function(v) {
    //                return ks + encodeURIComponent(stringifyPrimitive(v));
    //            }).join(sep);
    //        } else {
    //            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
    //        }
    //    }).join(sep);
    //
    //}
    //
    //if (!name) return '';
    //return encodeURIComponent(stringifyPrimitive(name)) + eq +
    //    encodeURIComponent(stringifyPrimitive(obj));

    if (typeof obj === 'object') {
        return Object.keys(obj).map(function(k) {
            var ks = (stringifyPrimitive(k)) + eq;
            if (Array.isArray(obj[k])) {
                return obj[k].map(function(v) {
                    return ks + (stringifyPrimitive(v));
                }).join(sep);
            } else {
                return ks + (stringifyPrimitive(obj[k]));
            }
        }).join(sep);

    }

    if (!name) return '';
    return (stringifyPrimitive(name)) + eq +
        (stringifyPrimitive(obj));
};

Science.getParamsFormUrl= function(paramName){
    var reg=new RegExp("[&\?]"+paramName+"=[^&]+","g");
    var paramstrs = decodeURIComponent(window.location.search).match(reg);
    var params;
    if(paramstrs && paramstrs.length){
        params = [];
        _.each(paramstrs,function(str){
            params.push(str.substr(2+paramName.length));
        });
    }
    return params;
}