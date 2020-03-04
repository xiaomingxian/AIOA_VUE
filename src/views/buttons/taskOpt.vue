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
          <p style="width: 100%;height: 15px;" class="otherLineShow" v-if="index==1" @click="otherLineShow">
            <a href="#">
              <a-icon  :type="iconType" />
              <span style="font-size:14px;font-weight: bold;margin-left: 5px;">其他意见</span>
            </a>
          </p>
          <div  v-show="index==0||setIndexShow==0">
            <a-textarea class="textarea" contenteditable="true" :rows="index==0?otherLine.height*1.5:otherLine.height"
                        :cols="otherLine.width"
                        :value="item[0].optionName+'\n'+ item[0].optionContext2"  readonly></a-textarea>
          </div>

        </td>
        <td width="50%">
          <p class="otherLineShow" v-if="index==1" style="visibility: hidden; width: 100%;height: 15px;border: 1px solid #aa7d7d ;border-radius: 4px;line-height: 15px" @click="otherLineShow">50%点击事件占位符</p>
          <div v-show="index==0||setIndexShow==0">
            <a-textarea class="textarea" contenteditable="true" :rows="index==0?otherLine.height*1.5:otherLine.height"
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
      return {
        setIndexShow:1,
        iconType:'down'
      }
    },
    created() {
    },
    methods: {
      otherLineShow(){
        if(this.setIndexShow==1){
          this.setIndexShow = 0;
          this.iconType = 'up'
        }else{
          this.setIndexShow = 1;
          this.iconType = 'down'

        }
      }


    }
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

  /deep/.otherLineShow{
    width: 100%;
    height: 30px;
    border: 1px solid #dddddd;
  }
</style>