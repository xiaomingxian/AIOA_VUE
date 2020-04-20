<template>
  <a-modal
    :width="modalWidth"
    :visible="visible"
    title="部门搜索"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    >
    <div style="height: 400px; width:100%;overflow: auto">
    <!--部门树-->
    <template>
      <a-form :form="form">
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级部门">
      <a-tree
        multiple
        @expand="onExpand"
        checkable

        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        v-model="checkedKeys"
        @check="onCheck"
        :selectedKeys = "selectedKeys"


        treeCheckable="tree"
        :checkedKeys="checkedKeys"
        allowClear="true"
        :checkStrictly="false"

        :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
        :treeData="departTree"
        placeholder="请选择上级部门"
        >
      </a-tree>
      </a-form-item>
      </a-form>
    </template>
    </div>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  import { queryIdTree } from '@/api/api'
  import userModal from './UserModal'
  export default {
    name: "DepartWindow",
    components: {
      userModal,
    },
    data () {
      return {
        checkedKeys:[], // 存储选中的部门id
        checkPartsLists:[],//  选择的部门名称以及id
        expandedKeys:[],
        selectedKeys:[],
        autoExpandParent:true,

        userId:"", // 存储用户id
        model:{}, // 存储SysUserDepartsVO表
        userDepartModel:{userId:'',departIdList:[]}, // 存储用户id一对多部门信息的对象
        departList:[], // 存储部门信息
        modalWidth:400,
        departTree:[],
        title:"操作",
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        headers:{},
        form:this.$form.createForm(this),
        url: {
          userId:"/sys/user/generateUserId", // 引入生成添加用户情况下的url
        },
        //用来判断弹框是用来新增或是编辑两种状态
        isadd:false,
        // departTree,
      }
    },
    methods: {
      onExpand(expandedKeys){

        console.log(expandedKeys);
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false
      },

      add (checkedDepartKeys,isadd) {
        console.log(checkedDepartKeys);
        console.log(isadd);

        this.isadd = isadd;//用来判断弹框是用来新增或是编辑两种状态,编辑时只能选一个，新增时可以多选
        if(isadd){
          this.checkedKeys = [];
        }else{
          this.checkedKeys .push(checkedDepartKeys) ;
        }
        this.edit({});
      },
      edit (record) {
        this.departList = [];
        this.queryDepartTree();
        this.form.resetFields();
        this.visible = true;
        this.model = Object.assign({}, record);
        let filedsVal = pick(this.model,'id','userId','departIdList');
        this.$nextTick(() => {
          this.form.setFieldsValue(filedsVal);
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.departList = [];
        this.checkedKeys = [];
      },
      handleSubmit () {
        if(!this.checkedKeys.length){
          this.$message.error('请选择部门')
        }else{
          console.log(this.checkPartsLists);
          if(this.isadd){
            if(this.checkPartsLists[0].dataRef.children.length>0){
              this.$emit('sendPartsList',this.checkPartsLists[0]);
            }else{
              this.$emit('sendPartsList', this.checkPartsLists);
            }
            this.visible = false;
          }else{
            if(this.checkPartsLists[0].dataRef.children.length>0){
              this.$emit('sendPartsList',this.checkPartsLists[0]);
              this.visible = false;
            }
            else{
            if (this.checkPartsLists.length>1){
              this.$message.error('编辑时只能选择一个部门或者选择整个支行')
            }else{
              this.$emit('sendPartsList', this.checkPartsLists);
              this.visible = false;
            }
            }
          }


        }
        // const that = this;
        // // 触发表单验证
        // this.form.validateFields((err) => {
        //   if (!err) {
        //     that.confirmLoading = true;
        //     if(this.userId == null){
        //       getAction(this.url.userId).then((res)=>{
        //         if(res.success){
        //           let formData = {userId:res.result,
        //           departIdList:this.departList}
        //           console.log(formData)
        //           that.$emit('ok', formData);
        //         }
        //       }).finally(() => {
        //         that.departList = [];
        //         that.confirmLoading = false;
        //         that.close();
        //       })
        //     }else {
        //       let formData = {userId:this.userId,
        //         departIdList:this.departList}
        //       console.log(formData)
        //       that.departList = [];
        //       that.$emit('ok', formData);
        //       that.confirmLoading = false;
        //       that.close();
        //     }
        //   }
        // })
      },
      handleCancel () {
        this.close()
      },

      // 选择部门时作用的API
      onCheck(checkedKeys, info){
        console.log(checkedKeys);
        console.log(info);

        this.departList = [];
        this.checkedKeys = checkedKeys;
        let checkedNodes = info.checkedNodes;
        for (let i = 0; i < checkedNodes.length; i++) {
          let de = checkedNodes[i].data.props;
          let depart = {key:"",value:"",title:""};
          depart.key = de.value;
          depart.value = de.value;
          depart.title = de.title;
          this.departList.push(depart);
        }
        let checkPartsLists = [];
        info.checkedNodes.map((item)=>{
           checkPartsLists.push(item.data.props);
        });
        this.checkPartsLists = checkPartsLists;
        console.log(checkPartsLists);

      },
      queryDepartTree(){
        queryIdTree().then((res)=>{
          if(res.success){
            this.departTree = res.result;
          }
        })
      },
      modalFormOk(){

      }
      },
  }
</script>

<style scoped>
  .ant-table-tbody .ant-table-row td{
    padding-top:10px;
    padding-bottom:10px;
  }
</style>