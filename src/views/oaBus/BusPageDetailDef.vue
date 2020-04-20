<template>
  <a-modal :visible="visible" :title="title" :width="900" @ok="handleOk" @cancel="handleCancel">

    <!--<div style="padding:20px;"  v-show="showFlag" class="table-operator">
      <a-button type="primary" @click="handleSaveAll" >生成含义</a-button>
    </div>  -->
    <div style="height: 400px;overflow: auto">
      <div style="width: 95%">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="8" :sm="8">
                <a-form-item label="字段名">
                  <a-input placeholder="请输入字段名" v-model="queryParam.sTableColumn"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="含义">
                  <a-input placeholder="字段的含义" v-model="queryParam.sColumnName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" >
              <a-button type="primary" @click="searchTable1" icon="search">查询</a-button>
              <a-button type="primary" @click="refesh" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
              </a-col>

            </a-row>
          </a-form>
        </div>
        <div style="padding-left:20px;" class="table-operator">
          <h3>自定义列名</h3>
        </div>
        <!--:pagination="ipagination1"-->
        <a-table
          ref="table"
          size="middle"
          bordered
          :pagination=false
          rowKey="index"
          :columns="columns1"
          :dataSource="dataSource1"

          :loading="loading"
          @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelect(record.iid)">
                  <a>删除</a>
          </a-popconfirm>
          <!--<a @click="handleDelect(record.iid)">删除</a>-->
        </span>
        </a-table>
        <a-table
          rowKey="index"
          :columns="columns00"
          :dataSource="dataSource00"
          :pagination="false"
          :loading="loading"
          :showAlertInfo="false"
          :showHeader="false"
          :expandIconAsCell="false"
        >
          <a-table
            slot="expandedRowRender"
            ref="table"
            size="middle"
            bordered
            rowKey="index"
            :columns="columns"
            :dataSource="dataSource2"
            :pagination=false
            :loading="loading">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
        </span>

          </a-table>
        </a-table>
      </div>

      <bus-page-detail-def-modal ref="busPageDetailDefModel" @loading="refesh" @ok="refesh"/>
    </div>
  </a-modal>
</template>

