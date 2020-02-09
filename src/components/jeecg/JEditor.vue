<template>
  <a-card :bordered="false" :visible="visible">
    <div class="tinymce-editor" >
      <editor
        v-if="showFlag == 1 "
        v-model="myValue"
        :init="init"
        :disabled="disabled"
        @onClick="onClick">
      </editor>

      <!--<textarea  v-model="myValue" name="" id="" cols="30" rows="10"></textarea>-->
      <div v-if="showFlag == 2 " style="width: 80%; margin: 0 auto;display: flex;flex-direction:column;align-items: flex-start;" v-html="myValue">

      </div>
    </div>
  </a-card>
</template>

<script>
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver/theme'
  import 'tinymce/plugins/image'
  import 'tinymce/plugins/media'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/colorpicker'
  import 'tinymce/plugins/textcolor'
  import 'tinymce/plugins/fullscreen'
  export default {
    components: {
      Editor
    },
    props: {
      value: {
        type: String,
        required:false
      },
      showFlag: {
        type: Number,
        default: 1,
        required:false
      },
      newHeight: {
        type: Number,
        default: 300,
        required:false
      },
      triggerChange:{
        type: Boolean,
        default: false,
        required:false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      plugins: {
        type: [String, Array],
        default: 'lists image media table textcolor wordcount contextmenu fullscreen'
      },
      toolbar: {
        type: [String, Array],
        default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat | fullscreen'
      }
    },
    data() {
      return {
        //初始化配置
        init: {
          language_url: '/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/tinymce/skins/lightgray',
          height: 300,
          plugins: this.plugins,
          toolbar: this.toolbar,
          branding: false,
          menubar: false,
          images_upload_handler: (blobInfo, success) => {
            const img = 'data:image/jpeg;base64,' + blobInfo.base64()
            success(img)
          }
        },
        myValue: this.value,
        visible: false
      }
    },
    mounted() {
      tinymce.init({})
    },
    created(){
      //this.modifyHeight()
    },
    methods: {

      onClick(e) {
        this.$emit('onClick', e, tinymce)
      },
      modifyHeight() {
        if(this.newHeight != 300){

          this.init.height = window.innerHeight - 200 ;
        }
      },
      //可以添加一些自己的自定义事件，如清空内容
      clear() {
        this.myValue = ''
      }
    },
    watch: {
      value(newValue) {
        this.myValue = (newValue == null ? '' : newValue)
      },
      newHeight(newValue) {
        if(newValue > 300){
          this.showFlag = 2 ;
        }
        this.modifyHeight()
      },
      myValue(newValue) {
        console.log(newValue)
        if(this.triggerChange){
          console.log(1)
          this.$emit('change', newValue)
        }else{
          console.log(2)
          this.$emit('input', newValue)
        }
      }
    }
  }

</script>
<style scoped>
</style>