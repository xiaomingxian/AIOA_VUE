<template>
   <div style="width: 100%;display: flex;align-items: center;justify-content: space-between">
    <!--<apexchart width="60%" style="margin-top: 20px;" type="bar" height="400"  title="月份排行" :options="chartOptions" :series="series" ></apexchart>-->
   <template v-if="banjielvNum">
     <div style="width: 60%">
       <apexchart width="100%" type='radialBar' height="450" :options="chartOptions" :series="series"></apexchart>
     </div>
     <div class="discribion" style="width: 35%;height: 300px;">
       <h3>分析报告</h3>
       <p style="line-height: 36px;">{{currtentYear}}年，您一共办理公文{{fenSum}}件，占同类公文的{{PeerNum}}%,其中{{thanAverageValue}}份办理公文数量超过平均值,是您最忙的时候,您所办理的公文办结率达到{{banJie}}%，占行内同类公文办结数量的{{currtenreta}}%</p>
     </div>
   </template>
     <template v-else>
       <p>办结率为0</p>
     </template>
  </div>
</template>

<script>
  import {httpAction,getAction} from '@/api/manage'
  export default {

    components:{
      // apexchart:VueApexCharts,
    },

    data() {
      return {
        series: [],
        chartOptions: {
          chart:{
            type:'radialBar',
            toolbar:{
              show:true
            }
          },
          labels:['办结率'],
        },

        currtentYear:'', //年份
        currtenreta:'',//占行内
        fenSum:'',//件
        PeerNum:'',
        banJie:'',//办结率

        banjielvNum:true,
        thanAverageValue:''


      }
    },
    created(){

    },
    methods:{
      //图表数据   获取父级传参   subData
      getSubData(data){
        console.log('=-=--====-=-=-=-=-=-=-===========================------------------------',data);
        // alert(data)
        let url = "/data/dataAnalysis/Rate";
        getAction(url,data).then((res) => {
          console.log(res);
          if(res.reta){
            this.series = [];
            if((res.reta)%1===0){
              this.series.push((res.reta)*100);
            }else{
              this.series.push(((res.reta)*100).toFixed(2));
            }
          }else{
            this.banjielvNum = false
          }

        })


      /*  let url2 = '/data/dataAnalysis/HandlingRate'; //办理率
        getAction(url2,data).then((res)=>{
          console.log(res);
          this.currtenreta = parseFloat(res[0].reta*100).toFixed(2);
          this.currtentYear = res[1].year;



        })

        let url3 = '/data/dataAnalysis/Handling';  //总共办理的公文数量
        getAction(url3,data).then((res)=>{
          console.log(res);
          this.fenSum = res.num1;

        })
        let url4 = '/data/dataAnalysis/PeerNum';  //办理的数量占同行办理数量的比例
        getAction(url4,data).then((res)=>{
          console.log(res);

          if(res[0]==null){
            this.PeerNum =0
          }else{
            this.PeerNum = parseFloat(res[0].reta*100).toFixed(2);
          }

        })
*/
        let url5 = "/data/dataAnalysis/MonthAverage";   // 超过平均值月份
        getAction(url5,data).then((res) => {


          if(res[0] == 0){
            this.banJie = 0;
          }else{
            this.banJie = parseFloat(res[0].reta*100).toFixed(2);
          }
          if(res[2] == 0){
            this.currtenreta = 0;
          }else{
            this.currtenreta =  parseFloat(res[2].HandlingRate*100).toFixed(2);
          }
          if(res[1] == 0){
            this.PeerNum = 0;
          }else{
            this.PeerNum = parseFloat(res[1].preeNum*100).toFixed(2);
          }
          this.fenSum = res[3].Handling;
          this.currtentYear = res[4].year

          /* let sds = [];
          res.map((item)=>{
            sds.push(item.i_create_month+'月');
          })
          this.thanAverageValue = sds.toString();*/
        })


      },



    }

  }
</script>

<style scoped>

</style>