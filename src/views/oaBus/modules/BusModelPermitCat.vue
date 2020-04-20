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
          label="范围类型">
          <a-select v-model="typeModel"
                    @change="getTypeVal"
                    placeholder="范围类型"
                    :disabled="disableSubmit">
            <a-select-option value="0">所有人</a-select-option>
            <a-select-option value="1">角色</a-select-option>
            <a-select-option value="2">部门</a-select-option>
            <a-select-option value="3">人员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色" v-if="spermitType==1">
          <a-select  v-model="selectedRole">
            <a-select-option  v-for="(role,roleindex) in roleList" :key="roleindex" :value="role.id">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!--部门分配-->
        <div v-else-if="spermitType==2">
          <a-form-item label="部门分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled && typeModel == 2"  v-decorator="[ 'itypeId', {}]">
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
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="人员"    v-else="spermitType==3">
          <a-select  v-model="selectedUser">
            <a-select-option  v-for="(user,userindex) in userList" :key="userindex" :value="user.id">
              {{ user.username }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否可见">
          <a-radio-group v-model="selectvalue">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
    <depart-window ref="departWindow" @ok="modalFormOk" ></depart-window>
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

  import Vue from 'vue'

  export default {
    name: "BusModelPermitModal",
    components: {
      departWindow,
    },
    data () {
      return {
        // 范围类型
        spermitType:'',
        selectvalue:'1',  //是否选中
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
        selectedUser:[],
        userList:[],
        userId: "", //保存用户id
        disableSubmit: false,
        userDepartModel: {userId: '', departIdList: []}, // 保存SysUserDepart的用户部门中间表数据需要的对象
        url: {
          add: "/oaBus/busModelPermit/add",
          edit: "/oaBus/busModelPermit/edit",
        },
      }
    },
    created () {

      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token}
    },

    methods: {
      // 获取范围类型
      getTypeVal(e){
        alert(e);
        console.log(e);
        this.spermitType = e;
      },

      handleOk () {
        this.close()
      },
      handleCancel () {
        this.typeModel = null;
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>