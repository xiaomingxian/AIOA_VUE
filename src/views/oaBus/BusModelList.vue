<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="业务菜单名称">
              <a-input placeholder="请输入业务菜单名称" v-model="queryParam.sName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">
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
    </div>

    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
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
          <a-divider type="vertical"/>
          <a @click="permitConfig(record)">拟稿权限</a>
          <!--<a-dropdown>
          <a-divider type="vertical"/>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <busModel-modal ref="modalForm" @ok="modalFormOk"></busModel-modal>
    <ModelPermitModal ref="modelModalForm"></ModelPermitModal>
  </a-card>
</template>

<script>
  import BusModelModal from './modules/BusModelModal'
  import { httpAction,getAction } from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import ModelPermitModal from './modules/ModelPermitModal.vue'

  export default {
    name: "BusModelList",
    mixins: [JeecgListMixin],
    components: {
      BusModelModal,
      ModelPermitModal
    },
    data() {
      return {
        description: '业务模块表（业务分类表）管理页面',
        iisFontSize: '16px',
        // 表头
        columns: [
          /*{
              title: '主键id',
              align: "center",
              display: 'nine',
              dataIndex: 'iid'
          },*/
          {
            title: '序号',
            align: "center",
            width: 60,
            dataIndex: 'iorder'
          },
          {
            title: '业务菜单名称',
            align: "center",
            dataIndex: 'sname',
            ellipsis: true,
          },{
            title: '业务参数',
            align: "center",
            dataIndex: 'senName',
            ellipsis: true,
          },{
            title: '业务分类',
            align: "center",
            dataIndex: 'sbusdataTable',
            customRender:  (text)=> {
              for(let i = 0 ; i < this.dbtable.length ; i ++){
                if(text == this.dbtable[i].value){
                  return this.dbtable[i].text
                }
              }
              return text ;
            }
          },
        /*  {
            title: '路径名称',
            align: "center",
            dataIndex: 'senName'
          },
          {
            title: '数据表',
            align: "center",
            dataIndex: 'sbusdataTable'
          },
          {
            title: '权限表',
            align: "center",
            dataIndex: 'sbusdataTable',
            customRender: function (text) {
              return text + '_opinion';
            }
          },
          {
            title: '意见表',
            align: "center",
            dataIndex: 'sbusdataTable',
            customRender: function (text) {
              return text + '_permit';
            }
          },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},

          }
        ],
        url: {
          list: "/oaBus/busModel/list",
          delete: "/oaBus/busModel/delete",
          deleteBatch: "/oaBus/busModel/deleteBatch",
          exportXlsUrl: "oaBus/busModel/exportXls",
          importExcelUrl: "oaBus/busModel/importExcel",
          getDbtable :"/sys/dict/getDictItems/dbtable"
        },
        ibusId: "",
        dbtable: "",
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created(){
      this.initDbdata();
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
      permitConfig(record) {
        this.$refs.modelModalForm.show(record);
      },
      initDbdata(){
        getAction(this.url.getDbtable).then(res => {
          this.dbtable = res.result ;
        }) ;
      }

    }
  }
</script>