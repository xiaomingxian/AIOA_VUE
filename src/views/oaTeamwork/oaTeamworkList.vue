<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>
    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
        <!--<i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
        <!--<a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
      <!--</div>-->

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="iid"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
      >

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
          <a @click="handleConfig(record)">配置业务</a>
          <a-divider type="vertical" />
         <a @click="handleDelete11(record.iid)">删除</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
    <!--模态框-->
    <a-modal
      title="温馨提示"
      :visible="visibleDel"
      @ok="comfirmDelOrBatchDel"
      @cancel="handleCancel"
    >
      <p>请确认是否要删除该条数据</p>
    </a-modal>
    <!-- 表单区域 -->
    <oaTeamwork-modal ref="modalForm" @ok="modalFormOk"></oaTeamwork-modal>
    <oa-teamwork-set-list ref="teamworkSetList" @ok="modalFormOk" ></oa-teamwork-set-list>
  </a-card>
</template>

<script>
  import oaTeamworkModal from './modules/oaTeamworkModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import  oaTeamworkSetList from './oaTeamworkSetList'
  import {httpAction, getAction, postAction, getRoleList, getUserList, getServiceList,deleteAction} from '@/api/manage'

  export default {
    name: "oaTeamworkList",
    mixins:[JeecgListMixin],
    components: {
      oaTeamworkModal,
      oaTeamworkSetList,

    },
    data () {
      return {
        description: '个人协同办公业务配置分类管理页面',
        iisFontSize: '16px',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        // 表头
        columns: [
         /* {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
		      {
            title: '协同业务名称',
            align:"center",
            width:180,
            dataIndex: 'steamworkName'
           },
          {
            title: '描述',
            align:"left",
            dataIndex: 'description'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:180,
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/oateamwork/oaTeamwork/list",
          delete: "/oateamwork/oaTeamwork/delete",
          deleteBatch: "/oateamwork/oaTeamwork/deleteBatch",
          exportXlsUrl: "oateamwork/oaTeamwork/exportXls",
          importExcelUrl: "oateamwork/oaTeamwork/importExcel",
       },
        //keysObjs:[],
        ids:'',

        visibleDel:false,
        selectedRowKeys:[],
        selectionRows: [],
        TenworkList:[],
    }
  },

  created(){

    this.setFontSize();
    this.selectOption();
    this.searchReset();

  },
    computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      setFontSize(){
        const  userid =JSON.parse( localStorage.getItem('userdata')).userInfo.id;
        let url = "/testt/sysUserSet/queryByUserId";
        getAction(url,{userId:userid}).then((res) => {
          if(res.result.iisFontSize == 1){
            this.iisFontSize = '18px';
          }else if(res.result.iisFontSize == 3){
            this.iisFontSize = '14px';
          }else{
            this.iisFontSize = '16px';
          }
          document.getElementsByClassName('ant-table')[0].style.fontSize = this.iisFontSize;
        })
      },
      // 多选事件
     /* onSelectChange(selectedRowKeys,keysObjs){
        console.log(selectedRowKeys)
        console.log(keysObjs)
        let ids = []
        for(let i=0;i<keysObjs.length;i++){
           ids.push(keysObjs[i].iid)
        }
        console.log(ids.toString())
        this.keysObjs = keysObjs;
        this.ids=ids.toString()
        this.selectedRowKeys = selectedRowKeys
      },*/
      handleConfig: function (record) {
        this.$refs.teamworkSetList.open(record);
        this.$refs.teamworkSetList.title = "查看";

      },
      showOpen(){
        // alert(111)
        getAction(this.url.list).then((res) => {
          this.dataSource = res.result.records;
          this.ipagination.total =  res.result.total;
          this.selectedRowKeys = []
          this.selectionRows = []
        })
      } ,
      selectOption(){
        // alert(111)
        getAction(this.url.list).then((res) => {
          this.TenworkList = res.result.records;
        })
      } ,
      //---------删除功能---------------------------
      handleDelete11(iid) {
        this.visibleDel = true;
        this.iid = iid; //   单元删除id

      },
      comfirmDelOrBatchDel(){
        deleteAction(this.url.delete,{id:this.iid }).then((res) => {
          if(res.success){
            this.showOpen()
          }else{
            this.$message.warning(res.message);
          }
        });

        this.visibleDel = false;

      },
      handleCancel(){
        this.visibleDel = false;
      },
      //单项删除
      handleDelete(e,n){
        console.log(e);
        console.log(n);
        deleteAction(this.url.delete, {id: e}).then((res) => {
          if (res.success) {
            this.$message.success(res.message);

          } else {
            this.$message.warning(res.message);
          }
        });
      },
      // 批量删除操作
      batchDel(){

        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk:(()=>{

            deleteAction(this.url.deleteBatch, {ids:this.ids }).then((res) => {
              if (res.success) {
                this.$message.success(res.message);
                this.showOpen();

               // this.selectedRowKeys = []
              } else {
                this.$message.warning(res.message);
               // this.selectedRowKeys = []

              }
            });
          })
        });
      },
    }
  }
</script>
<style scoped>
</style>