<script>
  import {httpAction, getAction, deleteAction, postAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import BusPageDetailDefModal from "./modules/BusPageDetailDefModal";

  export default {
    name: "BusPageDetailDef",
    mixins: [JeecgListMixin],
    components: {
      BusPageDetailDefModal
    },
    data() {
      return {
        title: "配置含义",
        visible: false,
        iBMId: '',
        modelWidth: '100%',
        showFlag: false,
        queryParam: {},
        columns00: [
          {
            dataIndex: 'stableColumn'
          }
        ],
        columns1: [
          {
            title: '字段名',
            align: "center",
            dataIndex: 'stableColumn'
          },
          {
            title: '含义',
            align: "center",
            dataIndex: 'scolumnName'
          },
          {
            title: '列表标题列',
            align: "center",
            dataIndex: 'iisListtitle',
            customRender: (text) => {
              if (text == '1' || text == 1) {
                return "是"
              } else {
                return '否'
              }
            }
          },
          {
            title: '列表顺序',
            align: "center",
            dataIndex: 'iorder',
            customRender: (text) => {
              if (text == null) {
                return "--"
              } else {
                return text
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
        columns: [
          {
            title: '字段名',
            align: "center",
            dataIndex: 'stableColumn'
          },
          {
            title: '含义',
            align: "center",
            dataIndex: 'scolumnName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 80,
            scopedSlots: {customRender: 'action'},
          }
        ],
        dataSource00: [
          {
            stableColumn: '固定列名',
          }
        ],
        dataSource2: [],
        dataSource1: [],
        ipagination1: {
          pageSize: 100,
          /*current: 1,
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0*/
        },
        ipagination2: {
          current: 1,
          pageSize: 100,
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        procDefKv: '',
        model: {busPageDetailList: [{}]},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        functionId: '',
        pageId: '',
        modelId: '',
        url: {
          add: "/oaBus/busFunction/add",
          delete: "/oaBus/busPageDetail/delete",
          edit: "/oaBus/busFunction/edit",
          getbusPageDetailList: "/oaBus/oaBusdata/getPageDataForm",
          orderTicketList: "/test/jeecgOrderMain/queryOrderTicketListByMainId",
          initDetail: "/oaBus/busPageDetail/initDetail",
          queryCount: "/oaBus/busPageDetail/queryCount",
          list: "/oaBus/busPageDetail/queryListByFunctionId",
          queryListByName: "/oaBus/busPageDetail/queryListByName",
        },
      }
    },
    created() {
      this.getSelection();
    },

    destroyed() {
      this.close();
    },
    methods: {
      searchTable1() {
        let par = {iBusFunctionId: this.functionId, iBusPageId: this.pageId};
        let param = Object.assign(par, this.queryParam)
        getAction(this.url.queryListByName, param).then((res) => {
          //console.log(res);
          this.dataSource1 = res.result;
          this.ipagination1.total = res.result.length;
          this.$forceUpdate()
        })
        //this.getSelection();
      },
      //删除数据
      handleDelect(id) {

        deleteAction(this.url.delete, {id: id}).then(res => {
          this.refesh()
        })
      },
      refesh() {
        this.queryParam = {};
        this.initTabel1();
        this.initTabel2();
      },
      /*每次进来后初始化含义*/
      initDetail() {
        getAction(this.url.initDetail, {
          functionId: this.functionId,
          pageId: this.pageId,
          modelId: this.modelId
        }).then((res) => {
          //console.log(res);
          this.initTabel1();
          this.initTabel2();
        })
      },
      busFunProcButOpin(procButtonOpinion) {
        this.procButtonOpinion = {};
        this.procButtonOpinion = procButtonOpinion;
      },
      handleEdit(records) {
        this.$refs.busPageDetailDefModel.edit(records, this.pageId, this.functionId, this.modelId);
      },
      initTabel1() {

        getAction(this.url.list, {ibusFunctionId: this.functionId, ibusPageId: this.pageId}).then((res) => {
          //console.log(res);
          this.dataSource1 = res.result;
          this.ipagination1.total = res.result.length;
          this.$forceUpdate()
        })
      },
      initTabel2() {
        getAction(this.url.getbusPageDetailList,
          {pageId: this.pageId, modelId: this.modelId, functionId: this.functionId}).then((res) => {
          //console.log(res);
          this.dataSource2 = res.result.records;
          this.ipagination2.total = res.result.records.length;
          this.$forceUpdate()
        })
      },
      show(rec) {
        this.visible = true;
        this.title = "含义配置：" + rec.sname;
        console.log("****" + JSON.stringify(rec))
        this.pageId = rec.ipageId;
        this.functionId = rec.iid;
        this.modelId = rec.ibusModelId;

        if (this.pageId == null || this.pageId == '') {
          this.$message.error("页面数据未定义，请确认数据完整！！！")
          this.close()
          return;
        }
        if (this.functionId == null || this.functionId == '') {
          this.$message.error("业务数据未定义，请确认数据完整！！！")
          this.close();
          return;
        }
        if (this.functionId == null || this.modelId == '') {
          this.$message.error("模板数据未定义，请确认数据完整！！！")
          this.close();
          return;
        }
        this.initDetail();
      },

      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'ibusModelId', 'sname', 'ipageId', 'sbusLeftParameter', 'iisUnit', 'iisDept', 'sbusRightParameter', 'iisEditor', 'iisLimits', 'iisEs', 'iisProc', 'iprocSetId', 'screateBy', 'supdateBy'))
        });

      },
      close() {
        //this.$emit('close');
        this.ipagination1.total = '';
        this.ipagination2.total = '';
        this.dataSource2 = [];
        this.dataSource1 = [];
        this.visible = false;
      },
      //选择页面
      selectPageOk(data) {
        this.model.ipageId = data[0];
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'ipageId'))
        });

      },
      handleOk() {
        this.close();
      },

      handleCancel() {
        this.close()
      },
      getSelection() {
        let url = "/oaBus/busModel/modelList";
        getAction(url).then((res) => {
          /*alert(res.result.iid);
          console.log('----------------------------------------------------------');
          console.log(res.result);*/
          this.selectModelData = res.result;
        })
      }

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
