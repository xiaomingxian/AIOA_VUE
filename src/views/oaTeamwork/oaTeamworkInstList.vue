<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="协同业务">
              <a-select  v-decorator="[ 'iteamworkId', {}]" @change="getTeamwork">
                <a-select-option v-for="(item,index) in teamworkList" :key="index" :value="item.iid">{{item.steamworkName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
      <!--  <template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="个人协同办公业务配置明细ID">
              <a-input placeholder="请输入个人协同办公业务配置明细ID" v-model="queryParam.iTeamworkSetId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="步骤序号(与teamworkset配置一致）">
              <a-input placeholder="请输入步骤序号(与teamworkset配置一致）" v-model="queryParam.iOrder"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="业务模块id">
              <a-input placeholder="请输入业务模块id" v-model="queryParam.iBusModelId"></a-input>
            </a-form-item>
          </a-col>
          </template>-->
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery1" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset1" icon="reload" style="margin-left: 8px">重置</a-button>
             <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
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
        rowKey="iid"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
          <a @click="previewModal(record)">协同预览</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <oaTeamworkInst-modal ref="modalForm" @ok="modalFormOk"></oaTeamworkInst-modal>
    <collaborative-preview-modal ref="previewModal" @ok="modalFormOk"></collaborative-preview-modal>
  </a-card>
</template>

<script>
  import oaTeamworkInstModal from './modules/oaTeamworkInstModal'
  import CollaborativePreviewModal from './modules/CollaborativePreviewModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,getAction,postAction } from '@/api/manage'

  export default {
    name: "oaTeamworkInstList",
    mixins:[JeecgListMixin],
    components: {
      oaTeamworkInstModal,
      CollaborativePreviewModal
    },
    inject:['reload'],
    data () {
      return {
        description: '个人协同办公业务实例管理页面',
        iisFontSize: '16px',
        modelList: [],
        selectList: [],
        teamworkList: [],
        busModelId:'',
        iteamworkId:'',
        modelId:'',
        functionId:'',
        // 表头
        columns: [
		   {
            title: '协同业务',
            align:"center",
            dataIndex: 'iteamworkName',
             sorter: (i, ii, type) => {
           //descend倒叙
           //ascend正序

           this.queryParam.tableOrder = true
           //置空其他环节
           this.nullOther('orederByTile')
           this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
           return true
         },
           },
		   {
            title: '标题（步骤1的业务标题）',
            align:"center",
            dataIndex: 'iteamworkSetId',
         sorter: (i, ii, type) => {
           //descend倒叙
           //ascend正序

           this.queryParam.tableOrder = true
           //置空其他环节
           this.nullOther('orederByTile')
           this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
           return true

        },},

		   {
            title: '协同序号（最新启动的协同顺序号)',
            align:"center",
            dataIndex: 'iorder',
         sorter: (i, ii, type) => {
           //descend倒叙
           //ascend正序

           this.queryParam.tableOrder = true
           //置空其他环节
           this.nullOther('orederByTile')
           this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
           return true
         },
           },
          {
            title: '创建时间（步骤1的业务创建时间）',
            align:"center",
            dataIndex: 'busModelName', sorter: (i, ii, type) => {
              //descend倒叙
              //ascend正序

              this.queryParam.tableOrder = true
              //置空其他环节
              this.nullOther('orederByTile')
              this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
              return true
            },

          },
		 /*  {
            title: '业务分类',
            align:"center",
            dataIndex: 'busModelName'
           },
		   {
            title: '业务功能',
            align:"center",
            dataIndex: 'busFunctionName'
           },*/
		  /* {
            title: '版本号(暂不考虑）',
            align:"center",
            dataIndex: 'iversion'
           },*/
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        ipagination:{
          total:'',
          current:''
        },
		url: {
          list: "/oaTea/oaTeamworkInst/list",
          delete: "/oaTea/oaTeamworkInst/delete",
          deleteBatch: "/oaTea/oaTeamworkInst/deleteBatch",
          exportXlsUrl: "oaTea/oaTeamworkInst/exportXls",
          importExcelUrl: "oaTea/oaTeamworkInst/importExcel",
       },
    }
  },
    created() {
      this.getBusModelSelectList();
      this.getTeamWorkList();
      this.setFontSize();
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
  /*    handleTableChange(q,w,e,){
        console.log(q.current);
        this.ipagination.current = q.current;
        getAction(this.url.list, {pageNo:q.current, iTeamworkId:this.iteamworkId}).then((res) => {
          this.dataSource = res.result.records;
          this.ipagination.total =  res.result.total;
        })
      },*/
      searchQuery1(){
        getAction(this.url.list, {iTeamworkId: this.iteamworkId}).then((res) => {
          this.dataSource=res.result.records;
          this.ipagination.total =  res.result.total;
        });
      },
      searchReset1(){
        this.reload();
      },
      previewModal(record){
        this.$refs.previewModal.open(record);
        this.$refs.previewModal.title = "协同办公";
      },
      getTeamwork(e){
        console.log(e)
        this.iteamworkId = e;
      },
      getBusModelSelectList(){
        let url = "/oaBus/busModel/findList";
        getAction(url, {}).then((res) => {
          this.modelList=res.result;
        });
      },
      getTeamWorkList(){
        let url = "/oateamwork/oaTeamwork/findTeamworkName";
        getAction(url, {}).then((res) => {
          this.teamworkList=res.result;
        });
      },
      // 所属业务模块数据  参数依赖于所属模块 所选id
      getFunctionList(value){
        let url = "/papertitle/docNumSet/busFunctionList?ibusModelId="+value;
        getAction(url).then((res)=>{
          this.selectList = res.result;
        })

      },
    }
  }
</script>
<style scoped>
</style>