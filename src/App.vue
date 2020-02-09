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