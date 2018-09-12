Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份 
    "d+": this.getDate(),                    //日 
    "h+": 0,                   //小时 
    "m+": 0,                 //分 
    "s+": 0,                 //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": 0            //毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}   

function getFormatDate(date) {  
  return date.format("yyyy-MM-dd hh:mm:ss");
}

function addDate(date, days) {
 
  date.setDate(date.getDate() + days);
  return date.format("yyyy-MM-dd hh:mm:ss");
} 


module.exports.getFormatDate = getFormatDate; 

module.exports.addDate = addDate; 