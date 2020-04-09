<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    destroyOnClose="true"
    @ok="handleUpload"
    @cancel="handleCancel"
    cancelText="关闭">
    <div>
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">

          <!--<a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="主键id">
            <a-input-number v-decorator="[ 'iId', validatorRules.iId ]" />
          </a-form-item>-->
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="页面名称">
            <a-input placeholder="请输入页面名称" v-decorator="['spageName', validatorRules.spageName]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="详情页面路径">
            <a-input placeholder="请输入详情页面路径" v-decorator="['spagePath', validatorRules.spagePath]"/>
          </a-form-item>


          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="模板分类">
            <a-select placeholder="请选择模板分类" v-decorator="['ipapeType', {}]">
              <a-select-option v-for="(item,index) in dbtable" :key="index" :value="item.value">{{item.text}}
              </a-select-option>
            </a-select>
            <!--<a-input-number v-decorator="[ 'ipapeType', {}]"/>-->
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="管理视频文件">
            <a-radio-group :defaultValue="0"  v-decorator="['iisVideo', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!--
                      <a-input placeholder="请输入是否可以管理视频文件" v-decorator="['iisVideo', {}]" />
            -->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="主送、抄送、传阅">
            <a-radio-group  :defaultValue="0" v-decorator="['iisSend', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!--<a-input placeholder="请输入是否包含主送、抄送、传阅" v-decorator="['iisSend', {}]" />-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="抄报">
            <a-radio-group  :defaultValue="0" v-decorator="['iisCopy', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!-- <a-input placeholder="请输入是否包含抄报(1、0)" v-decorator="['iisCopy', {}]" />-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="VIP模板">
            <a-radio-group  :defaultValue="0" v-decorator="['iisVip', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!--<a-input placeholder="请输入是否是VIP模板(1、0)" v-decorator="['iisVip', {}]" />-->
          </a-form-item>

          <!--<a-form-item v-if="upFailId === 1"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol"
                       label="附件id">
            <a-input placeholder="请输入附件id" v-model="fileId" v-decorator="['ifileId', {}]"/>
          </a-form-item>-->
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="概要">
            <a-textarea v-decorator="['spageRemarks', {}]"></a-textarea>
            <!-- <a-input placeholder="请输入概要说明" v-decorator="['spageRemarks', {}]"/>-->
          </a-form-item>

          <!-- <a-form-item v-if="upFailId === 1"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        label="附件名称">
             <a-input type="hidden" placeholder="请输入附件id" v-model="fileId" v-decorator="['ifileId', {}]"/>
             <a-input v-model="upFileName"/>
           </a-form-item>-->

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="上传阅览图片">
            <a-upload name="file"
                      :fileList="fileList"
                      :beforeUpload="beforeUpload"
                      :showUploadList="false"
                      accept=".jpg,.png,.gif"
                      :multiple="false"
                      @preview="handlePreview"
                      :headers="headers" @change="handleChange">
              <a-button :disabled="uploading">
                <a-icon type="upload"/>
                点击上传
              </a-button>
            </a-upload>
          </a-form-item>

          <a-form-item
            v-show="upFailId === 1"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="图片名称">
            <a-input v-model="upFileName"/>
            <a-button type="primary" icon="plus" @click="deleteFileName">删除</a-button>
            <a-input v-show="false" v-model="fileId" v-decorator="['ifileId', {}]"/>
          </a-form-item>


          <!-- <a-form-item
             :labelCol="labelCol"
             :wrapperCol="wrapperCol"
             label="图片名称">
             <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel1">
               <img alt="example" style="width: 100%" :src="previewImage" />
             </a-modal>
           </a-form-item>-->


        </a-form>
      </a-spin>
    </div>
    <!--<div class="table-operator">
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importUrl"
                @change="dealUpFile">
        <a-button type="primary" icon="import">上传附件</a-button>
      </a-upload>
    </div>-->
  </a-modal>

</template>

