<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    destroyOnClose
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">

      <a-form>
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="请输入流程名称(只能以中文或英文开头,只能包含中文/英文/数字/下划线;长度大于等于5小于等于20)"
            v-model="name"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            type="text"
            placeholder="请输入流程key(只能以字母开头,只能包含字母,数字,下划线;长度大于等于5小于等于20)"
            v-model="key"
          ></a-input>
        </a-form-item>

      </a-form>


    </a-spin>
  </a-modal>
</template>

<script>
  import {getAction, httpAction, postAction} from '@/api/manage'
  import DictItemModal from "../../system/modules/DictItemModal";
  import AFormItem from "ant-design-vue/es/form/FormItem";

  export default {
    name: "copyProcActinstModal",
    components: {AFormItem, DictItemModal},
    data() {
      return {
        title: "复制流程",
        isClick:false,
        visible: false,
        confirmLoading: false,
        name: undefined,
        key: undefined,
        proMSg: {},
        url: {
          copy: '/workflowSet/copy'
        },
      }
    },
    created() {
    },
    methods: {
      show() {
        this.name = undefined
        this.key = undefined
        this.visible = true
        this.isClick=false
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        if (this.isClick){
          this.$message.error("请勿重复点击")
        }
        if (this.name == undefined) {
          this.$message.error('请输入流程名称')
          return
        }
        if (this.key == undefined) {
          this.$message.error('请输入流程key')
          return
        }


        //key校验
        let keyReg = /^([a-zA-Z])([-_a-zA-Z0-9]{4,19})$/
        if (!keyReg.test(this.key)) {
          if ((this.key).length > 20) {
            this.$message.error('您输入的key长度过长')
            return
          }
          if ((this.key).length < 5) {
            this.$message.error('您输入的key长度过短')
            return
          }
          this.$message.error('您输入的key不合法请检查')
          return
        }

        let nameReg = /^([\u4e00-\u9fa5]|[a-zA-Z])([-\u4e00-\u9fa5_-_a-zA-Z0-9]{4,19})$/
        if (!nameReg.test(this.name)) {

          if ((this.name).length > 20) {
            this.$message.error('您输入的名称长度过长')
            return
          }
          if ((this.name).length < 5) {
            this.$message.error('您输入的名称长度过短')
            return
          }
          this.$message.error('您输入的名称不合法请检查')

          return
        }

        postAction(this.url.copy + '?copyKey=' + this.key + '&copyName=' + this.name + '&sourceDefId=' + this.proMSg.id).then(res => {
          if (res.success) {
            this.isClick=true
            this.$message.success(res.message)
            //刷新父页面
            this.$emit('reload')
            this.handleCancel()

          } else {
            this.$message.error(res.message)
          }
        })

      },
      handleCancel() {
        this.close();
      },
    }
  }
</script>

<style lang="less" scoped>

</style>