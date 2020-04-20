<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">

      <!--部门分配-->
      <a-form-item label="部门分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled">
        <a-input-search
          placeholder="点击右侧按钮选择部门"
          v-model="checkedDepartNameString"
          disabled
          @search="onSearch">
          <a-button slot="enterButton" icon="search">选择</a-button>
        </a-input-search>
      </a-form-item>
      <depart-window ref="departWindow" @ok="modalFormOk" @partData="partData"></depart-window>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction,postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import departWindow from './SelectDepartWindow'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: "sysUserManagedeptsModal",
    components: {
      departWindow,
    },
    // props:{'userId':String},
    data () {
      return {
        departDisabled: false, //是否是我的部门调用该页面
        roleDisabled: false, //是否是角色维护调用该页面
        modalWidth:800,
        drawerWidth:700,
        // userId:'',
        userDepartModel:{
        userId:'',
          username:'',
        departIdList:[]
        },
        modaltoggleFlag:true,
        confirmDirty: false,
        selectedDepartKeys:[], //保存用户选择部门id
        checkedDepartKeys:[],
        checkedDepartNames:[], // 保存部门的名称 =>title
        checkedDepartNameString:"", // 保存部门的名称 =>title
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/sys/sysUserManagedepts/add",
          edit: "/sys/sysUserManagedepts/edit",
        },
        // userId:''/
      }
    },
    created () {
    },
    methods: {
      partData(formData){
        console.log("222222222")
        console.log(formData);
        this.checkedDepartNames = [];
        this.selectedDepartKeys = [];
        this.checkedDepartNameString = '';
        // this.userId = formData.userId;
        this.userDepartModel.userId = formData.userId;
        for (let i = 0; i < formData.length; i++) {
          this.selectedDepartKeys.push(formData[i].key);
          this.checkedDepartNames.push(formData[i].title);
          this.checkedDepartNameString = this.checkedDepartNames.join(",");
        }
        console.log(this.selectedDepartKeys)
        this.userDepartModel.departIdList = this.selectedDepartKeys;
        this.checkedDepartKeys = this.selectedDepartKeys;  //更新当前的选择keys
        // //获取部门搜索的数据   this.checkedDepartNameString
        // let strpartName = '';
        // e.map((item,index)=>{
        //   strpartName += item.title+'   ';
        // })
        //
        //
        // this.checkedDepartNameString = strpartName
        //
        // console.log(this.checkedDepartNameString );
      },

      add (record) {
        this.userId=record[0].userId;
        console.log(record)
        this.username = record[0].username;
        this.edit(record);
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);

        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iId','sUserId','sDeptId'))
		  //时间格式化
        });
      },
      // 搜索用户对应的部门API
      onSearch(){
        this.$refs.departWindow.add(this.checkedDepartKeys,this.userId);
      },
      // 获取用户对应部门弹出框提交给返回的数据
      modalFormOk (formData) {
      //
        },
     /* loadCheckedDeparts(){
        let that = this;
        if(!that.userId){return}
        getAction(that.url.userWithDepart,{userId:that.userId}).then((res)=>{
          that.checkedDepartNames = [];
          if(res.success){
            for (let i = 0; i < res.result.length; i++) {
              that.checkedDepartNames.push(res.result[i].title);
              this.checkedDepartNameString = this.checkedDepartNames.join(",");
              that.checkedDepartKeys.push(res.result[i].key);
            }
            that.userDepartModel.departIdList = that.checkedDepartKeys
          }else{
            console.log(res.message);
          }
        })
      },*/
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
        this.userDepartModel = {userId:'',departIdList:[]};
        this.checkedDepartNames = [];
        this.checkedDepartNameString='';
        this.checkedDepartKeys = [];
        this.selectedDepartKeys = [];
      },
      /*close () {
        this.$emit('close');
        this.visible = false;
      },*/
      handleOk () {
        console.log(this.username);
        console.log(this.userId);
        postAction(this.url.add,{userId:this.userId,departId:this.userDepartModel.departIdList}).then(res=>{
          if(res.success){
            this.$message.info(res.message)
            this.close()
            this.$emit('ok');
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      handleCancel () {
        this.close()

      },


    }
  }
</script>

<style lang="less" scoped>

</style>