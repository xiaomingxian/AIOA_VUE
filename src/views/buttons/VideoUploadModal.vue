<template>
  <a-modal
    :modal-append-to-body="false"
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭">
    <template slot="footer">
      <a-button type="primary" @click.stop="close()">取消</a-button>
      <a-button type="primary" @click.stop="confrimUpLoad()" :disabled="isUploadBtn == true">确定</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <uploader v-if="isShowList" ref="uploader" :options="options" class="uploader-example"
                    :file-status-text="statusText"
                    autoStart @file-added="getfiles" @file-removed="fileRemoved" @upload-start="uploadStart"
                    @file-complete="fileComplete" @complete="complete">
            <uploader-unsupport></uploader-unsupport>
            <!--            <uploader-drop style="height: 50px">-->
            <!--              <p>Drop files here to upload or</p>-->
            <h3 style="display: inline-block;margin-left: 30px;font-size: 16px;font-weight: bolder;float: left;">
              视频：</h3>
            <uploader-btn>
              <a-icon type="upload"/>
              选择文件
            </uploader-btn>
            <!--              <uploader-btn :attrs="attrs">选择图片</uploader-btn>-->
            <!--              <uploader-btn :directory="true">选择文件夹</uploader-btn>-->
            <div></div>
            <!--            </uploader-drop>-->
            <!--            <slot :file-list="fileList">-->
            <!--            </slot>-->
            <uploader-list>
            </uploader-list>
          </uploader>
          <!--          <a-button @click="videoPlay">播放视频</a-button>-->
        </a-form-item>
      </a-form>
    </a-spin>
    <video-play-modal ref="videoPlayModal"></video-play-modal>
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
  import Uploader from "vue-simple-uploader/src/components/uploader";
  import qs from 'qs'
  import VideoPlayModal from "./VideoPlayModal";

  export default {
    name: "VideoUploadModal",
    components: {VideoPlayModal, Uploader, ATextarea, InputElement},
    // computed: {
    //   fileList() {
    //     console.log(this.uploader.fileList)
    //     return this.uploader.fileList
    //   }
    // },
    data() {
      return {
        title: "操作",
        isShowList: false,
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
        clickTotal: 0,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          // ibusFunctionId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {},
        address: '',
        fileList: [],
        isUploadBtn:false,
        fileData: {
          sTable: "",
          iTableId: 0,
          sFileType: 0
        },
        options: {
          target: window._CONFIG['domianURL'] + '/oaBus/oaFile/chunk',
          headers: {
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
          },
          testChunks: false,
          simultaneousUploads: 3,
          chunkSize: 10 * 1024 * 1024
        },
        attrs: {
          accept: 'image/*'
        },
        statusText: {
          success: '上传成功',
          error: '上传失败',
          uploading: '上传中',
          paused: '暂停上传',
          waiting: '等待中'
        }
      }
    },
    created() {
    },
    mounted() {

    },
    methods: {
      //初始化数据
      show(data) {
        this.fileData.sTable = data.table;
        this.fileData.iTableId = data.i_id;
        this.fileData.sFileType = 8;
        this.isShowList = true;
        this.visible = true;
      },
      // //视频播放初始化
      // videoPlay() {
      //   this.$refs.videoPlayModal.show(this.address);
      //   this.$refs.videoPlayModal.title = "播放视频";
      //   this.$refs.videoPlayModal.disableSubmit = false;
      // },
      //新增上传文件
      getfiles(e) {
        const videoSuffex = ['mp4', 'mkv'];
        var fileName = e.name;
        var fileSuffex = fileName.slice(fileName.lastIndexOf(".")+1)
        if (videoSuffex.indexOf(fileSuffex) === -1){
          this.$message.error("暂不支持该格式，请上传MP4、MKV格式！")
          e.ignored = true;
          return;
        }else {
          if (this.fileList.length > 0 ){
            for (let i in this.fileList){
              if (e.name == this.fileList[i].name){
                this.$message.error(e.name+"文件列表已存在！")
                e.ignored = true;
                return;
              }
            } 
          }   
          e.uniqueIdentifier = Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
          // console.log(e)
          this.fileList.push(e)
          console.log(this.fileList)
        }
      },
      //删除文件
      fileRemoved(e) {
        // console.log(e)
        // this.e.cancel()
        const index = this.fileList.indexOf(e);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
        // console.log(this.fileList)
      },
      //是否自动上传
      uploadStart(e) {
        this.isUploadBtn = true;
        // console.log(e)
      },
      // 上传完成
      complete() {
        console.log('complete', arguments);
        setTimeout(()=>{
          this.isUploadBtn = false
        },800)
      },
      // 一个根文件（文件夹）成功上传完成。
      fileComplete() {
        console.log('file complete', arguments)
        var vm = this;
        const file = arguments[0].file;
        var config = {
          headers: {
            'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
          },
        }
        axios.post(window._CONFIG['domianURL'] + '/oaBus/oaFile/mergeFile', qs.stringify({
          filename: file.name,
          identifier: arguments[0].uniqueIdentifier,
          totalSize: file.size,
          type: file.fileType
        }), config).then(function (response) {
          // console.log(response)
          // var path = response.data.result.sfilePath;
          // vm.address = path.slice(path.indexOf("videos\\") + 7);
          for (let j in vm.fileList) {
            if (vm.fileList[j].name == response.data.resul.t.sfileName) {
              vm.fileList[j].sFilePath = response.data.result.sfilePath
              vm.fileList[j].sFileName = response.data.result.sfileName
              vm.fileList[j].sTable = vm.fileData.sTable
              vm.fileList[j].iTableId = vm.fileData.iTableId
              vm.fileList[j].sFileType = vm.fileData.sFileType
              console.log(vm.fileList);
            }
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      confrimUpLoad() {
        if (this.fileList.length == 0) {
          this.$message.error("请选择上传文件！")
          return;
        }
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
              postAction('/oaBus/dynamic/updateData', param).then(res => {
              })
              this.close();
              this.$emit('watchSub', true);
            } else {
              this.$message.error("视频上传失败，请重新上传！")
              this.clickTotal = 0;
            }
          })
        } else {
          this.close();
        }
      },
      close() {
        this.$emit('close');
        this.visible = false;
        // console.log(this.fileList)
        this.isShowList = false;
        this.fileList = [];
        this.clickTotal = 0;
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
  .uploader-example {
    width: 700px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    padding-top: 0.1%;
    /*box-shadow: 0 0 10px
    gba(0, 0, 0, .4);*/
  }

  .uploader-example .uploader-btn {
    margin-right: 8px;
  }

  .uploader-example .uploader-list {
    max-height: 240px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }

  /deep/ .uploader-file[status=success] .uploader-file-actions .uploader-file-remove {
    display: block;
  }

  /deep/ .ant-form-item-control {
    bottom: 27px;
    right: 27px;
  }

  /deep/ .ant-form label {
    font-size: 15px;
    padding: 5px 14px;
  }

  .ant-form-item label > .anticon {
    vertical-align: inherit;
    padding-right: 7px;
  }
</style>
