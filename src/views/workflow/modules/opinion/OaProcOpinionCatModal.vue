<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading" style="height: 360px;overflow: auto">
      <a-form :form="form">
        <a-button  type="primary"  icon="plus" style="margin-bottom: 5px"  @click="handleEdit1()">新建</a-button>
        <a-divider type="vertical"/>
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
            :dataSource="opinionCatData"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange">
            <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
        <span slot="action" slot-scope="text, record">
          <!--<a @click="handleCat(record)">查看</a>-->
          <a @click="handleEditDone(record)">编辑</a>

          <a-divider type="vertical" />
          <!--<a-dropdown>-->
            <!--<a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
            <!--<a-menu slot="overlay">-->
              <!--<a-menu-item>-->
                <!--<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">-->
                  <!--<a>删除</a>-->
                <!--</a-popconfirm>-->
          <a @click="beforeConfirm(record.iid)">删除</a>
              <!--</a-menu-item>-->
            <!--</a-menu>-->
          <!--</a-dropdown>-->
        </span>

          </a-table>
        </div>
        <!-- table区域-end -->
        <oa-opinion-set-cat-model ref="setCatModalForm" @ok="modalFormOk"></oa-opinion-set-cat-model>
        <oa-proc-opinion-new-modal ref="OaProcOpinionNewModal" @ok="modalFormOk"></oa-proc-opinion-new-modal>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import OaProcOpinionNewModal from './OaProcOpinionNewModal'
  import OaOpinionSetCatModel from './OaOpinionSetCatModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "OaProcOpinionModal",
    mixins:[JeecgListMixin],
    components: {
      OaProcOpinionNewModal,
      OaOpinionSetCatModel
    },
    data () {
      return {
        opinionCatData:[],
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
        TaskLinkId:'',
        TaskLink:[],
        iProcOpinionId:'',
        procDefKey:'',
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
          //   align: "center",
          //   dataIndex: 'iid'
          // },
          // {
          //   title: '流程按钮关联ID',
          //   align: "center",
          //   dataIndex: 'iprocOpinionId'
          // },
          // {
          //   title: '意见配置描述',
          //   align: "center",
          //   dataIndex: 'iprocSetId'
          // },
          {
            title: '任务环节名称',
            align: "center",
            dataIndex: 'taskDefKey',
            customRender:(text,row,index)=>{
//              console.log(this.TaskLink);
//              console.log("**********************************");
              for (let i = 0; i < this.TaskLink.length ; i++) {
                if (text==this.TaskLink[i].id) {
//                  console.log("111111111");
                  return this.TaskLink[i].name;
                }
              }
            }
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
          findOpinionCatById:"/oaopinionset/oaOpinionSet/list",
          delete: "/oaopinionset/oaOpinionSet/delete",
          deleteBatch: "/oaopinionset/oaOpinionSet/deleteBatch",
          exportXlsUrl: "oaopinionset/oaOpinionSet/exportXls",
          importExcelUrl: "oaopinionset/oaOpinionSet/importExcel",
          add: "/oaprocopinion/oaProcOpinion/add",
          edit: "/oaprocopinion/oaProcOpinion/edit",
          TaskLink:"/wf/process/actsList"
        },

      }
    },
    created () {
    },
    methods: {
      //点击删除按钮 前校验
      beforeConfirm(iid){
        // console.log(this.btnSetModel)
        if (iid==null){
          this.$message.warning("当前信息不存在");
        }else {
          let url='oaopinionset/oaOpinionSet/verButtonSetDelete';
          getAction(url,{id:iid}).then(res=>{
            if (res.success){
              // this.$message.success(res.message);
              //调用弹框
              this.showConfirm(iid);
            } else {
              this.handleDelete(iid);
            }
          });
        }
      },
      //弹框
      showConfirm(iid){
        let that=this;
        this.$confirm({
          title:'您的某些业务已经使用了这套意见!!!',
          content:'删除将影响业务办理,你确定还要删除吗?',
          onOk(){
            that.handleDelete(iid);
          },
          onCancel(){
          }
        })
      },
      add (record,TaskLinkId) {

//        console.log("55555555555555555555");
//        console.log(record);
        this.TaskLinkId=TaskLinkId;
//        console.log(TaskLinkId);
        //---------------任务环节列表---------------
        getAction(this.url.TaskLink,{processDefinitionId:TaskLinkId}).then(res=>{
//          console.log(res);
          this.TaskLink = res.result;
        });
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        let that=this;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'iid','procdefKey','sbuttonSetName'))
		  //时间格式化
        });
        that.loadData();
      },
      handleEdit1:function () {
        this.$refs.OaProcOpinionNewModal.editlvjian(this.model,this.TaskLinkId);
        // this.$refs.OaProcOpinionNewModal.loadData(record.iid)
        this.$refs.OaProcOpinionNewModal.title = "新建";
        this.$refs.OaProcOpinionNewModal.disableSubmit = false;
      },

      handleEditDone:function (record) {
        this.$refs.OaProcOpinionNewModal.editBeforelvjian(this.model,this.TaskLinkId,record);
        this.$refs.OaProcOpinionNewModal.title = "编辑";
        this.$refs.OaProcOpinionNewModal.disableSubmit = false;
      },
      handleCat: function (record) {
        this.$refs.setCatModalForm.add(record,this.TaskLinkId);
        this.$refs.setCatModalForm.title = "查看";
        this.$refs.setCatModalForm.disableSubmit = false;

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.clearData();
        this.close()
      },
      handleCancel () {
        this.clearData();
        this.close()
      },
      handleTableChange(page) {
        this.ipagination.current = page.current;
        this.ipagination.pageSize = page.pageSize;
        this.loadData();
      },
      loadData(){
        // this.model=Object.assign({}, record);
//        console.log("2143564700000000000000000000000000");
//        console.log(this.model);
        // alert("666")
        this.iProcOpinionId=this.model.iid;
        this.procDefKey=this.model.procDefKey;
        getAction(this.url.list,{iProcOpinionId:this.iProcOpinionId,procDefKey:this.procDefKey,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then(res=>{
//          console.log(res.result.records);
          this.opinionCatData = res.result.records;
          this.ipagination.total = res.result.total;
        })
      },
      clearData(){
        this.opinionCatData= []
      }
    }
  }
</script>

<style lang="less" scoped>

</style>