<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="业务模板名称">
              <a-input placeholder="请输入业务模板名称" v-model="queryParam.spageName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="模板分类">
              <!--<a-input placeholder="请输入模板分类" v-model="queryParam.ipapeType"></a-input>-->
              <a-select placeholder="请选择模板分类" v-model="queryParam.iPapeType" v-decorator="['iPapeType', {}]">
                <a-select-option  v-for="(item,index) in dbtable" :key="index" :value="item.value" >{{item.text}}</a-select-option>
              </a-select>
            </a-form-item>

          </a-col>

          <template v-if="toggleSearchStatus">

          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('业务页面表')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      `<a-dropdown v-if="selectedRowKeys.length > 0">
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
    </div>

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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
          <a @click="handleDefModel(record)">定义含义</a>
          <a-divider type="vertical"/>
          <a @click="showPicture(record)">预览图片</a>
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
    <busPage-modal ref="modalForm" @ok="modalFormOk"></busPage-modal>
    <bus-page-templete-def ref="busPageTempleteDef" />
    <page-picture ref="pagePicture"></page-picture>
  </a-card>

</template>

<script>
  import {httpAction,getAction} from '@/api/manage'
  import BusPageModal from './modules/BusPageModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import BusPageTempleteDef from "./BusPageTempleteDef";
  import PagePicture from "./pageModels/pagePicture";

  export default {
    name: "BusPageList",
    mixins: [JeecgListMixin],
    components: {
      PagePicture,
      BusPageTempleteDef,
      BusPageModal,
    },
    data() {
      return {
        description: '业务页面表管理页面',
        iisFontSize: '16px',
        // 表头
        dbtable:'',
        columns: [
          {
            title: '序号',
            align: "center",
            dataIndex: 'iid'
          },
          {
            title: '业务模板名称',
            align: "center",
            dataIndex: 'spageName'
          },
          {
            title: '详情页面路径',    //详情页面路径（项目文件存放目录）
            align: "center",
            width: "20%" ,
            dataIndex: 'spagePath'
          },

          {
            title: '概要',
            align: "left",
            width: "50%" ,
            dataIndex: 'spageRemarks'
          },

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
    mounted(){
      console.log('sssssssssssssss'+this.$refs.table)
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },

    },
    created(){
      this.iPapeType();
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
      //按展图片
      showPicture(record){
        this.$refs.pagePicture.show(record.iid);
      },
      iPapeType(){
        getAction(this.url.getDbtable).then(res => {
          this.dbtable = res.result ;
        }) ;

      },
      //定义含义的方法，弹出一个页面，定义数据
      handleDefModel(rec){
        this.$refs.busPageTempleteDef.show(rec)
      },
      handleAdd: function () {
        this.$refs.modalForm.add(this.dbtable);
        this.$refs.modalForm.title = "新增";
        this.$refs.modalForm.disableSubmit = false;
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>