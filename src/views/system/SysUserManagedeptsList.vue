<template>
  <a-modal :visible="showFunPer" :width="1200" @ok="handleOk" @cancel="handleCancle">
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

      <!--    <a-col :md="6" :sm="8">
            <a-form-item label="主键id">
              <a-input placeholder="请输入主键id" v-model="queryParam.iId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="用户id">
              <a-input placeholder="请输入用户id" v-model="queryParam.sUserId"></a-input>
            </a-form-item>
          </a-col>-->
          <a-col :md="6" :sm="8">
            <a-form-item label="部门名称">
              <a-input placeholder="请输入部门名称" v-model="queryParam.deptName"></a-input>
            </a-form-item>
          </a-col>
        <!--<template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="部门ID">
              <a-input placeholder="请输入部门ID" v-model="queryParam.sDeptId"></a-input>
            </a-form-item>
          </a-col>
          </template>-->
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="onSearch" type="primary" icon="plus">新增</a-button>
        <a-button @click="onDelete" type="primary" icon="delete">删除</a-button>

    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <!--<a @click="handleEdit(record)">编辑</a>-->

          <!--<a-divider type="vertical" />-->
          <!--<a-dropdown>-->
          <!--  <a-popconfirm placement="bottom" okText="Yes" cancelText="No" @confirm="() => handleDelete(record)">
              <template slot="title">
                <a>删除</a>
              </template>
            </a-popconfirm>-->


            <!--<a-menu slot="overlay">-->
              <!--<a-menu-item>-->
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
                  <a class="ant-dropdown-link">删除</a>
                </a-popconfirm>
              <!--</a-menu-item>-->
            <!--</a-menu>-->
          <!--</a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sysUserManagedepts-modal ref="modalForm" @ok="modalFormOk"></sysUserManagedepts-modal>

    <depart-window ref="departWindow" @ok="modalFormOk" @partData="partData"></depart-window>
  </a-card>
  </a-modal>
</template>

<script>
  import sysUserManagedeptsModal from './modules/SysUserManagedeptsModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,getAction,postAction } from '@/api/manage'
  import departWindow from './modules/SelectDepartWindow'

  export default {
    name: "sysUserManagedeptsList",
    mixins:[JeecgListMixin],
    components: {
      sysUserManagedeptsModal,
      departWindow,
    },
    data () {
      return {
        queryParam:{
          deptName:'',
      },
        description: '分管领导部门管理管理页面',
        username:'',
        checkedDepartKeys:[],
        selectedDepartKeys:[], //保存用户选择部门id
        departIdList:[],
        deptName:'',
        userId:'',
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
        // 表头
        columns: [
          {
            title: '用户账号',
            align:"center",
            dataIndex: 'username'
          },
          {
            title: '机构名称',
            align:"center",
            dataIndex: 'deptName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/sys/sysUserManagedepts/list",
          add: "/sys/sysUserManagedepts/add",
          delete: "/sys/sysUserManagedepts/delete",
          queryById: "/sys/sysUserManagedepts/queryById",
          deleteList:"/sys/sysUserManagedepts/deleteList",
       },
        showFunPer: false,
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      config(username) {
        console.log("----------------")
        console.log(username)
        this.showFunPer = true;
        this.username=username;
        this.loadData1();
        /*getAction(this.url.list, {username: username}).then((res) => {
          console.log("-------------");
          console.log(res.result);
          this.dataSource = res.result.records;
        })*/
      },
      modalFormOk(){
        this.loadData1();
      },
      handleOk() {
        this.showFunPer = false;
      },
      handleCancle() {
        this.showFunPer = false;
      },
      partData(formData){
        this.selectedDepartKeys = [];
          for (let i = 0; i < formData.length; i++) {
          this.selectedDepartKeys.push(formData[i].key);
        }
        this.departIdList = this.selectedDepartKeys;
        this.checkedDepartKeys = this.selectedDepartKeys;  //更新当前的选择keys
        postAction(this.url.add,{userId:this.userId,departId:this.departIdList}).then(res=>{
          if(res.success){
            this.$message.info(res.message)
            // this.$emit('ok');
            // this.$emit('close',this.username);
            this.loadData1();
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      onSearch(){
        this.$refs.departWindow.add(this.checkedDepartKeys,this.userId);
      },
      // 搜索用户对应的部门API
      /*onSearch() {
        // this.$refs.departWindow.add(this.checkedDepartKeys, this.userId);
        this.$refs.modalForm.add(this.dataSource[0].userId);
      },*/
      searchQuery(){
        if (this.queryParam.deptName == '' || this.queryParam.deptName == undefined){
          this.modalFormOk();
          return;
        }
        console.log(this.dataSource);
        console.log(this.dataSource[0].userId);
        console.log("9999999")
        getAction(this.url.queryById,{userId:this.userId,deptName:this.queryParam.deptName}).then((res)=>{
          if(res.success){
            console.log(res.result)
            this.dataSource = res.result.records;
          }else{
            this.$message.warning(res.message);
          }
        })
      },
      //批量删除
      onDelete(){
        if (this.selectedRowKeys.length == 0  ){
          this.$message.error("请至少选择一条记录！")
          return;
        }
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk:  ()=> {
            postAction(this.url.deleteList,{departMapId:this.selectedRowKeys}).then(res=>{
              if(res.success){
                this.modalFormOk();
                this.onClearSelected();
                this.$message.success("删除成功")
              }else {
                this.$message.error(res.message);
              }
            })
          }
        });
      },
      //删除
      handleDelete(record){
        getAction(this.url.delete,{userId:record.userId,deptId:record.deptId}).then((res)=>{
          if(res.success){
            this.$message.success(res.message);
            this.modalFormOk();
            this.onClearSelected();
          }else{
            this.$message.error(res.message);
          }
        })
      },

/*      loadData() {//请求表格数据
        console.log("************")
        // getAction(this.url.list, {iProcOpinionId: iid}).then(res => {
        //   this.dataSource = res.result.records;
        // })
        getAction(this.url.list,{}).then((res)=>{
          // console.log("====================================");
          // console.log(res);
          this.data=res.result;
          this.dataSource=res.result.records;
        })
      },*/
      handleTableChange(page) {
        this.ipagination.current = page.current;
        this.ipagination.pageSize = page.pageSize;
        this.loadData1();
      },
      clearDate(){
        console.log("1111111111111")
        this.dataSource = [];
      },
      loadData1() {
        console.log("0000000000000000")
        this.clearDate();
        getAction(this.url.list, {username: this.username,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then((res) => {
          console.log(res.result);
          this.dataSource = [];
          this.ipagination.total = res.result.total;
          this.userId = res.result.records[0].userId;
          if(res.result.records.length == 1 && res.result.records[0].id == undefined){
              return;
          }
          this.dataSource = res.result.records;
          for(let i in this.dataSource){
            if(this.dataSource[i].parentName != ""){
              this.dataSource[i].parentName += "-";
              this.dataSource[i].parentName += this.dataSource[i].deptName;
              this.dataSource[i].deptName = this.dataSource[i].parentName;
            }
          }

        })

        /*getAction(this.url.list, {username: username,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize}).then((res) => {
          console.log("-------------");
          console.log(res.result);
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        })*/
      },
      loadData(){

      }
    }
  }
</script>
<style scoped>
</style>