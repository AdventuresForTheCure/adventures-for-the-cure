exports.encode = function(value) {
  var str = value;
  return str.replace(/<|>/ig,function(m){
    return '&'+(m=='>'?'g':'l')+'t;';
  });
};