<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    destroyOnClose
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">

      <a-form>
        <a-form-item>
          <span>流程名称：</span>
          <a-input
            size="large"
            type="text"
            placeholder="请输入流程名称;5-20字符"
            v-model="name"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <span>流程&nbspkey：</span>
          <a-input
            size="large"
            type="text"
            placeholder="请输入流程key;5-20字符"
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
        timeRecord:null,
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

        let time = this.timeRecord
        var now = Date.parse(new Date());

        if (time != null) {
          if ((now - time) < 7 * 1000) {
            // let t = (7 - (now - time) / 1000) == 0 ? 1 : (7 - (now - time) / 1000)

            // this.$message.error('您点击过于频繁,请' + (t) + '秒后重试')

            this.$message.error('系统正在处理您的请求,请耐心等待')
            return
          } else {
            console.log('1111111111111111')
            this.timeRecord = now
          }
        } else {
          console.log('222222222222222')

          this.timeRecord = now
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
  /deep/ .ant-form-item-children {

    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    span {
      font-size: 16px;
      font-weight: bold;
      margin-left: 20px;
    }

    input {
      width: 75%;
      margin-left: 10px;

    }
  }

</style>