<template>
  <div>
    <a-drawer
      title="办理详情"
      :width="720"
      @close="onClose"
      :visible="visible"
      :bodyStyle="{ paddingBottom: '80px' }"
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="是否公开:">
              <a-select defaultValue="0"  @change="getiIsOpen"

              >
                <a-select-option value="1" >是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="办理状态:">
              <a-select  defaultValue="0" @change="getiIs1"
              >
                <a-select-option value="0">办理中</a-select-option>
                <a-select-option value="1">已办结</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="办理进度：">
              <a-textarea v-model="detailData.sOpinion"
                v-decorator="[
                  'description',
                  {
                    rules: [{ required: true, message: 'Please enter url description' }],
                  },
                ]"
                :rows="4"
                placeholder="请填写办理意见"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="附件：">

            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '25px' }" type="primary" @click="onClose">
          取消
        </a-button>
        <a-button :style="{ marginRight: '25px' }" type="primary" @click="onClose">
          删除
        </a-button>
        <a-button :style="{ marginRight: '25px' }" type="primary" @click="onClose">
          上传附件
        </a-button>
        <a-button @click="onClose" type="primary">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
  import {deleteAction, downFile, getAction, postAction} from '@/api/manage'
  export default {
    name: "detailedInst",
    data() {
      return {
        visible: false,
        detailData:{
          iId:0,
          sTable:"",
          iTableId:0,
          sOpinion:"",
          iIsOpen:0,
          iIs1:0,
          sCreateName:"",
          sCreateBy:"",
          sCreateDept:"",
          sCreateDeptid:"",
          cmd:1,
        },
      };
    },
    created(){

    },
    methods: {
      showDrawer(data) {
        this.detailData=data;
        this.visible = true;
      },
      onClose() {
        let detailedInst={
          s_table:this.detailData.sTable,
          i_table_id:this.detailData.iTableId,
          s_opinion:this.detailData.sOpinion,
          i_is_open:this.detailData. iIsOpen,
          i_is_1:this.detailData.iIs1,
          s_create_name:this.detailData.sCreateName,
          s_create_by:this.detailData.sCreateBy,
          s_create_dept:this.detailData.sCreateDept,
          s_create_deptid:this.detailData.sCreateDeptid
        };
        var addurl="/oadatafetailedinst/oaDatadetailedInst/adddatadetailedInst"

        postAction(addurl,detailedInst).then(res =>{
          if (res.success){
            this.$message.success("新建办理成功")
          } else {
            this.$message.warning("新建办理失败")
          }
        })
        this.visible = false;
      },
      getiIs1(num){
        // console.log("====================>>4444"+num)
        // console.log("====================>>4444"+parseInt(num))
        this.detailData.iIs1=parseInt(num);
      },
      getiIsOpen(num){
        // console.log("====================>>5555"+num)
        // console.log("====================>>5555"+parseInt(num))
        this.detailData.iIsOpen=parseInt(num);
      }
    },
  };
</script>