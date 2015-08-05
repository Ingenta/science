Science.escapeRegEx = function (string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

Science.replaceSubstrings = function (string, find, replace) {
    if (string===undefined)return string;
    return string.replace(new RegExp(Science.escapeRegEx(find), 'g'), replace);
};

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
