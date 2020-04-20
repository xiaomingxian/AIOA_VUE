<template>
  <a-modal :visible="showFunPer"  :title="title" :width="900" @ok="handleOk" @cancel="handleCancle">

  <a-card class="findChild" :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="add"  :disabled="addDisabled" type="primary" icon="plus">新增</a-button>
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
        :dataSource="data"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >

        <span slot="action" slot-scope="text, record">
          <a @click="edit(record)">编辑</a>
           <a-divider type="vertical" />
          <a @click="handleDelete(record.iid)">删除</a>
           <!--<a-divider type="vertical"/>
            <a @click="handleCat(record)">查看</a>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!--模态框-->
    <a-modal
      title="温馨提示"
      :visible="visibleDel"
      @ok="comfirmDelOrBatchDel"
      @cancel="handleCancel"
    >
      <p>请确认是否要删除该条数据</p>
    </a-modal>
    <!--编辑-->
    <busModelPermit-modal ref="modalForm"  @submit="getissubmit($event)" @ok="modalFormOk" ></busModelPermit-modal>
    <!--查看-->
    <bus-model-cat-modal ref="catModalFrom"></bus-model-cat-modal>

    <new-task-modal ref="newTaskModel" @ok="modalFormOk"></new-task-modal>
  </a-card>
  </a-modal>
</template>

<script>
  import BusModelCatModal from "./BusModelCatModal"
  import BusModelPermitModal from './BusModelPermitModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction,deleteAction,putAction} from '@/api/manage'
  import newTaskModal  from '../../mytask/modules/newTaskModal'


  export default {
    name: "BusModelPermitList",
    mixins:[JeecgListMixin],
    components: {
      BusModelPermitModal,
      BusModelCatModal,
      newTaskModal
    },
    data () {
      return {
        loading:true,
        visibleDel:false,
        selectedRowKeys:[],// 批量删除数组
        ibusmodelId: '',
        title:'新增',
        sname: '',
        data:[


        ],
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
        param: {
          sDisplay: '',
          sPermitType:'',
          iBusModelId:''
        },
        description: '业务模板管理页面',
        // 表头
        columns: [
		   {
            title: '业务模块',
            align:"center",
            dataIndex: 'busModelName'
           },
		   {
            title: '权限类型',
            align:"center",
            dataIndex: 'spermitType',
            customRender: function (text) {
           if (text == 1) {
             return "角色";
           } else if (text == 2) {
             return "部门";
           } else if (text == 3) {
             return "人员";
           } else if(text==0){
             return "所有人";
           }else {
             return text;
           }
         }
           },
		   // {
       //      title: '权限数据名称',
       //      align:"center",
       //      dataIndex: 'itypeName',
       //     customRender:function (text,record,index) {
       //     if(record.parentName){
       //       return record.parentName + '-'+text;
       //     }else{
       //       return text;
       //     }
       //   }
       //     },
		   {
            title: '是否可见',
            align:"center",
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
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/oaBus/busModelPermit/pagelist",
          AllList: "/oaBus/busModelPermit/findAllList",
          delete: "/oaBus/busModelPermit/delete",
          deleteBatch: "/oaBus/busModelPermit/deleteBatch",
          exportXlsUrl: "oaBus/busModelPermit/exportXls",
          importExcelUrl: "oaBus/busModelPermit/importExcel",

       },
        showFunPer:false,

    }
  },
  computed: {
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
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
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
      //确定删除的取消按钮
      handleCancel(){
        this.visibleDel = false;
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
      //---------删除功能---------------------------
      handleDelete(iid) {
        this.visibleDel = true;
        this.iid = iid; //   单元删除id


      },
      //----------------确定子组件已经提交，若提交则刷新表格-------------------
      getissubmit(issubmit){
        getAction(this.url.list, {ibusmodelId: this.ibusModelId}).then((res) => {
          this.data = res.result.records;

        })
      },
      change1(a) {
        this.param.sDisplay = a
      },
      search(record) {
        this.param.iBusModelId = this.ibusModelId;
        getAction(this.url.AllList, this.param).then((res) => {
          this.data = res.result.records;
        })
      },
      change2(a) {
        this.param.sPermitType = a
      },
      add() {
        this.$refs.modalForm.add1(this.ibusModelId, this.sname,this.data)
      },
      edit(record) {
        this.$refs.modalForm.update(record,{edit:true});

      },
      show(record) {

        this.showFunPer = true;
        this.ibusModelId = record.iid
        this.sname = record.sname
        this.title = "拟稿权限"
        getAction(this.url.list,{ibusmodelId:this.ibusModelId}).then((res)=>{
          this.data=res.result.records;
        })
      },
      handleOk(){
        this.showFunPer = false ;

      },
      handleCancle () {
        this.showFunPer = false;

      },

      handleCat(record) {
        this.$refs.catModalFrom.showCat2(record);
        this.$refs.catModalFrom.title = "查看";
        this.$refs.catModalFrom.disableSubmit = false;
      },
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
