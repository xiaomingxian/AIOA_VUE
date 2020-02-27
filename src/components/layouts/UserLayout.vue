<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <img v-if="picDetail.pic2" :src="picDetail.pic2" class="logo" alt="logo">
            <img v-else src="~@/assets/logo2x.png" class="logo" alt="logo">
            <span v-if="picDetail.pictrueText"  class="title">{{picDetail.pictrueText}}</span>
            <!--<span v-else class="title">AI综合办公服务平台</span>-->
          </a>
        </div>
        <div class="desc">
          <!--Jeecg Boot 是中国最具影响力的 企业级 快速开发平台-->
        </div>
      </div>

      <route-view></route-view>

      <div class="footer">
        <!--<div class="links">-->
          <!--<a href="http://jeecg-boot.mydoc.io" target="_blank">帮助</a>-->
          <!--<a href="https://github.com/zhangdaiscott/jeecg-boot" target="_blank">隐私</a>-->
          <!--<a href="https://github.com/zhangdaiscott/jeecg-boot" target="_blank">条款</a>-->
        <!--</div>-->
        <!--<div class="copyright">-->
          <!--Copyright &copy; 2019 <a href="http://www.jeecg.org" target="_blank">JEECG开源社区</a> 出品-->
        <!--</div> -->
        <div class="copyright">
          中国金融电子化公司版权所有
          <a-icon type="copyright"/>
          <span> 2016 All rights reserved</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RouteView from "@/components/layouts/RouteView"
  import { mixinDevice } from '@/utils/mixin.js'
  import { getAction,postAction } from '@/api/manage'
  import axios from 'axios'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import Vue from 'vue'

  export default {
    name: "UserLayout",
    components: { RouteView },
    mixins: [mixinDevice],
    data () {
      return {
        picDetail:{
          pictrueText:'',
          pic2:'',
          nowPic2:''
        },
        url:{
          getLoginText: '/oafile/LoginPicture/loginPictrue',
          getPictrueText: '/oafile/LoginPicture/getPictrueText',
        }
      }
    },
    mounted () {
      document.body.classList.add('userLayout')
    },
    beforeDestroy () {
      document.body.classList.remove('userLayout')
    },
    created (){
      this.showSign();
    },
    methods:{
      getText(){

        postAction(this.url.getPictrueText).then(res => {

          if (res.success){

            if(res.result == null){

              this.picDetail.pictrueText = "中国人民银行";

            }else {

                if (typeof this.getCaption(res.result) == 'object') {

                  if (this.getCaption(res.result)[0] == '') {

                    this.picDetail.pictrueText = "中国人民银行";

                  } else {

                    this.picDetail.pictrueText = this.getCaption(res.result)[0];

                  }

                } else {

                  this.picDetail.pictrueText = res.result;

                }


            }
          }
        })
      },

    // getPicText(){
    //   postAction(this.url.getPictrueText).then(res => {
    //     if (res.success){
    //     if (res.result == null){
    //       this.picDetail.pictrueText = "中国人民银行";
    //     } else {
    //       if(typeof this.getCaption(res.result) == 'string'){
    //         this.picDetail.pictrueText = this.getCaption(res.result);
    //       }else {
    //         this.picDetail.pictrueText = res.result;
    //       }
    //     }
    //   }
    // })
    // },

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

            if(this.picDetail.nowPic2 != 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')) && res.data.byteLength >= 10){
              this.picDetail.nowPic2 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.picDetail.pic2 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.visible = true;
            }else{
              // this.picDetail.pic2 = "";

              this.picDetail.pic2 = this.picDetail.nowPic2;
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
        // console.log(obj)
        return obj;
      }
    }
  }
</script>

<style lang="scss" scoped>

  #userLayout{
    overflow: hidden;
  }

  #userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }

    .container {
      width: 100%;
      min-height: 100%;
      background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
      background-size: 100%;
      padding: 110px 0 144px;
      position: relative;

      a {
        text-decoration: none;
      }

      .top {
        text-align: center;

        .header {
          width:176%;
          height: 44px;
          line-height: 44px;
          position: fixed;
          left: -67%;
          top: 26%;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            /*margin-right: 16px;*/
            border-style: none;
          }

          .title {
            font-size: 26px;
            color: rgba(0, 0, 0, .85);
            /*background-color: #f0f2f5;*/
            background-color: transparent !important;
            font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
</style>