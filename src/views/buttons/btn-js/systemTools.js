export const systemTool = {
  GetOss:function(){
   var version = navigator.userAgent;
   if(version.indexOf("Windows NT 5")!=-1) {
     return 'xp';
   }else if(version.indexOf("Windows NT 7")!=-1){
     return 'win7';
   }else if(version.indexOf("Windows NT 10")!=-1){
     return 'win10'
   }
  },
  getOS: function () {
  var sUserAgent = navigator.userAgent;
  var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
  var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
  if (isMac) return "Mac";
  var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
  if (isUnix) return "Unix";
  var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
  if (isLinux) return "Linux";
  if (isWin) {
    var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
    if (isWin2K) return "Win2000";
    var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
    if (isWinXP) return "WinXP";
    var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
    if (isWin2003) return "Win2003";
    var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
    if (isWinVista) return "WinVista";
    var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
    if (isWin7) return "Win7";
    var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
    if (isWin10) return "Win10";
  }
  return "other";
},
  getBrowserInfo:function () {
  var agent = navigator.userAgent.toLowerCase() ;
  var regStr_ie = /msie [\d.]+;/gi ;
  var regStr_ff = /firefox\/[\d.]+/gi
  var regStr_chrome = /chrome\/[\d.]+/gi ;
  var regStr_saf = /safari\/[\d.]+/gi ;
  //IE11以下
  if(agent.indexOf("msie") > 0)
  {
    return agent.match(regStr_ie) ;
  }
  //IE11版本中不包括MSIE字段
  if(agent.indexOf("trident") > 0&&agent.indexOf("rv") > 0){
    return "IE " + agent.match(/rv:(\d+\.\d+)/) [1];
  }
  //firefox
  if(agent.indexOf("firefox") > 0)
  {
    return agent.match(regStr_ff) ;
  }
  //Chrome
  if(agent.indexOf("chrome") > 0)
  {
    return agent.match(regStr_chrome) ;
  }
  //Safari
  if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
  {
    return agent.match(regStr_saf) ;
  }
}
}


// getAddress
// {/*<script src="http://pv.sohu.com/cityjson?ie=utf-8"></script>*/}
// {/*export function GetAddress () {*/}
//   {/*return returnCitySN*/}
// {/*}*/}