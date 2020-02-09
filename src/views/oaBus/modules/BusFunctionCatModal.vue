<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"

    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
<a-spin :spinning="confirmLoading">
  <a-form-item
    :labelCol="labelCol"
    :wrapperCol="wrapperCol"
    label="范围类型"
  >
    <a-input  style="width: 200px;" v-model="typeModel"></a-input>
  </a-form-item>

  <a-form-item
    v-if="isshowType==1"
    :labelCol="labelCol"
    :wrapperCol="wrapperCol"
    label="角色">
    <a-input  style="width: 200px;" v-model="selectedRole"></a-input>
  </a-form-item>

  <!--部门分配-->
  <a-form-item
    v-else-if="isshowType==2"
    :labelCol="labelCol"
    :wrapperCol="wrapperCol"
    label="部门">
    <a-input  style="width: 200px;" v-model="checkedDepartNameString"></a-input>
  </a-form-item>

  <a-form-item
    v-else-if="isshowType==3"
    :labelCol="labelCol"
    :wrapperCol="wrapperCol"
    label="人员">
    <a-input  style="width: 200px;" v-model="selectedUser"></a-input>
  </a-form-item>
  <a-form-item
    v-else="isshowType==0">
    <!--<a-input  style="width: 200px;" v-model="selectedUser"></a-input>-->
  </a-form-item>
  <a-form-item
    :labelCol="labelCol"
    :wrapperCol="wrapperCol"
    label="是否可见">
    <a-radio-group v-model="selectvalue">
      <a-radio :value="1">是</a-radio>
      <a-radio :value="0">否</a-radio>
    </a-radio-group>
  </a-form-item>

</a-spin>
  </a-modal>
</template>
<script>
  import { httpAction } from '@/api/manage'
  import { getAction,postAction} from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  import Vue from 'vue'

  export default {
    name: "BusFunctionCatModal",
    mixins:[JeecgListMixin],
    data () {
      return {
        isshowType:'1',
        typeModel:'',//范围类型    需要判断  分别值有 0 1 2 3
        checkedDepartNameString:'',
        confirmLoading:false,
        selectvalue:'1',  //是否选中
        itypeId:'',
        itypeName:'',
        title: "操作",
        visible: false,
        selectedRole:'',//
        selectedUser:'',//
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
      }
    },
    created(){
      this.getSelection();
    },
    mounted(){

    },
    methods: {
      showCat(record) {
        console.log(record);
        this.typeModel = record.spermitType;
        this.$nextTick(() => {
          if(record.spermitType=='1'){
            this.isshowType = 1;
            this.selectedRole = record.itypeName;
            this.typeModel = '角色';
          }else if(record.spermitType=='3'){
            this.isshowType = 3;
            this.selectedUser = record.itypeName;
            this.typeModel = '人员';
          }else if(record.spermitType=='2'){
            this.isshowType = 2;
            this.typeModel = '部门';
            this.checkedDepartNameString =record. itypeName
          }else{
            this.isshowType = 0;
            this.typeModel = '所有人'
          }

          this.selectvalue = Number(record.sdisplay);
          this.visible = true;
        });



      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.close()
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>