<template>
  <!--<script type="text" src="../../../public/ntko/js/jquery-1.7.1.js"></script>-->
  <!-- , width: fixedHeader ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'  -->
  <a-layout-header
    style=""
    v-if="!headerBarFixed"
    :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed', ]"
    :style="{ padding: '0' }">
    <div v-if="mode === 'sidemenu'" class="header" :class="theme">
      <div style="width: 100%;height: 100%;position:absolute;z-index: -9999;">
        <img v-if="headerPic" style="width: 100%;height: 100%;" :src="headerPic"/>
        <img v-else style="width: 100%;height: 100%;" src="../../../src/assets/titlebg@2x.png"/>
      </div>
      <a-icon
        v-if="device==='mobile'"
        class="trigger"
        :type="collapsed ? 'menu-fold' : 'menu-unfold'"
        @click.native="toggle"></a-icon>
      <a-icon
        v-else
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click.native="toggle"/>

      <!--<span v-if="device === 'desktop'"></span>-->
      <!--<span v-else>Jeecg-Boot</span>-->

      <user-menu :theme="theme"/>
    </div>
    <!-- 顶部导航栏模式 -->
    <div v-else :class="['top-nav-header-index', theme]">
      <div class="header-index-wide">
        <div class="header-index-left" :style="topMenuStyle.headerIndexLeft">
          <logo class="top-nav-header" :show-title="device !== 'mobile'" :style="topMenuStyle.topNavHeader"/>
          <div v-if="device !== 'mobile'" :style="topMenuStyle.topSmenuStyle">
            <s-menu
              mode="horizontal"
              :menu="menus"
              :theme="theme"></s-menu>
          </div>
          <a-icon
            v-else
            class="trigger"
            :type="collapsed ? 'menu-fold' : 'menu-unfold'"
            @click.native="toggle"></a-icon>
        </div>
        <user-menu class="header-index-right" :theme="theme" :style="topMenuStyle.headerIndexRight"/>
      </div>
    </div>

  </a-layout-header>
</template>

<script>
  import UserMenu from '../tools/UserMenu'
  import {httpAction, getAction,postAction} from '@/api/manage'
  import SMenu from '../menu/'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import axios from 'axios'
  import Logo from '../tools/Logo'
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'GlobalHeader',
    components: {
      UserMenu,
      SMenu,
      Logo
    },
    mixins: [mixin],
    props: {
      mode: {
        type: String,
        // sidemenu, topmenu
        default: 'sidemenu'
      },
      menus: {
        type: Array,
        required: true
      },
      theme: {
        type: String,
        required: false,
        default: 'dark'
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      device: {
        type: String,
        required: false,
        default: 'desktop'
      }
    },
    data() {
      return {
        headerBarFixed: false,
        //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
        topMenuStyle: {
          headerIndexLeft: {},
          topNavHeader: {},
          headerIndexRight: {},
          topSmenuStyle: {}
        },
        headerPic:'',
        nowHeaderPic:'',
        picurl:'',
        src:''
      }
    },
    watch: {
      /** 监听设备变化 */
      device() {
        if (this.mode === 'topmenu') {
          this.buildTopMenuStyle()
        }
      },
      /** 监听导航栏模式变化 */
      mode(newVal) {
        if (newVal === 'topmenu') {
          this.buildTopMenuStyle()
        }
      }
    },
    //update-end--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
      //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
      if (this.mode === 'topmenu') {
        this.buildTopMenuStyle()
      }
      //update-end--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
      this.changeBGI();
    },
    created() {
      this.showHeader();
    },
    methods: {
      showHeader() {

        this.picurl = window._CONFIG['domianURL'] + '/oafile/groPicture/readPicture?resourceType=image',
          axios.get(this.picurl, {
            responseType: 'arraybuffer',
            headers: {
              'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
            }
          }).then(res => {

            if(this.nowHeaderPic != 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')) && res.data.byteLength >= 10){
              this.nowHeaderPic = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.headerPic = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.visible = true;
            }else{
              // this.headerPic = "";

              this.picDetail.headerPic = this.picDetail.nowHeaderPic;
            }

          })
      },
      handleScroll() {
        if (this.autoHideHeader) {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
          if (scrollTop > 100) {
            this.headerBarFixed = true
          } else {
            this.headerBarFixed = false
          }
        } else {
          this.headerBarFixed = false
        }
      },
      toggle() {
        this.$emit('toggle')
      },
      //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
      buildTopMenuStyle() {
        if (this.mode === 'topmenu') {
          if (this.device === 'mobile') {
            // 手机端需要清空样式，否则显示会错乱
            this.topMenuStyle.topNavHeader = {}
            this.topMenuStyle.topSmenuStyle = {}
            this.topMenuStyle.headerIndexRight = {}
            this.topMenuStyle.headerIndexLeft = {}
          } else {
            let rightWidth = '360px'
            this.topMenuStyle.topNavHeader = { 'min-width': '165px' }
            this.topMenuStyle.topSmenuStyle = { 'width': 'calc(100% - 165px)' }
            this.topMenuStyle.headerIndexRight = { 'min-width': rightWidth }
            this.topMenuStyle.headerIndexLeft = { 'width': `calc(100% - ${rightWidth})` }
          }
        }
      },
      //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----

      changeBGI(){
        document.querySelector('.layout .header.dark[data-v-6d229060]').style.background = "url(../../../src/assets/titlebg@2x.png) round !important";
      }
    }
  }
</script>

<style lang="scss" scoped>
  /* update_begin author:scott date:20190220 for: 缩小首页布局顶部的高度*/

  $height: 59px;

  .layout {

    .top-nav-header-index {

      .header-index-wide {
        margin-left: 10px;

        .ant-menu.ant-menu-horizontal {
          height: $height;
          line-height: $height;
        }
      }
      .trigger {
        line-height: 64px;
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }

    .header {
      z-index: 2;
      color:#fff;
      height: $height;
      background-color: #1890ff;
      transition: background 300ms;

      /* dark 样式 */
      &.dark {
        color: #fff;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        background-color: #055bc4 !important;
        /*background-image: url('../../../src/assets/titlebg@2x.png') !important;*/
        background-repeat: round !important;
      }
    }

    .header, .top-nav-header-index {
      &.dark .trigger:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .ant-layout-header {
    height: $height;
    line-height: $height;
  }

  /* update_end author:scott date:20190220 for: 缩小首页布局顶部的高度*/

</style>