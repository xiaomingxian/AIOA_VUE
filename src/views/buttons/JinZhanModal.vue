<template>
  <a-modal
    title="进展分析"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="confirm"
    @cancel="handleCancel"
    okText="确定"
    cancelText="取消">
    <a-tabs @change="getTabVal" defaultActiveKey="1">

      <a-tab-pane  tab="办结率" key="1">

      </a-tab-pane>

      <a-tab-pane  tab="评价" key="2">
      </a-tab-pane>

    </a-tabs>
    <jie-zhan-banjie v-show="tabShow==1?true:false" ref="BanJie"></jie-zhan-banjie>
    <ping-jia-list v-show="tabShow==2?true:false" ref="PingJia"></ping-jia-list>
  </a-modal>

</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {httpAction, getAction,putAction, postAction, getRoleList, getUserList, getServiceList} from '@/api/manage'
  import JieZhanBanjie  from './JieZhanBanjie'
  import PingJiaList from './PingJiaList'
  export default {
      name: "JinZhanModal",
      mixins: [JeecgListMixin],
      components: {
        JieZhanBanjie,
        PingJiaList
      },
      data() {
        return {
          visible:false,
          tabShow:1,
          proInstId:'',
          tableId:'',
          functionId:'',
          backData:[],
          url: {
            currentUnDo: '/oadatafetailedinst/oaDatadetailedInst/queryTaskUnDoCurrent',
            cuiBan: '/testt/sysUserSet/chuiban',
            add: '/oaBus/Calendar/oaCalendar/DataAdd',
          },
        }
      },
       methods: {
         show(a,b){
           console.log(b);
           this.proInstId = a;
           this.visible=true
           this.tableId =  b.i_id;
           this.functionId = b.i_bus_function_id;
          console.log(b.i_id)

           this.$refs.PingJia.traceP(this.proInstId);
         },
         getTabVal(e){
           console.log(e)
           this.tabShow = e;
           if(e==2){
             this.$refs.PingJia.traceP(this.proInstId, this.tableId ,this.functionId );
           }else{
             this.$refs.BanJie.show(this.proInstId, this.tableId ,this.functionId);
           }
          // this.startAnalysis();
         },
         handleCancel(){
           this.visible=false
         }
      }
    }

</script>

<style scoped>

</style>