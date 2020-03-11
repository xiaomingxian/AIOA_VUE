<template>
  <div class="main">
    <h1 @click="downLoadFile" style="width: 120%;position: absolute;top: 9%;left: 36%;color: red;cursor: pointer;">体验前先看我—>《系统体验指导手册》</h1>
    <img v-if="picDetail.pic" :src="picDetail.pic" style="width: 51%;height: 38%;position: fixed;left: 6.5%;bottom: 29.5%;"/>
    <img v-else src="~@/assets/work.png" style="width: 51%;height: 38%;position: fixed;left: 6.5%;bottom: 29.5%;"/>
    <img src="~@/assets/translucent.png" style="width: 16.7%;height: 38%;position: fixed;left: -3%;bottom: 29.5%;"/>
    <img src="~@/assets/inputbg.png" style="width: 55%;height: 47%;position: fixed;right: 0%;bottom: 26%;"/>
    <img src="~@/assets/technologypic.png" style="width: 7%;height: 14%;position: fixed;right: 12%;bottom: 69%;"/>
    <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin" style="width: 18%;height: 32%;position: fixed;right: 25.7%;bottom: 38.7%;">
      <a-tabs
        class="login"
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick">
        <a-tab-pane key="tab1" tab="用户登录">
          <a-form-item v-show="orgSchemaFlag">
            <a-select size="large"  placeholder="请选择机构" v-decorator="[ 'orgSchema', {}]">
              <a-select-option v-for="(item,index) in orgSchemaList" :key="index" :value="item.value">
                {{item.text}}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              v-decorator="['username',validatorRules.username,{ validator: this.handleUsernameOrEmail }]"
              type="text"
              placeholder="请输入帐户名">
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              v-decorator="['password',validatorRules.password]"
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码 / 默认123456">
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="0" style="display: none">
            <a-col :span="14">
              <a-form-item>
                <a-input
                  v-decorator="['inputCode',validatorRules.inputCode]"
                  size="large"
                  type="text"
                  @change="inputCodeChange"
                  placeholder="请输入验证码">
                  <a-icon slot="prefix" v-if=" inputCodeContent==verifiedCode " type="smile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                  <a-icon slot="prefix" v-else type="frown" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col  :span="10">
              <j-graphic-code @success="generateCode" style="float: right"></j-graphic-code>
            </a-col>
          </a-row>
        </a-tab-pane>
        <!--<a-tab-pane key="tab2" tab="手机号登陆">
          <a-form-item>
            <a-input
              v-decorator="['mobile',validatorRules.mobile]"
              size="large"
              type="text"
              placeholder="手机号">
              <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item>
                <a-input
                  v-decorator="['captcha',validatorRules.captcha]"
                  size="large"
                  type="text"
                  placeholder="请输入验证码">
                  <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"></a-button>
            </a-col>
          </a-row>
        </a-tab-pane>-->
      </a-tabs>

      <!--<a-form-item>
        <a-checkbox v-model="formLogin.rememberMe">自动登陆</a-checkbox>
       <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">
          忘记密码
        </router-link>
        <router-link :to="{ name: 'register'}" class="forge-password" style="float: right;margin-right: 10px" >
          注册账户
        </router-link>
      </a-form-item>-->

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn"
        >确定
        </a-button>
      </a-form-item>

      <!-- <div class="user-login-other">
        <span>其他登陆方式</span>
        <a><a-icon class="item-icon" type="alipay-circle"></a-icon></a>
        <a><a-icon class="item-icon" type="taobao-circle"></a-icon></a>
        <a><a-icon class="item-icon" type="weibo-circle"></a-icon></a>
        <router-link class="register" :to="{ name: 'register' }">
          注册账户
        </router-link>
      </div>-->
    </a-form>

    <two-step-captcha
      style="z-index: 9999"
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"></two-step-captcha>

    <a-modal
      title="登录部门选择"
      :width="450"
      :visible="departVisible"
      :closable="false"
      :maskClosable="false">

      <template slot="footer">
        <a-button  @click="close">取消</a-button>
        <a-button type="primary" @click="departOk">确认</a-button>
      </template>

      <a-form>
        <a-form-item
          :labelCol="{span:4}"
          :wrapperCol="{span:20}"
          style="margin-bottom:10px"
          :validate-status="validate_status">
          <a-tooltip placement="topLeft" >
            <template slot="title">
              <span>您隶属于多部门，请选择登录部门</span>
            </template>
            <a-avatar style="backgroundColor:#87d068" icon="gold" />
          </a-tooltip>
          <a-select @change="departChange" :class="{'valid-error':validate_status=='error'}" placeholder="请选择登录部门" style="margin-left:10px;width: 80%">
            <a-icon slot="suffixIcon" type="gold" />
            <a-select-option
              v-for="d in departList"
              :key="d.id"
              :value="d.orgCode">
              {{ d.departName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>



    </a-modal>

  </div>
</template>

<script>
  //import md5 from "md5"
  import api from '@/api'
  import axios from 'axios'
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
  import { mapActions } from "vuex"
  import { timeFix } from "@/utils/util"
  import Vue from 'vue'
  import { ACCESS_TOKEN ,ENCRYPTED_STRING} from "@/store/mutation-types"
  import JGraphicCode from '@/components/jeecg/JGraphicCode'
  import { getAction,postAction,putAction } from '@/api/manage'
  import { encryption , getEncryptedString } from '@/utils/encryption/aesEncrypt'
  import store from '@/store/'
  import { USER_INFO } from "@/store/mutation-types"

  export default {
    components: {
      TwoStepCaptcha,
      JGraphicCode,
      ATextarea
    },
    data () {
      return {
        picDetail:{
          pic: '',
          nowPic:''
        },
        headers: {
          'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        },
        customActiveKey: "tab1",
        //机构
        orgSchemaList:[],
        orgSchemaFlag:false,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        form: this.$form.createForm(this),
        encryptedString:{
          key:"",
          iv:"",
        },
        url: {
          getLoginText: '/oafile/LoginPicture/loginPictrue',
          getOrgSchemaList: "/sys/dict/getDictItems/org_schema",
        },
        state: {
          time: 60,
          smsSendBtn: false,
        },
        formLogin: {
          username: "",
          password: "",
          captcha: "",
          mobile: "",
          rememberMe: true
        },
        validatorRules:{
          username:{rules: [{ required: true, message: '请输入用户名!',validator: 'click'}]},
          password:{rules: [{ required: true, message: '请输入密码!',validator: 'click'}]},
          mobile:{rules: [{validator:this.validateMobile}]},
          captcha:{rule: [{ required: true, message: '请输入验证码!'}]},
          inputCode:{rules: [{ required: true, message: '请输入验证码!'},{validator: this.validateInputCode}]}
        },
        verifiedCode:"",
        inputCodeContent:"",
        inputCodeNull:true,

        departList:[],
        departVisible:false,
        departSelected:"",
        currentUsername:"",
        validate_status:""
      }
    },
    created () {
      this.getOrgSchemaList();
      this.show();
      Vue.ls.remove(ACCESS_TOKEN)
      this.getRouterData();
      // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
      //this.getEncrypte();
      // update-end- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
    },
    methods: {
      downLoadFile() {
        let URL = '/ntko/files/AI综合办公服务平台体验指导手册.docx';
        window.open(URL);
      },


      ...mapActions([ "Login", "Logout","PhoneLogin" ]),
      getOrgSchemaList(){
        getAction(this.url.getOrgSchemaList).then(res=>{
          this.orgSchemaList = res.result ;
          if(this.orgSchemaList.length>0){
            this.orgSchemaFlag = true ;
            this.form.setFieldsValue({'orgSchema': this.orgSchemaList[0].value});
            console.log(this.form.getFieldValue('orgSchema'))
          }
        })
      },

      //显示当前已确认使用的图片
      show() {
        this.picDetail.picurl = window._CONFIG['domianURL'] + '/oafile/LoginPicture/readPicture?resourceType=image',
          axios.get(this.picDetail.picurl, {
            responseType: 'arraybuffer',
            headers: {
              'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
            }
          }).then(res => {

            if(this.picDetail.nowPic != 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')) && res.data.byteLength >= 10){
              this.picDetail.nowPic = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.picDetail.pic = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.visible = true;
            }else{
              // this.picDetail.pic = "";

              this.picDetail.pic = this.picDetail.nowPic;
            }

          })
      },

      // handler
      handleUsernameOrEmail (rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        callback()
      },
      handleTabClick (key) {
        this.customActiveKey = key
        // this.form.resetFields()
      },
      handleSubmit () {
        let that = this
        let loginParams = {
          remember_me: that.formLogin.rememberMe
        };
        that.loginBtn = true;
        // 使用账户密码登陆
        if (that.customActiveKey === 'tab1') {
          // 去掉验证码校验
          // that.form.validateFields([ 'username', 'password','inputCode' ], { force: true }, (err, values) => {
          that.form.validateFields([ 'username', 'password','orgSchema' ], { force: true }, (err, values) => {
            if (!err) {
              loginParams.username = values.username
              // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
              //loginParams.password = md5(values.password)
              //loginParams.password = encryption(values.password,that.encryptedString.key,that.encryptedString.iv)
              loginParams.password = values.password
              //if()
              loginParams.orgSchema = values.orgSchema
              // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题

              that.Login(loginParams).then((res) => {
                //储存用户信息到本地
                const userdata = res.result;

                window.localStorage.setItem('userdata',JSON.stringify(userdata));
                this.departConfirm(res)
              }).catch((err) => {
                that.requestFailed(err);
              });


            }else {
              that.loginBtn = false;
            }
          })
          // 使用手机号登陆
        } else {
          that.form.validateFields([ 'mobile', 'captcha' ], { force: true }, (err, values) => {
            if (!err) {
              loginParams.mobile = values.mobile
              loginParams.captcha = values.captcha
              that.PhoneLogin(loginParams).then((res) => {
                console.log(res.result);
                this.departConfirm(res)
              }).catch((err) => {
                that.requestFailed(err);
              })

            }
          })
        }
      },
      getCaptcha (e) {
        e.preventDefault();
        let that = this;
        this.form.validateFields([ 'mobile' ], { force: true },(err,values) => {
            if(!values.mobile){
              that.cmsFailed("请输入手机号");
            }else if (!err) {
              this.state.smsSendBtn = true;
              let interval = window.setInterval(() => {
                if (that.state.time-- <= 0) {
                  that.state.time = 60;
                  that.state.smsSendBtn = false;
                  window.clearInterval(interval);
                }
              }, 1000);

              const hide = this.$message.loading('验证码发送中..', 0);
              let smsParams = {};
                  smsParams.mobile=values.mobile;
                  smsParams.smsmode="0";
              postAction("/sys/sms",smsParams)
                .then(res => {
                  if(!res.success){
                    setTimeout(hide, 0);
                    this.cmsFailed(res.message);
                  }
                  console.log(res);
                  setTimeout(hide, 500);
                })
                .catch(err => {
                  setTimeout(hide, 1);
                  clearInterval(interval);
                  that.state.time = 60;
                  that.state.smsSendBtn = false;
                  this.requestFailed(err);
                });
            }
          }
        );
      },
      stepCaptchaSuccess () {
        this.loginSuccess()
      },
      stepCaptchaCancel () {
        this.Logout().then(() => {
          this.loginBtn = false
          this.stepCaptchaVisible = false
        })
      },
      loginSuccess () {
        // update-begin- author:sunjianlei --- date:20190812 --- for: 登录成功后不解除禁用按钮，防止多次点击
        // this.loginBtn = false
        // update-end- author:sunjianlei --- date:20190812 --- for: 登录成功后不解除禁用按钮，防止多次点击
        const userinfo =JSON.parse( localStorage.getItem('userdata')).userInfo;
        let currentUsername = userinfo.username;
        this.$router.push({ name: "dashboard" })
        let url = "/sys/message";
        postAction(url,{username: currentUsername}).then((res) => {
          console.log("11111111111111111")
          console.log(res)
          if (res.result == null || res.result == ''){
            this.$notification.success({
              message: `${timeFix()}，欢迎`+ currentUsername +`回来`
            });
          } else {
            this.IP = res.result;
            this.$notification.success({
              message: `${timeFix()}，欢迎`+ currentUsername +`回来`,
              description: '最近登录IP : '+this.IP,
            });
          }

        });
      },
      cmsFailed(err){
        this.$notification[ 'error' ]({
          message: "登录失败",
          description:err,
          duration: 4,
        });
      },
      requestFailed (err) {
        this.$notification[ 'error' ]({
          message: '登录失败',
          description: ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试",
          duration: 4,
        });
        this.loginBtn = false;
      },
      validateMobile(rule,value,callback){
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)){
          callback();
        }else{
          callback("您的手机号码格式不正确!");
        }

      },
      validateInputCode(rule,value,callback){
        if(!value || this.verifiedCode==this.inputCodeContent){
          callback();
        }else{
          callback("您输入的验证码不正确!");
        }
      },
      generateCode(value){
        this.verifiedCode = value.toLowerCase()
      },
      inputCodeChange(e){
        this.inputCodeContent = e.target.value
        if(!e.target.value||0==e.target.value){
          this.inputCodeNull=true
        }else{
          this.inputCodeContent = this.inputCodeContent.toLowerCase()
          this.inputCodeNull=false
        }
      },
      departConfirm(res){
        if(res.success){
          let multi_depart = res.result.multi_depart
          //0:无部门 1:一个部门 2:多个部门
          if(multi_depart==0){
            this.loginSuccess()
            this.$notification.warn({
              message: '提示',
              description: `您尚未归属部门,请确认账号信息`,
              duration:3
            });
          }else if(multi_depart==2){
            this.departVisible=true
            this.currentUsername=this.form.getFieldValue("username")
            this.departList = res.result.departs
          }else {
            this.loginSuccess()
          }
        }else{
          this.requestFailed(res)
          this.Logout();
        }
      },
      close(){
        this.Logout().then(()=>{
          this.departClear();
          this.loginBtn = false;
        });
      },
      departOk(){
        if(!this.departSelected){
          this.validate_status='error'
          return false
        }
       let obj = {
          orgCode:this.departSelected,
          username:this.form.getFieldValue("username")
        }
        putAction("/sys/selectDepart",obj).then(res=>{
          if(res.success){
            const userInfo = res.result.userInfo;
            Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000);
            store.commit('SET_INFO', userInfo);
            //console.log("---切换组织机构---userInfo-------",store.getters.userInfo.orgCode);
            this.departClear()
            this.loginSuccess()
          }else{
            this.requestFailed(res)
            this.Logout().then(()=>{
              this.departClear()
            });
          }
        })
      },
      departClear(){
        this.departList=[]
        this.departSelected=""
        this.currentUsername=""
        this.departVisible=false
        this.validate_status=''
      },
      departChange(value){
        this.validate_status='success'
        this.departSelected = value
      },
    getRouterData(){
      this.$nextTick(() => {
        this.form.setFieldsValue({
        'username': this.$route.params.username
      });
    })
    },
    //获取密码加密规则
    getEncrypte(){
      var encryptedString = Vue.ls.get(ENCRYPTED_STRING);
      if(encryptedString == null){
        getEncryptedString().then((data) => {
          this.encryptedString = data
        });
      }else{
        this.encryptedString = encryptedString;
      }
    },
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
        color: rgba(0,0,0,.2);
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

  /*.user-layout-wrapper .container .header .title{*/
    /*font-size: 26px !important;*/
    /*background-color: transparent !important;*/
  /*}*/

  .user-layout-login  .ant-tabs-nav {
    bottom: 10px;
    left: 36%;
  }
  .user-layout-login .ant-tabs-nav .ant-tabs-tab-active{
    font-size: 16px;
    color:#fff;
  }

  .user-layout-login .ant-tabs-nav .ant-tabs-tab-active:hover{
    font-size: 16px;
    color: #40a9ff;
  }

  .user-layout-login .ant-tabs-nav .ant-tabs-ink-bar{
    background-color: #c3fdff;
  }

  .user-layout-login .login-button{
    color:#624af7;
    background:linear-gradient(to right,rgb(0,228,255),rgb(146,254,215)) repeat scroll 0% 0%;
    border-color:#29DFDD;
  }

  .user-layout-login .login-button:hover{
    background:#20d8f4;
  }

  .valid-error .ant-select-selection__placeholder{
    color: #f5222d;
  }

</style>