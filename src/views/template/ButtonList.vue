<template>
  <a-card :bordered="false">


    <!-- 操作按钮区域 -->
    <div class="table-operator">

      <!--填写意见-->
      <a-button @click="writeOpinion" type="primary" icon="plus">填写意见</a-button>

      <!--登记文号-->
      <a-button @click="djDocNum" type="primary" icon="plus">登记文号</a-button>

      <!--引入公文链接-->
      <a-button @click="yrOfficeDoc" type="primary" icon="plus">引入公文链接</a-button>

      <!--修改文头-->
      <a-button @click="updatePaperTitle" type="primary" icon="plus">修改文头</a-button>

      <!--封发日期-->
      <a-button @click="delTime" type="primary" icon="plus">封发日期</a-button>

      <!--批量审阅-->
      <a-button @click="piliang" type="primary" icon="plus">批量审阅</a-button>

      <!--引入办文依据-->
      <a-button @click="banwenModal" type="primary" icon="plus">引入办文依据</a-button>

      <!--查看意见-->
      <a-button @click="opinionModal" type="primary" icon="plus">查看意见</a-button>

      <a-button @click="showRead" type="primary" icon="plus">已读情况查看</a-button>


    </div>

    <!-- 表单区域 -->
    <suggesttion-modal ref="opinionForm"></suggesttion-modal>
    <dengjiwenhao-modal ref="docNumForm" ></dengjiwenhao-modal>
    <yin-ru-fu-jian-modal ref="officeForm"></yin-ru-fu-jian-modal>
    <updatePaperTitle-modal ref="titleForm"></updatePaperTitle-modal>
    <del-time-modal ref="timeForm"></del-time-modal>
    <many-watch-modal ref="watchForm"></many-watch-modal>
    <yin-ru-ban-wen-modal ref="banwenForm"></yin-ru-ban-wen-modal>
    <cat-opinion-list-modal ref="opinionlistForm"></cat-opinion-list-modal>
    <ShowReadModal ref="showReadForm"></ShowReadModal>
  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  //引入按钮弹框
  import SuggesttionModal from '../buttons/SuggesttionModal'
  import DengjiwenhaoModal from '../buttons/DengjiwenhaoModal'
  import YinRuFuJianModal from '../buttons/YinRuFuJianModal'
  import UpdatePaperTitleModal from '../buttons/UpdatePaperTitleModal'
  import DelTimeModal from '../buttons/DelTimeModal'
  import ManyWatchModal from '../buttons/ManyWatchModal'
  import YinRuBanWenModal from '../buttons/YinRuBanWenModal'
  import CatOpinionListModal from '../buttons/CatOpinionListModal'
  import ShowReadModal from '../buttons/ShowReadModal'


  export default {
    name: "ButtonList",
    mixins: [JeecgListMixin],
    components: {
      SuggesttionModal,
      DengjiwenhaoModal,
      YinRuFuJianModal,
      UpdatePaperTitleModal,
      DelTimeModal,
      ManyWatchModal,
      YinRuBanWenModal,
      CatOpinionListModal,
      ShowReadModal
    },
    data() {
      return {
        description: '业务按钮页面',

        url: {
          list: "/papertitle/oaTemplate/list",
        },
      }
    },
    methods: {
      showRead: function () {
        this.$refs.showReadForm.showHead();
        this.$refs.showReadForm.title = "已读情况";
        this.$refs.showReadForm.disableSubmit = false;
      },
      writeOpinion: function () {
        this.$refs.opinionForm.suggest();
        this.$refs.opinionForm.title = "填写意见";
        this.$refs.opinionForm.disableSubmit = false;
      },
      djDocNum: function () {
        this.$refs.docNumForm.dengji();
        this.$refs.docNumForm.title = "登记文号";
        this.$refs.docNumForm.disableSubmit = false;
      },
      yrOfficeDoc: function () {
        this.$refs.officeForm.yinru();
        this.$refs.officeForm.title = "引入公文链接";
        this.$refs.officeForm.disableSubmit = false;
      },
      updatePaperTitle: function (record) {
        this.$refs.titleForm.paperTitle(record);
        this.$refs.titleForm.title = "修改文头";
        this.$refs.titleForm.disableSubmit = false;
      },
      delTime: function () {
        this.$refs.timeForm.delDate();
        this.$refs.timeForm.title = "封发日期";
        this.$refs.timeForm.disableSubmit = false;
      },
      piliang: function () {
        this.$refs.watchForm.piliang();
        this.$refs.watchForm.title = "批量审阅";
        this.$refs.watchForm.disableSubmit = false;
      },
      banwenModal: function () {
        this.$refs.banwenForm.show();
        this.$refs.banwenForm.title = "引入办文依据";
        this.$refs.banwenForm.disableSubmit = false;
      },
      opinionModal: function () {
        this.$refs.opinionlistForm.show();
        this.$refs.opinionlistForm.title = "查看意见";
        this.$refs.opinionlistForm.disableSubmit = false;
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>