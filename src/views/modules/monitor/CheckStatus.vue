<template>
  <a-card title="WEB服务器">
    <a-row>
      <template>
        <a-col>
          <iframe width="100%" height="500" frameborder="0" :src=htmlUrl></iframe>
        </a-col>
      </template>
    </a-row>
  </a-card>
</template>

<script>
  export default {
    name: "CheckStatus.vue",
    data() {
      return {
        htmlUrl: '',
        description: 'WEB服务器'
      }
    },
    mounted() {
      this.htmlUrl = window.location.origin + "/nginx/checkstatus.html";
    },
    methods: {}
  }
</script>

<style scoped>

</style>