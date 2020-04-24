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
            placeholder="以中文或英文开头,只能包含中文/英文/数字/下划线;长度大于等于3小于等于20"
            size="large"
            type="text"
            v-model="bpmn.name"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          <span>流程&nbspKEY：</span>
          <a-input
            autocomplete="false"
            placeholder="以字母开头,只能包含字母,数字,下划线;长度大于等于3小于等于20"
            size="large"
            type="key"
            v-model="bpmn.key"
          >
          </a-input>
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
        title: "画流图",
        isClick: false,
        visible: false,
        confirmLoading: false,
        name: undefined,
        key: undefined,
        timeRecord: null,
        proMSg: {},
        bpmn: {
          name: "",
          key: "",
          description: "",
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
        this.isClick = false
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk()
      {




        var url = '/modeler/create'
        var url_model = '/modeler.html?modelId='
        var parm = {'name': this.bpmn.name, 'key': this.bpmn.key, 'description': this.bpmn.description}

        let nameReg = /^([\u4e00-\u9fa5]|[a-zA-Z])([-\u4e00-\u9fa5_-_a-zA-Z0-9]{2,19})$/
        if (!nameReg.test(this.bpmn.name)) {

          if ((this.bpmn.name).length > 20) {
            this.$message.error('您输入的名称长度过长')
            return
          }
          if ((this.bpmn.name).length < 3) {
            this.$message.error('您输入的名称长度过短')
            return
          }
          this.$message.error('您输入的名称不合法请检查')

          return
        }

        let keyReg = /^([a-zA-Z])([-_a-zA-Z0-9]{2,19})$/
        if (!keyReg.test(this.bpmn.key)) {
          if ((this.bpmn.key).length > 20) {
            this.$message.error('您输入的key长度过长')
            return
          }
          if ((this.bpmn.key).length < 3) {
            this.$message.error('您输入的key长度过短')
            return
          }
          this.$message.error('您输入的key不合法请检查')
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
            // console.log('1111111111111111')
            this.timeRecord = now
          }
        } else {
          // console.log('222222222222222')
          this.timeRecord = now
        }



        postAction(url, parm).then((res) => {

          if (res.success) {
            this.isClick = true
            url_model = window._CONFIG['domianURL'] + url_model + res.message
            // window.location.href = url_model
            window.open(url_model)
            this.close()

          } else {
            this.$message.error(res.message)
            window.location.reload()

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
      /*font-weight: bold;*/
      margin-left: 20px;
    }

    input {
      width: 75%;
      margin-left: 10px;

    }
  }

</style>