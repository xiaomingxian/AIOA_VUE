<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <!--<a-col :md="6" :sm="8">-->
          <!--<a-form-item label="主键id">-->
          <!--<a-input placeholder="请输入主键id" v-model="queryParam.iId"></a-input>-->
          <!--</a-form-item>-->
          <!--</a-col>-->
          <!--<a-col :md="6" :sm="8">-->
          <!--<a-form-item label="流程定义KEY">-->
          <!--<a-input placeholder="请输入流程定义KEY" v-model="queryParam.procDefKey"></a-input>-->
          <!--</a-form-item>-->
          <!--</a-col>-->
          <!--<template v-if="toggleSearchStatus">-->
          <a-col :md="8" :sm="6">
            <a-form-item label="任务环节">
              <a-input maxLength="40" placeholder="请输入任务环节名称" v-model="name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="6">
            <a-form-item label="按钮名称">
              <a-input maxLength="50" placeholder="请输入按钮名称" v-model="sbtnName"></a-input>
            </a-form-item>
          </a-col>
          <!--</template>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQueryCha" icon="search">查询</a-button>
              <!--<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">-->
              <!--{{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--<a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--</a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <a-spin tip="Loading..." :spinning="confirmLoading" style="height: 360px;overflow: auto">
      <a-form :form="form">
        <a-button  type="primary"  icon="plus" style="margin-bottom: 5px" @click="handleEdit1()">新建</a-button>
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
            :dataSource="data"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange">
            <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
        <span slot="action" slot-scope="text, record">
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
        <oa-proc-button-new-modal ref="modalForm" @ok="modalFormOk()"></oa-proc-button-new-modal>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import OaProcButtonNewModal from './OaProcButtonNewModal'
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage.js'
  import {postAction} from '@/api/manage.js'

  export default {
    name: "OaProcButtonModal",
    mixins:[JeecgListMixin],
    components: {
      OaProcButtonNewModal,
    },
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
        newDataId:'',
        buttonList:'',
        TaskLink:[],
        TaskLinkId:'',
        sbtnName:'',
        procDefKey:'',//流程key
        name:'',//任务环节名称
        buttonId:"",
        heBingcolumn:'',
        HBcolumn:1,
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
          {
            title: '任务环节名称',
            align: "center",
            dataIndex: 'taskDefKey',
            customRender:(text,row,index)=>{
//              const obj = {
//                children: text,
//                attrs: {}
//              };
//              if(text==this.heBingcolumn){
//                  this.HBcolumn+=1;
//              }else {
//                this.HBcolumn=1;
//              }
//              obj.attrs.rowSpan =this.HBcolumn;
              for (let i = 0; i < this.TaskLink.length ; i++) {
//                 console.log("**********************************111");
//                 console.log(text);
//                 console.log(i);
//                 console.log(this.buttonList[i]);
                if (text==this.TaskLink[i].id) {
//                  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                  return this.TaskLink[i].name;
//                  obj.children=this.TaskLink[i].name
//                  return obj;
                }
              }
              //保存上一条数据
//              this.heBingcolumn=text;
            }
          },
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
            title: '不控制',
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
            title: '已办用户',
            align: "center",
            dataIndex: 'iisLastsender',
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
            title: '处理人',
            align: "center",
            dataIndex: 'iisTransactors',
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
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
//          list: "/oabuttonset/oaButtonSet/list",
          findById:"/oabuttonset/oaButtonSet/findByIf",
          delete: "/oabuttonset/oaButtonSet/delete",
          deleteBatch: "/oabuttonset/oaButtonSet/deleteBatch",
          exportXlsUrl: "oabuttonset/oaButtonSet/exportXls",
          importExcelUrl: "oabuttonset/oaButtonSet/importExcel",
          add: "/oaprocbutton/oaProcButton/add",
          edit: "/oaprocbutton/oaProcButton/edit",
          buttonList: "/oabutton/oaButton/buttonList",
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
          let url='oabuttonset/oaButtonSet/verButtonSetDelete';
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
          title:'您的某些业务已经使用了这套按钮!!!',
          content:'删除将影响业务办理,你确定还要删除吗?',
          onOk(){
            that.handleDelete(iid);
          },
          onCancel(){
          }
        })
      },
      add (record,TaskLinkId,procDefKey) {
        this.confirmLoading=true;
//        清除查询条件
        this.buttonId=[];
        this.taskDefKey=[];
//        ------
        this.procDefKey=procDefKey;

//        console.log(record);
        this.TaskLinkId=TaskLinkId;
        //---------------任务环节列表---------------
        getAction(this.url.TaskLink,{processDefinitionId:TaskLinkId}).then(res=>{
          this.TaskLink = res.result;
        });
        this.sbtnName="";
        this.name="";
        // this.$nextTick()
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
      handleEdit1:function () {
        this.$refs.modalForm.edit(this.model,this.TaskLinkId);
        this.$refs.modalForm.loadData(this.model.iid)
        this.$refs.modalForm.title = "新编辑";
        this.$refs.modalForm.disableSubmit = false;
      },
      handleEditDone:function (record) {
        this.$refs.modalForm.editBefore(this.model,this.TaskLinkId,record);
        this.$refs.modalForm.loadData(this.model.iid)
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
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
      searchQueryCha(){
        this.confirmLoading=true;
        const promise1 = new Promise(resolve => {
        if(this.sbtnName!=null && this.sbtnName.trim()!=""){
          getAction("/oabutton/oaButton/queryBySbtnName",{sbtnName:this.sbtnName}).then(res=>{
//            console.log("000000000000000-----------");
            if(res.success){
//            console.log(res.result);
              this.buttonId = res.result;
            }else {
              this.buttonId =[];
            }
              this.data =""
              this.ipagination.total =""
//            this.loadData();
          })
        }
          resolve(this.buttonId)
        })

        promise1.then((newDataId)=> {
          if (this.name!=null && this.name.trim()!=""){
          getAction("/workflow/oaProcActinst/queryByKeyAndName", {
            procDefKey: this.procDefKey,
            actName: this.name
          }).then(res => {
            if (res.success) {
//            console.log(res.result);
              this.taskDefKey = res.result;
            } else {
              this.taskDefKey = [];
            }
            this.data = ""
            this.ipagination.total = ""
          })
        }
        }).then(()=>{
         setTimeout(()=>{
           if (this.sbtnName == null || this.sbtnName.trim() == ""){
//             console.log("9999999999999999999-----------");
             this.buttonId = null;
           }
           if (this.name == null || this.name.trim() == "") {
//             console.log("1111111111111-----------");
             this.taskDefKey = null;
           }
           this.loadData();
         },3200)
        })







//        this.buttonId=[];
//        this.taskDefKey=[];
      },
      loadData(){
        // this.columns = [];
        // this.data = [];
        postAction(this.url.findById,{id:this.model.iid,buttonId:this.buttonId,taskDefKey:this.taskDefKey,
          pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then(res=>{

//          console.log("22222222222222222222222-----------");
         // console.log(res);
          this.data = res.result.records;
          this.ipagination.total = res.result.total;
          this.confirmLoading=false;
        })
      },
      clearData(){
        this.data= []
      }

    }
  }
</script>

<style lang="less" scoped>

</style>