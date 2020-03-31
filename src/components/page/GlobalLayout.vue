<template >
  <a-layout class="layout" :class="[device]">

    <template v-if="navisshow">
      <template v-if="layoutMode === 'sidemenu'">
        <a-drawer
          v-if="device === 'mobile'"
          :wrapClassName="'drawer-sider ' + navTheme"
          placement="left"
          @close="() => this.collapsed = false"
          :closable="false"
          :visible="collapsed"
          width="200px"
        >
          <side-menu
            mode="inline"
            :menus="menus"
            @menuSelect="menuSelect"
            :theme="navTheme"
            :collapsed="false"
            :collapsible="true"></side-menu>
        </a-drawer>

        <side-menu
          v-else
          mode="inline"
          :menus="menus"
          @menuSelect="myMenuSelect"
          :theme="navTheme"
          :collapsed="collapsed"
          :collapsible="true"></side-menu>
      </template>
      <!-- 下次优化这些代码 -->
      <template v-else>
        <a-drawer
          v-if="device === 'mobile'"
          :wrapClassName="'drawer-sider ' + navTheme"
          placement="left"
          @close="() => this.collapsed = false"
          :closable="false"
          :visible="collapsed"
          width="200px"
        >
          <side-menu
            mode="inline"
            :menus="menus"
            @menuSelect="menuSelect"
            :theme="navTheme"
            :collapsed="false"
            :collapsible="true"></side-menu>
        </a-drawer>
      </template>
    </template>

    <a-layout
      :class="[layoutMode, `content-width-${contentWidth}`]"
      :style="{ paddingLeft: fixSiderbar && isDesktop() ? `${sidebarOpened ? 200 : 80}px` : '0' }">
      <!-- layout header -->
      <global-header
        v-if="navisshow"
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', paddingTop: fixedHeader ? '59px' : '0' }">
        <slot></slot>
      </a-layout-content>

      <!-- layout footer -->
      <!--<a-layout-footer style="padding: 0px">-->
      <!--<global-footer/>-->
      <!--</a-layout-footer>-->
    </a-layout>

    <setting-drawer></setting-drawer>
  </a-layout>
</template>

<script>
  import SideMenu from '@/components/menu/SideMenu'
  import GlobalHeader from '@/components/page/GlobalHeader'
  import GlobalFooter from '@/components/page/GlobalFooter'
  import SettingDrawer from '@/components/setting/SettingDrawer'
  import { triggerWindowResizeEvent } from '@/utils/util'
  import { mapState, mapActions } from 'vuex'
  import { mixin, mixinDevice } from '@/utils/mixin.js'
  import { getAction } from '@/api/manage'

  // import $ from  'jquery'

  export default {
    name: 'GlobalLayout',
    components: {
      SideMenu,
      GlobalHeader,
      GlobalFooter,
      SettingDrawer
    },
    mixins: [mixin, mixinDevice],
    data() {
      return {
        navisshow:true,
        collapsed: false,
        activeMenu:{},
        menus: [],
        iisFontSize: '16px'
      }
    },
    computed: {
      ...mapState({
        // 主路由
        mainRouters: state => state.permission.addRouters,
        // 后台菜单
        permissionMenuList: state => state.user.permissionList
      })
    },
    watch: {
      sidebarOpened(val) {
        this.collapsed = !val
      }
    },
    created() {
      document.title = 'AI综合办公服务平台'

      // this.hidden = this.$route.query.hidden;
      // alert(this.$route.query.navisshow)
      if(!this.$route.query.navisshow){
        this.navisshow = true
      }else{
        this.navisshow = false
      }

      //--update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
      //this.menus = this.mainRouters.find((item) => item.path === '/').children;
      this.menus = this.permissionMenuList
      // 根据后台配置菜单，重新排序加载路由信息
      console.log('----加载菜单逻辑----')
      console.log(this.mainRouters)
      console.log(this.permissionMenuList)
      console.log('----navTheme------'+this.navTheme)
      //--update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------

      this.setFontSize();
    },

    mounted(){

    },
    methods: {
      ...mapActions(['setSidebar']),
      setFontSize(){
        const  userid =JSON.parse( localStorage.getItem('userdata')).userInfo.id;
        let url = "/testt/sysUserSet/queryByUserId";
        getAction(url,{userId:userid}).then((res) => {
          if(res.result.iisFontSize == 1){
            this.iisFontSize = '18px';
          }else if(res.result.iisFontSize == 3){
            this.iisFontSize = '14px';
          }else{
            this.iisFontSize = '16px';
          }
          document.getElementsByTagName('body')[0].style.fontSize = this.iisFontSize;
          // for(let i = 0;i < document.getElementsByClassName('ant-table').length;i++){
          //   document.getElementsByClassName('ant-table')[i].style.fontSize = this.iisFontSize;
          // }
        })
      },
      toggle() {
        this.collapsed = !this.collapsed
        this.setSidebar(!this.collapsed)
        triggerWindowResizeEvent()
      },
      menuSelect() {
        if (!this.isDesktop()) {
          this.collapsed = false
        }
      },
      //update-begin-author:taoyan date:20190430 for:动态路由title显示配置的菜单title而不是其对应路由的title
      myMenuSelect(value){
        //此处触发动态路由被点击事件
        this.findMenuBykey(this.menus,value.key)
        this.$emit("dynamicRouterShow",value.key,this.activeMenu.meta.title)
      },
      findMenuBykey(menus,key){
        for(let i of menus){
          if(i.path==key){
            this.activeMenu = {...i}
          }else if(i.children && i.children.length>0){
            this.findMenuBykey(i.children,key)
          }
        }
      }
      //update-end-author:taoyan date:20190430 for:动态路由title显示配置的菜单title而不是其对应路由的title
    }
  }

