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
              <a-select      v-decorator="[ 'iteamworkId', {}]" @change="getTeamwork" placeholder="请选择协同业务">
                <a-select-option v-for="(item,index) in teamworkList" :key="index" :value="item.iid">{{item.steamworkName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery1" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset1" icon="reload" style="margin-left: 8px">重置</a-button>
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
         <!--<a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />-->
          <a @click="previewModal(record)">协同预览</a>
        <!--  <a-divider type="vertical" />
           <a @click="previewModal(record)">发起下一步协同</a>-->
        <!--  <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
            <a>删除</a>
          </a-popconfirm>-->
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
		   {
            title: '协同业务',
            align:"center",
            dataIndex: 'iteamworkName',
             sorter: (i, ii, type) => {
           //descend倒叙
           //ascend正序

           this.queryParam.tableOrder = true
           //置空其他环节
           this.nullOther('orederByiteamworkName')
           this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
           return true
         },
           },
		   {
            title: '标题',
            align:"center",
            dataIndex: 'stitle',
         sorter: (i, ii, type) => {
           //descend倒叙
           //ascend正序

           this.queryParam.tableOrder = true
           //置空其他环节
           this.nullOther('stitle')
           this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
           return true

        },
           },

          {
            title: '当前步骤',
            align:"center",
            dataIndex: 'lastOrder',
            sorter: (i, ii, type) => {
              //descend倒叙
              //ascend正序

              this.queryParam.tableOrder = true
              //置空其他环节
              this.nullOther('lastOrder')
              this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
              return true
            },

          },
          {
            title: '总步骤',
            align:"center",
            dataIndex: 'orders',
            sorter: (i, ii, type) => {
              //descend倒叙
              //ascend正序
              this.queryParam.tableOrder = true
              //置空其他环节
              this.nullOther('Orders')
              this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
              return true
            },

          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'dCreateTime',
            sorter: (i, ii, type) => {
              //descend倒叙
              //ascend正序

              this.queryParam.tableOrder = true
              //置空其他环节
              this.nullOther('dCreateTime')
              this.queryParam.orederByTile = type == 'descend' ? -1 : 1;
              return true
            },
          },
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