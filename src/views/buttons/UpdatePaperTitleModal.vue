<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文头">
          <a-input v-model="paperTitleName" placeholder="" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  /*import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'*/
  import { getAction } from '@/api/manage'
    export default {
        name: "UpdatePaperTitle",
      data () {
        return {
          title:"操作",
          visible: false,
          model: {},
          labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
          table:"",
          id:"",
          paperTitleName:"",
          confirmLoading: false,
          form: this.$form.createForm(this),
          validatorRules:{
            // ibusFunctionId:{rules: [{ required: true, message: '请输入主键id!' }]},
          },
          url: {
            editTitle: "/oaBus/oaBusdata/editTitle"
          },

        }
      },
      created () {
      },
      methods: {
        paperTitle(backData) {
          this.visible = true;
          this.table = backData.table;
          this.id = backData.i_id;
        },

        close () {
          this.$emit('close');
          this.visible = false;
        },
        handleOk () {
          getAction(this.url.editTitle,{table:this.table,
            iId:this.id,
            sMiddleParameter:this.paperTitleName}).then((res)=>{
            if(res.success){
              this.$message.success(res.message);
              this.$emit('ok');
              this.$emit('updateMiddleParameter', this.paperTitleName)
              this.close();
            }else{
              this.$message.warning(res.message);
            }
          })

        },
        handleCancel () {
          this.close()
        },


      }
    }
</script>

<style scoped>

</style>