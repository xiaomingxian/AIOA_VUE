<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading" style="height: 400px;overflow: auto">
      <a-form :form="form">
      
       <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主键id">
          <a-input-number v-decorator="[ 'iId', validatorRules.iid ]" />
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="页面按钮id">
          <a-input placeholder="请输入页面按钮id" v-decorator="['sbtnId', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="页面按钮name">
          <a-input placeholder="请输入页面按钮name" v-decorator="['sbtnName', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="页面按钮value">
          <a-input placeholder="请输入页面按钮value" v-decorator="['sbtnValue', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="互斥按钮id">
          <a-input placeholder="请输入互斥按钮id" v-decorator="['sexcbuttonId', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="互斥状态字段（如正文排版、封发日期）">
          <a-input placeholder="请输入互斥状态字段（如正文排版、封发日期）" v-decorator="['sexcfield', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否刷新页面">
          <a-radio-group v-decorator="['iisRefresh', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否需要校验按钮对应的业务操作（下一任务（保存）时，校验该按钮业务操作）">
          <a-radio-group v-decorator="['iisCheckbus', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否是维护按钮">
          <a-radio-group v-decorator="['iisDefend', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否操作ntko控件">
          <!--<a-input placeholder="请输入是否操作ntko控件" v-decorator="['iisNtko', {}]" />-->
          <a-radio-group v-model="isNtko" v-decorator="['iisNtko', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <div v-show="isNtko">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko打印">
            <a-radio-group v-decorator="['iisPrint', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko打印预览">
            <a-radio-group v-decorator="['iisPrintpreview', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko另存">
            <a-radio-group v-decorator="['iisSaveas', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko保存">
            <a-radio-group v-decorator="['iisSave', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko新建">
            <a-radio-group v-decorator="['iisNew', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko禁止文件菜单的关闭项">
            <a-radio-group v-decorator="['iisClose', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko打开">
            <a-radio-group v-decorator="['iisOpen', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko编辑">
            <a-radio-group v-decorator="['iisEdit', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko拷贝">
            <a-radio-group v-decorator="['iisCopy', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否ntko保存痕迹">
            <a-radio-group v-decorator="['iisSaverevision', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否允许ntko显示痕迹">
            <a-radio-group v-decorator="['iisShowrevision', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否ntko套打">
            <a-radio-group v-decorator="['iisAddread', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>

        </div>
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { getAction } from '@/api/manage.js'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "OaButtonCatModal",
    data () {
      return {
        isNtko: 0,
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
          add: "/oabutton/oaButton/add",
          edit: "/oabutton/oaButton/edit",
          queryById: "/oabutton/oaButton/queryById"
        },
      }
    },
    created () {
    },
    methods: {
      // add () {
      //   this.edit({});
      // },
      add (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','sbtnId','sbtnName','sbtnValue','sexcbuttonId','sexcfield','iisRefresh','iisCheckbus','iisDefend','iisNtko','iisPrint','iisPrintpreview','iisSaveas','iisSave','iisNew','iisClose','iisOpen','iisEdit','iisCopy','iisSaverevision','iisShowrevision','iisAddread'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.close()
      },
      handleCancel () {
        this.close()
      },
      loadData(iid) {
        //alert(iid);
        getAction(this.url.queryById, {id: iid}).then(res => {
          // console.log(res.result.records);
          this.data = res.result.records;
          console.log("123123---");
          console.log(this.data);
        })
      }

    }
  }
</script>

<style lang="less" scoped>

</style>