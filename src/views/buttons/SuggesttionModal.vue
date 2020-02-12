<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    okText="提交意见"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <div class="box">
      <div class="isreplace">
        <span style="font-weight: bolder">是否替换：</span>
        <a>
          <a-switch checkedChildren="追加" @change="getchangeval" unCheckedChildren="替换" defaultChecked v-model="routeSwitch"/>
        </a>
        <span style="margin-left: 50px;font-weight: bolder" >快捷意见</span>
        <a-select v-model="selectedModel" style="width: 260px;margin-bottom:7px; margin-left: 15px" @change="selectval"
                  v-decorator="[ 'ibusModelId', {}]">
          <!--<a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}</a-select-option>-->
          <a-select-option :value="item.id" v-for="(item,index) in suggesttionLists" :key="index">{{item.scontent}}
          </a-select-option>
        </a-select>
      </div>
      <!--<a-button @click="toModal" type="primary" icon="plus">定制个人意见</a-button>-->
    </div>

    <div style="margin-top: 30px">
    <a-textarea style="font-weight: bolder" :rows="3" placeholder="请填选意见" v-model="areatext"></a-textarea>
    </div>
    <create-user-opinion-modal ref="userOpinionForm"></create-user-opinion-modal>

  </a-modal>
</template>

<script>
  import {httpAction,postAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import {getAction} from '@/api/manage'
  import CreateUserOpinionModal from '../buttons/CreateUserOpinionModal'

  export default {
    name: "SuggesttionModal",
    components: {
      CreateUserOpinionModal
    },
    data() {
      return {
        selectedModel: '',
        title: "操作",
        areatext: '',
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        backData: {},
        confirmLoading: false,
        routeSwitch: true,
        opinionlist: [],
        suggesttionLists: [],
        sUserId: 0,
        form: this.$form.createForm(this),
        validatorRules: {
          // iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/button/button/putOpinion",
          list: '/sys_user_opinion/sysUserOpinion/getUserOpinion'
        },
      }
    },
    created() {
      // this.opinionList();
      // const suggesttionLists = [
      //   {id: '0', scontent: '请批示'},
      //   {id: '1', scontent: '请审签'},
      //   {id: '2', scontent: '不同意'},
      //   {id: '3', scontent: '阅'},
      //   {id: '4', scontent: '同意'},
      // ];

      // let url = this.url.list;
      // getAction(url, {sUserId: 'e9ca23d68d884d4ebb19d07889727dae'}).then((res) => {
      //   // this.opinionlist = res.result;
      //   // console.log(res.result);
      //   res.result.map((item, index) => {
      //     // console.log(item.scontent);
      //     // console.log(item.scontent);
      //     // console.log(index);
      //     suggesttionLists.push({id: suggesttionLists.length, scontent: item.scontent})
      //   });
      //   this.suggesttionLists = suggesttionLists;
      //   console.log(this.suggesttionLists)
      // });
    },

    methods: {
      suggest(record) {
        this.backData = record;
        this.sUserId = this.backData.i_user_id;
        this.visible = true;
        this.opinionList();
        this.getUserWriteOpinion();
      },
      getUserWriteOpinion() {
        let param = {};
        param.i_opinion_set_id = this.backData.i_opinion_set_id;
        param.i_bus_function_id = this.backData.i_bus_function_id;
        param.i_busdata_id = this.backData.i_busdata_id;
        param.i_user_id = this.backData.i_user_id;
        param.s_task_id = this.backData.s_task_id;
        param.s_taskdef_key = this.backData.s_taskdef_key;
        param.table = this.backData.table;
        postAction('oaBus/dynamic/queryById',param).then(res=>{
          if (res.success && res.result !=null){
            this.areatext = res.result.s_opinion;
          }
        })
      },
      opinionList() {
        let url = this.url.list;
        //用户个人意见
        getAction(url, {sUserId: this.sUserId}).then((res) => {
          if (res.success && res.result != null) {
            res.result.map((item, index) => {
              this.suggesttionLists.push({id: this.suggesttionLists.length, scontent: item.scontent})
            });
          }
        })
        //系统意见
        getAction( '/sys/dict/getDictByKeyObj', {dictKey: 'opinion_content'}).then(res => {
          console.log(res.result.value)
          console.log(res.result.text)
          res.result.map((item, index) => {
            this.suggesttionLists.push({id: this.suggesttionLists.length, scontent: item.text})
          });
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.routeSwitch = true;
      },
      handleOk() {

        this.$emit('saveOption', this.areatext)
        this.close()

      },
      handleCancel() {
        this.close()
      },
      //获取是否追加
      getchangeval(e) {
        console.log(e);
        this.routeSwitch = e;
      },
      selectval(e) {
        if (this.routeSwitch) {
          this.areatext += this.suggesttionLists[e].scontent + ' ';
        } else {
          this.areatext = '';
          this.areatext = this.suggesttionLists[e].scontent;
        }
      },
      toModal: function () {
        this.$refs.userOpinionForm.show();
        this.$refs.userOpinionForm.title = "定制个人意见";
        this.$refs.userOpinionForm.disableSubmit = false;
      },

    }
  }
</script>

<style lang="less" scoped>
  .box {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: -20px;

    .isreplace {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

</style>