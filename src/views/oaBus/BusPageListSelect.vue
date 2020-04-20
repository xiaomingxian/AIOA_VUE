<template>
  <a-modal
    :visible="visible"
    :width="900"
    @ok="handleOk"
    destroyOnClose="true"
    @cancel="handleCancle"
    cancelText="关闭">
    <a-card :bordered="false">

      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="8">
              <a-form-item label="业务模板名称">
                <a-input placeholder="请输入业务模板名称" v-model="queryParam.sPageName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="模板分类">
                <a-select placeholder="请选择模板分类" v-model="queryParam.iPapeType" v-decorator="['iPapeType', {}]" >
                  <a-select-option  v-for="(item,index) in dbtable" :key="index" :value="item.value" >{{item.text}}</a-select-option>
                </a-select>
                <!--<a-input placeholder="请输入模板分类" v-model="queryParam.iPapeType"></a-input>-->
              </a-form-item>
            </a-col>
            <!--<a-col :md="6" :sm="8">-->
              <!--<a-form-item label="概要">-->
                <!--<a-input placeholder="请输入概要" v-model="queryParam.sPageRemarks"></a-input>-->
              <!--</a-form-item>-->
            <!--</a-col>-->
            <template v-if="toggleSearchStatus">
              <!--<a-col :md="6" :sm="8">
                <a-form-item label="附件表id">
                  <a-input placeholder="请输入附件表id" v-model="queryParam.iFileId"></a-input>
                </a-form-item>
              </a-col>-->


            </template>
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
      <!--<div class="table-operator">
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel">
              <a-icon type="delete"/>
              删除
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </div>-->

      <!-- table区域-begin -->
      <div>
        <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{
          selectedRowKeys.length }}</a>项
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
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: pageListChange,type: 'radio' }"
          @change="handleTableChange">

          <!--:rowSelection="{selectedRowKeys: selectedRowKeys, onChange: pageListChange}"-->

        <span slot="action" slot-scope="text, record">
          <a @click="showPicture(record)">预览图片</a>
        </span>

        </a-table>
      </div>
      <!-- table区域-end -->

      <!-- 表单区域 -->
      <!--<busPage-modal ref="modalForm" @ok="modalFormOk"></busPage-modal>-->
      <page-picture ref="pagePicture"></page-picture>
    </a-card>
  </a-modal>
</template>

<script>
  import {httpAction,getAction} from '@/api/manage'
  //import BusPageModal from './modules/BusPageModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import PagePicture from "@/views/oaBus/pageModels/pagePicture";

  export default {
    name: "BusPageListSelect",
    mixins: [JeecgListMixin],
    components: {
      PagePicture,
      // BusPageModal
    },
    data() {
      return {
        description: '业务页面表管理页面',
        visible: false,
        //返回的数据
        dataSource1:[],
        dbtable:'',
        // 表头
        columns: [
          /*{
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },*/
          /*{
            title: 'id',
            align: "center",
            dataIndex: 'iid',

          },*/
          {
            title: '页面名称',
            align: "center",
            dataIndex: 'spageName'
          },
          /*{
            title: '详情页面路径',    //详情页面路径（项目文件存放目录）
            align: "center",
            dataIndex: 'spagePath'
          },
          {
            title: '附件表id',
            align: "center",
            dataIndex: 'ifileId'
          },

          {
            title: '业务归类',  //（1.信息发布、2.公文审批、3.事务审批、4.业务审批）
            align: "center",
            dataIndex: 'ipapeType'
          },*/
          {
            title: '概要',
            align: "center",
            dataIndex: 'spageRemarks'
          },
          {
            title: '管理视频文件',    //(1、0)
            align: "center",
            dataIndex: 'iisVideo',
            customRender:  (text)=> {
              if(text == 1){
                return '是' ;
              }else{
                return '否' ;
              }
            }
          },
          /*{
            title: '主送、抄送、传阅',    //(0,1)
            align: "center",
            dataIndex: 'iisSend'
          },
          {
            title: '抄报',     //(1、0)
            align: "center",
            dataIndex: 'iisCopy'
          },
          {
            title: 'VIP模板',     //(1、0)
            align: "center",
            dataIndex: 'iisVip'
          },*/
          /*{
               title: '创建者',
               align:"center",
               dataIndex: 'screateBy'
              },
              {
               title: '创建时间',
               align:"center",
               dataIndex: 'dCreateTime'
              },
              {
               title: '修改者',
               align:"center",
               dataIndex: 'supdateBy'
              },
              {
               title: '修改时间',
               align:"center",
               dataIndex: 'dUpdateTime'
              },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/oaBus/busPage/list",
          delete: "/oaBus/busPage/delete",
          deleteBatch: "/oaBus/busPage/deleteBatch",
          exportXlsUrl: "oaBus/busPage/exportXls",
          importExcelUrl: "oaBus/busPage/importExcel",
          getDbtable :"/sys/dict/getDictItems/fun_temp_type"
        },
      }
    },
    created() {
      this.visible = false;
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      showPicture(record){
        this.$refs.pagePicture.show(record.iid);
      },
      show() {
        this.visible = true;
        getAction(this.url.getDbtable).then(res => {
          this.dbtable = res.result ;
        }) ;
        //alert("!!!!!!!!");
      },
      handleOk(){

        this.$emit("selectFinished",this.dataSource1) ;
        this.visible = false ;
      },
      handleCancle (){
        this.visible = false ;
        this.searchReset() ;
      },
      pageListChange(selectedRowKeys){
        /*if(selectedRowKeys.length > 1){
          //清空上一个选择的数据
          selectedRowKeys.shift();
        }*/
        //console.log(selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
        this.dataSource1 = [];
        this.dataSource1.push(selectedRowKeys[0]) ;
        console.log(this.dataSource1);
        this.$emit("selectFinished",this.dataSource1) ;
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
<!--
<style lang="less" scoped>
  .ant-card-body .table-operator{
    margin-bottom: 18px;
  }
  .ant-table-tbody .ant-table-row td{
    padding-top:15px;
    padding-bottom:15px;
  }
  .anty-row-operator button{margin: 0 5px}
  .ant-btn-danger{background-color: #ffffff}

  .ant-modal-cust-warp{height: 100%}
  .ant-modal-cust-warp .ant-modal-body{height:calc(100% - 110px) !important;overflow-y: auto}
  .ant-modal-cust-warp .ant-modal-content{height:90% !important;overflow-y: hidden}
</style>
-->