</script>

<style lang="scss">
  body {
    // 打开滚动条固定显示
    overflow-y: scroll;
    /*font-size: 16px !important;*/

    &.colorWeak {
      filter: invert(80%);
    }
  }

  .layout {
    min-height: 100vh !important;
    overflow-x: hidden;

    &.mobile {

      .ant-layout-content {
        .content {
          margin: 24px 0 0;
        }
      }

      /**
       * ant-table-wrapper
       * 覆盖的表格手机模式样式，如果想修改在手机上表格最低宽度，可以在这里改动
       */
      .ant-table-wrapper {
        .ant-table-content {
          overflow-y: auto;
        }
        .ant-table-body {
          min-width: 800px;
        }
      }
      .sidemenu {
        .ant-header-fixedHeader {

          &.ant-header-side-opened, &.ant-header-side-closed {
            width: 100%
          }
        }
      }

      .topmenu {
        /* 必须为 topmenu  才能启用流式布局 */
        &.content-width-Fluid {
          .header-index-wide {
            margin-left: 0;
          }
        }
      }
      .header, .top-nav-header-index {
        .user-wrapper .action {
          padding: 0 12px !important;
        }
      }
    }

    &.ant-layout-has-sider {
      flex-direction: row;
    }

    .trigger {
      font-size: 22px;
      line-height: 42px;
      padding: 0 18px;
      cursor: pointer;
      transition: color 300ms, background 300ms;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    .topmenu {
      .ant-header-fixedHeader {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        width: 100%;
        transition: width .2s;

        &.ant-header-side-opened {
          width: 100%;
        }

        &.ant-header-side-closed {
          width: 100%;
        }
      }
      /* 必须为 topmenu  才能启用流式布局 */
      &.content-width-Fluid {
        .header-index-wide {
          max-width: unset;
          margin-left: 24px;
        }

        .page-header-index-wide {
          max-width: unset;
        }
      }

    }

    .sidemenu {
      .ant-header-fixedHeader {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        width: 100%;
        transition: width .2s;

        &.ant-header-side-opened {
          width: calc(100% - 200px)
        }

        &.ant-header-side-closed {
          width: calc(100% - 80px)
        }
      }
    }

    .header {
      height: 64px;
      padding: 0 12px 0 0;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
      position: relative;
    }

    .header, .top-nav-header-index {

      .user-wrapper {
        float: right;
        height: 100%;

        .action {
          cursor: pointer;
          padding: 0 14px;
          display: inline-block;
          transition: all .3s;

          height: 70%;
          line-height: 46px;

          &.action-full {
            height: 100%;
          }

          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .avatar {
            margin: 20px 10px 20px 0;
            color: #1890ff;
            background: hsla(0, 0%, 100%, .85);
            vertical-align: middle;
          }

          .icon {
            font-size: 16px;
            padding: 4px;
          }
        }
      }

      &.dark {
        .user-wrapper {

          .action {
            color: black;

            &:hover {
              background: rgba(0, 0, 0, 0.05);
            }
          }
        }
      }
    }

    &.mobile {
      .top-nav-header-index {

        .header-index-wide {

          .header-index-left {

            .trigger {
              color: rgba(255, 255, 255, 0.85);
              padding: 0 12px;
            }

            .logo.top-nav-header {
              text-align: center;
              width: 56px;
              line-height: 58px;
            }
          }
        }

        .user-wrapper .action .avatar {
          margin: 20px 0;
        }

        &.light {

          .header-index-wide {

            .header-index-left {
              .trigger {
                color: rgba(0, 0, 0, 0.65);
              }
            }
          }
          //
        }
      }
    }

    &.tablet {
      // overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
      .top-nav-header-index {

        .header-index-wide {

          .header-index-left {
            .logo > a {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }

    }

    .top-nav-header-index {
      background-color:  #055bc4;
      box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
      position: relative;
      transition: background .3s, width .2s;

      .header-index-wide {
        width: 100%;
        margin: auto;
        padding: 0 20px 0 0;
        display: flex;
        height: 59px;

        .ant-menu.ant-menu-horizontal {
          border: none;
          height: 64px;
          line-height: 64px;
        }

        .header-index-left {
          flex: 1 1;
          display: flex;

          .logo.top-nav-header {
            width: 165px;
            height: 64px;
            position: relative;
            line-height: 64px;
            transition: all .3s;
            overflow: hidden;

            img {
              display: inline-block;
              vertical-align: middle;
              height: 32px;
            }

            h1 {
              color: #fff;
              display: inline-block;
              vertical-align: top;
              font-size: 16px;
              margin: 0 0 0 12px;
              font-weight: 400;
            }
          }
        }

        .header-index-right {
          float: right;
          height: 59px;
          overflow: hidden;
          .action:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
        }
      }

      &.light {
        background-color: #fff;

        .header-index-wide {
          .header-index-left {
            .logo {
              h1 {
                color: #002140;
              }
            }
          }
        }
      }

      &.dark {

        .user-wrapper {

          .action {
            color: white;

            &:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          }
        }
        .header-index-wide .header-index-left .trigger:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }

    }

    // 内容区
    .layout-content {
      margin: 24px 24px 0px;
      height: 64px;
      padding: 0 12px 0 0;
    }

  }

  .topmenu {
    .page-header-index-wide {
      margin: 0 auto;
      width: 100%;
    }
  }

  // drawer-sider 自定义
  .ant-drawer.drawer-sider {
    .sider {
      box-shadow: none;
    }

    &.dark {
      .ant-drawer-content {
        background-color: rgb(0, 21, 41);
      }
    }
    &.light {
      box-shadow: none;
      .ant-drawer-content {
        background-color: #fff;
      }
    }

    .ant-drawer-body {
      padding: 0
    }
  }

  // 菜单样式
  .sider {
    box-shadow: 2px 116px 6px 0 rgba(0, 21, 41, .35);
    position: relative;
    z-index: 10;

    &.ant-fixed-sidemenu {
      position: fixed;
      height: 100%;
    }

    .logo {
      height: 64px;
      position: relative;
      line-height: 64px;
      padding-left: 24px;
      -webkit-transition: all .3s;
      transition: all .3s;
      background: #002140;
      overflow: hidden;

      img, h1 {
        display: inline-block;
        vertical-align: middle;
      }

      img {
        height: 32px;
      }

      h1 {
        color: #fff;
        font-size: 18px;
        margin: 0 0 0 8px;
        font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 600;
      }
    }

    &.light {
      background-color: #fff;
      box-shadow: 2px 116px 8px 0 rgba(29, 35, 41, 0.05);

      .logo {
        background: #fff;
        box-shadow: 1px 1px 0 0 #e8e8e8;

        h1 {
          color: unset;
        }
      }

      .ant-menu-light {
        border-right-color: transparent;
      }
    }

  }

  // 外置的样式控制
  .user-dropdown-menu-wrapper.ant-dropdown-menu {
    /*background-color: #8cc8ff;*/
    padding: 4px 0;

    .ant-dropdown-menu-item {
      width: 160px;
      font-size: 15px;
      padding-left:27px;
    }

    .ant-dropdown-menu-item span {
      margin-left:7px;
    }

    .ant-dropdown-menu-item > a > i{
      font-size: 17px;
    }

    .ant-dropdown-menu-item > i {
      font-size: 17px;
    }

    .ant-dropdown-menu-item > .anticon:first-child,
    .ant-dropdown-menu-item > a > .anticon:first-child,
    .ant-dropdown-menu-submenu-title > .anticon:first-child,
    .ant-dropdown-menu-submenu-title > a > .anticon:first-child {
      min-width: 12px;
      margin-right: 8px;
    }

  }

  // 数据列表 样式
  .table-alert {
    margin-bottom: 16px;
  }

  .table-page-search-wrapper {

    .ant-form-inline {

      .ant-form-item {
        display: flex;
        margin-bottom: 24px;
        margin-right: 0;

        .ant-form-item-control-wrapper {
          flex: 1 1;
          display: inline-block;
          vertical-align: middle;
        }

        > .ant-form-item-label {
          line-height: 32px;
          padding-right: 8px;
          width: auto;
        }
        .ant-form-item-control {
          height: 32px;
          line-height: 32px;
        }
      }
    }

    .table-page-search-submitButtons {
      display: block;
      margin-bottom: 24px;
      white-space: nowrap;
    }

  }

  .content {

    .table-operator {
      margin-bottom: 18px;

      button {
        margin-right: 8px;
      }
    }
  }


  .tab-layout-tabs.ant-tabs{
    background: rgba(0,0,0,0) linear-gradient(to bottom,rgb(221,221,255),rgb(167,196,255)) repeat scroll 0% 0%;
    border-bottom:1px solid #898cff !important;
  }

  .ant-tabs.ant-tabs-card>.ant-tabs-bar .ant-tabs-tab{
    font-size: 15px !important;
    background-color: transparent !important;
  }

  .ant-tabs.ant-tabs-card>.ant-tabs-bar .ant-tabs-tab:hover{
    color: #0061cb !important;
  }

  .ant-tabs.ant-tabs-card>.ant-tabs-bar .ant-tabs-tab .anticon{
    color: #fff  !important;
    top: 17% !important;
  }

  .ant-tabs.ant-tabs-card>.ant-tabs-bar .ant-tabs-tab-active{
    color: #fff  !important;
    background-color: #2eabff !important;
    border-radius: 7% !important;
  }

  .ant-layout{
    background-color: #c3d3e3 !important;
  }

  .ant-layout-footer{
    display: none;
    background-color: #c3d3e3 !important;
  }

</style>

<style>
  .ant-form label{
    font-size: 16px !important;
  }

  .ant-input{
    background-color: #f0f5fc;
  }

  .ant-select-selection--single{
    background-color: #f0f5fc !important;
  }

  .ant-select-selection__placeholder{
     color: rgba(0, 0, 0, 0.65) !important;
  }

  /*.ant-table{*/
    /*font-size: 16px !important;*/
  /*}*/

  /*.ant-table-thead {*/
    /*font-size: 17px;*/
  /*}*/

  .ant-table-thead > tr > th{
    color: #fff !important;
    background-color: #006db9 !important;
    /*border: none !important;*/
    border-right:1px solid #779ecb !important;
  }

  /*.ant-table-tbody{*/
    /*font-size: 16px;*/
  /*}*/

  .light-row{
    background-color: #fff;
  }

  .dark-row{
    /*background:linear-gradient(to bottom,rgb(221,221,255),rgb(167,196,255)) repeat scroll 0% 0%;*/
    /*background-color: #c2d9f8;*/
    background-color: #fff;
  }

  .dark-row:hover{
    background-color: #ffadd2;
  }

  .table-page-search-submitButtons .ant-btn{
    background:linear-gradient(180deg,rgba(115,128,255,1),rgba(47,86,255,1)) repeat scroll 0% 0%;
  }

  .table-page-search-submitButtons .ant-btn svg{
    fill:cyan;
  }

  .ant-input-disabled{
    background-color: #fff !important;
    color: rgba(0, 0, 0, .65) !important;
  }

  .ant-modal-header{
    background-color: #d6ebff !important;
  }

  .ant-modal-footer{
    background-color: #d6ebff !important;
  }

  .ant-drawer-header{
    background-color: #d6ebff !important;
  }

  .ant-drawer-footer{
    background-color: #d6ebff !important;
  }

  .ant-modal-title{
    font-weight: bolder !important;
    border-left: 3px solid #1890ff;
    padding-left: 10px;
  }

  .ant-notification{
    margin-right:39% !important;
  }
</style>