<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    okText=""
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所属模块">
          <!--<a-select v-model="selectedModel"  v-decorator="[ 'ibusModelId', {}]">-->
            <!--<a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}</a-select-option>-->
          <!--</a-select>-->
          <a-input placeholder=""  :value="mname" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所属机构">
          <!--<a-select v-model="selectedModel"  v-decorator="[ 'ibusModelId', {}]">-->
          <!--<a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}</a-select-option>-->
          <!--</a-select>-->
          <a-input placeholder=""  :value="uname" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所属业务">
          <!--<a-select   v-decorator="[ 'ibusFunctionId', {}]" >-->
            <!--<a-select-option v-for="(item,index) in functionData" :key="index" :value="item.iid">{{item.sname}}</a-select-option>-->
          <!--</a-select>-->
          <a-input placeholder="" :value="fname" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="序号">
          <a-input-number v-decorator="[ 'iorder', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文号名称">
          <a-input placeholder="" v-decorator="['sname', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文号规则">
          <a-input placeholder="" v-decorator="['sdocRule', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="当前文号">
          <a-input-number placeholder="" v-decorator="['idocNum', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上报模版">
          <a-select  v-decorator="[ 'iutemplateId', {}]">
            <a-select-option v-for="(item,index) in upData" :key="index" :value="item.iid">{{item.sname}}</a-select-option>

          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="下发模版">
          <a-select  v-decorator="[ 'idtemplateId', {}]">
            <a-select-option v-for="(item,index) in downData" :key="index" :value="item.iid">{{item.sname}}</a-select-option>

          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="办文单模板">
          <a-select  v-decorator="[ 'iatemplateId', {}]">
            <a-select-option v-for="(item,index) in officeData" :key="index" :value="item.iid">{{item.sname}}</a-select-option>

          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-textarea placeholder="" v-decorator="['sremarks', {}]" />
        </a-form-item>
        <!--部门分配-->
        <a-form-item label="部门分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled">
          <a-input-search
            placeholder="点击右侧按钮选择部门"
            v-model="checkedDepartNameString"
            disabled
            @search="onSearch">
            <!--<a-button slot="enterButton" icon="search">选择</a-button>-->
          </a-input-search>
        </a-form-item>
        <a-input type="hidden" placeholder="" v-decorator="['selecteddeparts']" />
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  // 引入搜索部门弹出框的组件
  import departWindow from '../../system/modules/DepartWindow'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {addUser, editUser, queryUserRole, queryall} from '@/api/api'
  import {disabledAuthFilter} from "@/utils/authFilter"
  import {duplicateCheck} from '@/api/api'
  export default {
    name: "DocNumCopyModal",
    data () {
      return {
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
          // ibusFunctionId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/papertitle/docNumSet/add",
          userWithDepart: "/papertitle/docNumSet/getDocDepartsList",
          userId: "/sys/user/generateUserId"
        },
        fname:'',
        mname:'',
        uname:'',
        selectedModel:null,
        selectedFunction:null,
        modelData:[],
        functionList:[],
        functionData:[],
        upData:[],
        downData:[],
        officeData:[],
        //部门控件
        departDisabled: false, //是否是我的部门调用该页面
        roleDisabled: false, //是否是角色维护调用该页面
        modalWidth: 800,
        drawerWidth: 700,
        modaltoggleFlag: true,
        confirmDirty: false,
        selectedDepartKeys: [], //保存用户选择部门id
        checkedDepartKeys: [],
        checkedDepartNames: [], // 保存部门的名称 =>title
        checkedDepartNameString: "", // 保存部门的名称 =>title
        userId: "", //保存用户id
        disableSubmit: false,
        userDepartModel: {userId: '', departIdList: []}, // 保存SysUserDepart的用户部门中间表数据需要的对象
      }
    },
    created () {
      this.getBusModelList();
      this.getTemplateUp();
      this.getTemplateDown();
      this.getTemplateOffice();
    },
    watch:{
      selectedModel:'getBusFunctionList'
    },
    methods: {

      add(record) {
        this.form.resetFields();
        this.userId = record.iid;
        this.fname = record.fname;
        this.mname = record.mname;
        this.uname = record.uname;
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','ibusModelId','ibusFunctionId','iorder','sname','sdocRule','idocNum','iutemplateId','idtemplateId','iatemplateId','sremarks','screateBy','supdateBy'))
        });
// 调用查询用户对应的部门信息的方法
        this.checkedDepartKeys = [];
        this.loadCheckDeparts();
      },
      loadCheckDeparts(){
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
      },
      // 搜索用户对应的部门API
      onSearch() {
        this.$refs.departWindow.add(this.checkedDepartKeys, this.userId);
      },
      // 获取用户对应部门弹出框提交给返回的数据
      modalFormOk(formData) {
        this.checkedDepartNames = [];
        this.selectedDepartKeys = [];
        this.checkedDepartNameString = '';
        this.userId = formData.userId;
        this.userDepartModel.userId = formData.userId;
        for (let i = 0; i < formData.departIdList.length; i++) {
          this.selectedDepartKeys.push(formData.departIdList[i].key);
          this.checkedDepartNames.push(formData.departIdList[i].title);
          this.checkedDepartNameString = this.checkedDepartNames.join(",");
        }
        this.userDepartModel.departIdList = this.selectedDepartKeys;
        this.checkedDepartKeys = this.selectedDepartKeys  //更新当前的选择keys
        console.log("=====>" + this.checkedDepartKeys);
      },
      refresh() {
        this.selectedDepartKeys = [];
        this.checkedDepartKeys = [];
        this.checkedDepartNames = [];
        this.checkedDepartNameString = "";
        this.userId = ""
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.userDepartModel = {userId:'',departIdList:[]};
        this.checkedDepartNames = [];
        this.checkedDepartNameString='';
        this.checkedDepartKeys = [];
        this.selectedDepartKeys = [];
      },
      handleOk () {
        this.close()
      },
      handleCancel () {
        this.close()
      },
      //下拉选列表-所属模块
      getBusModelList(){
        let url = "/papertitle/docNumSet/busModelList";
        getAction(url).then((res)=>{
          console.log(res.result);
          this.modelData = res.result;
        })
      },
      //下拉选列表-所属业务
      getBusFunctionList(){
        let vm = this;
        let url = "/papertitle/docNumSet/busFunctionList";
        getAction(url).then((res)=>{
          this.functionList = res.result;
          this.functionData = this.functionList.filter(function (city) {
            return city.ibusModelId == vm.selectedModel;
          })

        })
      },
      //下拉选列表-上报
      getTemplateUp(){
        let url = "/papertitle/oaTemplate/templateList?type=1";
        getAction(url).then((res)=>{
          console.log(res.result);
          this.upData = res.result;
        })
      },
      //下拉选列表-下发
      getTemplateDown(){
        let url = "/papertitle/oaTemplate/templateList?type=2";
        getAction(url).then((res)=>{
          console.log(res.result);
          this.downData = res.result;
        })
      },
      //下拉选列表-办公单
      getTemplateOffice(){
        let url = "/papertitle/oaTemplate/templateList?type=3";
        getAction(url).then((res)=>{
          console.log(res.result);
          this.officeData = res.result;
        })
      },

    }
  }
</script>

<style lang="less" scoped>

</style>