Template.registerHelper('getImageHelper', function(pictureId){
    var noPicture = "http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg";
    return (Images && pictureId && Images.findOne({_id: pictureId}).url()) || noPicture;
});

Template.registerHelper('isChinese', function(language){
    if(language==="zh-CN")
        return true;
    return false;
});

Template.registerHelper('translateThis', function(language,chinese,english){
    if(language==="zh-CN")
        return chinese;
    return english;
});

Template.registerHelper('getUrlToJournal', function(id,title){
    var name =Publishers.findOne({_id:id}).name
    return "/publisher/"+name+"/journal/"+title;
});


pluralize = function(n, thing, options) {
  var plural = thing;
  if (_.isUndefined(n)) {
    return thing;
  } else if (n !== 1) {
    if (thing.slice(-1) === 's')
      plural = thing + 'es';
    else
      plural = thing + 's';
  }

  if (options && options.hash && options.hash.wordOnly)
    return plural;
  else
    return n + ' ' + plural;
}

Template.registerHelper('pluralize', pluralize);
