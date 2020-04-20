<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :key="nowKey"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="选择流程">
          <!--v-decorator="[ 'procDefKeyVal', {}]"-->
          <a-select v-model="procDefKey" @change="changeDefKey">
            <a-select-option v-for="role in procDefKeyList" :key="role.key" :value="role.val">
              {{ role.key }}
            </a-select-option>
          </a-select>

        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流程对应的按钮">
          <a-select v-model="procButton" @change="butChange" placeholder="请选择流程对应的按钮">
            <a-select-option v-for="(role,roleindex) in procButtonList" :key="roleindex" :value="role.iid">
              {{ role.sbuttonSetName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流程对应的意见">
          <a-select v-model="procOpinion" @change="changeOpinion" placeholder="请选择流程对应的意见">
            <a-select-option v-for="(role,roleindex) in procOpinionList" :key="roleindex" :value="role.iid">
              {{ role.sprocOpinionName }}
            </a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction, getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "BusFunctionProcButtonModal",
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        procOpinion: '',
        procButton: '',
        procDefKey: '',
        nowKey: '',
        procOpinionObj: {},
        procButtonObj: {},
        procDefKeyObj: {},
        procDefKeyList: [],
        procOpinionList: [],
        procButtonList: [],
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          iId: {rules: [{required: true, message: '请输入主键id!'}]},
        },
        url: {
          add: "/oaBus/busFunctionView/add",
          edit: "/oaBus/busFunctionView/edit",
        },
      }
    },
    created() {


    },
    methods: {
      butChange(index, item) {

        let num = item.data.key
        this.procButtonObj = this.procButtonList[num];


      },
      changeOpinion(index, item) {
        let num = item.data.key
        this.procOpinionObj = this.procOpinionList[num];
      },
      changeDefKey(index, item) {
        console.log(index, item);
        let num = item.data.key
        for(var entry in this.procDefKeyList){
          //console.log(this.procDefKeyList[entry])
          if(this.procDefKeyList[entry].key == num ){
            this.procDefKeyObj = this.procDefKeyList[entry]
          }
        }
        /*
        ;*/
        this.procOpinion = '';
        this.procButton = '';
        this.selectButton(this.procDefKey);
        this.selectOpinion(this.procDefKey);
      },
      selectButton(key) {
        this.procButtonList = [];
        let url = "/oaprocbutton/oaProcButton/queryProcButton";
        //console.log(this.procDefKey) ;  ,{procKey: this.procDefKey}
        getAction(url, {key: key}).then((res) => {
          this.procButtonList = res.result;
        })
      },

      selectOpinion(key) {
        this.procOpinionList = [];
        let url = "/oaBus/busFunction/queryProcOpinion";
        //console.log(this.procDefKey) ;  ,{procKey: this.procDefKey}
        getAction(url, {key: key}).then((res) => {
          this.procOpinionList = res.result;
        })

      },
      initProcDef: function (resolve,reject) {
        let url = "/wf/process/defKv";
        getAction(url).then((res) => {
          for (let i in res) {
            let v = res[i]
            this.procDefKeyList.push({'key': i, 'val': v})
          }
          resolve(this.procDefKeyList)
        })
      },
      add(params) {
        this.nowKey = (new Date()).valueOf();
        let that
        //this.initProcDef();
        /*.catch(function (reason) {
          console.log("失败L"+reason)
        })*/
        if(params != undefined ){
          new Promise(this.initProcDef).then( (result)=> {
            console.log(JSON.stringify(result))
            console.log(params.procDefKey)
            /*for(var entry in this.procDefKeyList){
              console.log(this.procDefKeyList[entry])
              if(this.procDefKeyList[entry].key == params.procDefKey ){
                this.procDefKeyObj = this.procDefKeyList[entry]
              }
            }*/
            for(var entry in result){
              if(result[entry].val == params.procDefKey ){
                this.procDefKeyObj = result[entry]
                console.log(this.procDefKeyObj)
              }
            }
          })
          this.procDefKey = params.procDefKey ;
          this.selectButton(this.procDefKey);
          this.selectOpinion(this.procDefKey);
        }

       /* this.procButton = params.iprocButtonId ;
        this.procOpinion = params.iprocOpinionId ;*/
        this.visible = true;
        //this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iId', 'iBusFunctionId', 'iType', 'iRoleId'))
          //时间格式化
        });

      },
      close() {
        this.procDefKey = '';
        this.procOpinion = '';
        this.procButton = '';
        this.procDefKeyList = [];
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        let bol = true;
        if (this.procOpinion == '' || this.procOpinion == null) {
          alert("请选择流程对应的意见！！！");
          bol = false;
        }
        if (this.procButton == '' || this.procButton == null) {
          alert("请选择流程对应的按钮！！！");
          bol = false;
        }
        if (this.procDefKey == '' || this.procDefKey == null) {
          alert("请选择流程！！！");
          bol = false;
        }
        if (bol) {
          let procButtonOpinion = {
            'procDefKey': this.procDefKeyObj,
            'iprocButtonId': this.procButtonObj,
            'iprocOpinionId': this.procOpinionObj
          }
          this.$emit("ok", procButtonOpinion);
          this.close()
        }
      },
      handleCancel() {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>