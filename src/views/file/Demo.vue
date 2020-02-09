<template>
  <div>
    <button type="primary" style="width: 50%" @click="open(1)">起草底稿-->1</button>
    <button type="primary" style="width: 50%" @click="open(2)">正文排版-->2</button>
    <button type="primary" style="width: 50%" @click="open(3)">查看底稿-->3</button>
    <button type="primary" style="width: 50%" @click="open(5)">查看正文-->5</button>
    <button type="primary" style="width: 50%" @click="open(4)">编辑底稿-->4</button>
    <button type="primary" style="width: 50%" @click="open(6)">校核正文-->6</button>
    <button type="primary" style="width: 50%" @click="open(7)">保存办文单---7</button>
    <button type="primary" style="width: 50%" @click="open(8)">打印办文单---8</button>


  </div>
</template>

<script>
 import Ntko from './Ntko'
    export default {
        // components:{Ntko},
        data(){
          return{
            //ntko:false,

          }
        },
      computed:{

      },
      mounted:function(){
          let ntkoBrowser=require('./ntkobackground.min.js').ntkoBrowser
      },

      methods:{

        open(cmd){
          let ntkoBrowserFile=require('./ntkobackground.min.js').ntkoBrowser;
          let ntkoed=ntkoBrowserFile.ExtensionInstalled();
          // alert(ntkoBrowserFile);
          // alert(ntkoed);
          if(ntkoed){
            ntkoBrowserFile.openWindow(window.location.origin + "/ntko/editindex.html?cmd="+cmd+"&stable=oa_busdata10&tableid="+10+"&btnid="+14);
          }else{
            window.open(window.location.origin + "/ntko/exeindex.html")
          }

          window.ntkoCloseEvent=function () {
            // alert("跨浏览器插件应用程序窗口已关闭")
          }
        },
      }
    }
</script>

<style scoped>

</style>