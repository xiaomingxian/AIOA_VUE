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
              placeholder="请输入流程名称(只能以中文或英文开头,只能包含中文/英文/数字/下划线;长度大于等于5小于等于20)"
              v-model="bpmn.name"
            >
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="key"
              autocomplete="false"
              placeholder="请输入流程key(只能以字母开头,只能包含字母,数字,下划线;长度大于等于5小于等于20)"
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
        iisFontSize: '16px',
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
      this.setFontSize();
    },
    methods: {
      setFontSize(){
        const  userid =JSON.parse( localStorage.getItem('userdata')).userInfo.id;
        let url = "/testt/sysUserSet/queryByUserId";
        getAction(url,{userId:userid}).then((res) => {
          if(res.result.iisFontSize == 1){
            this.iisFontSize = '18px';
          }else if(res.result.iisFontSize == 3){
            this.iisFontSize = '14px';
          }else{
            this.iisFontSize = '16px';
          }
          document.getElementsByClassName('ant-table')[0].style.fontSize = this.iisFontSize;
        })
      },
      bpmn_create() {
        var url = '/modeler/create'
        var url_model = '/modeler.html?modelId='
        var parm = {'name': this.bpmn.name, 'key': this.bpmn.key, 'description': this.bpmn.description}



        let keyReg = /^([a-zA-Z])([-_a-zA-Z0-9]{4,19})$/
        if (!keyReg.test(this.bpmn.key)) {
          if ((this.bpmn.key).length > 20) {
            this.$message.error('您输入的key长度过长')
            return
          }
          if ((this.bpmn.key).length < 5) {
            this.$message.error('您输入的key长度过短')
            return
          }
          this.$message.error('您输入的key不合法请检查')
          return
        }
        let nameReg = /^([\u4e00-\u9fa5]|[a-zA-Z])([-\u4e00-\u9fa5_-_a-zA-Z0-9]{4,19})$/
        if (!nameReg.test(this.bpmn.name)) {

          if ((this.bpmn.name).length > 20) {
            this.$message.error('您输入的名称长度过长')
            return
          }
          if ((this.bpmn.name).length < 5) {
            this.$message.error('您输入的名称长度过短')
            return
          }
          this.$message.error('您输入的名称不合法请检查')

          return
        }


        postAction(url, parm).then((res) => {

          if (res.success) {
            url_model = window._CONFIG['domianURL'] + url_model + res.message
            // window.location.href = url_model
            window.open(url_model)

          } else {
            this.$message.error(res.message)
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