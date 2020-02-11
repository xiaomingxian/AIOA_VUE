<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">

      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->
      <img v-if="navTheme === 'dark' && picDetail.pic2" :src="picDetail.pic2" alt="logo">
      <img v-else-if="navTheme === 'dark'" src="~@/assets/logo2x.png" alt="logo">
      <img v-else src="~@/assets/logo2x.png" alt="logo">
      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo颜色根据主题颜色变化 -->
      <h1 v-if="showTitle && picDetail.logoText">{{ picDetail.logoText }}</h1>
      <h1 v-else-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import { getAction,postAction } from '@/api/manage'
  import axios from 'axios'
  import Vue from 'vue'
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    mixins: [mixin],
    props: {
      title: {
        type: String,
        default: '中国人民银行',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    },
    data () {
      return {
        picDetail:{
          logoText:'',
          pic2:'',
        },
        url:{
          getPictrueText: '/oafile/LoginPicture/getPictrueText',
        }
      }
    },
    created (){
      this.showSign()
    },
    methods:{

      // getPicText(){
      //   postAction(this.url.getPictrueText).then(res => {
      //     if (res.success){
      //       console.log(res)
      //       if (res.result == null){
      //         this.picDetail.pictrueText = "中国人民银行";
      //       } else {
      //         this.iisCalendar = true;
      //         this.picDetail.pictrueText = res.result;
      //       }
      //     }
      //   })
      // },

      getText(){

        postAction(this.url.getPictrueText).then(res => {
          if (res.success){
            if (res.result == null){
              this.picDetail.logoText = "中国人民银行";
            } else {
              if(typeof this.getCaption(res.result) == 'object'){
                this.picDetail.logoText = this.getCaption(res.result)[1];
              }else {
                this.picDetail.logoText = res.result;
              }
            }
          }
        })
      },

      //显示当前已确认使用的图片
      showSign() {
        this.getText();
        this.picDetail.picurl2 = window._CONFIG['domianURL'] + '/oafile/signPicture/readPicture?resourceType=image',
          axios.get(this.picDetail.picurl2, {
            responseType: 'arraybuffer',
            headers: {
              'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
            }
          }).then(res => {
            if(res.data.byteLength >= 10){
              this.picDetail.pic2='data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.visible = true;
            }else{
              this.picDetail.pic2 = ""
            }
          })
      },
      getCaption(obj,state){
        let index = obj.lastIndexOf("\&");
        if(index == -1){
          return obj;
        }else {
          if(state == 0){
            obj = obj.substring(0,index);
          }else if(state == 1){
            obj = obj.substring(index+1,obj.length);
          }else {
            obj = [obj.substring(0,index),obj.substring(index+1,obj.length)];
          }
        }
        return obj;
      }
    }
  }

</script>



<style lang="scss" scoped>
  /*缩小首页布 局顶部的高度*/
  $height: 59px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: $height !important;
      line-height: $height !important;
      box-shadow: none !important;
      background-color: #055bc4;
      transition: background 300ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      background-color: #1890ff;
    }
  }
</style>