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
          label="流程对应的按钮">
          <a-select v-model="procButton" @change="butChange" placeholder="请选择流程对应的按钮">
            <a-select-option v-for="(role,roleindex) in procButtonList" :key="roleindex" :value="role.iid">
              {{ role.sbuttonSetName }}
            </a-select-option>
          </a-select>
          <!--<a-input placeholder="请输入查看权限类型（1、角色、2、角色+机构3、角色+部门4、角色+分管部门）" v-decorator="['iType', {}]" />-->
        </a-form-item>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction, getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  // import moment from "moment"

  export default {
    name: "BusFunNoProcButton",
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        procOpinion: '',
        nowKey:'',
        procButton: '',
        procDefKey: '',
        procDefKeyList: [],
        procOpinionList: [],
        procButtonList: [],
        procButtonObj: {},
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
      /*this.initialRoleList();
      this.selectButton();
      this.selectOpinion();*/
    },
    methods: {
      selectButton(resolve,reject){
        this.procButtonList = [];
        let url = "/oaprocbutton/oaProcButton/queryNoProcButton";
        //console.log(this.procDefKey) ;  ,{procKey: this.procDefKey}
        getAction(url).then((res) => {
          this.procButtonList = res.result ;
          resolve("true")
        })
      },

      selectOpinion(){
      this.procOpinionList = [];
      let url = "/oaBus/busFunction/queryProcOpinion";
      //console.log(this.procDefKey) ;  ,{procKey: this.procDefKey}
      getAction(url).then((res) => {
        this.procOpinionList = res.result ;
      })

      },
      initialRoleList: function () {
        let url = "/wf/process/defKv";
        getAction(url).then((res) => {
          for (let i in res) {
            let v = res[i]
            this.procDefKeyList.push({'key': i, 'val': v})
          }
          console.log(this.procDefKeyList) ;
        })
      },
      add(params) {
        this.nowKey = (new Date()).valueOf();
        //this.edit({});
        //this.selectButton();
        let buttonIdTemp = params.iprocButtonId ;
        new Promise(this.selectButton).then((result)=> {

          for(let i =0 ; i < this.procButtonList.length ; i ++){
            if(buttonIdTemp == this.procButtonList[i].iid){
              // console.log(result)
              this.procButton = buttonIdTemp;
              break ;
            }
          }
        })
        this.visible = true ;
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
        this.$emit('close');
        this.visible = false;
      },
      butChange(index, item) {
        let num = item.data.key
        this.procButtonObj = this.procButtonList[num];
      },
      handleOk() {
        let bol = true ;

        if(this.procButton == '' || this.procButton == null){
          alert("请选择按钮！！！") ;
          bol = false ;
        }
        if(bol){
          this.$emit("ok",this.procButtonObj) ;
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