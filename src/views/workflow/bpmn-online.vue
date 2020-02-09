<template>
  <div class="main">
    <a-form :form="form" class="user-layout-login" ref="bpmn" id="bpmn">
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick">
        <a-tab-pane key="tab1" tab="流程描述">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="请输入流程名称"
              v-model="bpmn.name"
            >
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="key"
              autocomplete="false"
              placeholder="请输入流程定义key"
              v-model="bpmn.key"

            >
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="请输入流程描述"
              v-model="bpmn.description"
            >
            </a-input>
          </a-form-item>


        </a-tab-pane>
      </a-tabs>


      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          @click.stop.prevent="bpmn_create"
          :disabled="loginBtn">确定
        </a-button>
      </a-form-item>

    </a-form>


  </div>
</template>

<script>
  import {postAction} from '@/api/manage'

  export default {
    data() {
      return {
        customActiveKey: "tab1",
        loginBtn: false,
        form: this.$form.createForm(this),
        bpmn: {
          name: "",
          key: "",
          description: "",
        },
        validatorRules: {
          name: {rules: [{required: true, message: '请输入流程名称!', validator: 'click'}]},
          key: {rules: [{required: true, message: '请输入流程key!', validator: 'click'}]},
          description: {rules: [{required: false, message: '请输入描述信息'}, {validator: this.validateInputCode}]}
        }
      }
    },
    created() {
    },
    methods: {
      bpmn_create() {
        var url = '/modeler/create'
        var url_model = '/modeler.html?modelId='
        var parm = {'name': this.bpmn.name, 'key': this.bpmn.key, 'description': this.bpmn.description}




        postAction(url, parm).then((res) => {

          if (res.success) {
            url_model = window._CONFIG['domianURL'] + url_model + res.message
            // window.location.href = url_model
            window.open(url_model)

          } else {
            alert(res.message)
            window.location.reload()

          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, .2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }

</style>
<style>
  .valid-error .ant-select-selection__placeholder {
    color: #f5222d;
  }
</style>