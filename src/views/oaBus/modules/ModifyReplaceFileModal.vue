<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="主键id">-->
          <!--<a-input-number v-decorator="[ 'iId', {} ]" />-->
        <!--</a-form-item>-->
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="附件所属数据所在表">-->
          <!--<a-input placeholder="请输入附件所属数据所在表" v-decorator="['stable', {}]" />-->
        <!--</a-form-item>-->
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="附件所属数据id">-->
          <!--<a-input placeholder="请输入附件所属数据id" v-decorator="['itableId', {}]" />-->
        <!--</a-form-item>-->


        <!-- 查询区域 -->


        <!-- 操作按钮区域 -->
        <!--<div class="table-operator" style="margin-bottom: 20px;" >-->
          <!--<a-button style="margin-left: 10px;" type="primary" icon="download" @click="handleExportXls('运维工具描述')">导出</a-button>-->
          <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"-->
                    <!--@change="handleImportExcel">-->
            <!--&lt;!&ndash;<a-button style="margin-left: 10px;"  type="primary" icon="import">导入</a-button>&ndash;&gt;-->
          <!--</a-upload>-->
          <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
            <!--<a-menu slot="overlay">-->
              <!--<a-menu-item key="1" @click="batchDel">-->
                <!--<a-icon type="delete"/>-->
                <!--删除-->
              <!--</a-menu-item>-->
            <!--</a-menu>-->
            <!--<a-button style="margin-left: 8px"> 批量操作-->
              <!--<a-icon type="down"/>-->
            <!--</a-button>-->
          <!--</a-dropdown>-->
        <!--</div>-->

        <!-- table区域-begin -->
        <div>
          <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
            <!--<i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{-->
            <!--selectedRowKeys.length }}</a>项-->
            <!--<a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
          <!--</div>-->

          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="data"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange">
            <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
       <span slot="action" slot-scope="text, record">
         <a-form-item
           style="margin-top: 20px"
           label="">
          <a-upload
            name="file"
            :multiple="false"
            :showUploadList="false"
            :accept="suffixName"
            :beforeUpload="beforeUpload"
            :headers="headers"
          >
            <!--:action="fileUpload"
             @change="handleChange"-->

            <a-button  @mousedown="getIid(record)"><a-icon type="upload" />替换文件</a-button>
          </a-upload>
        </a-form-item>

        </span>

          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <!--<oaButtonSet-modal ref="modalForm" @ok="modalFormOk"></oaButtonSet-modal>-->

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'


  export default {
    name: "ModifyReplaceFileModal",
    mixins: [JeecgListMixin],
    components: {},
    data() {
      return {
        title: "操作",
        visible: false,
        data: [],
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        upFileName:'',
        upFailId: 0,
        fileId:'',
        iid:0,
        suffixName:'',
        fileUpload: window._CONFIG['domianURL'] +"/modify/fields/upload/",
        // fileList: [],
        // headers: {
        //   'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        // },
        stable:'',//关联表名
        itableId:'',//关联表Id
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          iId: {rules: [{required: true, message: '请输入主键id!'}]},
        },
        description: '运维工具替换文件页面',
        // 表头
        columns: [
          /*{
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },*/
//          {
//            title: '主键id',
//            align: "center",
//            dataIndex: 'iid'
//          },
//          {
//            title: '附件所属数据所在表',
//            align: "center",
//            dataIndex: 'stable'
//          },
//          {
//            title: '附件所属数据id',
//            align: "center",
//            dataIndex: 'itableId'
//          },
//          {
//            title: '附件类型',  //（1 底稿 2 正文 3办文单4 附件 5背景材料 6办文依据）
//            align: "center",
//            dataIndex: 'sfileType'
//          },
//          {
//            title: '序号',
//            align: "center",
//            width: 60,
//            dataIndex: 'iorder'
//          },
          {
            title: '附件名',
            align: "center",
            dataIndex: 'sfileName'
          },
          {
            title: '附件存储路径',
            align: "center",
            dataIndex: 'sfilePath'
          },
          /* {
                title: '创建者',
                align:"center",
                dataIndex: 'screateBy'
               },
               {
                title: '创建时间',
                align:"center",
                dataIndex: 'dCreateTime'
               },
               {
                title: '修改者',
                align:"center",
                dataIndex: 'supdateBy'
               },
               {
                title: '修改时间',
                align:"center",
                dataIndex: 'dupdateTime'
               },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          upload:"modify/fields/upload",
          list: "/oaBus/oaFile/list",
          delete: "/oaBus/oaFile/delete",
          deleteBatch: "/oaBus/oaFile/deleteBatch",
          exportXlsUrl: "oaBus/oaFile/exportXls",
          importExcelUrl: "oaBus/oaFile/importExcel",
        },
      }
    },
    created() {
      this.loadData(this.stable,this.itableId);
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getIid(res){
        this.iid=res.iid;
//        console.log(this.iid);

//          console.log('+++++++++++++++++++++++++');
        let url="modify/fields/getFileSuffixName";
        getAction(url, {iid:this.iid }).then(res => {
//          console.log('mmmmmmmmmmmmmmmmmmmmm');
//          console.log(res.result);
          this.suffixName ="";
          this.suffixName = res.result;
        })

      },
      handleTableChange(page) {
        this.ipagination.current = page.current;
        this.ipagination.pageSize = page.pageSize;
        this.loadData();
      },
      loadData(stable,itableId) {
//        console.log(stable);
//        console.log(itableId);
        getAction(this.url.list, {sTable: this.stable,iTableId:this.itableId,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then(res => {
//          console.log('vvvvvvvvvvvvvvvvvvvvvvvvv');
//          console.log(res.result.records);
          this.data = res.result.records;
          this.ipagination.total = res.result.total;
        })
      },
      add() {
        this.edit({});
      },
      edit(record,tableName) {
        this.stable=tableName;//关联表名
        this.itableId=record.i_id;//关联表Id
        this.loadData(this.stable,this.itableId);
        // this.form.resetFields();
        // this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iid', 'stable', 'itableId'))
          //时间格式化
        });

      },
      beforeUpload(file){
        const formData=new FormData();
        formData.append("iid",this.iid);
        formData.append("file",file);
//        console.log('))))))))))))))))))');

        httpAction(this.fileUpload, formData, "post").then((res) => {
//          console.log('((((((((((((((((((((((');
//          console.log(res);
          if (res.success) {
            this.$message.success('替换（'+res.message+'）成功');
            this.$emit('ok');
          } else {
            this.$message.warning(res.message);
          }
        })

        return true;
      },
      handleChange(info) {
        // this.iid=res.iid;
        console.log("--文件列表改变--")
        console.log(info);
        let fileList = info.fileList
        if(info.file.status==='done'){
          if(info.file.response.success){
            fileList = fileList.map((file) => {
              if (file.response) {
                file.url = this.urlDownload+file.response.message;
              }
              return file;
            });
          }
          this.$message.success(`${info.file.name} 上传成功!`);
        }else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败.`);
        }else if(info.file.status === 'removed'){
          this.handleDelete(info.file)
        }
        this.fileList = fileList
        if(info.file.status==='done' || info.file.status === 'removed'){
          this.handlePathChange()
        }
      },


      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;

        // 触发表单验证
        // this.form.validateFields((err, values) => {
        //   if (!err) {
        //     that.confirmLoading = true;
        //     let httpurl = '';
        //     let method = '';
        //     if (!this.model.iid) {
        //       httpurl += this.url.add;
        //       method = 'post';
        //     } else {
        //       httpurl += this.url.edit;
        //       method = 'put';
        //     }
            // let formData = Object.assign(this.model, values);
            //时间格式化
            // httpAction(httpurl, formData, method).then((res) => {
            //   if (res.success) {
            //     that.$message.success(res.message);
            //     that.$emit('ok');
            //   } else {
            //     that.$message.warning(res.message);
            //   }
            // }).finally(() => {
            //   that.confirmLoading = false;
              that.close();
            // })
          // }
        // })
      },
      handleCancel() {
        this.close()
      }

    }

  }
</script>

<style lang="less" scoped>

</style>