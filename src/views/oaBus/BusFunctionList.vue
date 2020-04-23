<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="业务类别">
              <!--<a-input placeholder="请输入业务类别" v-model="queryParam.iId" v-decorator="[ 'ibusModelId', {}]"></a-input>-->
              <a-select v-model="queryParam.iBusModelId">
                <a-select-option v-for="(item,index) in selectModelData" :key="index" :value="item.iid">
                  {{item.sname}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="业务名称">
              <a-input placeholder="请输入业务名称" v-model="queryParam.sName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="7" :sm="8">
            <a-form-item label="业务所属机构">
              <!--<a-input placeholder="请输入业务类别" v-model="queryParam.iId" v-decorator="[ 'ibusModelId', {}]"></a-input>-->
              <a-select v-model="queryParam.unitId">
                <a-select-option v-for="(item,index) in unitList" :key="index" :value="item.id">
                  {{item.departName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
          <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>

          <!-- <template v-if="toggleSearchStatus">
             <a-col :md="6" :sm="8">
               <a-form-item label="业务名称">
                 <a-input placeholder="请输入业务名称" v-model="queryParam.sName"></a-input>
               </a-form-item>
             </a-col>
             <a-col :md="7" :sm="8">
               <a-form-item label="业务所属机构">
                 &lt;!&ndash;<a-input placeholder="请输入业务类别" v-model="queryParam.iId" v-decorator="[ 'ibusModelId', {}]"></a-input>&ndash;&gt;
                 <a-select v-model="queryParam.unitId">
                   <a-select-option v-for="(item,index) in unitList" :key="index" :value="item.id">
                     {{item.departName}}
                   </a-select-option>
                 </a-select>
               </a-form-item>
             </a-col>
           </template>
           <a-col :md="5" :sm="8">
             <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
               <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
               <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
               <a @click="handleToggleSearch" style="margin-left: 8px">
                 {{ toggleSearchStatus ? '收起' : '展开' }}
                 <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
               </a>
             </span>
           </a-col>-->

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>

    </div>

    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
        <!--<i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{-->
        <!--selectedRowKeys.length }}</a>项-->
        <!--<a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
      <!--</div>-->
      <!--
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      -->
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
          <a-divider type="vertical"/>
          <a @click="permitConfig(record)">拟稿权限</a>
          <a-divider type="vertical"/>
          <a @click="openPageDetailDef(record)">配置含义</a>
          <a-divider type="vertical"/>
          <!--<a @click="handleUnit(record)">数据查看权限</a>
          <a-divider type="vertical"/>
          <a @click="handleUnit(record)">数据查看权限</a>
          <a-divider type="vertical"/>-->
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
                  <a>删除</a>
          </a-popconfirm>
          <!--<a-dropdown>
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
    <busFunction-modal ref="modalForm" @ok="modalFormOk"></busFunction-modal>
    <function-permit-modal ref="modelModalForm" @ok="modalFormOk"></function-permit-modal>
    <bus-page-detail-def ref="refBusPageDetailDef"></bus-page-detail-def>
  </a-card>
</template>

<script>
  import {getAction} from '@/api/manage'
  import BusFunctionModal from './modules/BusFunctionModal'
  import functionPermitModal from './modules/functionPermitModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import BusPageDetailDef from "./BusPageDetailDef";


  export default {
    name: "BusFunctionList",
    mixins: [JeecgListMixin],
    components: {
      BusPageDetailDef,
      BusFunctionModal,
      functionPermitModal,
    },
    data() {
      return {
        description: '业务配置表管理页面',
        iisFontSize: '16px',
        // 表头
        iBusModelId: '',
        selectModelData: [],
        unitList: [],
        iBMId: '',
        columns: [
          /*{
              title: '#',
              dataIndex: '',
              key: 'rowIndex',
              width: 60,
              align: "center",
              customRender: function (t, r, index) {
                  return parseInt(index) + 1;
              }
          },*/
          {
            title: '业务分类',
            align: "center",
            width: 100,
            dataIndex: 'ibusModelId',
            customRender: (text) => {
              let length = this.selectModelData.length;
              for (let i = 0; i < length; i++) {
                if (text == this.selectModelData[i].iid) {
                  return this.selectModelData[i].sname;
                }
              }
            },
            sorter: (a, b, type) => {
              /* if(type == 'descend'){
                 this.queryParam.orderFlag = this.searchColumns[i].s_table_column + ' desc'
               }else{
                 this.queryParam.orderFlag = this.searchColumns[i].s_table_column + ' asc'
               }*/
              //a.s_title.length - b.s_title.length ;
            },
          },
          {
            title: '业务名称',
            align: "center",
            dataIndex: 'sname'
          },
          {
            title: '单位名称',
            align: "center",
            dataIndex: 'sbusLeftParameter',
            //ellipsis: true,

          },
          // {
          //   title: '插入机构',
          //   align: "center",
          //   dataIndex: 'iisUnit',
          //   customRender: (text) => {
          //     if (text == 1) {
          //       return '是';
          //     } else {
          //       return '否';
          //     }
          //   }
          // },
          // {
          //   title: '插入部门',
          //   align: "center",
          //   dataIndex: 'iisDept',
          //   customRender: (text) => {
          //     if (text == 1) {
          //       return '是';
          //     } else {
          //       return '否';
          //     }
          //   }
          // },
          {
            title: '业务功能',
            align: "center",
            dataIndex: 'sbusRightParameter',

          },
          /*{
              title: '编辑器',         //(1、0)
              align: "center",
              dataIndex: 'iisEditor',
            customRender:  (text)=> {
              if(text == 1){
                return '是' ;
              }else {
                return '否' ;
              }
            }
          },*/
          // {
          //   title: '发送范围',      //(1、0)
          //   align: "center",
          //   dataIndex: 'iisLimits',
          //   customRender: (text) => {
          //     if (text == 1) {
          //       return '是';
          //     } else {
          //       return '否';
          //     }
          //   }
          // },
          {
            title: '全文检索',      //(1、0)
            align: "center",
            width: 80,
            dataIndex: 'iisEs',
            customRender: (text) => {
              if (text == 1) {
                return '是';
              } else {
                return '否';
              }
            }
          },
          {
            title: '流程审批',      //(1、0)
            align: "center",
            width: 80,
            dataIndex: 'iisProc',
            customRender: (text) => {
              if (text == 1) {
                return '是';
              } else {
                return '否';
              }
            }
          },
          /* {
               title: '工作流配置id',
               align: "center",
               dataIndex: 'iprocSetId'
           },*/
          /*{
              title: '创建者',
              align: "center",
              dataIndex: 'sCreateBy'
          },
          {
              title: '创建时间',
              align: "center",
              dataIndex: 'dCreateTime'
          },
          {
              title: '修改者',
              align: "center",
              dataIndex: 'sUpdateBy'
          },
          {
              title: '修改时间',
              align: "center",
              dataIndex: 'dUpdateTime'
          },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 250,
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/oaBus/busFunction/list",
          delete: "/oaBus/busFunction/delete",
          deleteBatch: "/oaBus/busFunction/deleteBatch",
          exportXlsUrl: "oaBus/busFunction/exportXls",
          importExcelUrl: "oaBus/busFunction/importExcel",
          findList: "/oaBus/busFunction/findlist",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created() {
      this.getSelection();
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
        this.$refs.modelModalForm.mo(record);

      },
      openPageDetailDef(record) {
        this.$refs.refBusPageDetailDef.show(record);
      },
      getSelection() {
        let url = "/oaBus/busModel/modelList";
        getAction(url).then((res) => {
          this.selectModelData = res.result.modelList;
        })
        let url2 = '/sys/sysDepart/query' ;
        getAction(url2,{orgType:'1'}).then((res) => {
          this.unitList = res.result;
        })
      },
      //业务所属机构
      handleUnit(record) {
        alert("业务所属机构 ")
      }
      /*unitClickFun(){
        alert('业务所属机构 页面') ;
      },
      dataPowerClick(){
        alert('数据查看权限 页面') ;
      }*/
    }
  }
</script>
<style scoped>
</style>