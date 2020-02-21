<template>
  <a-modal
    :title="title"
    :width="710"
    :height="450"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <div>
      <h3>排版：{{createName}}</h3>
      <h3>排版：{{createName}}</h3>
    </div>
    <!--<p class="title"><span>{{item.depart_name}}</span></p>-->


  </a-modal>
</template>
<script>

  import {getAction, postAction} from "@/api/manage";
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import axios from 'axios'

  export default {
    name: "paiBanDengJi",
    data() {
      return {
        createName:"",
        currentName:"",
        title:"排版登记",
        visible: false,
        url: {
          queryDownUnits: '/oaBus/dynamic/queryUnitsByUser',
        }
      }
    },
    methods: {
      show(createName,currentName) {
        this.createName = createName ;
        this.currentName = currentName ;
        this.visible = true;
      },

      handleOk() {
        this.$emit('confimName') ;
        this.visible = false ;
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.createName = '' ;
        this.currentName = '' ;
      },

      handleCancel() {
        this.close();
      },

    },
  }
</script>




