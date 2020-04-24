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

      <!--  <a-form-item
        :labelCol="labelCol"resetFields
        :wrapperCol="wrapperCol"
        label="业务功能id">
        <a-input placeholder="" v-decorator="['ibusId', {}]" />
      </a-form-item>-->
        <!-- v-model="iid"-->

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="权限类型"
      >
        <a-select style="width: 200px;" v-model="typeModel"
                  v-decorator="[ 'itypeId', {rules:[{required:true,message:'权限类型不能为空'}]}]"
                  @change="getTypeVal"
                  placeholder="权限类型"
                  :disabled="disableSubmit"
        >

          <a-select-option   v-for="(item,index) in isno" :value="item.value">{{item.typename}}</a-select-option>

        </a-select>
      </a-form-item>
        <a-form-item
          v-if="spermitType==1"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色">
          <a-select style="width: 200px;" v-model="selectedRole" @change="getPeople" >
            <a-select-option v-for="(role,roleindex) in roleList" :key="roleindex" :value="role.id">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!--部门分配-->
        <div v-else-if="spermitType==2">
          <a-form-item  label="部门分配" :labelCol="labelCol" :wrapperCol="wrapperCol"
                       v-show="!departDisabled" v-decorator="[ 'itypeId', {}]">
            <a-input-group style="display: inline-flex">
              <a-input
                style="pointer-events: auto"
                placeholder="点击右侧按钮选择部门"
                v-model="checkedDepartNameString"
                disabled>
              </a-input>
              <a-button icon="search" @click="onSearch">选择</a-button>
            </a-input-group>
          </a-form-item>
          <a-input type="hidden" placeholder="" v-decorator="['selecteddeparts']"/>
        </div>
      <a-form-item
        v-else-if="spermitType==3"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="人员">
        <j-select-user-by-dep-single v-decorator="[ 'itypeId', {}]"  @senUserId="senUserId" v-model="userRealName":userRealName="userRealName" @getUD2="getUD2" ></j-select-user-by-dep-single>
      </a-form-item>
      <a-form-item
        v-else="spermitType==0">
      </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否可见">
          <a-radio-group v-model="selectvalue" @change="getisnot">
            <a-radio :value="1" default-checked="true">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>

    </a-spin>
    <depart-window ref="departWindow" @sendPartsList="sendPartsList" @ok="modalFormOk"></depart-window>
  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import {getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  // 引入搜索部门弹出框的组件
  import departWindow from '../../system/modules/DepartWindow'
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {addUser, editUser, queryUserRole, queryall} from '@/api/api'
  import {disabledAuthFilter} from "@/utils/authFilter"
  import {duplicateCheck} from '@/api/api'
  import JSelectUserByDepSingle from "../../../components/jeecgbiz/JSelectUserByDepSingle";

  import Vue from 'vue'


  export default {
    name: "BusFunctionPermitModal",
    components: {
      departWindow,
      JSelectUserByDepSingle
    },
    data() {
      return {
        isno:[
          {typename:'所有人',value:'0'},
          {typename:'角色',value:'1'},
          {typename:'部门',value:'2'},
          {typename:'人员',value:'3'},
        ],
        // 范围类型
        spermitType:0,
        selectvalue:1,  //是否选中
        itypeName:'',// 角色或人员或部门的名字
        userRealName:'',
        title: "新增",
        visible: false,
        model: {
          itypeId:'',//角色或人员或部门的id
          iid:'',
          ibusId:''
        },
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        selectData: [],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          iId: {rules: [{required: true, message: '请输入主键id!'}]},
        },
        selectedModel: null,
        selectedFunction: null,
        typeModel: null,
        roleList: [],
        selectedRole: '',
        selectedUser: '',
        userList: [],
        selectedDepart: [],
        modelData: [],
        functionList: [],
        functionData: [],
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
          add: "/oaBus/busFunctionPermit/add",
          edit: "/oaBus/busFunctionPermit/edit",
        },

        //用来判断弹框是用来新增或是编辑两种状态
        isadd:false
      }
    },
    created() {
      this.initialRoleList();
      this.initialUserList();
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token}
    },
    watch: {
      typeModel: 'initialRoleList',
      typeModel: 'initialUserList',
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
      getPeople(e){
        console.log(e);
        this.model.itypeId = e;

      },
      //接收 父级传来的参数
      add1(ibusId,sname,data) {
        this.isadd = true;
        this.model.ibusId = ibusId;
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
      //获取部门自组建返回的对象
      sendPartsList(partsLists){
        // this.checkedDepartcalendarNameString
        console.log(partsLists);
        let itypeIdLists = '';
        let itypeNanesLists = '';
        if(Array.isArray(partsLists)){
          // this.checkedDepartNameString
          let itypeIdLists = '';
          let itypeNanesLists = '';
          partsLists.map((part)=>{
            itypeNanesLists+=part.title+'  ';
            itypeIdLists+=part.value;
          });

          this.model.itypeId =itypeIdLists;
          this.checkedDepartNameString = itypeNanesLists;
        }else{
          this.model.itypeId =partsLists.value;
          this.checkedDepartNameString = partsLists.title;

        }
      },
      //初始换数据渲染
      edit1(record,isedit) {
        console.log(record)
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
        this.title=record.busFunctionName;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.selectvalue = Number(this.model.sdisplay);
        //范围类型
        this.$nextTick(() => {
          this.typeModel = this.model.spermitType;
          if( this.typeModel=='1'){
            setTimeout(()=>{
              this.selectedRole = this.model.itypeName;
              console.log(this.selectedRole)
            },1000)
          }else if(this.typeModel=='3'){
            this.userRealName = this.model.itypeName;

          }else if(this.typeModel=='2'){
            this.checkedDepartNameString = this.model.itypeName;
            console.log(this.model.itypeId);

          }


        });
      },
      initialRoleList: function () {
        let url = "/oaBus/busFunctionPermit/findRoleByCode";
        getAction(url).then((res) => {
          //console.log(res.result);
          this.roleList = res.result;
        })
      },
      initialUserList: function () {

        let url = "/oaBus/busFunctionPermit/userList";
        getAction(url).then((res) => {
          //console.log(res.result);
          this.userList = res.result;
        })
      },
      loadCheckDeparts() {
        let that = this;
        if (!that.userId) {
          return
        }
        getAction(that.url.userWithDepart, {userId: that.userId}).then((res) => {
          that.checkedDepartNames = [];
          if (res.success) {
            for (let i = 0; i < res.result.length; i++) {
              that.checkedDepartNames.push(res.result[i].title);
              this.checkedDepartNameString = this.checkedDepartNames.join(",");
              that.checkedDepartKeys.push(res.result[i].key);
            }
            that.userDepartModel.departIdList = that.checkedDepartKeys
          } else {
            console.log(res.message);
          }
        })
      },
      // 搜索用户对应的部门API
      onSearch() {
        // console.log(this.checkedDepartKeys);
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
        this.userDepartModel = {userId: '', departIdList: []};
        this.checkedDepartNames = [];
        this.checkedDepartNameString = '';
        this.checkedDepartKeys = [];
        this.selectedDepartKeys = [];
      },
      //获取人员下拉框 所选用户id



      //获取用户点击的是否单选
      getisnot(e){
        console.log(e);
        this.selectvalue = e.target.value;

      },
      handleOk() {
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

        //提交对象    this.userDepartModel.departIdList= this.selectedDepartKeys.substring(0,this.selectedDepartKeys.length-1);
        let formData = {
          'iid':this.model.iid,
          'ibusId':this.model.ibusId,
          'spermitType':this.spermitType,
          'itypeId':this.model.itypeId,
          'sdisplay':JSON.stringify(this.selectvalue)

        }
        console.log(formData)
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (this.isadd) {
              httpurl += this.url.add;
              method = 'post';
              formData.iid = '';

            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                //告诉父级组件我已关闭  关闭后刷新父级列表
                that.$emit('submit',true);
              } else {
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
      handleCancel() {
        this.typeModel = null;
        this.selectedRole = '';
        this.userRealName = '';
        this.spermitType = 0;
        this.selectvalue = 1;
        this.close()
      }

    }
  }
</script>

<style lang="less" scoped>

</style>