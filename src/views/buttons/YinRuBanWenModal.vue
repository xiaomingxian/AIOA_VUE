<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭">
    <template slot="footer">
      <a-button type="primary" @click.stop="close()">取消</a-button>
      <a-button type="primary" @click.stop="confrimUpLoad()" :disabled="isShowProgress == true">确定</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!--          <h3 style="display: inline-block;margin-left: 30px; font-weight: bolder">附件：</h3>-->
          <!--<a-textarea v-model="upFileName"></a-textarea>-->
          <!--          <a-upload style="margin-left: 15px;" name="file" :fileList="fileList" :remove="handleRemove"-->
          <!--                    :beforeUpload="beforeUpload"-->
          <!--                    :showUploadList="true" :multiple="true" :headers="headers">-->
          <!--            <a-button>-->
          <!--              <a-icon type="upload"/>-->
          <!--              点击上传-->
          <!--            </a-button>-->
          <!--          </a-upload>-->


          <div id="app">
            <h3 style="display: inline-block;margin-left: 30px; font-weight: bolder;float: left;">附件：</h3>
            <p class="input-zone">
              <a-button name="file" @change="upload" multiple="multiple">
                <a-icon type="upload"/>
                点击上传
              </a-button>
              <br/>
              <!--              <span v-if="filename">{{filename}}</span>-->
              <!--              <span v-else>+请选择文件上传+</span>-->
              <input type="file" name="file" value="" placeholder="请选择文件" @change="upload" multiple="multiple"/>
            </p>
            <div>
              <div style="line-height: 30.9999px;" v-for="(item,index) in fileList">
                <span
                  style="display: inline-block;max-width: 259px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;margin-left: 79px;line-height: 30.9999px;font-size: 17px">{{item.name}}</span>
                <img class="pices" @click.stop="handleRemove(item)" src="../../../src/assets/delete.png"/><br/>
              </div>
            </div>
            <p v-if="isShowProgress == true" style="float: left;margin: 17px 0 0 27px;">上传进度：</p>
            <div v-if="isShowProgress == true" class="progress-wrapper">
              <div class="progress-progress" :style="uploadStyle"></div>
              <div class="progress-rate">{{(uploadRate*100).toFixed(2)}}%</div>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction, postAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import {getAction} from '@/api/manage'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import Vue from 'vue'
  import InputElement from "ant-design-vue/es/auto-complete/InputElement";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import axios from 'axios'

  export default {
    name: "YinRuBanWenModal",
    components: {ATextarea, InputElement},
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        headers: {
          'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        },
        initSize: 0,
        maxSize:100*1024*1024,
        maxSizeName:"",
        fileSuffix: ['doc','docx','xls','xlsx','wps','jpg','png','pdf','pptx','ppt'],
        fileList: [],
        tableSelection: [],
        fileData: {
          sTable: "",
          iTableId: 0,
          sFileType: 0
        },
        uploadRate: 0,
        filename: '',
        uploadStyle: {
          width: '0%'
        },
        isShowProgress: false,
        clickTotal: 0,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          // ibusFunctionId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          upload: "/papertitle/oaTemplate/uploads",
          getDictValue: '/sys/dict/getDictByKeyObj',
        },

      }
    },
    created() {
    },
    methods: {
      show(data) {
        this.initData(data);
      },
      //初始化页面变量
      initData(data) {
        this.fileData.sTable = data.table;
        this.fileData.iTableId = data.i_id;
        this.fileData.sFileType = 4;
        this.getFileMaxTotal();
        this.getFileSuffix();
        this.visible = true;
      },
      //初始化--最大上传总量
      getFileMaxTotal() {
        getAction(this.url.getDictValue, {dictKey: 'uploadFile_maxSize'}).then(res => {
          if (res.success && res.result.length>0 && res.result[0].value !==undefined) {
            this.maxSize =this.countTotal(res.result[0].value);
            this.maxSizeName =res.result[0].description;
            console.log(this.maxSize)
          }
        })
      },
      //初始化--文件格式
      getFileSuffix() {
        getAction(this.url.getDictValue, {dictKey: 'uploadFile_suffix'}).then(res => {
          if (res.success && res.result.length>0 && res.result[0].value !==undefined) {
            this.fileSuffix = res.result[0].value.split(",");
          }
        })
      },
      //文件大小转换
      countTotal(size) {
        let total = 0;
        if (size.indexOf("M") !== -1) {
          total = parseInt(size.slice(0, size.indexOf("M"))) * 1024 * 1024
          // console.log(total)
        }
        if (size.indexOf("G") !== -1) {
          total = parseInt(size.slice(0, size.indexOf("G"))) * 1024 * 1024 * 1024
          // console.log(total)
        }
        return total;
      },
      beforeUpload: function (file, fileList) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
      },
      confrimUpLoad() {
        this.clickTotal++;
        if (this.clickTotal > 1) {
          this.$message.error("系统正在处理您的请求，请耐心等待...")
          return;
        }
        if (this.fileList.length > 0) {
          postAction('/oaBus/oaFile/addFiles', this.fileList).then(res => {
            if (res.success) {
              //修改业务数据是否有附件状态
              let param = {};
              param.table = this.fileData.sTable;
              param.i_id = this.fileData.iTableId;
              param.i_is_file = 1;
              if (param.table !== "oa_datadetailed_inst") {
                postAction('/oaBus/dynamic/updateData', param).then(res => {
                })
              }
              this.$emit('watchSub', true);
              this.close();
            }
          })
        } else {
          this.close();
        }
      },
      handleUpload() {
        this.clickTotal++;
        if (this.clickTotal > 1) {
          return;
        }
        const {fileList} = this;
        const data = new FormData();
        let url = this.url.upload;
        let method = 'post';
        fileList.forEach(file => {
          data.append('file', file);
        });
        // console.log(this, data, fileList)
        data.append("sTable", this.fileData.sTable)
        data.append("iTableId", this.fileData.iTableId)
        data.append("sFileType", this.fileData.sFileType)
        this.axios({url, method, data, processData: false}).then(res => {
          if (res.success) {
            let param = {};
            param.table = this.fileData.sTable;
            param.i_id = this.fileData.iTableId;
            param.i_is_file = 1;
            postAction('/oaBus/dynamic/updateData', param).then(res => {
            })
          }
          this.$emit('watchSub', true);
          this.close();
        })
      },
      upload: function (e) {
        console.log(e)
        var vm = this;
        var formData = new FormData();
        // formData.append("name", "Alax");
        var fileData = e.target.files;
        if (e.target.files.length == 0) {
          return;
        }
        vm.initSize = 0;
        for (var i = 0; i < e.target.files.length; i++) {
          vm.initSize += fileData[i].size;
          var name = fileData[i].name;
          var suffix = name.slice(name.indexOf(".")+1)
          //文件格式校验
          // if (this.fileSuffix.indexOf(suffix) == -1){
          //   vm.$message.error("文件上传暂不支持"+suffix+"格式！");
          //   return;
          // }
          if (fileData[i].size > vm.maxSize) {
            vm.$message.error(fileData[i].name + "已超出文件限制大小"+this.maxSizeName+"!");
            return;
          }
          if (vm.initSize > vm.maxSize) {
            vm.$message.error("上传列表大小已超出限制"+this.maxSizeName+"!");
            return;
          }
        }

        for (var i = 0; i < e.target.files.length; i++) {
          var file = e.target.files[i]; //取第1个文件
          formData.append("file", file);
          this.fileList.push(file)
          // vm.filename = file.name;
          // console.log(file);
        }
        // console.log(vm.fileList);
        this.isShowProgress = true;
        var config = {
          headers: {'Content-Type': 'multipart/form-data', 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
          onUploadProgress: function (e) {
            console.log("进度：");
            console.log(e);
            //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
            //如果lengthComputable为false，就获取不到e.total和e.loaded
            if (e.lengthComputable) {
              var rate = vm.uploadRate = e.loaded / e.total; //已上传的比例
              if (rate < 1) {
                //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                //等响应回来时，再将进度设为100%
                vm.uploadRate = rate;
                vm.uploadStyle.width = (rate * 100).toFixed(2) + '%';
              }
            }
          }
        };
        //window._CONFIG['domianURL'] +
        axios.post(window._CONFIG['domianURL'] + this.url.upload, formData, config)
          .then(function (data) {
            console.log(data);
            var json = data.data; //后台实际返回的结果
            if (json.success && json.result.length > 0) {
              vm.uploadRate = 1;
              vm.uploadStyle.width = '100.00%';
              vm.$message.success("上传成功！")
              vm.isShowProgress = false;
              for (let i in json.result) {
                for (let j in vm.fileList) {
                  //IE文件名称返回绝对路径处理
                  if (json.result[i].sfileName.lastIndexOf("\\") != -1){
                    json.result[i].sfileName = json.result[i].sfileName.slice(json.result[i].sfileName.lastIndexOf("\\")+1)
                  }
                  if (vm.fileList[j].name == json.result[i].sfileName) {
                    vm.fileList[j].sFilePath = json.result[i].sfilePath
                    vm.fileList[j].sFileName = json.result[i].sfileName
                    vm.fileList[j].sTable = vm.fileData.sTable
                    vm.fileList[j].iTableId = vm.fileData.iTableId
                    vm.fileList[j].sFileType = vm.fileData.sFileType
                  }
                }
              }
              // console.log(vm.fileList)
            } else {
              for (let i in formData){
                vm.handleRemove(formData[i]);
              }
              vm.uploadRate= 0;
              vm.uploadStyle.width = '0.00%';
              vm.isShowProgress= false;
              vm.$message.error("上传失败，请重新上传！")

            }
          })
          .catch(function (err) {
            console.log(err);
          });
      },

      close() {
        this.$emit('close');
        this.visible = false;
        this.fileList = [];
        this.clickTotal = 0;
        this.isShowProgress = false;
        this.uploadStyle.width = '0.00%';
      },
      handleCancel() {
        this.close()
      },
      handleOk() {
        this.close()
      },


    }
  }
</script>

<style scoped>
  .input-zone {
    width: 500px;
    color: blue;
    font-size: 14px;
    position: relative;
  }

  .input-zone input[type='file'] {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
  }

  .progress-wrapper {
    position: relative;
    height: 20px;
    border-radius: 5px;
    background-color: lightgrey;
    margin: 27px 0 0 99px;
  }

  .progress-wrapper .progress-progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0%;
    border-radius: 5px;
    background-color: darkturquoise;
    z-index: 1;
  }

  .progress-wrapper .progress-rate {
    position: relative;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    height: 100%;
    z-index: 2;
  }

  .pices {
    float: right;
    margin: 1.4% 27% 0% 0%;
    width: 23px;
    height: 23px;
  }
</style>