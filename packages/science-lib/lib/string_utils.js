Science.String = {};

Science.String.escapeRegEx = function (string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

Science.String.replaceSubstrings = function (string, find, replace) {
    if (string === undefined)return string;
    return string.replace(new RegExp(Science.escapeRegEx(find), 'g'), replace);
};

Science.String.clearTags = function (string) {
    return string && string.replace(new RegExp("</?[^>]*?>", 'g'), " ") || "";
}

Science.String.joinStrings = function (stringArray, join) {
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

Science.String.ipToNumber = function (ip) {
    var sum = 0;
    var arr = ip.split('.');
    arr.reverse().forEach(function (a, index) {
        sum += (a * (Math.pow(256, index)));
    });
    return sum;
}


var stringifyPrimitive = function (v) {
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

Science.String.queryStringify = function (obj, sep, eq, name) {
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
        return Object.keys(obj).map(function (k) {
            var ks = (stringifyPrimitive(k)) + eq;
            if (Array.isArray(obj[k])) {
                return obj[k].map(function (v) {
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

Science.String.getParamsFormUrl = function (paramName) {
    var reg = new RegExp("[&\?]" + paramName + "=[^&]+", "g");
    var paramstrs = decodeURIComponent(window.location.search).match(reg);
    var params;
    if (paramstrs && paramstrs.length) {
        params = [];
        _.each(paramstrs, function (str) {
            params.push(str.substr(2 + paramName.length));
        });
    }
    return params;
}

Science.String.parseToNumbers = function (str) {
    if (!str)
        return;
    var parts = str.replace(/\s/g, "").split(/[,，]/);
    var resultArr = [];
    _.each(parts, function (part) {
        var tPart = part.trim();
        var range = tPart.split(/[~-－-––]/);
        if (!_.isEmpty(range)) {
            if (range.length === 2) {
                var n1 = Number(range[0]);
                var n2 = Number(range[1]);
                if (n1 <= n2) {
                    for (var i = n1; i <= n2; i++) {
                        resultArr.push(i);
                    }
                }
            } else if (range.length === 1) {
                resultArr.push(Number(range[0]));
            }
        }
    });
    return _.sortBy(resultArr);
};

Science.String.getLastPart = function (str, separate) {
    separate = separate || ".";
    var lastIndex = str.lastIndexOf(separate);
    if (lastIndex > -1) {
        return str.substr(lastIndex + separate.length);
    }
};

Science.String.getExt = function (str) {
    return Science.String.getLastPart(str);
};

Science.String.getFileName = function (str) {
    var afterReplace = str.replace(/\\/g, "/");
    return Science.String.getLastPart(afterReplace, "/") || str;
};

Science.String.getFileNameWithOutExt = function (str) {
    var name = Science.String.getFileName(str);
    var lastIndex = name.lastIndexOf(".");
    return lastIndex > -1 ? name.substr(0, lastIndex) : name;
};

Science.String.toDate = function (str) {
    if (!str) return;
    var p = Date.parse(str);
    if (!p) return;
    return new Date(p);
}

Science.String.PadLeft = function (str, pchar, len, keepMinus) {
    var val=str || "";
    if(!keepMinus && str.indexOf('-')>=0){
        val=val.slice(0,val.indexOf("-"));
    }
    var curLen = ('' + val).length;
    return (Array(
        len > curLen ? len - curLen + 1 || 0 : 0
    ).join(pchar) + val);
}

Science.String.PadLeftForNumber = function(str, pchar, len){
    var headNumbers=/^\d+/.exec(str);
    if(!_.isEmpty(headNumbers)){
        str=headNumbers[0];
    }
    return Science.String.PadLeft(str,pchar,len);
}

Science.escapeRegEx = Science.String.escapeRegEx;
Science.replaceSubstrings = Science.String.replaceSubstrings;
Science.clearTags = Science.String.clearTags;
Science.joinStrings = Science.String.joinStrings;
Science.ipToNumber = Science.String.ipToNumber;
Science.queryStringify = Science.String.queryStringify;
Science.getParamsFormUrl = Science.String.getParamsFormUrl;

Science.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
//去除html标签,并且将连续空白字符替换为单个空格
Science.String.forceClear=function(string){
    return Science.String.clearTags(string).replace(/\s+/g," ").trim();
}