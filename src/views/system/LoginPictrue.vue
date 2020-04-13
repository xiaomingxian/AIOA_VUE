<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <div class="watchHeader" style="position: absolute;bottom: 112.7%;left: -1%;">
          <img v-if="picDetail.pic1" :src="picDetail.pic1" style="width: 101%;height: 59px;background-color: #055bc4;"/>
          <img v-else src="~@/assets/titlebg@2x.png" style="width: 101%;height: 59px;background-color: #055bc4;"/>
        </div>

        <div style="height: auto; background: #fff;  padding: 27px;">

          <div style="display: flex;position: relative;bottom: 32px;right: 27px;">
            <img src="~@/assets/settingTitle@2x.png" style="width: 1672.7px;height: 43px;"/>
          </div>

          <div style="width: 100%;display: flex;background: #fff;align-items: center;justify-content: flex-start;margin-left: 96px;">
            <span>默认使用背景图 :&nbsp&nbsp</span>
            <a-switch @change="onChange1" checked-children="自定义" v-model="iisCalendar"   un-checked-children="默认"></a-switch>
            <!--<span style="color: #d60303;margin-left: 50px;">只允许上传png、jpg、bmp格式的图片</span>-->
          </div>



          <div style="display: flex;position: relative;top: 22px;">
            <span style="font-size: 16px;font-weight: bolder;">自定义图片</span>
            <span style="color: #d60303;margin-left: 10px;">只允许上传png、jpg、bmp格式的图片</span>
          </div>



          <div style="height: 80px;display: flex;margin:17px 0 0 96px;">
            <div style="display: flex;align-items: center;justify-content: flex-start;">
              <span>登录页面背景图：</span>
              <a-upload
                name="file"
                :multiple="false"
                :showUploadList="false"
                :beforeUpload="beforeUpload"
                :headers="headers"
              >
                <a-button style="width:172px;border-color: #8cc8ff">
                  <a-icon type="upload" />
                  点击上传主背景图
                </a-button>
              </a-upload>
            </div>
            <div style="background: #fff;display: flex;align-items: center;justify-content: flex-start;margin-left: 30px;">
              <span style="color: #d60303;">建议上传图片尺寸876*455px，大小1MB以内</span>
            </div>
            <div style="background: #fff;display: flex;align-items: center;justify-content: flex-start;margin-left: 30px;">
              <span style="width: 188px;">图片名称：</span>
              <a-input v-if="picDetail.upFileName" style="margin-left: -71px;border: transparent;" v-model="picDetail.upFileName" disabled/>
            </div>
          </div>



          <div style="display: flex;margin-left: 96px;">
            <div style="display: flex;align-items: center;justify-content: flex-start;">
              <span>首页头部背景图：</span>
              <a-upload
                name="file"
                :multiple="false"
                :showUploadList="false"
                :beforeUpload="beforeUpload1"
                :headers="headers"
              >
                <a-button style="width: 172px;border-color: #8cc8ff">
                  <a-icon type="upload" />
                  点击上传Header图
                </a-button>
              </a-upload>
            </div>
            <div style="background: #fff;display: flex;align-items: center;justify-content: flex-start;margin-left: 30px;">
              <span style="color: #d60303;">建议上传图片尺寸1618*70px，大小1MB以内</span>
            </div>
            <div style="background: #fff;display: flex;align-items: center;justify-content: flex-start;margin-left: 30px;">
              <span style="width: 188px;">图片名称：</span>
              <a-input v-if="picDetail.upFileName1" style="margin-left: -71px;border: transparent;" v-model="picDetail.upFileName1" disabled/>
            </div>
          </div>




          <div style="height: 80px;display: flex;margin: 0 0 9px 96px;">
            <div style="display: flex;align-items: center;justify-content: flex-start;">
              <span>登录&导航Logo：</span>
              <a-upload
                name="file"
                :multiple="false"
                :showUploadList="false"
                :beforeUpload="beforeUpload2"
                :headers="headers"
              >
                <a-button style="width:172px;border-color: #8cc8ff;">
                  <a-icon type="upload" />
                  点击上传logo
                </a-button>
              </a-upload>
            </div>
            <div style="background: #fff;display: flex;align-items: center;justify-content: flex-start;margin-left: 30px;">
              <span style="color: #d60303;">建议上传图片为png格式，大小1MB以内</span>
            </div>
            <div style="background: #fff;display: flex;align-items: center;justify-content: flex-start;margin-left: 57px;">
              <span style="width: 188px;">图片名称：</span>
              <a-input v-if="picDetail.upFileName2" style="margin-left: -71px;border: transparent;" v-model="picDetail.upFileName2" disabled/>
              <!--<a-input v-else style="margin-left: -20px;border: transparent;" v-model="picDetail.upFileName2" disabled/>-->
            </div>
          </div>


          <div style="width: 907px;height: 1px;background-color: rgba(0, 0, 0, 0.65);margin-left: 96px;"></div>


          <div style="display: flex;position: relative;top: 27px;">
            <span style="font-size: 16px;font-weight: bolder;">自定义标题</span>
          </div>



          <div style="display: flex;margin: 41px 0 0 96px;">
            <div style=" background: #fff;display: flex;align-items: center;justify-content: flex-start;">
              <span style="width: 71px;">系统名称：</span>
              <a-input style="width: 371px;" maxlength="50" onkeyPress="if(event.keyCode == 32){event.keyCode = 0;event.returnValue = false}"  @input="getLoginPic"  v-model="picDetail.editTitleText" />
            </div>

            <div style="background: #fff;display: flex;align-items: center;justify-content: flex-start;margin-left: 353px;">
              <a-button size="middle" icon="check-circle" @click="confirmPic"  type="primary">确认替换</a-button>
            </div>
          </div>

          <div style="height: 41px;display: flex;margin-left: 96px;">
            <div style="background: #fff;display: flex;align-items: center;justify-content: flex-start;">
              <span style="color: #d60303;">实例1：XX省综合办公服务平台&XX市中心支行。登录页系统名：XX省综合办公服务平台；系统内系统名：XX市中心支行<br/>
                                            实例2：XX省综合办公服务平台。登录页系统名：XX省综合办公服务平台；系统内系统名：XX省综合办公服务平台
              </span>
            </div>
          </div>
        </div>

        <div class="watchBox">
          <div style="margin: 0% 0% 0% 14%;display: inline-table;">
            <img v-if="picDetail.pic2" style="width:49.59px;height:44px;position: absolute;bottom: 74%;" :src="picDetail.pic2">
            <img v-else style="width:49.59px;height:44px;position: absolute;bottom: 74%;" src="~@/assets/logo2x.png">
            <!--<a-input style="width: 260px;margin: 3% 0% 0% 14%;" v-model="picDetail.pictrueText" />-->
            <span style="font-size:27px;font-weight: bolder;position: absolute;bottom: 74%;left: 18%;">{{picDetail.pictrueText}}</span>
          </div>
          <div class="watchPic">
            <!--<div style="width: 100px; height: 100px; background-color: red " v-model="picDetail.pictrueText"></div>-->
            <!--{{picDetail.pic}}-->
            <!--<img  :src="picDetail.pic" style="width:51%;height:260px;position: absolute;top: 27%;left: 50px"/>-->
            <img v-if="picDetail.pic" :src="picDetail.pic" style="width:51%;height: 39.5%;position: absolute;top: 27%;left: 50px"/>
            <img v-else src="~@/assets/work.png" style="width:51%;height: 39.5%;position: absolute;top: 27%;left: 50px"/>
            <!--<img src="~@/assets/background.svg"/>-->
            <img src="~@/assets/translucentCut.png" style="width:12.7%;height: 39.5%;position: absolute;top: 27%;left: 0%"/>
            <img src="~@/assets/inputbgFilled.png" style="width:55%;height: 44%;position: absolute;top: 25%;right: 0"/>
            <img src="~@/assets/technologypic.png" style="width:7%;height:14%;position: absolute;right: 12%;bottom: 72%;"/>
          </div>

          <div class="footer">
            <div class="copyright">
              中国金融电子化公司版权所有
              <a-icon type="copyright"/>
              <span> 2016 All rights reserved</span>
            </div>
          </div>
        </div>

      </a-form>
    </a-spin>
  </div>

