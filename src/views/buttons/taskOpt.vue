<template>
  <div>
    <!--意见table-->
    <table width="100%" class="table">
      <tr v-if="justOne">
        <td class="td">
          <a-textarea class="textarea" contenteditable="true" :rows="oneLine.height*2" :cols="oneLine.width"
                      :value="oneLine.data[0].optionName+'\n'+
                      oneLine.data[0].optionContext2+'\t'" readonly></a-textarea>
        </td>
      </tr>
      <tr v-if="jiShu">
        <!--autofocus="autofocus"-->
        <td rowspan="2" width="50%">

          <div>
            <a-textarea class="textarea" contenteditable="true" :rows="oneLine.heightLeft" :cols="oneLine.widthLeft"
                        :value="oneLine.data[0].optionName+'\n'+
                      oneLine.data[0].optionContext2+'\t'" readonly></a-textarea>
          </div>
        </td>
        <td width="50%">
                <a-textarea class="textarea"  contenteditable="true" :rows="oneLine.height" :cols="oneLine.width"
                            :value="oneLine.data[1].optionName+'\n'+
                      oneLine.data[1].optionContext2+'\t'" readonly></a-textarea>
         </td>
         </tr>
         <tr v-if="jiShu">
         <td width="50%">
                <a-textarea class="textarea" contenteditable="true" :rows="oneLine.height" :cols="oneLine.width"
                            :value="oneLine.data[2].optionName+'\n'+
                      oneLine.data[2].optionContext2+'\t'" readonly></a-textarea>
        </td>
      </tr>

      <!--奇数时 其他意见框显示方式-->
      <tr v-show="ouShu&&jiShu">
        <td width="50%">
          <p
            style="width: 100%;height: 40px;line-height: 40px;background:#E9ECF2;padding: 0; margin-top: -5px; margin-bottom: 5px;"
            class="otherLineShow" @click="otherJiLineShow">
            <a href="#">
              <a-icon :type="iconType"/>
              <span style="font-size:14px;font-weight: bold;margin-left: 5px;">其他意见</span>
            </a>
          </p>
        </td>
        <td width="50%">
          <p
            style="width: 100%;height: 40px;line-height: 40px;background:#E9ECF2;padding: 0; margin-top: -5px; margin-bottom: 5px;"
            class="otherLineShow" @click="otherJiLineShow">
            <a href="#">

              <span style="font-size:14px;font-weight: bold;margin-left: 5px;"></span>
            </a>
          </p>
        </td>
      </tr>


      <tr v-if="jishuOtherShow" v-for="item,index in otherLine.data">
        <td width="50%">
          <p id="otherLineShow1"
             style="width: 100%;height: 40px;line-height: 40px;background:#E9ECF2;padding: 0; margin-top: -5px; margin-bottom: 5px;"
             class="otherLineShow" v-if="index==1" @click="otherLineShow">
            <a href="#">
              <a-icon :type="iconType"/>
              <span style="font-size:14px;font-weight: bold;margin-left: 5px;cursor:pointer">其他意见</span>
            </a>
          </p>
          <div v-show="index==0||setIndexShowJi==0">
            <a-textarea class="textarea" contenteditable="true" :rows="index==0?otherLine.height*1.5:otherLine.height"
                        :cols="otherLine.width"
                        :value="item[0].optionName+'\n'+ item[0].optionContext2" readonly></a-textarea>
          </div>

        </td>
        <td width="50%">
          <p id="otherLineShow" class="otherLineShow" v-if="index==1"
             style="background: #E9ECF2;width: 100%;height: 40px;border-top-right-radius: 4px;border-bottom-right-radius: 4px;  line-height: 40px;padding: 0;margin-top: -5px;margin-bottom: 5px;"
             @click="otherLineShow"></p>
          <div v-show="index==0||setIndexShowJi==0">
            <a-textarea class="textarea" contenteditable="true" :rows="index==0?otherLine.height*1.5:otherLine.height"
                        :cols="otherLine.width"
                        :value="item[1].optionName+'\n'+ item[1].optionContext2" readonly></a-textarea>
          </div>

        </td>

      </tr>


      <tr v-if="ouShu&&!jiShu" v-for="item,index in otherLine.data">
        <td width="50%">
          <p
            style="width: 100%;height: 40px;line-height: 40px;background:#E9ECF2;padding: 0; margin-top: -5px; margin-bottom: 5px;"
            class="otherLineShow" v-if="index==1" @click="otherLineShow">
            <a href="#">
              <a-icon :type="iconType"/>
              <span style="font-size:14px;font-weight: bold;margin-left: 5px;cursor:pointer">其他意见</span>
            </a>
          </p>
          <div v-show="index==0||setIndexShow==0">
            <a-textarea class="textarea" contenteditable="true" :rows="index==0?otherLine.height*1.5:otherLine.height"
                        :cols="otherLine.width"
                        :value="item[0].optionName+'\n'+ item[0].optionContext2" readonly></a-textarea>
          </div>

        </td>
        <td width="50%">
          <p class="otherLineShow" v-if="index==1"
             style="background:#E9ECF2;width: 100%;height: 40px;border-top-right-radius: 4px;border-bottom-right-radius: 4px;  line-height: 40px;padding: 0;margin-top: -5px;margin-bottom: 5px;"
             @click="otherLineShow"></p>
          <div v-show="index==0||setIndexShow==0">
            <a-textarea class="textarea" contenteditable="true" :rows="index==0?otherLine.height*1.5:otherLine.height"
                        :cols="otherLine.width"
                        :value="item[1].optionName+'\n'+ item[1].optionContext2" readonly></a-textarea>
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
        setIndexShow: 1,
        setIndexShowJi: 0,
        iconType: 'down',
        jishuOtherShow: false,
      }
    },
    created() {
    },
    mounted() {
      // setTimeout(()=>{
      //   console.log(document.getElementById('otherLineShow1').parentNode.height = '10px');
      //   document.getElementById('otherLineShow1').parentNode.height = '10px';
      //   document.getElementById('otherLineShow1').parentNode.style.margin = '0px';
      // },3000)
    },
    methods: {
      getOptionsNum(num) {
        if (num % 2 == 0) {
          this.setIndexShow = 0;
          this.iconType = 'up'
        } else {
          this.jishuOtherShow = true
          this.iconType = 'up'
        }
      },
      otherLineShow() {
        if (this.setIndexShow == 1) {
          this.setIndexShow = 0;
          this.iconType = 'up'
        } else {
          this.setIndexShow = 1;
          this.iconType = 'down'

        }
      },
      otherJiLineShow() {
        if (this.setIndexShowJi == 1) {
          this.setIndexShowJi = 0;
          this.jishuOtherShow = false
          this.iconType = 'down'

        } else {
          this.setIndexShowJi = 1;
          this.jishuOtherShow = true
          this.iconType = 'up'

        }
      }


    }
  }
</script>

<style>
  .textarea {
    font-weight: bolder !important;
    border-color: #ffffff !important;
    /*border-color: #aa7d7d !important;*/
    /*padding-top: 5% !important;*/
  }
  .table{
		border-collapse: collapse;
	}

	.table td {
		border:1px solid #DAE0EA;

	}

	.table tr.lastrow td {
		border-bottom: 0;
	}

	.table tr td.lastCol {
		border-right: 0;

 }
 form .textarea.ant-input {
    margin-bottom: 11px !important;
  }

  /deep/ .otherLineShow {
    width: 100%;
    height: 30px;
    border: 1px solid #dddddd;
  }
</style>