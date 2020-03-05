<template>


  <div style="min-height: 150px; padding-bottom: 0.7%;">
    <!--<a-button  @click="showPic">图</a-button>-->
    <!--<a-button  @click="reCall">撤回</a-button>-->
    <!--<a-button  @click="showBack">回退</a-button>-->
    <!--<a-button  @click="showJump">跳转</a-button>-->
    <!--<a-button  @click="nextTaskQuery">下一任务</a-button>-->
    <!--<a-button  @click="addUserOrDepart">追加</a-button>-->
    <!--<a-button  @click="insideReading">内部传阅</a-button>-->

    <div class="optionTip" @click="btnBoxShow">
      <a href="#">
        <a-icon  :type="iconType" />
        <span style="font-size:14px;font-weight: bold;margin-left: 5px;">操作按钮</span>
      </a>
    </div>
    <div  v-show="setIndexShow==1">
      <div class="btndefindbox">
        <a-button v-for="(item,index) in defindBtns" @click="method_router(item,index)" ref="isDefendBtn" :id="item.id"
                  icon="save" size="middle" style="background: #b2daff;margin-left: 3px;">{{item.sbtnName}}
        </a-button>
      </div>
      <br>
      <div class="btnnotdefindbox">
        <a-button v-for="(item,index) in btn" @click="method_router(item,index)" ref="isNotDefendBtn" :id="item.id"
                  size="large" style="margin-left: 3px;margin-bottom: 14px;">{{item.sbtnName}}
        </a-button>
      </div>
    </div>



    <!--.............引入具体展示组件.....................-->
    <next-users ref="nextUsers" @func="confirmNextUsers" @confirmNextUsersMore="confirmNextUsersMore"></next-users>
    <add-users-modal ref="addUsersModal" @func="confirmAddUserSingle" @confirmNextUsersMore="confirmAddUsers"></add-users-modal>
    <add-users-modal-chuan-yue ref="addUserCy" @func="confirmAddUserSingle" @confirmNextUsersMore="confirmAddUsers"></add-users-modal-chuan-yue>

    <back-modal ref="backModal"></back-modal>
    <suggesttion-modal ref="opinionForm" @saveOption="saveOption"></suggesttion-modal>
    <dengjiwenhao-modal ref="docNumForm" @saveDocNum="saveDocNum"></dengjiwenhao-modal>
    <yin-ru-fu-jian-modal ref="officeForm" @gongwenData="gongwenData"></yin-ru-fu-jian-modal>
    <updatePaperTitle-modal ref="titleForm" @updateMiddleParameter="updateMiddleParameter"></updatePaperTitle-modal>
    <del-time-modal ref="timeForm"></del-time-modal>
    <many-watch-modal ref="watchForm"></many-watch-modal>
    <yin-ru-ban-wen-modal ref="banwenForm" @watchSub="watchSub"></yin-ru-ban-wen-modal>
    <yin-ru-yi-ju-modal ref="banwenYiJuForm" @watchSub="watchSub"></yin-ru-yi-ju-modal>
    <cat-opinion-list-modal ref="opinionlistForm"></cat-opinion-list-modal>
    <task-shift-modal ref="taskShift"></task-shift-modal>
    <re-call-modal ref="reCall"></re-call-modal>
    <show-read-modal ref="showreadmodal"></show-read-modal>
    <pic2-modal ref="picModal"></pic2-modal>
    <pic-modal ref="picModalNoTask"></pic-modal>
    <select-unit-name ref="selectUnitModel"></select-unit-name>
    <select-city-name ref="selectCityModel"></select-city-name>
    <pai-ban-deng-ji ref="paiBanDengJi" @confimName="confimName"></pai-ban-deng-ji>

    <!--模态框-->
    <a-modal
      title="温馨提示"
      :visible="visibleModel"
      @ok="upSendConfirm"
      @cancel="closeModal">
      <p v-show="this.isUpSend === 0" style="font-size: 15px;font-weight: bolder">该公文将上报至{{this.dictData.unitName}}，您确定上报吗？
      <p v-show="this.isUpSend === 1" style="font-size: 15px;font-weight: bolder">该公文<span style="color: red">已上报</span>至{{this.dictData.unitName}}，您确定<span style="color: red">重新上报</span>吗？
      </p>
    </a-modal>
  </div>

</template>


