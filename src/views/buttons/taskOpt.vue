<template>
  <div>
    <!--意见table-->
    <table width="100%" border="0">
      <tr v-if="justOne">
        <td>
          <a-textarea class="textarea" contenteditable="true" :rows="oneLine.height*2" :cols="oneLine.width"
                      :value="oneLine.data[0].optionName+'\n'+
                      oneLine.data[0].optionContext2+'\t'" readonly></a-textarea>
        </td>
      </tr>
      <tr v-if="jiShu">
        <!--autofocus="autofocus"-->
        <td width="50%">
          <div>
            <a-textarea class="textarea" contenteditable="true" :rows="oneLine.heightLeft" :cols="oneLine.widthLeft"
                        :value="oneLine.data[0].optionName+'\n'+
                      oneLine.data[0].optionContext2+'\t'"  readonly></a-textarea>
          </div>
        </td>
        <td width="50%">
          <div>
            <!--rows="5" cols="50"-->
            <a-textarea class="textarea" contenteditable="true" :rows="oneLine.height" :cols="oneLine.width"
                        :value="oneLine.data[1].optionName+'\n'+
                      oneLine.data[1].optionContext2+'\t'"  readonly></a-textarea>
            <a-textarea class="textarea" contenteditable="true" :rows="oneLine.height" :cols="oneLine.width"
                        :value="oneLine.data[2].optionName+'\n'+
                      oneLine.data[2].optionContext2+'\t'"  readonly></a-textarea>
          </div>
        </td>
      </tr>
      <tr v-if="ouShu" v-for="item,index in otherLine.data">

        <td width="50%">
          <div >
            <a-textarea class="textarea" contenteditable="true" :rows="index==0?otherLine.height*2:otherLine.height"
                        :cols="otherLine.width"
                        :value="item[0].optionName+'\n'+ item[0].optionContext2"  readonly></a-textarea>
          </div>

        </td>
        <td width="50%">
          <div >
            <a-textarea class="textarea" contenteditable="true" :rows="index==0?otherLine.height*2:otherLine.height"
                        :cols="otherLine.width"
                        :value="item[1].optionName+'\n'+ item[1].optionContext2"  readonly></a-textarea>
          </div>

        </td>
      </tr>

    </table>

  </div>
</template>


<script>
  import {OptJs} from "./btn-js/OptJs";

  export default {
    name: "taskOpt",
    mixins: [OptJs],
    components: {},
    data() {
      return {}
    },
    created() {
    },
    methods: {}
  }
</script>

<style>
  .textarea{
    font-weight: bolder !important;
    border-color: #aa7d7d !important;
    /*padding-top: 5% !important;*/
  }

  form .textarea.ant-input {
    margin-bottom: 11px !important;
  }
</style>