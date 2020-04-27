<template>
  <a-modal
    title="未办理信息"
    :width="900"

    :visible="visible"

    @cancel="closeUndo"
    destroyOnClose

    cancelText="取消">
    <a-card :bordered="false">

      <div>

        <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;display: flex;align-items: center;justify-content: flex-start">
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          <!--<button @click="allcuiban" style="margin-left: 40px">全部催办</button>-->
          <a-button @click="allcuiban"  type="primary" style="margin-left: 30px;">全部催办</a-button>

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
          <a @click="cuiban(record)">催办</a>
        </span>

        </a-table>
      </div>
    </a-card>

  </a-modal>

</template>


<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {httpAction, getAction,putAction, postAction, getRoleList, getUserList, getServiceList} from '@/api/manage'




  export default {
    name: "dunningButtonModal",
    mixins: [JeecgListMixin],
    data() {
      return {
        tipstime:[],
        visible:false,
        dataSource:[],
        titleName:'',
        iBusDataId:'',
        loading:false,
        tableName:'',
        busModelId :'',
        busFunctionId :'',
        sCreateName :'',
        dCreateTime :'',
        selectedList :[],
        usernames:'',
        // 表头
        columns: [
          {
            title: '环节',
            dataIndex: 'taskDefName',
            align: "center",
          },
          {
            title: '部门',
            dataIndex: 'deptName',
            align: "center",
          },
          {
            title: '用户',
            dataIndex: 'userName',
            align: "center",
          },
          {
            title: '办理状态',
            dataIndex: 'iIs1',
            align: "center",
          },
          {
            title: '最后办理时间',
            dataIndex: 'dCreateTime',
            align: "center",
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }

        ],
        url: {
          currentUnDo: '/oadatafetailedinst/oaDatadetailedInst/queryTaskUnDoCurrent',
          cuiBan: '/testt/sysUserSet/chuiban',
          add: '/oaBus/Calendar/oaCalendar/DataAdd',
        },
      }
    },
    created() {
    },
    methods: {
      onSelectChange(index,listObj){

        console.log(listObj);
        this.selectedRowKeys = index;
        this.selectedList = listObj;




      },

      closeUndo(){
        this.visible=false
      },
      qucik(e,a) {
        console.log(a)
        this.visible=true
        let procInstId = e
        this.tableName =  a.table;
        this.iBusDataId =a.i_id;
        this.titleName =  a.s_title;
        this.busModelId = a.i_bus_model_id;
        this.busFunctionId = a.i_bus_function_id;
        this.sCreateName = a.s_create_name;
        this.dCreateTime = a.d_create_time;
        getAction(this.url.currentUnDo, {
          procInstId: procInstId,
          iTableId:  this.iBusDataId
        }).then(res => {
          if (res.success) {
            console.log(res)
            this.loading = false;
            this.dataSource= res.result

          } else {
            this.$message.error(res.message)
          }
        })
      },
      allcuiban(){


        console.log( this.selectedList);


        this.selectedList.map((item,index)=>{
          console.log(this.selectedList[index])
          this.usernames = this.selectedList[index].userName+","+this.usernames
          console.log(this.usernames+"-----------------------")


         /* this.cuiban(item);*/
        })
        getAction(this.url.cuiBan, {title:this.titleName,userName:this.usernames,tableName:this.tableName,busdataId:String(this.busDataId)
        }).then(res => {
          if (res.success) {

              this.tipstime.push('success')
              this.$message.success("催办成功");
              this.selectedList.map((item,index)=>{
              console.log(this.selectedList[index])
              this.usernames = this.selectedList[index].userName+","+this.usernames
              console.log(this.usernames+"-----------------------")
              let data1 = {
                stitle:this.titleName,
                suserNames:this.selectedList[index].userName,
                saddress:"",
                iisTop:0,
                iisLeader:0,
                iremindType:0,
                iopenType:0,
                screateBy:this.sCreateName,
                ibusModelId: this.busModelId,
                ibusFunctionId:this.busFunctionId,
                ifunDataId:this.iBusDataId,
                taskId:this.selectedList[index].taskId,
                taskUserId:this.selectedList[index].deptName,
                state :'1',
              }
              putAction(this.url.add,data1).then((res) => {
              })

              /* this.cuiban(item);*/
            })

          } else {
            this.$message.error("催办失败")
          }
        })



      },
      cuiban(e){

        // console.log(this.selectedRowKeys);
        console.log(e);
        // console.log(typeof this.tableName )
        // console.log(typeof this.iBusDataId )
        // console.log(typeof this.titleName )
        getAction(this.url.cuiBan, {title:this.titleName,userName:e.userName,tableName:this.tableName,busdataId:String(this.busDataId)
        }).then(res => {
          if (res.success) {
              this.tipstime.push('success')
              this.$message.success(res.message);
              console.log(e);
            let data1 = {
              stitle:this.titleName,
              suserNames:e.userName,
              saddress:"",
              iisTop:0,
              iisLeader:0,
              iremindType:0,
              iopenType:0,
              screateBy:this.sCreateName,
              ibusModelId: this.busModelId,
              ibusFunctionId:this.busFunctionId,
              ifunDataId:this.iBusDataId,
              taskId:e.taskId,
              taskUserId:e.deptName,
              state :'1',
            }
            putAction(this.url.add,data1).then((res) => {
            })
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  }
</script>