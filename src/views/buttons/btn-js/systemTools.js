export const systemTool = {
  GetOs:function(){
   var version = navigator.userAgent;
   if(version.indexOf("Windows NT 5")!=-1) {
     return 'xp';
   }else if(version.indexOf("Windows NT 7")!=-1){
     return 'win7';
   }else if(version.indexOf("Windows NT 10")!=-1){
     return 'win10'
   }
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