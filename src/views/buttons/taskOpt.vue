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
            class="otherLineShow" @click="otherJiLineShow">
            <a href="#">
              <a-icon :type="iconType"/>
              <span>其他意见</span>
            </a>
          </p>
        </td>
        <td width="50%">
          <p
            class="otherLineShow" @click="otherJiLineShow">
            <a href="#">
              <span></span>
            </a>
          </p>
        </td>
      </tr>


      <tr v-if="jishuOtherShow" v-for="item,index in otherLine.data">
        <td width="50%">
          <p id="otherLineShow1"
             class="otherLineShow" v-if="index==1" @click="otherLineShow">
            <a href="#">
              <a-icon :type="iconType"/>
              <span>其他意见</span>
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
            class="otherLineShow" v-if="index==1" @click="otherLineShow">
            <a href="#">
              <a-icon :type="iconType"/>
              <span>其他意见</span>
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

<style lang="less" scoped>

  @import "../../assets/less/detailsBaseStyle.less";


</style>