<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    @cancel="handleCancel">
    <template slot="footer">
      <a-button type="primary" @click.stop="close()">关闭</a-button>
    </template>
    <a-spin :spinning="confirmLoading" style="height: 400px; width:100%;overflow: auto">
      <a-form :form="form">

       <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主键id">
          <a-input-number v-decorator="[ 'iid', validatorRules.iId ]" />
        </a-form-item>-->
       <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="流程定义KEY">
          <a-input placeholder="请输入流程定义KEY" v-decorator="['procdefKey', {}]" />
        </a-form-item>-->
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="流程按钮配置名称（概要说明此套配置特点）">-->
          <!--<a-input placeholder="请输入流程按钮配置名称（概要说明此套配置特点）" v-decorator="['sbuttonSetName', {}]" />-->
        <!--</a-form-item>-->
        <!-- table区域-begin -->
        <div>

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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

          </a-table>
        </div>
        <!-- table区域-end -->

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage.js'

  export default {
    name: "OaProcButtonModal",
    mixins:[JeecgListMixin],
    data () {
      return {
        data:[],
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        iid: 1,
        buttonList:[],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        description: '发布类按钮描述管理页面',
        // 表头
        columns: [
          // {
          //   title: '主键id',
          //   align:"center",
          //   dataIndex: 'iid'
          // },
          // {
          //   title: '流程按钮关联ID',
          //   align:"center",
          //   dataIndex: 'iprocButtonId'
          // },
          {
            title: '顺序号',
            align: "center",
            dataIndex: 'iorder'
          },
          // {
          //   title: '顺序号',
          //   align: "center",
          //   dataIndex: 'iorder',
          //   customRender:(text,row,index)=>{
          //     // for (let i = 0; ; ) {
          //      return index+1;
          //     // }
          //   }
          // },
          {
            title: '按钮名称',
            align: "center",
            dataIndex: 'ibuttonId',
            customRender:(text,row,index)=>{
              for (let i = 0; i < this.buttonList.length ; i++) {
                // console.log("**********************************");
                // console.log(text);
                // console.log(this.buttonList[i].iid);
                if (text==this.buttonList[i].iid) {
                  return this.buttonList[i].sbtnName;
                }
              }
            }
          },
          {
            title: '控制',
            align: "center",
            dataIndex: 'ipermitType',
            customRender:(text,row,index)=>{
              if (text==1 || text=="1") {
                return "控制";
              }else if (text==0 || text=="0"){
                return "不控制";
              }else {
                return "---";
              }
            }
          },
          {
            title: '拟稿人',
            align: "center",
            dataIndex: 'iisCreater',
            customRender:(text,row,index)=>{
              if (text==1 || text=="1") {
                return "是";
              }else if (text==0 || text=="0"){
                return "否";
              }else {
                return "---";
              }
            }
          },
          {
            title: '读者',
            align: "center",
            dataIndex: 'iisReader',
            customRender:(text,row,index)=>{
              if (text==1 || text=="1") {
                return "是";
              }else if (text==0 || text=="0"){
                return "否";
              }else {
                return "---";
              }
            }
          }
        ],
        url: {
          list: "/oabuttonset/oaButtonSet/findById",
          // findById:"/oabuttonset/oaButtonSet/findById",
          delete: "/oabuttonset/oaButtonSet/delete",
          deleteBatch: "/oabuttonset/oaButtonSet/deleteBatch",
          exportXlsUrl: "oabuttonset/oaButtonSet/exportXls",
          importExcelUrl: "oabuttonset/oaButtonSet/importExcel",
          add: "/oaprocbutton/oaProcButton/add",
          edit: "/oaprocbutton/oaProcButton/edit",
          buttonList: "/oabutton/oaButton/buttonList"
        },

      }
    },
    created () {
    },
    methods: {

      add (record) {
        this.iid=record.iid;
        //按钮列表
        getAction(this.url.buttonList).then(res => {
          this.buttonList = res.result ;
        });
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','procdefKey','sbuttonSetName'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.close()
      },
      handleCancel () {
        this.close()
      },
      handleTableChange(page) {
        this.ipagination.current = page.current;
        this.ipagination.pageSize = page.pageSize;
        this.loadData();
      },
      loadData(){
        getAction(this.url.list,{id:this.iid,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then(res=>{
          this.data = res.result.records;
          this.ipagination.total = res.result.total;
        })
      }


    }
  }
</script>

<style lang="less" scoped>

</style>