<script>
  import {httpAction, getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import AFormItem from "ant-design-vue/es/form/FormItem";

  import moment from "moment"
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    name: "BusPageModal",
    components: {ATextarea, AFormItem},
    mixins: [JeecgListMixin],
    data() {

      return {
        fileId: '',
        upFailId: 0,
        upFileName: '',
        downFilePath: '',
        previewImage: '',
        title: "操作",
        uploading: false,
        previewVisible: false,
        visible: false,
        headers: {
          'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        },
        fileList: [],
        model: {},
        dbtable: [],
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
          spagePath: {rules: [{required: true, message: '请输入路径!'}]},
          spageName: {rules:[{required:true,message: '页面名称不能为空'},{ min: 0, max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }]},
        },
        url: {
          list: "/oaBus/busPagd/list",
          add: "/oaBus/busPage/add",
          edit: "/oaBus/busPage/edit",
          importExcelUrl: "/oaBus/busPage/upAttachmentFile",
          getDbtable: "/sys/dict/getDictItems/fun_temp_type",
          //upload: '/papertitle/oaTemplate/upload',
          upload: '/oaBus/busPage/upPic',
          getPicName: "/oaBus/busPage/getPicName",
        },
        importUrl: "/AIOA/oaBus/busPage/upAttachmentFile"
      }
    },
    created() {
      // this.add()
    },
    methods: {
      deleteFileName() {
        let that = this;
        that.upFailId = 0;
        that.upFileName = '';
        this.model.ifileId = "";
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'ifileId'))
        });
        this.uploading = false;
      },
      handlePreview(file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      handleCancel1() {
        this.previewImage = false;
      },
      add(dbtable) {
        this.dbtable = dbtable;

        this.edit({});
      },
      handleUpload() {
        const {fileList} = this;
        console.log("AAAA" + JSON.stringify(fileList))
        if (fileList.length == 0) {
          this.handleOk();
        } else {
          const data = new FormData();
          fileList.forEach(file => {
            data.append('file', file);
          });
          this.uploading = true;
          let url = this.url.upload;
          let method = 'post';
          httpAction(url, data, method).then((res) => {
            this.fileList = [];
            this.uploading = false;
            this.model.ifileId = res.result.iid;
            /*this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'ifileId'))
            });*/
            this.form.setFieldsValue({'ifileId': res.result.iid});
            this.handleOk();
          });
        }
      },
      edit(record) {
        getAction(this.url.getDbtable).then(res => {
          this.dbtable = res.result;
        });

        this.getFileName(record.ifileId);
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iid', 'spagePath', 'ifileId', 'spageName', 'ipapeType', 'spageRemarks', 'iisVideo', 'iisSend', 'iisCopy', 'iisVip', 'screateBy', 'supdateBy'))
          //时间格式化
          /*this.form.setFieldsValue({dCreateTime:this.model.dCreateTime?moment(this.model.dCreateTime):null})
          this.form.setFieldsValue({dUpdateTime:this.model.dUpdateTime?moment(this.model.dUpdateTime):null})*/
        });

      },
      handleChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if (info.file.response.success) {
            this.upFailId = 1;
            this.upFileName = info.file.name;
            this.model.ifileId = info.file.response.result.iid;
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'ifileId'))
            });
            this.$message.success(`${info.file.name} 文件上传成功`);
          } else {
            this.$message.error(`${info.file.name} ${info.file.response.message}.`);
          }
        } else if (info.file.status === 'error') {
          this.$message.error(`文件上传失败: ${info.file.msg} `);
        }
      },
      beforeUpload: function (file, fileList) {
        /*let ss = file.name.split(".")
        console.log(ss[ss.length-1]) ;*/

        this.upFailId = 1;
        this.upFileName = file.name;
        this.uploading = true;
        this.fileList = [...this.fileList, file];
        return false;
      },
      getFileName(fileId) {
        if (fileId == undefined || fileId == null) {
          return;
        }
        getAction(this.url.getPicName, {fileId: fileId}).then(res => {
          this.upFileName = res.result;
          this.upFailId = 1;
        })
      },
      close() {
        this.fileId = '';
        this.upFailId = 0;
        this.upFileName = '';
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
            if (!this.model.iid) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log(values)
            console.log(this.model)
            //时间格式化
            // formData.dCreateTime = formData.dCreateTime?formData.dCreateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.dUpdateTime = formData.dUpdateTime?formData.dUpdateTime.format('YYYY-MM-DD HH:mm:ss'):null;

            console.log("提交后" + formData);
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                //that.handleUpload();
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
      computed: {
        importExcelUrl: function () {
          console.error(" test ");
          return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
        }
      },


    }
  }
</script>

<style lang="less" scoped>

</style>