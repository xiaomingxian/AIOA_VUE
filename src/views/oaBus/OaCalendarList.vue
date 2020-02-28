<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
         <a-col :md="6" :sm="8">
            <a-form-item label="选择日程">
              <a-select v-model="serchSubData.richengName" style="width: 170px" @change="getSearchType">
                <a-select-option value="0">全部日程</a-select-option>
                <a-select-option value="1">我的日程</a-select-option>
                <a-select-option value="2">领导日程</a-select-option>
                <a-select-option value="3">共享日程</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="日程内容">
              <a-input placeholder="请输入日程内容" v-model="serchSubData.sTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="4">
            <a-form-item label="时段选择">
              <a-range-picker
                style="width: 250px"
                :showTime="{format:'HH:mm'}"
                format="YYYY-MM-DD HH:mm"
                :placeholder="['开始时间','结束时间']"
                @change="selectTime" @ok="confirmTime"
              />
            </a-form-item>
          </a-col>
          <a-col :md="2" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset1" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button style="margin-left: 10px;" type="primary" icon="download" @click="handleExportXls('日程管理表')">导出</a-button>
      <a-upload style="margin-left: 10px;" name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
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
        class="pointer"
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        :customRow="doTask"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
      >

        <span slot="action" slot-scope="text,record">
          <a @click.stop="handleEdit1(record,1)">编辑</a>
          <a-divider type="vertical" />
           <a @click.stop="handleDelete1(record.iid,record.screateBy)">删除</a>
        </span>


        <!-- 字符串超长截取省略号显示 -->
        <span slot="url" slot-scope="text">
          <j-ellipsis :value="text" :length="25"/>
        </span>
        <!-- 字符串超长截取省略号显示-->
        <span slot="suserNames" slot-scope="text">
          <j-ellipsis :value="text"/>
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
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <oaCalendar-modal ref="modalForm" @myrichenClose="myrichenClose" @ok="modalFormOk"></oaCalendar-modal>
    <oa-calendar-cat-modal ref="modalCatForm"  @ok="modalFormOk"></oa-calendar-cat-modal>
  </a-card>
</template>

