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
          <!--label="流程按钮配置名称（概要说明此套配置特点）">-->
          <!--<a-input placeholder="请输入流程按钮配置名称（概要说明此套配置特点）" v-decorator="['sbuttonSetName', {}]"/>-->
        <!--</a-form-item>-->

        <!-- 查询区域 -->
        <!--  <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="24">

                <a-col :md="6" :sm="8">
                  <a-form-item label="主键id">
                    <a-input placeholder="请输入主键id" v-model="queryParam.iId"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="8">
                  <a-form-item label="流程定义KEY（按钮配置和流程紧耦合，但可以多套按钮配置方案供用户选择）">
                    <a-input placeholder="请输入流程定义KEY（按钮配置和流程紧耦合，但可以多套按钮配置方案供用户选择）" v-model="queryParam.procDefKey"></a-input>
                  </a-form-item>
                </a-col>
                <template v-if="toggleSearchStatus">
                  <a-col :md="6" :sm="8">
                    <a-form-item label="任务环节（按钮权限和任务环节绑定）">
                      <a-input placeholder="请输入任务环节（按钮权限和任务环节绑定）" v-model="queryParam.taskDefKey"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="6" :sm="8">
                    <a-form-item label="流程按钮关联ID">
                      <a-input placeholder="请输入流程按钮关联ID" v-model="queryParam.iProcButtonId"></a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :md="6" :sm="8">
                    <a-form-item label="按钮ID（oa_button表）">
                      <a-input placeholder="请输入按钮ID（oa_button表）" v-model="queryParam.iButtonId"></a-input>
                    </a-form-item>
                  </a-col>
                </template>
                <a-col :md="6" :sm="8" >
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                <a @click="handleToggleSearch" style="margin-left: 8px">
                  {{ toggleSearchStatus ? '收起' : '展开' }}
                  <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
                </a>
              </span>
                </a-col>

              </a-row>
            </a-form>
          </div>-->

        <!-- 操作按钮区域 -->
        <div class="table-operator" style="margin-bottom: 20px;" >
          <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
          <!--<a-button style="margin-left: 10px;" type="primary" icon="download" @click="handleExportXls('发布类按钮描述')">导出</a-button>-->
          <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"-->
                    <!--@change="handleImportExcel">-->
            <!--<a-button style="margin-left: 10px;"  type="primary" icon="import">导入</a-button>-->
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
            :dataSource="data"
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
        <oaButtonSet-modal ref="modalForm" @ok="modalFormOk"></oaButtonSet-modal>
        <oa-button-set-cat-model ref="setCatModalForm" @ok="modalFormOk"></oa-button-set-cat-model>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import OaButtonSetModal from './OaButtonSetModal'
  import OaButtonSetCatModel from './OaButtonSetCatModal'
  import {httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'


  export default {
    name: "OaProcButtonModal",
    mixins: [JeecgListMixin],
    components: {
      OaButtonSetModal,
      OaButtonSetCatModel
    },
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
          //   title: '序号',
          //   align: "center",
          //   dataIndex: 'iid'
          // },
          // {
          //   title: '流程按钮关联ID',
          //   align: "center",
          //   dataIndex: 'iprocButtonId'
          // },
          {
            title: '按钮名称',
            align: "center",
            dataIndex: 'ibuttonId'
          },
          {
            title: '序号',
            align: "center",
            dataIndex: 'iorder'
          },
          {
            title: '不控制',
            align: "center",
            dataIndex: 'ipermitType'
          },
          {
            title: '拟稿人',
            align: "center",
            dataIndex: 'iisCreater'
          },
          {
            title: '读者',
            align: "center",
            dataIndex: 'iisReader'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/oabuttonset/oaButtonSet/findById",
          delete: "/oabuttonset/oaButtonSet/delete",
          deleteBatch: "/oabuttonset/oaButtonSet/deleteBatch",
          exportXlsUrl: "oabuttonset/oaButtonSet/exportXls",
          importExcelUrl: "oabuttonset/oaButtonSet/importExcel",
          add: "/oaprocbutton/oaProcButton/add",
          edit: "/oaprocbutton/oaProcButton/edit",
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
      handleEditOaProc(record){

        this.$refs.modalForm.edit(record,this.TaskLinkId);
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
      },
      handleAdd:function () {
        console.log('--------------------------------');
        this.$refs.modalForm.add(this.TaskLinkId,this.data.iprocButtonId);
        this.$refs.modalForm.title = "新增";
        this.$refs.modalForm.disableSubmit = false;
      },
      handleCat: function (record) {
        this.$refs.setCatModalForm.add(record,this.TaskLinkId);
        this.$refs.setCatModalForm.title = "查看";
        this.$refs.setCatModalForm.disableSubmit = false;

      },
      loadData(iid) {
        getAction(this.url.list, {id: iid}).then(res => {
          // console.log('999999999999999999999999999');
          // console.log(res.result.records);
          this.data = res.result.records;
        })
      },
      add() {
        this.edit({});
      },
      edit(record,TaskLinkId) {

        this.TaskLinkId=TaskLinkId;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iid', 'procdefKey', 'sbuttonSetName'))
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