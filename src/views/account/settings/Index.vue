<template>
  <div class="page-header-index-wide">
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <div class="account-settings-info-main" :class="device" :style=" 'min-height:'+ mainInfoHeight " >
        <div class="account-settings-info-left" >
          <a-menu
            :mode="device == 'mobile' ? 'horizontal' : 'inline'"
            :style="{ border: '0', width: device == 'mobile' ? '560px' : 'auto'}"
            :defaultSelectedKeys="defaultSelectedKeys"
            type="inner"
            @openChange="onOpenChange"

          >
          <!--  <a-menu-item key="/account/settings/base">
              <router-link :to="{ name: 'account-settings-base' }">
                个人设置
              </router-link>
            </a-menu-item>-->
           <!--<a-menu-item key="/account/settings/security">
              <router-link :to="{ name: 'account-settings-security' }">
                安全设置
              </router-link>
            </a-menu-item>-->
            <!--<a-menu-item key="/account/settings/custom">
              <router-link :to="{ name: 'account-settings-custom' }">
                个性化
              </router-link>
            </a-menu-item>-->
           <!-- <a-menu-item key="/account/settings/binding">
              <router-link :to="{ name: 'account-settings-binding' }">
                账户绑定
              </router-link>
            </a-menu-item>
            <a-menu-item key="/account/settings/notification">
              <router-link :to="{ name: 'account-settings-notification' }">
                新消息通知
              </router-link>
            </a-menu-item>-->

            <a-menu-item key="/account/settings/new">
              <router-link :to="{ name: 'account-settings-new' }">
               个性设置
              </router-link>
            </a-menu-item>
            <a-menu-item key="/account/settings/opinion">
              <router-link :to="{ name: 'account-settings-opinion' }">
                快捷意见
              </router-link>
            </a-menu-item>
            <a-menu-item key="/system/SysUserAgentList">
              <router-link :to="{ name: 'system-SysUserAgentList' }">
                任务委托
              </router-link>
            </a-menu-item>
            <a-menu-item key="/oaTeamwork/oaTeamworkList">
              <router-link :to="{ name: 'oaTeamwork-oaTeamworkList' }">
                协同配置
              </router-link>
            </a-menu-item>
          </a-menu>
        </div>
        <div class="account-settings-info-right">
          <div class="account-settings-info-title">
            <span>{{ $route.meta.title }}</span>
          </div>
          <route-view></route-view>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
  import PageLayout from '@/components/page/PageLayout'
  import RouteView from "@/components/layouts/RouteView"
  import { mixinDevice } from '@/utils/mixin.js'

  export default {
    components: {
      RouteView,
      PageLayout
    },
    mixins: [mixinDevice],
    data () {
      return {
        // horizontal  inline
        mode: 'inline',
        mainInfoHeight:"100%",
        openKeys: [],
        defaultSelectedKeys: [],

        // cropper
        preview: {},
        option: {
          img: '/avatar2.jpg',
          info: true,
          size: 1,
          outputType: 'jpeg',
          canScale: false,
          autoCrop: true,
          // 只有自动截图开启 宽度高度才生效
          autoCropWidth: 180,
          autoCropHeight: 180,
          fixedBox: true,
          // 开启宽度和高度比例
          fixed: true,
          fixedNumber: [1, 1]
        },

        pageTitle: ''
      }
    },
    created () {
      this.updateMenu()
    },
    mounted(){
      this.mainInfoHeight = (window.innerHeight-285)+"px";
    },
    methods: {
    /*  onOpenChange (openKeys) {
        this.openKeys = openKeys
      },*/
      updateMenu () {
        let routes = this.$route.matched.concat()
        this.defaultSelectedKeys = [ routes.pop().path ]
      }
    },
  }
</script>

<style lang="scss" scoped>
  .account-settings-info-main {
    width: 100%;
    display: flex;
    height: 100%;
    overflow: auto;
    position: relative;
    bottom: 16px;
    margin-bottom: -2.35%;

    &.mobile {
      display: block;

      .account-settings-info-left {
        border-right: unset;
        border-bottom: 1px solid #e8e8e8;
        width: 100%;
        height: 50px;
        overflow-x: auto;
        overflow-y: scroll;
      }
      .account-settings-info-right {
        padding: 20px 40px;
      }
    }

    .account-settings-info-left {
      border-right: 1px solid #e8e8e8;
      width: 224px;
      background:linear-gradient(225deg,rgba(178,255,255,1),rgba(167,186,247,1)) repeat scroll 0% 0%;
    }

    .account-settings-info-right {
      flex: 1 1;
      padding: 27px 40px;

      .account-settings-info-title {
        color: rgba(0,0,0,.85);
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        margin-bottom: 12px;
      }
      .account-settings-info-view {
        padding-top: 12px;
      }
    }
  }

  .ant-menu-inline{
    background-color: transparent !important;
  }

  .ant-menu-item a{
    color: #666 !important;
  }

  .ant-menu-item a:hover{
    color: #022570 !important;
  }

  .ant-menu-item-selected{
    background: rgba(0,0,0,0) linear-gradient(to right,rgb(221,221,255),rgb(167,196,255)) repeat scroll 0% 0%;
  }

  .ant-menu-item-selected a{
    color: #2f54eb !important;
  }

  /deep/.ant-btn-default{
    color: #fff;
    background:linear-gradient(180deg,rgba(115,128,255,1),rgba(47,86,255,1)) repeat scroll 0% 0% !important;
  }

  /deep/.ant-btn-default svg{
    fill:cyan;
  }

  /deep/.ant-switch-checked{
    background:linear-gradient(180deg,rgba(115,128,255,1),rgba(47,86,255,1)) repeat scroll 0% 0%;
  }
</style>