<template>
  <div class="footer">
    <!--<div class="links">-->
      <!--<a href="http://www.jeecg.org" target="_blank">JEECG 首页</a>-->
      <!--<a href="https://github.com/zhangdaiscott/jeecg-boot" target="_blank">-->
        <!--<a-icon type="github"/>-->
      <!--</a>-->
      <!--<a href="https://ant.design/">Ant Design</a>-->
      <!--<a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/">Vue Antd</a>-->
    <!--</div>-->
    <div class="copyright">
      中国金融电子化公司版权所有
      <a-icon type="copyright"/>
      <span> 2016 All rights reserved</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LayoutFooter"
  }
</script>

<style lang="scss" scoped>
  .footer {
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;

    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, .45);

        &:hover {
          color: rgba(0, 0, 0, .65);
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
    }
  }
</style>