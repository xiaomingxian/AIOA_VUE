<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view v-if="isRouterActive" />
    </div>
  </a-locale-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import enquireScreen from '@/utils/device'

  export default {
    inject: ['reload'],
    data () {
      return {
        locale: zhCN,
        isRouterActive:true
      }
    },
    provide(){
      return {
        reload:this.reload
      }
    },
    watch: {
      // '$route.path': function (newVal, oldVal) {
      //   if (newVal.includes('analysis') || newVal.includes('NewOneParts') || newVal.includes('daynnalysis')) {
      //     this.reload();
      //   }
      // }
    },
    created () {
      let that = this
      enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }

      })


      //监听页签切换 监听当页面是活动页时  刷新页面

      // var _this = this;
      //
      // document.addEventListener('visibilitychange', function () {
      //   // document.title = document.hidden?'拜拜11111':' 回来啦2222'
      //   if (document.hidden) {
      //
      //     console.log(_this.$route.path.endsWith('NewOneParts'));
      //     if (_this.$route.path.endsWith('NewOneParts') || _this.$route.path.endsWith('analysis') || _this.$route.path.endsWith('daynnalysis')) {
      //       _this.reload()
      //
      //     }
      //   }
      // })



    },
    methods:{
      reload(){
        this.isRouterActive = false;
        this.$nextTick(()=>{
          this.isRouterActive = true
        })
      }
    }
  }
</script>
<style>
  #app {
    height: 100%;
  }
</style>