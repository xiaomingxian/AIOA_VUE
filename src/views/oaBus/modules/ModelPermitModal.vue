<template>
  <a-modal :visible="showFunPer"  :title="title" :width="1200" @ok="handleOk" @cancel="handleCancle">

  <a-card :bordered="false">
   <!-- &lt;!&ndash; 查询区域 &ndash;&gt;
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
        <template v-if="toggleSearchStatus">

          <a-col :md="6" :sm="8">
            <a-form-item label="业务模块id">
              <a-input placeholder="模块id" v-model="ibusModelId" v-decorator="[ 'ibusmodelId', {}]" ></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="是否可见">
              <a-select
                @change="change1"
                v-decorator="[ 'sDisplay', {}]"
                placeholder="是否可见"
                :disabled="disableSubmit">
                <a-select-option value="0">否</a-select-option>
                <a-select-option value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="范围类型">
              <a-select
                @change="change2"
                v-decorator="[ 'sPermitType', {}]"
                placeholder="范围类型"
                :disabled="disableSubmit">
                <a-select-option value="0">所有人</a-select-option>
                <a-select-option value="1">角色</a-select-option>
                <a-select-option value="2">部门</a-select-option>
                <a-select-option value="3">人员</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          </template>
          <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="search(record)" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>-->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="add"  :disabled="addDisabled" type="primary" icon="plus">新增</a-button>
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
  </a-card>
  </a-modal>
</template>

<script>
  import BusModelCatModal from "./BusModelCatModal"
  import BusModelPermitModal from './BusModelPermitModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction,deleteAction,putAction} from '@/api/manage'


  export default {
    name: "BusModelPermitList",
    mixins:[JeecgListMixin],
    components: {
      BusModelPermitModal,
      BusModelCatModal
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
		   {
            title: '权限数据名称',
            align:"center",
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
        this.title = "权限配置"
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