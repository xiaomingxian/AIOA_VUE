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

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="代理开始时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="代理结束时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请选择代理人">
          <!-- <j-select-user-by-dep-single  v-decorator="[ 'agentUserName', {}]"></j-select-user-by-dep-single>-->
          <j-select-user-by-dep-single v-decorator="[ 'agentUserName', {rules:[{required:true,message:'参与人员不能为空'}]}]"
                                       @senUserId="senUserId" @senUserName="senUserName" :userIdLists="userIdLists"
                                       v-model="userRealName" @getUD2="getUD2"></j-select-user-by-dep-single>

        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态选择">
          <!--:defaultValue-->
          <a-radio-group buttonStyle="solid" v-decorator="['status', {} ]" size="small"  defaultValue="1">
            <a-radio-button value="1">有效</a-radio-button>
            <a-radio-button value="0">无效</a-radio-button>
          </a-radio-group>
        </a-form-item>

      </a-form>

    </a-spin>
  </a-modal>


</template>

<script>
  import {httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import JSelectUserByDepSingle from "../../../components/jeecgbiz/JSelectUserByDepSingle";

  export default {
    name: "SysUserAgentModal",
    components: {
      JSelectUserByDepSingle,
    },
    data() {
      return {
        title: "操作",
        visible: false,
        userlistid: '',//所选人员id  为字符串拼接
        usernamelistsarr: '',//所选人员 名称拼接    之前提交ids 字符拼接  现改为names 字符拼接
        selectusernames: [],
        userRealName: '',
        userIdLists: [],
        model: {},
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
        validatorRules: {},
        url: {
          add: "/sys/sysUserAgent/add",
          edit: "/sys/sysUserAgent/edit",
        },
        //****************************************
        checkedDepartKeys: [],
      }
    },
    created() {
    },
    methods: {
      onSearch() {
        this.$refs.SelectDepartWindow.add(this.checkedDepartKeys, this.userId);
      },
      add() {
        // this.form.setFieldsValue({startTime: 1})
        this.edit({});
      },
      senUserName(data) {
        this.userRealName = data
        console.log(this.userRealName.toString())
        this.form.resetFields();
        this.$nextTick(() => {
          this.form.setFieldsValue({agentUserName: this.userRealName.toString()})
        });
      },
      senUserId(data) {
        this.userIdLists = data
      },
      timeCheck() {
        if (this.model.startTime == undefined || this.model.startTime == null) {
          this.$message.error('开始时间不得为空')
          return true
        }
        if (this.model.endTime == undefined || this.model.startTime == null) {
          this.$message.error('结束时间不得为空')
          return true
        }
        if (new Date(this.model.startTime) > new Date(this.model.endTime)) {
          this.$message.error('结束时间不得小于开始时间')
          return true
        }
        // console.log(this.model.status)
        // if (this.model.status == undefined) {
        //   this.$message.error('状态值不能为空')
        //   return true
        // }

        return false
        // this.model.startTime
      },
      edit(record) {

        // return
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'userName', 'agentUserName', 'status', 'createName', 'updateName', 'sysOrgCode', 'sysCompanyCode'))
          //时间格式化
          this.form.setFieldsValue({startTime: this.model.startTime ? moment(this.model.startTime) : null})
          this.form.setFieldsValue({endTime: this.model.endTime ? moment(this.model.endTime) : null})
        });

      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {

        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null;
            formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null;

            console.log(formData)
            let flag = that.timeCheck()
            if (flag) {
              that.confirmLoading = false;
              // that.close();
              return
            }

            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })


          }
        })
      },
      handleCancel() {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>