<script>
  import {taskBth} from "./btn-js/taskBtn";
  import nextUsers from '../mytask/modules/nextUsers'
  import backModal from '../mytask/modules/backModal'
  //引入按钮弹框
  import SuggesttionModal from '../buttons/SuggesttionModal'
  import DengjiwenhaoModal from '../buttons/DengjiwenhaoModal'
  import YinRuFuJianModal from '../buttons/YinRuFuJianModal'
  import UpdatePaperTitleModal from '../buttons/UpdatePaperTitleModal'
  import DelTimeModal from '../buttons/DelTimeModal'
  import ManyWatchModal from '../buttons/ManyWatchModal'
  import YinRuBanWenModal from '../buttons/YinRuBanWenModal'
  import CatOpinionListModal from '../buttons/CatOpinionListModal'
  import taskShiftModal from '../mytask/modules/taskShiftModal'
  import ShowReadModal from '../buttons/ShowReadModal'
  import paiBanDengJi from '../buttons/paiBanDengJi'
  //撤回组件
  import reCallModal from '../mytask/modules/reCallTask'
  import pic2Modal from '../mytask/modules/pic2Modal'
  import picModal from '../workflow/modules/picModal'
  import SelectUnitName from "./selectUnitName";
  import SelectCityName from "./selectCityName";
  import YinRuYiJuModal from "./YinRuYiJuModal";
  //追加组件
  import AddUsersModal from '../mytask/modules/AddUsersModal'
  //传阅特殊化
  import AddUsersModalChuanYue from '../mytask/modules/AddUsersModalChuanYue'

  export default {
    name: "taskBtn",
    mixins: [taskBth],
    components: {
      YinRuYiJuModal,
      SelectCityName,
      SelectUnitName,
      nextUsers,
      backModal,
      SuggesttionModal,
      DengjiwenhaoModal,
      YinRuFuJianModal,
      UpdatePaperTitleModal,
      DelTimeModal,
      ManyWatchModal,
      YinRuBanWenModal,
      CatOpinionListModal,
      backModal,
      taskShiftModal,
      ShowReadModal,
      taskShiftModal,
      reCallModal,
      pic2Modal,
      picModal,
      AddUsersModal,
      paiBanDengJi,
      AddUsersModalChuanYue
    },
    data() {
      return {
        setIndexShow:1,
        iconType: 'up'
      }
    },
    created() {
      //监听页签切换  修改标题

    },
    methods: {
      btnBoxShow(){

        if(this.setIndexShow==0){
          this.setIndexShow = 1;
          this.iconType = 'up'
        }else{
          this.setIndexShow = 0;
          this.iconType = 'down'
        }

        console.log( this.setIndexShow)
      },
      modalFormOk() {

      },
      watchSub(e) {
        this.$emit('watchSub', e);
      },
      closeModal() {
        this.isUpSend = 0;
        this.$emit('close')
      },
      alertBtnStaus(flagValue, dealBtn) {
        alert(flagValue);
        let k = -1;
        console.log(flagValue)
        for (let i = 0; i < this.btn.length; i++) {
          if (this.btn[i].smethod == flagValue) {
            console.log(this.btn[i])
            k = i;
            break;
            alert(k)
          }
        }
        if (k >= 0) {
          //如果dealBtn为空的话，不插入数据，如果不为空的话，就可以将数据插入到起草底稿的位置
          if (dealBtn == undefined || JSON.stringify(dealBtn) == '{}') {
            this.btn.splice(k, 1)
          } else {
            this.btn.splice(k, 1, dealBtn)
          }
        }
        //this.btnObj[flagValue] = false ;
      },

    }
  }
</script>
<style lang="less" scoped>

  .optionTip{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 88%;
    margin: 0 auto;
  }
  .btndefindbox {
    display: flex;
    width: 88%;
    margin: 0 auto;
    margin-top: 10px;
  }

  .btnnotdefindbox {
    width: 88%;
    margin: 0 auto;
    display: flex;
    /*align-items:center;*/
    /*justify-content: space-around;*/
    flex-wrap: wrap;
  }

  .btnnotdefindbox > button {
    color: rgba(0, 0, 0, 0.65) !important;
    font-weight: bolder !important;
    /*border-radius: 14%;*/
    background-color: #8cc8ff !important;
    border-color: transparent !important;
  }
</style>