<script>
  import oaCalendarModal from './modules/oaCalendarModal'
  import oaCalendarCatModal from './modules/oaCalendarCatModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction,getAction,postAction,deleteAction} from '@/api/manage'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import PermissionDataRuleList from "../system/PermissionDataRuleList";
  import PermissionModal from "../system/modules/PermissionModal";


  export default {
    name: "oaCalendarList",
    mixins:[JeecgListMixin],
    components: {
      oaCalendarModal,
      oaCalendarCatModal,
      JEllipsis

    },
    inject:['reload'],
    data () {
      return {
        description: '日程管理表管理页面',
        iisFontSize: '16px',
        serchSubData:{
          richengName:'1',
          sTitle:'',
          startTime:'',
          endTime:''
        },
        visibleDel:false,
        selectedRowKeys:[],
        selectionRows: [],
        sCreateBys:'',//创建者拼接
        iids:'',//创建者id拼接
        userNames:[],//  创建者数组
        username:'',// 用户名称  登录者名称
        pagination:{
          total:'',
          showTotal:total=>`共计${total}条`,
          showSizeChanger:false,
          showQuickJumper:false
        },
        dataSource11:[],
        // 表头
        columns: [
          {
            title: '日程内容',
            align:"left",
            dataIndex: 'stitle'
          },
          {
            title: '对象',
            align:"left",
            dataIndex: 'suserNames',
            scopedSlots: { customRender: 'suserNames' },

            key: 'suserNames',
            customRender: function (text) {
              console.log(typeof text)
              if(text.length>20){
                console.log(text)
                return text.substring(0, 15) + '...'
              }else{
                return text;
              }
            }
          },
          {
            title: '地点',
            align:"center",
            width:100,
            dataIndex: 'saddress',
          },
          {
            title: '日程类型',
            align:"center",
            width:100,
            dataIndex: 'iopenType',
            width:100,
            customRender: function (text) {
              if (text == 1) {
                return "全行";
              } else if (text == 2) {
                return "分管";
              } else if (text == 3) {
                return "部门内";
              }else if (text == 0) {
                return "自己查看";
              }
            }

          },
          {
            title: '开始时间',
            align:"center",
            width:100,
            dataIndex: 'dStartTime',
            customRender: function (text) {
              return text.substring(0,10);
            }
          },
          {
            title: '结束时间',
            align:"center",
            width:100,
            dataIndex: 'dEndTime',
            customRender: function (text) {
              return text.substring(0,10);
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:100,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list:'/oaBus/Calendar/oaCalendar/list',
          findByLeader:'/oaBus/Calendar/oaCalendar/findByLeader',
          findById:'/oaBus/Calendar/oaCalendar/queryById',
          queryPageList:'/oaBus/Calendar/oaCalendar/queryPageList',
          delete: "/oaBus/Calendar/oaCalendar/delete",
          deleteBatch: "/oaBus/Calendar/oaCalendar/deleteBatch",
          exportXlsUrl: "oaBus/Calendar/oaCalendar/exportXls",
          importExcelUrl: "oaBus/Calendar/oaCalendar/importExcel",
        },
      }
    },

    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created(){
      const  userinfo =JSON.parse( localStorage.getItem('userdata')).userInfo;
      this.username = userinfo.username;

      this.searchQuery();
    /*  this.myListsFuc();*/
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
      myrichenClose(e){
        this.reload();
      },
      getSearchType(e){
        console.log(e);
        this.serchSubData.richengName = e;


      },
      //----------------时间变化检测---------------
      selectTime(e,t){
        console.log(e);
        console.log(t);
        this.serchSubData.startTime = t[0];
        this.serchSubData.endTime = t[1];
      },

      confirmTime(e){
        console.log(e);
      },
      //  我的日程  or 全部日程    全部日程与我的日程区分   全部日程不穿username
      myListsFuc(){

        getAction(this.url.list,{more:1}).then((res) => {
          console.log(res);
          this.dataSource = res.result.records;
          this.pagination.total = res.result.total

        });
      },

      // 重置
      searchReset1(){
        this.searchQuery(this.serchSubData.richengName==1)
      },
      handleEdit1(record){
        getAction(this.url.findById,{id:record.iid }).then((res) => {
          console.log(res);
          this.$refs.modalForm.update(res.result);

        });
        this.searchQuery();
      },
      //---------删除功能---------------------------
      handleDelete1(iid,screateBy) {
        this.visibleDel = true;
        this.iid = iid; //   单元删除id
        this.screateBy =screateBy;

      },
      comfirmDelOrBatchDel(){
        deleteAction(this.url.delete,{id:this.iid,sCreateBy:this.screateBy }).then((res) => {
          console.log(res);
          if(res.success){
          }else{
            this.$message.warning(res.message);
          }
        });

        this.visibleDel = false;
        this.searchQuery(this.serchSubData.richengName);

      },
    handleCancel(){
    this.visibleDel = false;
     },
      doTask(record, index) {
        return {
          on: {
            click: (event) => {
              getAction(this.url.findById,{id:record.iid }).then((res) => {
                console.log(res);
                this.$refs.modalCatForm.dayAnnalysis1(res.result);

              });
            }
          }
        }

      },
      // 开始查询
      searchQuery(){
        if(this.serchSubData.richengName==0){
          //全部日程
          getAction(this.url.list,{pageNo:1,pageSize:10,more:1,sTitle:this.serchSubData.sTitle,Strdate: this.serchSubData.startTime,Enddate:this.serchSubData.endTime }).then((res) => {
            console.log(res);
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total

          });


        }else if(this.serchSubData.richengName==1){
          //  我的日程
          getAction(this.url.list,{username:this.username,pageNo:1,pageSize:10,more:1,sTitle:this.serchSubData.sTitle,Strdate: this.serchSubData.startTime, Enddate :this.serchSubData.endTime}).then((res) => {
            console.log(res);
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total

          });
          }else if(this.serchSubData.richengName==2){
          //领导日程
          getAction(this.url.findByLeader,{pageNo:1,pageSize:10,more:1,sTitle:this.serchSubData.sTitle,Strdate: this.serchSubData.startTime, Enddate :this.serchSubData.endTime}).then((res) => {
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total

          });
        }else if(this.serchSubData.richengName==3){
          getAction(this.url.queryPageList,{pageNo:1,pageSize:10,more:1,sTitle:this.serchSubData.sTitle,Strdate: this.serchSubData.startTime, Enddate :this.serchSubData.endTime}).then((res) => {
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total
          });
        }
      },

      //单项删除
      handleDelete(e,n){
        console.log(e);
        console.log(n);
        deleteAction(this.url.delete, {id: e,sCreateBy:n}).then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.myListsFuc();
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      //获取批量ids
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
        // var sCreateBy = "";
        var iids = [];
        var userNames = [];
        for (var a = 0; a < this.selectionRows.length; a++) {
          // sCreateBy += this.selectionRows[a].screateBy + ",";
          iids.push(this.selectionRows[a].iid);
          userNames.push(this.selectionRows[a].screateBy )
        }
        // this.sCreateBys = sCreateBy;
        this.iids = iids;

        console.log( this.iids);
        this.userNames = userNames;

        // 批量删除时  只能删除自己的创建的日程  若用户选择非自己创建的日程时  做以提示
        // let name = 'admin';
        userNames.map((item)=>{
          if(this.username!=item){
            this.selectedRowKeys.pop();
            this.iids.pop();
           this.$message.error('您没有权限删除其他人的日程')
          }
        })
        console.log( this.iids);
      },
      // 批量删除操作
      batchDel(){

        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk:(()=>{

            deleteAction(this.url.deleteBatch, {ids:this.iids.toString() }).then((res) => {
              if (res.success) {
                this.$message.success(res.message);
                this.myListsFuc();
                this.selectedRowKeys = []
              } else {
                this.$message.warning(res.message);
                this.selectedRowKeys = []

              }
            });
          })
        });
      },
      //分页切换
      handleTableChange(pagination){
        console.log(pagination);
        const pager = {...this.pagination};
        pager.current = pagination.current;
        this.pagination = pager;
        console.log(pager);
       if(this.serchSubData.richengName==0){
          //全部日程
          getAction(this.url.list,{pageNo:this.pagination.current,pageSize:10,more:1}).then((res) => {
            console.log(res);
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total

          });
        }else if(this.serchSubData.richengName==1){
          //  我的日程
          getAction(this.url.list,{username:this.username,pageNo:this.pagination.current,pageSize:10,more:1}).then((res) => {
            console.log(res);
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total

          });
       }else if(this.serchSubData.richengName==2){
          //领导日程
          getAction(this.url.findByLeader,{pageNo:this.pagination.current,pageSize:10,more:1}).then((res) => {
            console.log(res);
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total

          });
        }else{
          getAction(this.url.queryPageList,{pageNo:this.pagination.current,pageSize:10,more:1}).then((res) => {
            console.log(res);
            this.dataSource = res.result.records;
            this.pagination.total = res.result.total
            console.log(this.total);
          });

      }
    }
    }
  }
</script>
<style scoped>
  .pointer:hover{
    cursor: pointer;
  }
</style>