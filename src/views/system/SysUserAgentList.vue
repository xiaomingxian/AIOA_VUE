<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <!--<div class="table-page-search-wrapper">-->
      <!--<a-form layout="inline">-->
        <!--<a-row :gutter="22">-->

          <!--<a-col :md="6" :sm="8">-->
            <!--<a-form-item label="用户名">-->
              <!--<a-input placeholder="请输入用户名" v-model="queryParam.userName"></a-input>-->
            <!--</a-form-item>-->
          <!--</a-col>-->


          <!--<a-col :md="6" :sm="8">-->
            <!--<a-form-item label="代理人">-->
              <!--<a-input placeholder="请输入代理人" v-model="queryParam.agentUserName"></a-input>-->
            <!--</a-form-item>-->
          <!--</a-col>-->
          <!--<a-col :md="6" :sm="6">-->
            <!--<a-form-item label="状态">-->
              <!--&lt;!&ndash;<a-input placeholder="请输入状态0无效1有效" v-model="queryParam.status"></a-input>&ndash;&gt;-->
              <!--<a-select v-model="queryParam.status" >-->
                <!--<a-select-option value="1">有效</a-select-option>-->
                <!--<a-select-option value="0">无效</a-select-option>-->
              <!--</a-select>-->
            <!--</a-form-item>-->
          <!--</a-col>-->
          <!--&lt;!&ndash;<a-col :md="6" :sm="8">&ndash;&gt;-->
            <!--&lt;!&ndash;<a-form-item label="代理人">&ndash;&gt;-->
              <!--&lt;!&ndash;<a-select  v-model="queryParam.agentUserName" placeholder="请选择代理人">&ndash;&gt;-->
                <!--&lt;!&ndash;<a-select-option v-for="(item,index) in postLists" :key="index" :value="item.agentUserName">{{item.agentUserName}}&ndash;&gt;-->
                <!--&lt;!&ndash;</a-select-option>&ndash;&gt;-->
              <!--&lt;!&ndash;</a-select>&ndash;&gt;-->
            <!--&lt;!&ndash;</a-form-item>&ndash;&gt;-->
          <!--&lt;!&ndash;</a-col>&ndash;&gt;-->
          <!--<template v-if="toggleSearchStatus">-->
            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="开始时间">-->
                <!--<a-input placeholder="请输入开始时间" v-model="queryParam.startTime"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="结束时间">-->
                <!--<a-input placeholder="请输入结束时间" v-model="queryParam.endTime"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->

          <!--</template>-->
          <!--<a-col :md="6" :sm="8">-->
            <!--<span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">-->
              <!--<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
              <!--<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">-->
                <!--{{ toggleSearchStatus ? '收起' : '展开' }}-->
                <!--<a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--</a>-->
            <!--</span>-->
          <!--</a-col>-->

        <!--</a-row>-->
      <!--</a-form>-->
    <!--</div>-->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAddMy" type="primary" icon="plus">新增</a-button>
     <!-- <a-button type="primary" icon="download" @click="handleExportXls('')">导出</a-button>
   -->   <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"-->
                <!--@change="handleImportExcel">-->
        <!--<a-button type="primary" icon="import">导入</a-button>-->
      <!--</a-upload>-->
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--<a-menu slot="overlay">-->
          <!--<a-menu-item key="1" @click="batchDel">-->
            <!--<a-icon type="delete"/>-->
            <!--删除-->
          <!--</a-menu-item>-->
        <!--</a-menu>-->
        <!--<a-button style="margin-left: 8px"> 批量操作-->
          <!--<a-icon type="down"/>-->
        <!--</a-button>-->
      <!--</a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
        <!--<i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{-->
        <!--selectedRowKeys.length }}</a>项-->
        <!--<a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
      <!--</div>-->

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
          <a @click="handleEditMy(record)">编辑</a>

          <a-divider type="vertical"/>
           <a @click="handleDelete(record.id)">删除</a>

          <!--<a-dropdown>-->
            <!--<a class="ant-dropdown-link">更多 <a-icon type="down"/></a>-->
            <!--<a-menu slot="overlay">-->
              <!--<a-menu-item>-->
                <!--<a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
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
    <sysUserAgent-modal ref="modalForm" @ok="modalFormOk"></sysUserAgent-modal>

  </a-card>
</template>

<script>
  import SysUserAgentModal from './modules/SysUserAgentModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { httpAction,getAction,postAction } from '@/api/manage'


  export default {
    name: "SysUserAgentList",
    mixins: [JeecgListMixin],
    components: {
      SysUserAgentModal
    },
    data() {
      return {
        description: 'a管理页面',
        iisFontSize: '16px',
        postLists:[],
        // 表头
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key:'rowIndex',
          //   width:60,
          //   align:"center",
          //   customRender:function (t,r,index) {
          //     return parseInt(index)+1;
          //   }
          //  },
          {
            title: '委托人',
            align: "center",
            dataIndex: 'userName'
          },
          {
            title: '代理人',
            align: "center",
            dataIndex: 'agentUserName'
          },
          {
            title: '代理人部门',
            align: "center",
            dataIndex: 'sysOrgCode'
          },
          {
            title: '开始时间',
            align: "center",
            dataIndex: 'startTime'
          },
          {
            title: '结束时间',
            align: "center",
            dataIndex: 'endTime'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            customRender:function (id) {
              if (id==0){
                return "无效"
              } else if (id==1) {
                return "有效"
              }else {
                return '无状态'
              }
            }
          },
          // {
          //   title: '创建人名称',
          //   align: "center",
          //   dataIndex: 'createName'
          // },
          // {
          //   title: '更新人名称',
          //   align: "center",
          //   dataIndex: 'updateName'
          // },

          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width:100,
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/sys/sysUserAgent/myAgent",
          delete: "/sys/sysUserAgent/delete",
          deleteBatch: "/sys/sysUserAgent/deleteBatch",
          exportXlsUrl: "/sys/sysUserAgent/exportXls",
          importExcelUrl: "/sys/sysUserAgent/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        // if (this.dataSource.length>0){
        //   this.$message.error('一个用户只能设置一个代理人')
        //   return
        // }
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created () {
       getAction(this.url.list).then((res) => {
        console.log(res.result.records);
        this.postLists = res.result.records;
      });
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
      beforeUpload: function (file, fileList) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      handleAddMy(){

        this.handleAdd()
      },
      handleEditMy(record){

        this.handleEdit(record)
        getAction(this.url.list).then((res) => {
          console.log(res.result.records);
          this.postLists = res.result.records;
        });
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>