<template>
  <a-modal :visible="showFunPer" :width="1200"  :title="title" @ok="handleOk" @cancel="handleCancle">
    <a-card :bordered="false" class="findChild">
      <div class="table-operator">
        <a-button @click="add"  :disabled="addDisabled" type="primary" icon="plus">新增</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1" title="确定删除吗?" @click="batchDel">
              <a-icon type="delete"/>
              删除
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </div>
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
          :dataSource="data"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange"
        >

        <span slot="action" slot-scope="text, record">
           <a @click="edit(record)">编辑</a>
           <a-divider type="vertical"/>
           <a @click="handleDelete(record.iid)" title="确定删除吗?">删除</a>
         <!-- <a-divider type="vertical"/>
          <a @click="handleCat(record)">查看</a>-->
        </span>


        </a-table>
      </div>
      <!--模态框-->
      <a-modal
        title="温馨提示"
        :visible="visibleDel"
        @ok="comfirmDelOrBatchDel"
        @cancel="handleCancel"
      >
        <p>请确认是否要删除该条数据</p>
      </a-modal>
      <busFunctionPermit-modal ref="modalForm" @submit="getissubmit($event)" @ok="modalFormOk"></busFunctionPermit-modal>
      <busFunctionCat-modal ref="catModalForm"></busFunctionCat-modal><!--@ok="modalFormOk"-->
      <new-task-modal ref="newTaskModel" @ok="modalFormOk"></new-task-modal>
    </a-card>
  </a-modal>
</template>

<script>
  import BusFunctionPermitModal from './BusFunctionPermitModal'
  import BusFunctionCatModal from './BusFunctionCatModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {getAction,deleteAction, putAction} from '@/api/manage'
  import newTaskModal  from '../../mytask/modules/newTaskModal'

  export default {
    name: "functionPermitModal",
    mixins: [JeecgListMixin],
    components: {
      BusFunctionPermitModal,
      BusFunctionCatModal,
      newTaskModal
    },
    data() {
      return {
        visibleDel:false,
        showFunPer: false,
        ibusId: '',
        title:'新增',
        sname: '',
        param: {
          sDisplay: '',
          sPermitType:'',
          iBusId:''
        },
        description: '业务类型管理页面',
        // 表头
        showFunPer: false,
        columns: [
          {
            title: '业务功能',
            align: "center",
            dataIndex: 'busFunctionName'
          },
          {
            title: '权限类型',
            align: "center",
            dataIndex: 'spermitType',
            customRender: function (text) {
              if (text == 1) {
                return "角色";
              } else if (text == 2) {
                return "部门";
              } else if (text == 3) {
                return "人员";
              } else if (text == 0) {
                return "所有人";
              } else {
                return text;
              }
            }
          },
          {
            title: '权限数据名称',
            align: "center",
            dataIndex: 'itypeName',
            customRender:function (text,record,index) {
               if(record.parentName){
                 return record.parentName + '-'+text;
               }else{
                 return text;
               }
            }
          },
          {
            title: '是否可见',
            align: "center",
            dataIndex: 'sdisplay',
            customRender: function (text) {
              if (text == '1') {
                return "是";
              } else if (text == "0") {
                return "否";
              } else {
                return text;
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
        ipagination:{
          total:'',
          current:''
        },
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
          current:''
        },
        url: {
          list: "/oaBus/busFunctionPermit/list",
          SList: "/oaBus/busFunctionPermit/findAllList",
          delete: "/oaBus/busFunctionPermit/delete",
          deleteBatch: "/oaBus/busFunctionPermit/deleteBatch",
          exportXlsUrl: "oaBus/busFunctionPermit/exportXls",
          importExcelUrl: "oaBus/busFunctionPermit/importExcel",
        },
        showFunPer: false,
        data: [],
        iid:'',
      }
    },
    created() {

    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
      addDisabled(){
        // data[0].spermitType==0?true:false
        if(this.data.length>0){
          if(this.data[0].spermitType==0){
            return true ;
          }else{
            return false;
          }

        }else{
          return false;
        }



      },
    },

    methods: {

      // 批量删除  获取id  组
      onSelectChange(selectedRowKeys){

        this.selectedRowKeys = selectedRowKeys
        this.iid = selectedRowKeys.toString()
      },
      //批量删除操作
      batchDel(){
        this.visibleDel = true;


      },
      //确认删除模态框
      comfirmDelOrBatchDel(){
        if(this.iid.length>1){
          deleteAction(this.url.deleteBatch, {ids: this.selectedRowKeys.toString()}).then((res) => {
            if(res.success){
              this.getissubmit();
              this.visibleDel = false;

            }

          })
        }else{
          deleteAction(this.url.delete,{id:this.iid}).then((res) => {
            console.log(res.success);
            //--------------删除成功后   刷新列表-----------------
            if(res.success){
              this.getissubmit();
              this.visibleDel = false;

            }

          })
        }


      },
      //确定删除的取消按钮
      handleCancel(){
        this.visibleDel = false;
      },
      //---------删除功能---------------------------
      handleDelete(iid) {
        this.visibleDel = true;
        this.iid = iid; //   单元删除id


      },
      handleTableChange(q,w,e,){
        console.log(q.current);
        this.ipagination.current = q.current;
        getAction(this.url.list, {pageNo:q.current,ibusId: this.ibusId}).then((res) => {
          this.dataSource = res.result.records;
          this.ipagination.total =  res.result.total;
        })
      },
      //----------------确定子组件已经提交，若提交则刷新表格-------------------
      getissubmit(issubmit){
        console.log(issubmit)
        console.log(this.ibusId);
        getAction(this.url.list, {ibusId: this.ibusId}).then((res) => {
          this.data = res.result.records;
          this.ipagination.total =  res.result.total;

        })
      },
      change1(a) {
        this.param.sDisplay = a
      },
      search(record) {
        this.param.iBusId = this.ibusId;
        getAction(this.url.SList, this.param).then((res) => {
          this.data = res.result.records;
        })
      },
      change2(a) {
        this.param.sPermitType = a
      },
      add() {
        this.$refs.modalForm.add1(this.ibusId,this.sname,this.data)
      },
      edit(record) {
        this.$refs.modalForm.edit1(record,{edit:true});

      },

      //权限配置 事件  busid传入
      mo(record) {
        this.ibusId = record.iid
        this.sname = record.sname
        this.title = "拟稿权限"
        this.showFunPer = true;
        getAction(this.url.list, {ibusId: this.ibusId}).then((res) => {
          this.data = res.result.records;
          this.ipagination.total =  res.result.total;
        })
      },
      handleOk() {
        this.showFunPer = false;
      },
      handleCancle() {
        this.showFunPer = false;
      },

      handleCat(record) {
        this.$refs.catModalForm.showCat(record);
        this.$refs.catModalForm.title = "查看";
        this.$refs.catModalForm.disableSubmit = false;
      },
      show(record) {
        putAction(this.url.editCementSend, {anntId: record.anntId}).then((res) => {
          if (res.success) {
            this.loadData();
          }
        });
        this.$refs.ShowAnnouncement.detail(record);
      }

    }
  }
</script>
<style  lang="less" scoped>
  .findChild{
    /deep/.ant-card-body{
      padding: 0
    }
  }
</style>
