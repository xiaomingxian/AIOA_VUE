<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="6">
            <a-form-item label="所属机构">
              <!--<a-input placeholder="" v-model="queryParam.ibusModelId"></a-input>-->
              <a-select v-model="queryParam.iBusUnitId" @change="getUnitVal">
                <a-select-option v-for="(item,index) in unitData" :key="index" :value="item.id">{{item.departName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
          <a-form-item label="业务分类">
            <!--<a-input placeholder="" v-model="queryParam.ibusModelId"></a-input>-->
            <a-select v-model="queryParam.iBusModelId" @change="getModelValue">
              <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="业务名称">
              <!--<a-input placeholder="" v-model="queryParam.iBusFunctionId"></a-input>-->
              <a-select v-model="queryParam.iBusFunctionId" @change="getFunctionId">
                <a-select-option v-for="(item,index) in functionList" :key="index" :value="item.iid">{{item.sname}}
                </a-select-option>
              </a-select>
              <!--<a-input v-else placeholder="暂无匹配业务"></a-input>-->
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="文号名称">
              <a-input placeholder="" v-model="queryParam.sName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
<!--      <a-button type="primary" icon="download" @click="handleExportXls('文号配置')">导出</a-button>-->
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"-->
<!--                @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->
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
          <a @click="handleCat(record)">查看</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="handleCopy(record)">复制文号</a>
          <a-divider type="vertical"/>
          <a @click="docNumExportXls(record)">导出文件目录</a>
          <a-divider type="vertical"/>
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
            <a>删除</a>
           </a-popconfirm>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <docNumSet-modal ref="modalForm" @ok="modalFormOk"></docNumSet-modal>
    <docNumCopy-modal ref="copyModalForm" @ok="modalFormOk"></docNumCopy-modal>
    <docNumCat-modal ref="catModalForm" @ok="modalFormOk"></docNumCat-modal>
  </a-card>
</template>

<script>
  import DocNumSetModal from './modules/DocNumSetModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import DocNumCopyModal from './modules/DocNumCopyModal'
  import DocNumCatModal from './modules/DocNumCatModal'
  import {httpAction, getAction, downFile, postAction} from '@/api/manage'

  export default {
    name: "DocNumSetList",
    mixins: [JeecgListMixin],
    components: {
      DocNumSetModal,
      DocNumCopyModal,
      DocNumCatModal
    },
    data() {
      return {
        description: '文号配置管理页面',
        iisFontSize: '16px',
        // 表头
        columns: [
          {
            title: '编号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '业务分类',
            align: "center",
            dataIndex: 'mname'
          },
          {
            title: '所属机构',
            align: "center",
            dataIndex: 'uname'
          },
          {
            title: '业务名称',
            align: "center",
            dataIndex: 'fname'
          },
          {
            title: '文号名称',
            align: "center",
            dataIndex: 'sname'
          },
          {
            title: '当前文号',
            align: "center",
            dataIndex: 'idocNum'
          },
          {
            title: '文号规则',
            align: "center",
            dataIndex: 'sdocRule'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/papertitle/docNumSet/list",
          delete: "/papertitle/docNumSet/delete",
          deleteBatch: "/papertitle/docNumSet/deleteBatch",
          exportXlsUrl: "papertitle/docNumSet/exportXls",
          importExcelUrl: "papertitle/docNumSet/importExcel",
        },
        selectedModel: null,
        selectedFunction: null,
        selectedUnit:null,
        modelData: [],
        unitData:[],
        functionList: [],
        functionData: [],
        queryParam: {
          iBusModelId: '',
          iBusFunctionId: '',
          sName: ''
        }

      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created() {
      this.getModelList();
      this.getUnitList();
      this.setFontSize();
    },
    methods: {
      setFontSize() {
        const userid = JSON.parse(localStorage.getItem('userdata')).userInfo.id;
        let url = "/testt/sysUserSet/queryByUserId";
        getAction(url, {userId: userid}).then((res) => {
          if (res.result.iisFontSize == 1) {
            this.iisFontSize = '18px';
          } else if (res.result.iisFontSize == 3) {
            this.iisFontSize = '14px';
          } else {
            this.iisFontSize = '16px';
          }
          document.getElementsByClassName('ant-table')[0].style.fontSize = this.iisFontSize;
        })
      },
      //所属模块
      getModelList() {
        let url = "/papertitle/docNumSet/busModelList";
        getAction(url).then((res) => {
          this.modelData = res.result;
        })
      },
      //查询机构
      getUnitList(){
        let url ='/sys/sysDepart/query';
        getAction(url,{orgType:'1'}).then(res=>{
          this.unitData = res.result;
          // this.queryParam.iBusUnitId = this.unitData[0].id
        })
      },
      //所属业务
      getModelValue(model) {
        this.queryParam.iBusFunctionId = null
        let url = "/papertitle/docNumSet/busFunctionList";
        getAction(url,{iBusModelId:model,iBusUnitId:this.queryParam.iBusUnitId}).then((res) => {
          this.functionList = res.result;
        })
      },
      //选择机构--》更新查业务
      getUnitVal(unit){
        let url = "/papertitle/docNumSet/busFunctionList";
        this.queryParam.iBusFunctionId = null;
        getAction(url,{iBusModelId:this.queryParam.iBusModelId,iBusUnitId:unit}).then((res) => {
          this.functionList = res.result;
        })
      },
      //所属业务赋值
      getFunctionId(value) {
        this.queryParam.iBusFunctionId = value;
      },
      //重置
      searchReset() {
        this.queryParam.iBusModelId = "";
        this.queryParam.iBusFunctionId = "";
        // this.queryParam.iBusUnitId = this.unitData[0].id;
        this.queryParam.iBusUnitId = "";
        this.functionList=[];
        this.queryParam.sName = "";
        this.loadData(1);
      },
      handleCopy: function (record) {
        this.$refs.copyModalForm.add(record);
        this.$refs.copyModalForm.title = "复制文号";
        this.$refs.copyModalForm.disableSubmit = false;
      },
      handleCat: function (record) {
        this.$refs.catModalForm.add(record);
        this.$refs.catModalForm.title = "查看";
        this.$refs.catModalForm.disableSubmit = false;
      },
      docNumExportXls(record) {
        const fileName = record.fname + "-" + record.sname + new Date().getTime()
        downFile("/papertitle/docNumSet/docNumExportXls", {
          iid: record.iid,
          s_create_by: record.screateBy
        }).then((data) => {
          if (data.type === "application/json") {
            this.$message.error("暂无数据！")
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        })
      },
    }
  }
</script>
<style scoped>

</style>