<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">


          <a-col :md="6" :sm="8">
            <a-form-item label="业务模块">
              <a-select v-model="selectedModel" v-decorator="[ 'ibusModelId', {}]">
                <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="业务功能">
                <a-select v-model="selectedFunction" v-decorator="[ 'ibusFunctionId', {}]">
                  <a-select-option v-for="(item,index) in functionData" :key="index" :value="item.iid">{{item.sname}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="是否可见">
                <a-select
                  v-decorator="[ 'spermitType', {}]"
                  placeholder="是否可见"
                  :disabled="disableSubmit">
                  <a-select-option value="0">否</a-select-option>
                  <a-select-option value="1">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">-->
                <!--{{ toggleSearchStatus ? '收起' : '展开' }}-->
                <!--<a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--</a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--<a-menu slot="overlay">-->
          <!--<a-menu-item key="1" @click="batchDel">-->
            <!--<a-icon type="delete"/>-->
            <!--删除-->
          <!--</a-menu-item>-->
        <!--</a-menu>-->
        <!--<a-button style="margin-left: 8px"> 批量操作-->
          <!--<a-icon type="down"/>-->
        <!--</a-button>-->
      <!--</a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
        <!--<i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{-->
        <!--selectedRowKeys.length }}</a>项-->
        <!--<a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
      <!--</div>-->

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
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a @click="show(record)">查看</a>
          <a-divider type="vertical"/>
          <a @click="handleDelete(record.id)">删除</a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <busFunctionPermit-modal ref="modalForm" @ok="modalFormOk"></busFunctionPermit-modal>
  </a-card>
</template>

<script>
  import BusFunctionPermitModal from './modules/BusFunctionPermitModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {getAction,putAction} from '@/api/manage'

  export default {
    name: "BusFunctionPermitList",
    mixins: [JeecgListMixin],
    components: {
      BusFunctionPermitModal
    },
    data() {
      return {
        description: '业务类型管理页面',
        // 表头
        columns: [
          {
            title: '业务模板',
            align: "center",
            dataIndex: 'modelName'
          },
          {
            title: '业务功能',
            align: "center",
            dataIndex: 'functionName'
          },
          {
            title: '范围类型',
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
            title: '类型名称',
            align: "center",
            dataIndex: 'itypeId',

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
        url: {
          list: "/oaBus/busFunctionPermit/list",
          delete: "/oaBus/busFunctionPermit/delete",
          deleteBatch: "/oaBus/busFunctionPermit/deleteBatch",
          exportXlsUrl: "oaBus/busFunctionPermit/exportXls",
          importExcelUrl: "oaBus/busFunctionPermit/importExcel",
        },
      }
    },
    created() {
      this.getBusModelList();
    },
    watch: {
      selectedModel: 'getBusFunctionList'
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },

    methods: {
      handleDetail: function (record) {
        this.$refs.busFunctionPermitModal.detail(record);
        this.$refs.busFunctionPermitModal.title="查看";
      },
      show(record){
        putAction(this.url.editCementSend,{anntId:record.anntId}).then((res)=>{
          if(res.success){
            this.loadData();
          }
        });
        this.$refs.ShowAnnouncement.detail(record);
      },
      getBusModelList() {
        let url = "/oaBus/busFunctionPermit/busModelList";
        getAction(url).then((res) => {
          console.log(res.result);
          this.modelData = res.result;
        })
      },
      getBusFunctionList() {
        let vm = this;
        let url = "/oaBus/busFunctionPermit/busFunctionList";
        getAction(url).then((res) => {

          this.functionList = res.result;
          this.functionData = this.functionList.filter(function (city) {
            return city.ibusModelId == vm.selectedModel
          })
        })
      }

    }
  }
</script>
<style scoped>
</style>