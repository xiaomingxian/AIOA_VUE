<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
   <!--  <div style="margin-bottom: 10px; "><img  style="height: 15px; width: 20px" src="../../../assets/矢量智能对象@2x.png" alt=""> <span style="margin-left: 10px">协同办公</span>
     </div>-->
     <!-- <span style="margin-bottom: 10px; ">协同办公</span>-->
      <br>
      <!--<div class="boxLists">-->
        <!--<div class="itemBox" v-for="(item,index) in listqq" >-->

          <!--<div  :key="index"  style="width: 130px; height: 100px;border: 1px solid ;background-color: #b4d7ff">-->
            <!--{{item.iid}}-->
          <!--</div>-->
          <!--<img   style="height: 20px; width: 50px" src="../../../assets/箭头@2x.png" alt=""/>-->

        <!--</div>-->
      <!--</div> direction="vertical"-->
      <a-steps  direction="vertical"  :current="total"  style="margin-left: 50px">
        <a-step class="step" style="width:400px" v-for="(item,index) in listqq" @dblclick="openXieTong(item.tableName,item.busDataId,index)"  :title="item.busFunctionName+'    '+item.stitle" :description="item.dCreateTime"></a-step>
      </a-steps>

    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction,getAction,postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "CollaborativePreviewModal",
    data () {
      return {
        title:"操作",
        visible: false,
        modelList: [],
        selectList: [],
        busModelId:'',
        listqq:[],
        modelId:'',
        findMax:'',
        tableName:[],
        total:'',
        functionId:'',
        num:'',
        model: {
          iteamworkId:'',
          steamworkName:'',
          iversion:'',
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/oateamwork/oaTeamworkSet/add",
          Setlist: "/oaTea/oaTeamworkInst/querylist",
          edit: "/oateamwork/oaTeamworkSet/edit",
          queryListL:"/oateamwork/oaTeamworkSet/list",
          findMax: "/oateamwork/oaTeamworkSet/findMax",
          selectTaskType: '/oaBus/newTask/findModelPermit1',
          selectTaskDetail: '/oaBus/newTask/findFunctionPermit',

        },

      }
    },
    created() {
    },
    methods: {
      openXieTong(e,d,i){
        if(this.IntsList[i] == undefined){
           this.$message.warning("没有业务数据");
         }
         else if(this.listqq[i].tableName != null &&  this.IntsList[i].busDataId != undefined){
           window.open(window.location.origin+'/mytask/taskList/Test-detailFile?tableName='+this.listqq[i].tableName+'&busdataId='+this.IntsList[i].busDataId+'&navisshow=false')
         }
      },
      open(e){
        this.visible = true;
        this.model.iteamworkId = e.iid
        this.model.steamworkName = e.steamworkName
        this.model.iversion = e.iversion;
        //查询实例表里面的东西，为了确定走到那个步骤
        getAction(this.url.Setlist, {iVersion: e.iversion}).then((res) => {
          this.total  = res.result.length
          this.IntsList =  res.result

        })
        //查出该所有的协同办公
        getAction(this.url.queryListL, {iTeamworkId: e.iteamworkId}).then((res) => {
          this.listqq = res.result.records;

        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        if(this.$refs.indexStep.value<this.num){
          this.$message.warning(this.findMax);
          return ;
        }
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            console.log(this.isadd)
            let httpurl = '';
            let method = '';
            if (this.isadd) {
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            /*formData.dCreateTime = formData.dCreateTime?formData.dCreateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.dUpdateTime = formData.dUpdateTime?formData.dUpdateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            */

    console.log(formData)
    httpAction(httpurl,formData,method).then((res)=>{
      if(res.success){
        that.$message.success(res.message);
        //告诉父级组件我已关闭  关闭后刷新父级列表
        that.$emit('submit',true);
      }else{
        that.$message.warning(res.message);
      }
    }).finally(() => {
      that.confirmLoading = false;
      that.close();
    })



  }
})
},
handleCancel () {
this.close()
},


}
}
</script>

<style lang="less" scoped>
.boxLists{
  /*background: red;*/
  display: flex;
  align-items: center;
  flex-wrap:wrap;
  /*flex-direction: row-reverse;*/
  .itemBox{
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
}

  .step:hover{
    cursor: pointer;
  }
</style>