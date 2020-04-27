<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <!--<a-col :md="6" :sm="8">
            <a-form-item label="主键id">
              <a-input placeholder="请输入主键id" v-model="queryParam.iId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="页面按钮id">
              <a-input placeholder="请输入页面按钮id" v-model="queryParam.sBtnId"></a-input>
            </a-form-item>
          </a-col>-->
          <a-col :md="6" :sm="8">
            <a-form-item label="按钮名称">
              <a-input placeholder="请输入按钮名称" v-model="queryParam.sBtnName"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :md="6" :sm="8">
            <a-form-item label="页面按钮value">
              <a-input placeholder="请输入页面按钮value" v-model="queryParam.sBtnValue"></a-input>
            </a-form-item>
          </a-col>-->
          <!--<a-col :md="6" :sm="8">-->
            <!--<a-form-item label="互斥按钮id">-->
              <!--<a-input placeholder="请输入互斥按钮id" v-model="queryParam.sExcbuttonId"></a-input>-->
            <!--</a-form-item>-->
          <!--</a-col>-->
        <!--<template v-if="toggleSearchStatus">
        <a-col :md="6" :sm="8">
            <a-form-item label="页面按钮name">
              <a-input placeholder="请输入页面按钮name" v-model="queryParam.sBtnName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="页面按钮value">
              <a-input placeholder="请输入页面按钮value" v-model="queryParam.sBtnValue"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="互斥按钮id">
              <a-input placeholder="请输入互斥按钮id" v-model="queryParam.sExcbuttonId"></a-input>
            </a-form-item>
          </a-col>
          </template>-->
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" >
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('按钮管理')">导出</a-button>-->
      <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
        <!--<a-button type="primary" icon="import">导入</a-button>-->
      <!--</a-upload>-->
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--<a-menu slot="overlay">-->
          <!--<a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
        <!--</a-menu>-->
        <!--<a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
      <!--</a-dropdown>-->
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
           <!--<a @click="handleCat(record)">查看</a>-->
          <!--<a-divider type="vertical" />-->
          <a @click="handleEdit(record)">编辑</a>
          <!--<a-divider type="vertical" />-->
          <!--<a-dropdown>-->
            <!--<a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
            <!--<a-menu slot="overlay">-->
              <!--<a-menu-item>-->
                <!--<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">-->
                  <!--<a>删除</a>-->
                <!--</a-popconfirm>-->
              <!--</a-menu-item>-->
            <!--</a-menu>-->
          <!--</a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <oaButton-modal ref="modalForm" @ok="modalFormOk"></oaButton-modal>
    <oaButtonCat-modal ref="catModalForm" @ok="modalFormOk"></oaButtonCat-modal>

  </a-card>
</template>

<script>
  import OaButtonModal from './modules/OaButtonModal'
  import OaButtonCatModal from './modules/OaButtonCatModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'

  export default {
    name: "OaButtonList",
    mixins:[JeecgListMixin],
    components: {
      OaButtonModal,
      OaButtonCatModal
    },
    data () {
      return {
        description: '按钮管理管理页面',
        iisFontSize: '16px',
        // 表头
        columns: [
         /* {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },*/
		/*   {
            title: '主键id',
            align:"center",
            dataIndex: 'iid'
           },*/
		   // {
       //      title: '序号',
       //      align:"center",
       //      width: 60,
       //      dataIndex: 'sbtnId'
       //     },
		   {
            title: '按钮名称',
            align:"center",
            width:150,
            dataIndex: 'sbtnName'
           },
		   {
            title: '方法名',
            align:"center",
            width:200,
            dataIndex: 'sbtnValue'
           },
		   {
            title: '适用范围',
            align:"left",
            dataIndex: 'sexcbuttonId'
           },
		  /* {
            title: '互斥状态字段（如正文排版、封发日期）',
            align:"center",
            dataIndex: 'sexcfield'
           },*/
	/*	   {
            title: '是否刷新页面',
            align:"center",
            dataIndex: 'iisRefresh'
           },*/
/*		   {
            title: '是否需要校验按钮对应的业务操作（下一任务（保存）时，校验该按钮业务操作）',
            align:"center",
            dataIndex: 'iisCheckbus'
           },*/
          {
            title: '基础按钮',
            align:"center",
            dataIndex: 'iisBase',
            width:100,
            customRender:(text,row,index)=>{
              if (text==true){
                return "是";
              } else {
                return "否";
              }
            }
          },
		  // {
      //       title: '管理员按钮',
      //       align:"center",
      //       dataIndex: 'iisDefend',
      //       customRender:(text,row,index)=>{
      //         if (text==true){
      //         return "是";
      //         } else {
      //         return "否";
      //         }
      //       }
      //      },
     /*   {
                 title: '是否操作ntko控件',
                 align:"center",
                 dataIndex: 'iisNtko'
                },
                {
                 title: '是否允许ntko打印',
                 align:"center",
                 dataIndex: 'iisPrint'
                },
                {
                 title: '是否允许ntko打印预览',
                 align:"center",
                 dataIndex: 'iisPrintpreview'
                },
                {
                 title: '是否允许ntko另存',
                 align:"center",
                 dataIndex: 'iisSaveas'
                },
                {
                 title: '是否允许ntko保存',
                 align:"center",
                 dataIndex: 'iisSave'
                },
                {
                 title: '是否允许ntko新建',
                 align:"center",
                 dataIndex: 'iisNew'
                },
                {
                 title: '是否允许ntko禁止文件菜单的关闭项',
                 align:"center",
                 dataIndex: 'iisClose'
                },
                {
                 title: '是否允许ntko打开',
                 align:"center",
                 dataIndex: 'iisOpen'
                },
                {
                 title: '是否允许ntko编辑',
                 align:"center",
                 dataIndex: 'iisEdit'
                },
                {
                 title: '是否允许ntko拷贝',
                 align:"center",
                 dataIndex: 'iisCopy'
                },
                {
                 title: '是否ntko保存痕迹',
                 align:"center",
                 dataIndex: 'iisSaverevision'
                },
                {
                 title: '是否允许ntko显示痕迹',
                 align:"center",
                 dataIndex: 'iisShowrevision'
                },
                {
                 title: '是否ntko套打',
                 align:"center",
                 dataIndex: 'iisAddread'
                },*/
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/oabutton/oaButton/list",
          delete: "/oabutton/oaButton/delete",
          deleteBatch: "/oabutton/oaButton/deleteBatch",
          exportXlsUrl: "oabutton/oaButton/exportXls",
          importExcelUrl: "oabutton/oaButton/importExcel",
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created(){
      this.setFontSize();
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
      // handleCat: function (record) {
      //   //console.log(record.iid)
      //   this.$refs.catModalForm.add(record);
      //   this.$refs.catModalForm.loadData(record.iid)
      //   this.$refs.catModalForm.title = "查看";
      //   this.$refs.catModalForm.disableSubmit = false;
      //
      // },
      handleEdit: function (record) {
        this.$refs.modalForm.edit(record);
        // this.$refs.modalForm.loadData(record.iid)
        this.$refs.modalForm.title = "编辑";
        this.$refs.modalForm.disableSubmit = false;
      }
    }
  }
</script>
<style scoped>
  /*@import '~@assets/less/common.less'*/
</style>