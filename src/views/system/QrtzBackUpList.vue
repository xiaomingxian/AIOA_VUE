<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="数据类型">
              <!--<a-input  placeholder="请输入任务类名" v-model="queryParam.iBackType"></a-input>-->
              <a-radio-group v-model="queryParam.iBackType">
                <a-radio-button value="1">数据库</a-radio-button>
                <a-radio-button value="2">附件</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="8">
            <a-form-item label="起止时间">
              <a-range-picker
                v-model="defaultTime"
                :showTime="{format:'HH:mm'}"
                format="YYYY-MM-DD"
                :placeholder="['开始时间','结束时间']"
                @change="selectTime"
                @ok="confirmTime"
              />
              <a-input v-show="false" v-model="queryParam.dStartTime"></a-input>
              <a-input v-show="false" v-model="queryParam.dEndTime"></a-input>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">
          </template>
          <a-col :md="2" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
<!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
<!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
<!--              </a>-->
              <!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
              <!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
<!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
<!--      <a-button style="margin-left: 10px;" type="primary" icon="download" @click="handleExportXls('备份情况')">导出</a-button>-->
<!--      <a-upload style="margin-left: 10px;" name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"-->
<!--                :action="importExcelUrl"-->
<!--                @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->
      <!--      <a-button style="margin-left: 10px;" type="primary" icon="download" @click="handleExportXls('备份情况')">导出</a-button>-->
      <!--      <a-upload style="margin-left: 10px;" name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"-->
      <!--                :action="importExcelUrl"-->
      <!--                @change="handleImportExcel">-->
      <!--        <a-button type="primary" icon="import">导入</a-button>-->
      <!--      </a-upload>-->
<!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
<!--        <a-menu slot="overlay">-->
<!--          <a-menu-item key="1" @click="batchDel">-->
<!--            <a-icon type="delete"/>-->
<!--            删除-->
<!--          </a-menu-item>-->
<!--        </a-menu>-->
<!--        <a-button style="margin-left: 8px"> 批量操作-->
<!--          <a-icon type="down"/>-->
<!--        </a-button>-->
<!--      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
<!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{-->
<!--        selectedRowKeys.length }}</a>项-->
<!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--      </div>-->

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
<!--        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <!--<qrtzBackUp-modal ref="modalForm" @ok="modalFormOk"></qrtzBackUp-modal>-->
  </a-card>
</template>

<script>
  // import QrtzBackUpModal from './modules/QrtzBackUpModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin2'
  import { getAction } from '@/api/manage'

  export default {
    name: "QrtzBackUpList",
    mixins: [JeecgListMixin],
    components: {
      // QrtzBackUpModal
    },
    data() {
      return {
        description: '备份情况管理页面',
        iisFontSize: '16px',
        defaultTime:'',
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '备份日期',
            align: "center",
            dataIndex: 'dCreateDay',
            width: 100,
          },
          {
            title: '数据类型',
            align: "center",
            dataIndex: 'ibackType',
            width: 100,
            customRender: function (text) {
              if (text == 1) {
                return "数据库"
              } else if (text == 2) {
                return "附件"
              }
            }
          },
          {
            title: '文件名称',
            align: "center",
            dataIndex: 'sname',
            width: 100,
          },
          {
            title: '存储位置',
            align: "center",
            dataIndex: 'sbackPath',
            width: 100,
          },
          {
            title: '文件大小',
            align: "center",
            dataIndex: 'sfileSize',
            width: 100,
          },
          // {
          //   title: '开始时间',
          //   align: "center",
          //   dataIndex: 'dStartTime',
          //   width: 100,
          //   customRender: (text) => {
          //     text = this.dateFormat(text);
          //     return text;
          //   }
          // },
          // {
          //   title: '结束时间',
          //   align: "center",
          //   dataIndex: 'dEndTime',
          //   width: 100,
          //   customRender: (text) => {
          //     text = this.dateFormat(text);
          //     return text;
          //   }
          // }
          // {
          //   title: '操作',
          //   dataIndex: 'action',
          //   align: "center",
          //   scopedSlots: {customRender: 'action'},
          // }
        ],
        url: {
          list: "/system/qrtzBackUp/list",
          delete: "/system/qrtzBackUp/delete",
          deleteBatch: "/system/qrtzBackUp/deleteBatch",
          exportXlsUrl: "system/qrtzBackUp/exportXls",
          importExcelUrl: "system/qrtzBackUp/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
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
      searchReset(){
        var that = this;
        that.queryParam = {}; //清空查询区域参数
        this.defaultTime =''
        that.loadData(1);
      },
      //----------------时间变化检测---------------
      selectTime(e,d) {
      },
      //----------------确定时间---------------
      confirmTime(e) {
        // 此处确定时间为  单项选择开始、单项结束时间、双向时间段选择提供服务   判断 this.searchTypeVal  确定是那种状态
        if (this.searchTypeVal === 2 || this.searchTypeVal === 3) {
          console.log(e._d);
          this.defaultTime = this.dateFormat(e._d);
        } else {
          // 时间段选择    为时间段的开始和结束时间赋值
          console.log(e);
          this.defaultTime = e;
          this.queryParam.dStartTime = this.dateFormat( this.defaultTime[0]._d);
          this.queryParam.dEndTime = this.dateFormat( this.defaultTime[1]._d);
        }
        // this.dateFormat(e._d);
        // console.log(this.dateFormat(e._d));

      },
      dateFormat(date) {
        let date1 = new Date(date);
        let Y = date1.getFullYear();
        let M = date1.getMonth() + 1;
        let D = date1.getDate();
        let newTime = Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + date1.toTimeString().substr(0, 8);
        return newTime;
      }
    }
  }
</script>
<style scoped lang="less">
  /*@import '~@assets/less/common.less'*/
</style>