</template>

<script>
  import {httpAction, getAction,postAction} from '@/api/manage'
  import Vue from 'vue'
  import axios from 'axios'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "LoginPictrue",
    components: {ATextarea},
    // inject:['reload'],
    data() {
      return {
        picDetail:{
          fileId: '',
          fileId1: '',
          fileId2: '',
          editTitleText:[],
          pictrueText: '',
          logoText: '',
          upFileName: '',
          upFileName1: '',
          upFileName2:'',
          pic: '',
          pic1: '',
          pic2: '',
          nowPic: '',
          nowPic1: '',
          nowPic2: '',
          fileType: 'bmp、jpg、png',
          picurl:'',
          picurl1:'',
          picurl2:'',
          picurl3:'',
          picurl4:'',
      },
      iisCalendar:false,
      iis:'',
      point:'只允许上传png、jpg、bmp格式的图片',
      upFailId: 0,
      flag: true,
      upFilePath: '',
      downFilePath: '',
      previewVisible: false,
      visible: false,
      headers: {
        'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
      },
      fileList: [],
      model: {},
      Dbtable: [],
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
      url: {
        checkDefault:'/oafile/LoginPicture/checkDefault',
        checkDefault1:'/oafile/groPicture/checkDefault',
        checkDefault2:'/oafile/signPicture/checkDefault',
        updatePic:'/oafile/LoginPicture/updatePicture',
        updatePic1:'/oafile/groPicture/updatePicture',
        updatePic2:'/oafile/signPicture/updatePicture',
        fileUpload: window._CONFIG['domianURL'] +"/oafile/LoginPicture/upload",
        fileUpload1: window._CONFIG['domianURL'] +"/oafile/groPicture/upload",
        fileUpload2: window._CONFIG['domianURL'] +"/oafile/signPicture/upload",
        getLoginText: '/oafile/LoginPicture/loginPictrue',
        getLoginText1: '/oafile/groPicture/loginPictrue',
        getLoginTextSign: '/oafile/signPicture/loginPictrue',
        updatePicText: '/oafile/LoginPicture/updatePicText',
        getPictrueText: '/oafile/LoginPicture/getPictrueText',
      },
    }
  },
  created() {
    this.show();
    this.show3();
    this.showSign();
    this.getPicText();
  },
    mounted(){
      this.hiddenBg();
    },
    destroyed() {
      this.showBg();
    },
  methods: {
    hiddenBg(){

      document.getElementsByClassName('header')[0].style.position = 'relative';
      document.getElementsByClassName('header')[0].style.top = '-61px';

      document.getElementsByClassName('trigger')[0].style.position = 'relative';
      document.getElementsByClassName('trigger')[0].style.top = '66px';

      document.getElementsByClassName('user-wrapper')[0].style.position = 'relative';
      document.getElementsByClassName('user-wrapper')[0].style.top = '61px';
      document.getElementsByClassName('user-wrapper')[0].style.right = '27px';

    },
    showBg(){

      document.getElementsByClassName('header')[0].style.top = '0px';
      document.getElementsByClassName('trigger')[0].style.top = '5px';
      document.getElementsByClassName('user-wrapper')[0].style.top = '0px';

    },

    beforeUpload(file){
      const formData=new FormData();
      formData.append("file",file);
      var t = file.name.substring(file.name.indexOf(".")+1);
        var type = this.picDetail.fileType.split("、");
        var flag = false;
        for (var i = 0;i<type.length;i++){
          if (type[i].toLowerCase() == t.toLowerCase()){
            flag = true;
          }
        }
        if (!flag){
          this.$message.warn("请上传"+ this.picDetail.fileType+"格式的图片");
          return
        }
        httpAction(this.url.fileUpload, formData, "post").then((res) => {
          if (res.success) {
            this.picDetail.upFileName = res.result.sfileName
            this.picDetail.fileId = res.result.iid;
            this.picDetail.pictrueText = res.result.stable;
            this.show1(res.result.iid);
            this.$message.success("上传主背景图成功");
            this.$emit('ok');
          } else {
            this.$message.error("上传主背景图失败");
          }
        })
        return true;
      },

      beforeUpload1(file){
        const formData=new FormData();
        formData.append("file",file);
        var t = file.name.substring(file.name.indexOf(".")+1);
        var type = this.picDetail.fileType.split("、");
        var flag = false;
        for (var i = 0;i<type.length;i++){
          if (type[i].toLowerCase() == t.toLowerCase()){
            flag = true;
          }
        }
        if (!flag){
          this.$message.warn("请上传正确格式的图片");
          return
        }
        httpAction(this.url.fileUpload1, formData, "post").then((res) => {
          if (res.success) {
            this.picDetail.upFileName1 = res.result.sfileName
            this.picDetail.fileId1 = res.result.iid;
            this.show4(res.result.iid);
            this.$message.success("上传成功");
            this.$emit('ok');
          } else {
            this.$message.error("上传失败");
          }
        })
        return true;
      },

      beforeUpload2(file){
        const formData=new FormData();
        formData.append("file",file);
        var t = file.name.substring(file.name.indexOf(".")+1);
        var type = this.picDetail.fileType.split("、");
        var flag = false;
        for (var i = 0;i<type.length;i++){
          if (type[i].toLowerCase() == t.toLowerCase()){
            flag = true;
          }
        }
        if (!flag){
          this.$message.warn("请上传正确格式的图片");
          return
        }
        httpAction(this.url.fileUpload2, formData, "post").then((res) => {
          if (res.success) {
            this.picDetail.upFileName2 = res.result.sfileName;
            this.picDetail.fileId2 = res.result.iid;
            this.show2(res.result.iid);
            this.$message.success("上传logo成功");
            this.$emit('ok');
          } else {
            this.$message.error("上传logo失败");
          }
        })
        return true;
      },


      getLoginPic(){

        if (typeof this.getCaption(this.picDetail.editTitleText) == 'object') {

          if (this.getCaption(this.picDetail.editTitleText)[0] == '') {

            this.picDetail.pictrueText = "中国人民银行";

          } else {

            this.picDetail.pictrueText = this.getCaption(this.picDetail.editTitleText)[0];

          }

        }else{

          this.picDetail.pictrueText = this.picDetail.editTitleText;

        }

      },

      getPicText(){
        postAction(this.url.getPictrueText).then(res => {
          if (res.success){
            console.log(res)
            if (res.result == null){
              this.picDetail.editTitleText = "中国人民银行";
              this.picDetail.pictrueText = "中国人民银行";
            } else {
              // this.iisCalendar = true;
              this.picDetail.editTitleText = res.result;
              this.getLoginPic();

            }
          }
        })
      },

      //确认替换
      confirmPic(){
        //fileId：背景主图id
        if (this.picDetail.fileId != null && this.picDetail.fileId != ''){
          getAction(this.url.updatePic,{id:this.picDetail.fileId}).then(res => {
            // if (res.success){
            //   this.$message.success(res.message)
            // } else {
            //   this.$message.error(res.message);
            // }
          })
        }
        //fileId1：Header图id
        if (this.picDetail.fileId1 != null && this.picDetail.fileId1 != ''){
          getAction(this.url.updatePic1,{id:this.picDetail.fileId1}).then(res => {
            // if (res.success){
            //   this.$message.success(res.message);
            // } else {
            //   this.$message.error(res.message);
            // }
          })
        }
        //fileId2：logo
        if (this.picDetail.fileId2 != null && this.picDetail.fileId2 != ''){
          getAction(this.url.updatePic2,{id:this.picDetail.fileId2}).then(res => {
            // if (res.success){
            //   this.$message.success(res.message)
            // } else {
            //   this.$message.error(res.message);
            // }
          })
        }
        if (this.picDetail.editTitleText != null && this.picDetail.editTitleText != ""){
          getAction(this.url.updatePicText,{picText:this.picDetail.editTitleText}).then(res => {
            if (res.success){
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message);
            }
          })
        }
      },

      getText(){

        postAction(this.url.getLoginText).then(res => {

          if (res.success){

            if(res.result == null){

              this.picDetail.upFileName = "";

              this.iisCalendar = false;

            }else {

              this.iisCalendar = true;

              this.picDetail.upFileName = res.result.sfileName;

              this.picDetail.fileId = res.result.iid;

            }


          }
        })
      },

      getText3(){
        postAction(this.url.getLoginText1).then(res => {
          if (res.success){
            if (res.result.sfileName == null || res.result.iid == null){
              this.picDetail.upFileName1 = "";
              this.picDetail.fileId1 = "";
            } else {
              this.picDetail.upFileName1 = res.result.sfileName;
              this.picDetail.fileId1 = res.result.iid;
            }
          }
        })
      },

      getCaption(obj,state){
        let index = obj.lastIndexOf("\&");
        if(index == -1){
          return obj;
        }else {
          if(state == 0){
            obj = obj.substring(0,index);
          }else if(state == 1){
            obj = obj.substring(index+1,obj.length);
          }else {
            obj = [obj.substring(0,index),obj.substring(index+1,obj.length)];
          }
        }
        return obj;
      },

      //显示当前已确认使用的图片
      show() {
        this.getText();
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

      getTextSign(){

        postAction(this.url.getLoginTextSign).then(res => {

          if (res.success){

            if (res.result == null){

              this.picDetail.logoText = "中国人民银行";

              this.picDetail.upFileName2 = "";

            } else {

              this.picDetail.upFileName2 = res.result.sfileName;

              if (res.result.stable == null) {

                this.picDetail.logoText = "中国人民银行";

              }else{

                if(typeof this.getCaption(res.result.stable) == 'object'){

                  if (this.getCaption(res.result.stable)[1] == '') {

                    this.picDetail.logoText = "中国人民银行";

                  } else {

                    this.picDetail.logoText = this.getCaption(res.result.stable)[1];

                  }

                }else {

                  this.picDetail.logoText = res.result.stable;

                }

              }

              this.picDetail.fileId2 = res.result.iid;

            }
          }
        })
      },

      //显示当前已确认使用的图片(标志)
      showSign() {
        this.getTextSign();
        this.picDetail.picurl2 = window._CONFIG['domianURL'] + '/oafile/signPicture/readPicture?resourceType=image',
          axios.get(this.picDetail.picurl2, {
            responseType: 'arraybuffer',
            headers: {
              'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
            }
          }).then(res => {
            if(this.picDetail.nowPic2 != 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')) && res.data.byteLength >= 10){
              this.picDetail.nowPic2 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.picDetail.pic2 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.visible = true;

            }else{
              // this.picDetail.pic2 = "";

              this.picDetail.pic2 = this.picDetail.nowPic2;
            }
          })
      },

      //显示当前未确认使用的图片
      show2(fileId) {
        this.picDetail.picurl2 = window._CONFIG['domianURL'] + '/oafile/signPicture/readNotPicture?id='+ fileId +'&resourceType=image',
          axios.get(this.picDetail.picurl2, {
            responseType: 'arraybuffer',
            headers: {
              'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
            }
          }).then(res => {
            console.log(res)
            if(this.picDetail.nowPic2 != 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')) && res.data.byteLength >= 10){
              this.picDetail.nowPic2 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.picDetail.pic2 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.visible = true;
            }else{
              // this.picDetail.pic2 = "";

              this.picDetail.pic2 = this.picDetail.nowPic2;
            }
          })
      },

      //显示当前已确认使用的图片
      show3() {
        this.getText3();
        this.picDetail.picurl3 = window._CONFIG['domianURL'] + '/oafile/groPicture/readPicture?resourceType=image',
          axios.get(this.picDetail.picurl3, {
            responseType: 'arraybuffer',
            headers: {
              'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
            }
          }).then(res => {
            if(this.picDetail.nowPic1 != 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')) && res.data.byteLength >= 10){
              this.picDetail.nowPic1 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.picDetail.pic1 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.visible = true;
            }else{
              // this.picDetail.pic1 = "";

              this.picDetail.pic1 = this.picDetail.nowPic1;
            }
          })
      },

      //显示当前未确认使用的图片
      show1(fileId) {
        this.picDetail.picurl1 = window._CONFIG['domianURL'] + '/oafile/LoginPicture/readNotPicture?id='+ fileId +'&resourceType=image',
          axios.get(this.picDetail.picurl1, {
            responseType: 'arraybuffer',
            headers: {
              'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
            }
          }).then(res => {
            console.log(res.data.byteLength);
            if(this.picDetail.nowPic != 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')) && res.data.byteLength >= 10){
              this.picDetail.nowPic = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.picDetail.pic = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.visible = true;
            }else{
              // this.picDetail.pic = "";
              // this.$message.error("图片下载失败");

              this.picDetail.pic = this.picDetail.nowPic;
            }
          })
      },

      //显示当前未确认使用的图片
      show4(fileId) {
        // console.log("================")
        this.picDetail.picurl4 = window._CONFIG['domianURL'] + '/oafile/groPicture/readNotPicture?id='+ fileId +'&resourceType=image',
          axios.get(this.picDetail.picurl4, {
            responseType: 'arraybuffer',
            headers: {
              'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
            }
          }).then(res => {
            console.log(res.data.byteLength);
            if(this.picDetail.nowPic1 != 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')) && res.data.byteLength >= 10){
              this.picDetail.nowPic1 = 'data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.picDetail.pic1='data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
              this.visible = true;
            }else{
              // this.picDetail.pic1 = "";
              // this.$message.error("图片下载失败");

              this.picDetail.pic1 = this.picDetail.nowPic1;
            }
          })
      },

      changeSwitch(checked) {
        if (checked == 0){
          this.picDetail.upFileName = null;
          this.picDetail.pictrueText = "中国人民银行";
        }
        getAction(this.url.checkDefault,{id:this.picDetail.fileId,checked:checked}).then(res => {
          /*if (res.success){
            this.$message.success("设置成功")
          } else {
            this.$message.error("设置失败")
          }*/
        })
        getAction(this.url.checkDefault1,{id:this.picDetail.fileId1,checked:checked}).then(res => {
          // if (res.success){
          //   this.$message.success("设置成功")
          // } else {
          //   this.$message.error("设置失败")
          //
          // }
        })
        getAction(this.url.checkDefault2,{id:this.picDetail.fileId2,checked:checked}).then(res => {
          if (res.success){
            this.$message.success("设置成功")
          } else {
            this.$message.error("设置失败")

          }
        })
      },

      onChange1 (checked) {
        console.log("----------------")
        console.log(checked)
        if(checked){
          //自定义
          this.iisCalendar = true;
          this.changeSwitch(1);
          // this.show()
          // this.reload();
        }else{
          //默认
          this.iisCalendar = false;
          this.changeSwitch(0);
          // this.show()
          // this.reload();
        }}
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';

  .watchBox{
    margin-top: 1%;
    width: 100%;
    height: 177%;
    background: #f0f2f5 url(~@/assets/background.svg) no-repeat;
    background-size: 100%;
    position: absolute;
  }

  .watchPic {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;
  }

  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }

  .ant-input-disabled{
    color: #3a80ff !important;
  }

  .ant-btn-primary{
    background:linear-gradient(180deg,rgba(115,128,255,1),rgba(47,86,255,1)) repeat scroll 0% 0%;
  }

  /deep/.ant-btn-primary svg{
    fill: cyan;
  }
</style>