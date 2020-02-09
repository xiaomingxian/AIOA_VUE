<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
       <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务模块id">
          <a-input  placeholder="" v-decorator="['ibusModelId', {}]" />
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限类型">
          <a-select v-model="typeModel"
                    @change="getTypeVal"
                    placeholder="权限类型"
                    :disabled="disableSubmit"
           >

            <a-select-option   v-for="(item,index) in isno" :value="item.value">{{item.typename}}</a-select-option>

          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"

          label="角色" v-if="spermitType==1">
          <a-select  v-model="selectedRole"  @change="getRole">
            <a-select-option  v-for="(role,roleindex) in roleList" :key="roleindex" :value="role.id">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!--部门分配-->
        <div v-else-if="spermitType==2">
            <a-form-item label="部门分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled && typeModel == 2">
              <a-input-search
                placeholder="点击右侧按钮选择部门"
                v-model="checkedDepartNameString"
                disabled
                @search="onSearch">
                <a-button slot="enterButton" icon="search">选择</a-button>
              </a-input-search>
            </a-form-item>
            <a-input type="hidden" placeholder="" v-decorator="['selecteddeparts']" />
        </div>
        <a-form-item
          v-else-if="spermitType==3"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="人员">
          <j-select-user-by-dep v-decorator="[ 'itypeId', {}]"  @senUserId="senUserId" v-model="userRealName" @getUD2="getUD2" ></j-select-user-by-dep>
        </a-form-item>
        <a-form-item
          v-else="spermitType==0">
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否可见">
          <a-radio-group v-model="selectvalue"  @change="getisnot" >
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
    <depart-window ref="departWindow" @sendPartsList="sendPartsList" @ok="modalFormOk" ></depart-window>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import {getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  // 引入搜索部门弹出框的组件
  import departWindow from '../../system/modules/DepartWindow'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {addUser, editUser, queryUserRole, queryall} from '@/api/api'
  import {disabledAuthFilter} from "@/utils/authFilter"
  import {duplicateCheck} from '@/api/api'
  import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'

  import Vue from 'vue'

  export default {
    name: "BusModelPermitModal",
    components: {
      departWindow,
      JSelectUserByDep
    },
    data () {
      return {

        isno:[
          {typename:'所有人',value:'0'},
          {typename:'角色',value:'1'},
          {typename:'部门',value:'2'},
          {typename:'人员',value:'3'},
        ],
        ibusModelId:'', //提交时所需参数
        itypeName:'',// 角色或人员或部门的名字
        spermitType:'',  // 范围类型
        selectvalue:1,  //是否选中
        title:"操作",
        visible: false,
        model: {
          iid:'',
          ibusModelId:'',
          itypeId:'',// 角色或人员或部门的id
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        selectData: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        selectedModel: null,
        selectedFunction: null,
        typeModel:null,
        roleList:[],
        selectedRole: '',
        userRealName:'',
        selectedUser:[],
        userList:[],
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
        url: {
          add: "/oaBus/busModelPermit/add",
          edit: "/oaBus/busModelPermit/edit",
        },
        //用来判断弹框是用来新增或是编辑两种状态
        isadd:false
      }
    },
    created () {
      this.initialRoleList();
      this.initialUserList();
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token}


    },
    watch:{
      typeModel:'initialRoleList',
      typeModel:'initialUserList'
    },
    methods: {
      senUserId(ids) {
        this.model.itypeId = ids.toString();
      },
      // 获取范围类型
      getTypeVal(e){
        this.spermitType = e;
        if(e=='1'){
          this.selectedRole = '';
        }else if (e=='3'){
          this.userRealName = '';
        }
      },
      //修改角色或者人员 获取角色id
      getRole(e){
        this.model.itypeId = e;
      },
      add1(ibusModelId,sname,data) {
        this.isadd = true;
        this.model.ibusModelId = ibusModelId;
        console.log(data)
        //判断类型为非零时  不可选所有人
        if(data.length != 0){
          data.forEach((item)=>{
            if(item.spermitType!=0){
              this.isno= [
                // {typename:'所有人',value:'0'},
                {typename:'角色',value:'1'},
                {typename:'部门',value:'2'},
                {typename:'人员',value:'3'}
              ]
            }else{
              this.isno= [
                {typename:'所有人',value:'0'},
                {typename:'角色',value:'1'},
                {typename:'部门',value:'2'},
                {typename:'人员',value:'3'}
              ]
            }
          })
        }else{
          this.isno= [
            {typename:'所有人',value:'0'},
            {typename:'角色',value:'1'},
            {typename:'部门',value:'2'},
            {typename:'人员',value:'3'}
          ]
        }

        this.visible = true
        this.title=sname;
        this.form.resetFields();
        //this.model = Object.assign({}, record2);
      },
      //获取部门子组件树形弹窗返回的对象
      sendPartsList(partsLists){
        console.log(partsLists);
        if(Array.isArray(partsLists)){

          // this.checkedDepartNameString
          let itypeIdLists = '';
          let itypeNanesLists = '';
          partsLists.map((part)=>{
            itypeNanesLists+=part.title+'  ';
            itypeIdLists+=part.value+',';
          });
          this.model.itypeId =itypeIdLists;
          this.checkedDepartNameString = itypeNanesLists;
        }else{
          this.model.itypeId =partsLists.value;
          this.checkedDepartNameString = partsLists.title;

        }

      },
      //初始换数据渲染
      update (record,isedit) {

        if(isedit){
          this.isno= [
            {typename:'所有人',value:'0'},
            {typename:'角色',value:'1'},
            {typename:'部门',value:'2'},
            {typename:'人员',value:'3'}
          ]
        }
        this.isadd = false;

        this.spermitType = record.spermitType;
        this.title=record.sname;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.selectvalue = Number(this.model.sdisplay);
        //范围类型
        this.typeModel = this.model.spermitType;
        if( this.typeModel=='1'){
          setTimeout(()=>{
            this.selectedRole = this.model.itypeName;
            console.log(this.selectedRole)
          },1000)
        }else if(this.typeModel=='2'){
          this.checkedDepartNameString = this.model.itypeName;
        }
        else if(this.typeModel=='3'){
          this.userRealName = this.model.itypeName;
        }
      },
      initialRoleList: function () {
        let url = "/oaBus/busFunctionPermit/findRoleByCode";
        getAction(url).then((res)=>{
          this.roleList = res.result;
        })
      },
      initialUserList: function () {
        let  url = "/oaBus/busFunctionPermit/userList";
        getAction(url).then((res)=>{
          this.userList = res.result;
        })
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
        // this.$refs.departWindow.add(this.checkedDepartKeys, this.userId);
        this.$refs.departWindow.add(this.model.itypeId, this.isadd);
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
      //获取人员下拉框 所选用户id
      getPeople(e){
        console.log(e);
        this.model.itypeId = e;

      },
      //获取用户点击的是否单选
      getisnot(e){
        console.log(e);
        this.selectvalue = e.target.value;

      },
      //----------------------------------编辑或新增提交按钮---------------------------------------------------
      handleOk () {
        if(!this.typeModel){
          this.$message.error('请选择一个类型！');

          return;
        }else{
          if(this.typeModel=='1'&&this.selectedRole==''){
            this.$message.error('请选择一个角色！');
            return;

          } if(this.typeModel=='2'&&this.checkedDepartNameString==''){
            this.$message.error('请选择一个部门！');
            return;
          } if(this.typeModel=='3'&&this.userRealName==''){
            this.$message.error('请选择一个人员！');
            return;
          }
        }

        this.typeModel = null;
        const that = this;

        //提交对象
        let formData = {
          'iid':this.model.iid,
          'ibusModelId':this.model.ibusModelId,
          'spermitType':this.spermitType,
          'itypeId':this.model.itypeId,
          'sdisplay':this.selectvalue

        }
        console.log(formData);
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(this.isadd){
              httpurl+=this.url.add;
              method = 'post';
              formData.iid = '';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
              if(this.spermitType==2){
                formData.itypeId = formData.itypeId.substring(0,formData.itypeId.length-1);
              }

            }
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
            that.$message.success(res.message);
                //告诉父级组件我已关闭  关闭后刷新父级列表
                that.$emit('submit',true);
              }else{
                 that.$message.warning(res.message);
               }
             }).finally(() => {
               that.confirmLoading = false;
              //提交后清空记录
              this.typeModel = '';
              this.selectedRole = '';
              this.userRealName = '';
              // this.selectvalue = '';
              //关闭中间角色 人员选框
              this.spermitType = 0;
              this.selectvalue = 1;
               that.close();
            })
          }
        })
      },
      handleCancel () {
        this.typeModel = null;
        this.selectedRole = '';
        this.userRealName = '';
        this.spermitType = 0;
        this.selectvalue = 1;

        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>