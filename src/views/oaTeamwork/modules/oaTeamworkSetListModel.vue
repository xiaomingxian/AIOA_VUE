<template>
  <a-modal :visible="showFunPer" :width="1200" @ok="handleOk" @cancel="handleCancle">
  <a-card :bordered="false">

    <!-- 查询区域 -->
   <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="描述">
              <a-input placeholder="请输入描述" v-model="queryParam.description"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8" >
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
-->
    <!-- 操作按钮区域 -->

    <!-- table区域-begin -->
  <!--  <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>-->

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
          <!--<a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />-->
          <a @click="handleConfig(record)">配置明细</a>
         <!-- <a-divider type="vertical" />
           <a @click="handleDelete(record.iid)" title="确定删除吗?">删除</a>-->
        </span>
      </a-table>

    <oaTeamwork-modal ref="modalForm" @ok="modalFormOk"></oaTeamwork-modal>
    <oa-teamwork-set-list ref="teamworkSetList" @ok="modalFormOk" ></oa-teamwork-set-list>
  </a-card>
  </a-modal>
</template>

<script>
  import oaTeamworkModal from './oaTeamworkModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import  oaTeamworkSetList from '../oaTeamworkSetList'
  import {httpAction, getAction, postAction, getRoleList, getUserList, getServiceList} from '@/api/manage'
  export default {
    name: "oaTeamworkList",
    mixins:[JeecgListMixin],
    components: {
      oaTeamworkModal,
      oaTeamworkSetList,

    },
    data () {
      return {
        iteamworkId:'',
        steamworkName:'',
        iversion:'',
        dataId:'',
        newDataId:'',
        Order:[],
        modelId:'',
        functionId:'',
        dataIds:'',
        IntsList:[],
        visibleDel:false,
        showFunPer: false,
        description: '个人协同办公业务配置分类管理页面',
        // 表头
          columns: [

            {
              title: '协同业务名称',
              align:"center",
              dataIndex: 'iteamworkName'
            },
            {
              title: '描述',
              align:"center",
              dataIndex: 'description'
            },
           {
              title: '步骤',
              dataIndex: 'orderName',
              align:"center",
            }
          ],
          url: {
            list: "/oateamwork/oaTeamworkSet/queryList",
            Intslist: "/oaTea/oaTeamworkInst/list",
            findOrder: "/oaTea/oaTeamworkInst/findOrder",
            delete: "/oateamwork/oaTeamwork/delete",
            deleteBatch: "/oateamwork/oaTeamwork/deleteBatch",
            exportXlsUrl: "oateamwork/oaTeamwork/exportXls",
            importExcelUrl: "oateamwork/oaTeamwork/importExcel",
          },

        keysObjs:[],
        }
  },
    created () {

    },

  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      handleTableChange(q,w,e,){
        console.log(q.current);
        this.ipagination.current = q.current;
        getAction(this.url.list, {pageNo:q.current, iTeamworkId:this.iteamworkId}).then((res) => {
          this.dataSource = res.result.record;
          this.ipagination.total =  res.result.total;
        })
      },
      showOpen (userid,backData,busDataid) {
        this.showFunPer = true
        this.dataId=busDataid;
        getAction(this.url.list,{sCreateBy:userid,iBusFunctionId:backData.i_bus_function_id}).then((res) => {
          if(res.result.records.length == 0){
            this.$message.error("该业务没有匹配的协同办公");
          }else{
            this.ipagination.total =  res.result.total;
            this.dataSource = res.result.records;
          }


        })
      },


      // 多选事件
      onSelectChange(selectedRowKeys,keysObjs){
        this.keysObjs = keysObjs;
        this.selectedRowKeys = selectedRowKeys
      },
      handleOk() {
        // this.showFunPer = false;
        console.log(this.keysObjs[0])
        console.log(this.dataId)
        getAction(this.url.findOrder,{iteamworkId:this.keysObjs[0].iteamworkId}).then((res) => {
          this.Order = res.result;
          for(let i=0;i<this.Order.length;i++){
            if(this.Order[i]<this.keysObjs[0].maxOrder){
              console.log(this.keysObjs[0])
              console.log(this.Order[i])
              this.$message.error("您选择的流程还没有完成");
              return ;
            }else
              {
              let param = {
                modelId: this.keysObjs[0].orderModelId.split(",")[1],
                functionId: this.keysObjs[0].orderFunctionId.split(",")[1],
              }
              postAction("/oaBus/oaBusdata/queryNewTaskMsg", param).then(res => {
                if (res.success) {
                  const promise1 = new Promise((resolve => {
                    // console.log(window.location);
                    this.newDataId =   JSON.stringify(res.result.busdataId)
                    console.log(this.newDataId);
                    // window.location.href(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + res.result.tableName + '&busdataId=' + res.result.busdataId + '&navisshow=false')
                    this.$router.push({path: '/mytask/taskList/Test-detailFile?tableName=' + res.result.tableName + '&busdataId=' + res.result.busdataId + '&navisshow=false'})
                    resolve(this.newDataId)
                  }))


                  promise1.then((newDataId)=>{
                    let data1 = {
                      iteamworkId:this.keysObjs[0].iteamworkId,
                      iteamworkSetId:this.keysObjs[0].iid,
                      iorder:1,
                      ibusdataId:this.dataId,
                      iversion:this.dataId,
                      ibusModelId:this.keysObjs[0].orderModelId.split(",")[0],
                      ibusFunctionId:this.keysObjs[0].orderFunctionId.split(",")[0]
                    }
                    let data2 = {
                      iteamworkId:this.keysObjs[0].iteamworkId,
                      iteamworkSetId:this.keysObjs[0].iid,
                      iorder:2,
                      ibusdataId:newDataId,
                      iversion:this.dataId,
                      ibusModelId:this.keysObjs[0].orderModelId.split(",")[1],
                      ibusFunctionId:this.keysObjs[0].orderFunctionId.split(",")[1]
                    }
                    let dataList = {
                      data1:data1,data2:data2
                    }
                    postAction("/oaTea/oaTeamworkInst/add", dataList).then(res => {
                      if (res.success) {
                        this.$message.success(res.message)
                      } else {
                        this.$message.error(res.message)
                      }
                    })
                  })

                } else {
                  this.$message.error(res.message)
                }
              })
            }
          }
        })


      },
      handleCancle() {
        this.showFunPer = false;
      },
    }
  }
</script>
<style scoped>

</style>