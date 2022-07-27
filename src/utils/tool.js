export function formatDate(dateStr, format = "YYYY-MM-DD") {
  let date = dateStr ? new Date(dateStr) : new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  let MAP_DATE = {
    YYYY: year,
    MM: formateNum(month),
    DD: formateNum(day),
    hh: formateNum(hour),
    mm: formateNum(minutes),
    ss: formateNum(seconds),
  };
  Object.keys(MAP_DATE).forEach((item) => {
    //遍历MAP_DATE的属性名，查看format有则替换为对应的属性值
    format = format.replace(item, MAP_DATE[item]);
  });
  return format;
}

function formateNum(num) {
  //封装单个数字补0方法
  return String(num).length > 1 ? num : "0" + num;
}
