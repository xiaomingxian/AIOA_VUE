<template>
  <div>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <div style="height: auto; background: #fff;  padding: 27px">
          <div style="width: 100%; height: 80px; background: #fff; margin: 0 auto;  display: flex;align-items: center;justify-content: flex-start">
            <span style="margin-left: 30px">默认使用背景图 :&nbsp&nbsp</span>
            <a-switch @change="onChange1" checked-children="自定义" v-model="iisCalendar"   un-checked-children="默认"></a-switch>
            <span style="color: #d60303;margin-left: 50px;">只允许上传png、jpg、bmp格式的图片</span>
          </div>
          <div style="display: flex">
            <div style="display: flex;align-items: center;justify-content: flex-start;margin-left: 30px;">
              <span>请上传图片：</span>
              <a-upload
                name="file"
                :multiple="false"
                :showUploadList="false"
                :beforeUpload="beforeUpload"
                :headers="headers"
              >
                <a-button style="border-color: #8cc8ff">
                  <a-icon type="upload" />
                  点击上传背景图片
                </a-button>
              </a-upload>
            </div>
            <div style="width: 30%; height: 80px; background: #fff;display: flex;align-items: center;justify-content: flex-start">
              <span style="width:27%;margin-left: 20px;">图片名称：</span>
              <a-input style="margin-left: -20px;border: transparent;" v-model="picDetail.upFileName" disabled/>
            </div>
          </div>

          <div style="display: flex;">
            <div style="width: 30%; height: 80px; background: #fff;display: flex;align-items: center;justify-content: flex-start">
              <a-button size="middle" icon="check-circle" style="margin-left: 30px;" @click="confirmPic"  type="primary">确认替换</a-button>
            </div>
          </div>
        </div>

        <div class="watchPic">
          <img v-if="picDetail.pic" :src="picDetail.pic" style="width: 102%;height: 20%;background-color: #055bc4;position: absolute;bottom: 121%;left: -1%;z-index: 9999;"/>
          <img v-else src="~@/assets/titlebg@2x.png" style="width: 102%;height: 20%;background-color: #055bc4;position: absolute;bottom: 121%;left: -1%;z-index: 9999;"/>
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
    name: "backGroundPictrue",
    components: {ATextarea},
    // inject:['reload'],
    data() {
      return {
        picDetail:{
          fileId: '',
          upFileName: '',
          pic: '',
          fileType: 'bmp、jpg、png',
          picurll:'',
          picurl:'',
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
        fileUpload: window._CONFIG['domianURL'] +"/oafile/groPicture/upload",
        checkDefault:'/oafile/groPicture/checkDefault',
        updatePic:'/oafile/groPicture/updatePicture',
        getLoginText: '/oafile/groPicture/loginPictrue',
      },
    }
  },
  created() {
    this.show();
  },
  methods: {
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
          this.$message.warn("请上传正确格式的图片");
          return
        }
        httpAction(this.url.fileUpload, formData, "post").then((res) => {
          if (res.success) {
            this.picDetail.upFileName = res.result.sfileName
            this.picDetail.fileId = res.result.iid;
            this.picDetail.pictrueText = res.result.stable;
            this.show1(res.result.iid);
            this.$message.success("上传成功");
            this.$emit('ok');
          } else {
            this.$message.error("上传失败");
          }
        })
        return true;
      },

      //确认替换
      confirmPic(){
        console.log(this.picDetail.fileId )
        console.log(this.picDetail.pictrueText )
        getAction(this.url.updatePic,{id:this.picDetail.fileId}).then(res => {
          if (res.success){
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
      },

      getText(){
        postAction(this.url.getLoginText).then(res => {
          if (res.success){
            console.log(res)
            if (res.result == null){
              this.picDetail.pictrueText = "";
              this.picDetail.upFileName = "";
              this.iisCalendar = false;
            } else {
              this.iisCalendar = true;
              this.picDetail.upFileName = res.result.sfileName;
              this.picDetail.pictrueText = res.result.stable;
              this.picDetail.fileId = res.result.iid;
            }
          }
        })
      },

      //显示当前已确认使用的图片
    show() {
      this.getText();
      // console.log("*************")
      this.picDetail.picurl = window._CONFIG['domianURL'] + '/oafile/groPicture/readPicture?resourceType=image',
        axios.get(this.picDetail.picurl, {
          responseType: 'arraybuffer',
          headers: {
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
          }
        }).then(res => {
          // console.log("888888888888888888888888888888888")
          // console.log(res)
          // console.log(res.data.byteLength)
          if(res.data.byteLength >= 10){
            this.picDetail.pic='data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            this.visible = true;
          }else{
            this.picDetail.pic = ""
          }
        })
    },

    //显示当前未确认使用的图片
    show1(fileId) {
      // console.log("================")
      this.picDetail.picurll = window._CONFIG['domianURL'] + '/oafile/groPicture/readNotPicture?id='+ fileId +'&resourceType=image',
      axios.get(this.picDetail.picurll, {
        responseType: 'arraybuffer',
        headers: {
          'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
      }).then(res => {
        console.log(res.data.byteLength);
        if(res.data.byteLength >= 10){
          this.picDetail.pic='data:image/png;base64,' + btoa( new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          this.visible = true;
        }else{
          this.picDetail.pic = ""
          this.$message.error("图片下载失败")
        }
      })
    },


    changeSwitch(checked) {
      //当checked为0时，使用默认值
      if (checked == 0){
        this.picDetail.upFileName = null;
        this.picDetail.pictrueText = "中国人民银行";
      }
      getAction(this.url.checkDefault,{id:this.picDetail.fileId,checked:checked}).then(res => {
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
  /*@import '~@assets/less/common.less'*/
  /*.watchPic {*/
    /*width: 100%;*/
    /*min-height: 100%;*/
    /*background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;*/
    /*background-size: 100%;*/
    /*!*padding: 110px 0 144px;*!*/
    /*!*position: relative;*!*/
    /*margin-top: 100px;*/
  /*}*/

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