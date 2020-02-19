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

        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主键id">
          <a-input-number v-decorator="[ 'iId', validatorRules.iId ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务功能配置id">
          <a-input-number v-decorator="[ 'iBusFunctionId', {}]" />
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="查看权限类型">
          <a-select v-model="typeModel"
                    v-decorator="[ 'itype', {}]"
                    placeholder="查看权限类型">
            <a-select-option value="1">角色</a-select-option>
            <a-select-option value="2">角色+机构</a-select-option>
            <a-select-option value="3">角色+部门</a-select-option>
            <a-select-option value="4">角色+分管部门</a-select-option>
          </a-select>
          <!--<a-input placeholder="请输入查看权限类型（1、角色、2、角色+机构3、角色+部门4、角色+分管部门）" v-decorator="['iType', {}]" />-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色ID">
          <!--<a-input placeholder="请输入角色ID" v-decorator="['iRoleId', {}]" />-->
          <a-select v-model="roleId">
            <a-select-option v-for="(role,roleindex) in roleList" :key="roleindex" :value="role.id">
              {{ role.roleName }}
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
    name: "BusFunctionViewModal",
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        typeModel: '',
        roleId: '',
        roleList: [],
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
      this.initialRoleList();
    },
    methods: {
      initialRoleList: function () {
        let url = "/sys/role/queryall";
        getAction(url).then((res) => {
          //console.log(res.result);
          this.roleList = res.result;
        })
      },
      add() {
        this.visible = true;
      },
      close() {
        /*document.getElementById("#stypeModel").empty();*/
        this.typeModel = '';
        this.roleId = '';
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        let flag = true;
        if (this.typeModel == '' || this.typeModel == null) {
          flag = false;
        }
        if (this.roleId == '' || this.roleId == null) {
          flag = false;
        }
        if (flag) {
          let roleObj = {"itype": this.typeModel, "iroleId": this.roleId};
          this.$emit("ok", roleObj);
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