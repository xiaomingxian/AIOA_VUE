<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <!--<a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主键id">
          <a-input-number v-decorator="[ 'iId', validatorRules.iid ]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流程定义KEY">
          <a-input placeholder="请输入流程定义KEY" v-decorator="['procdefKey', {}]" />
        </a-form-item>-->
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="意见框名称">-->
          <!--<a-input placeholder="请输入意见框名称（概要说明此套配置特点）" v-decorator="['iTaskOpinionName', {}]"/>-->
        <!--</a-form-item>-->

        <!-- 查询区域 -->
        <!--  <div class="table-page-search-wrapper">
            <a-form layout="inline">

            </a-form>
          </div>-->

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!--<a-button type="primary" icon="download" @click="handleExportXls('发布类按钮描述')">导出</a-button>-->
          <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"-->
                    <!--@change="handleImportExcel">-->
            <!--<a-button type="primary" icon="import">导入</a-button>-->
          <!--</a-upload>-->
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="batchDel">
                <a-icon type="delete"/>
                删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> 批量操作
              <a-icon type="down"/>
            </a-button>
          </a-dropdown>
        </div>

        <!-- table区域-begin -->
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
            selectedRowKeys.length }}</a>项
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div>

          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="OpinionData"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange">

       <span slot="action" slot-scope="text, record">
          <a @click="handleCat(record)">查看</a>
          <a-divider type="vertical"/>
          <a @click="handleEditOaProc(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
            <a>删除</a>
           </a-popconfirm>
        </span>

          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <oaOpinionSet-modal ref="modalForm" @ok="modalFormOk"></oaOpinionSet-modal>
        <oa-opinion-set-cat-model ref="setCatModalForm" @ok="modalFormOk"></oa-opinion-set-cat-model>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import OaOpinionSetModal from './OaOpinionSetModal'
  import OaOpinionSetCatModel from './OaOpinionSetCatModal'
  import {httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'


  export default {
    name: "OaProcOpinionModal",
    mixins: [JeecgListMixin],
    components: {
      OaOpinionSetModal,
      OaOpinionSetCatModel
    },
    data() {
      return {
        title: "操作",
        visible: false,
        OpinionData: [],
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        TaskLinkId:'',//流程定义Id
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          iId: {rules: [{required: true, message: '请输入主键id!'}]},
        },
        description: '发布类按钮描述管理页面',
        // 表头
        columns: [
          // {
          //   title: '主键id',
          //   align: "center",
          //   dataIndex: 'iid'
          // },
          // {
          //   title: '流程按钮关联ID',
          //   align: "center",
          //   dataIndex: 'iprocOpinionId'
          // },
          {
            title: '意见配置描述',
            align: "center",
            dataIndex: 'iprocSetId'
          },
          {
            title: '任务环节名称',
            align: "center",
            dataIndex: 'taskDefKey'
          },
          {
            title: '意见框名称',
            align: "center",
            dataIndex: 'itaskOpinionName'
          },
          {
            title: '意见框位置',
            align: "center",
            dataIndex: 'itaskOpinionOrder'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/oaopinionset/oaOpinionSet/list",
          delete: "/oaopinionset/oaOpinionSet/delete",
          deleteBatch: "/oaopinionset/oaOpinionSet/deleteBatch",
          exportXlsUrl: "oaopinionset/oaOpinionSet/exportXls",
          importExcelUrl: "oaopinionset/oaOpinionSet/importExcel",
          add: "/oaprocopinion/oaProcOpinion/add",
          edit: "/oaprocopinion/oaProcOpinion/edit",
        }
      }
    },
    created() {

    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleAdd(){
        this.$refs.modalForm.add(this.TaskLinkId,this.OpinionData.iprocOpinionId);
        this.$refs.modalForm.title = "添加";
        this.$refs.modalForm.disableSubmit = false;
      },
      handleEditOaProc(record){

        this.$refs.modalForm.edit(record,this.TaskLinkId);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
      },
      handleCat: function (record) {
        this.$refs.setCatModalForm.add(record,this.TaskLinkId);
        this.$refs.setCatModalForm.title = "查看";
        this.$refs.setCatModalForm.disableSubmit = false;

      },
      loadData(iid) {//请求表格数据
        getAction(this.url.list, {iProcOpinionId: iid}).then(res => {
          this.OpinionData = res.result.records;
        })
      },
      add() {
        this.edit({});
      },
      editlvjian(record,TaskLinkId) {
        //record---为上一页面数据，TaskLinkId---流程定义Key
        console.log('------------------888888888'+TaskLinkId);
        this.TaskLinkId=TaskLinkId;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        console.log(this.model);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iid', 'procdefKey','iProcOpinionId',
            'itaskOpinionName', 'iTaskOpinionOrder'))
          //时间格式化
        });

      },
      close() {
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
            //时间格式化
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
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
      }

    }

  }
</script>

<style lang="less" scoped>

</style>