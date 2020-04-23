<template>
  <div style="width: 100%;display: flex;align-items: center;justify-content: space-between">
    <div style="width: 60%">
      <apexchart width="100%" type='line' height="450" title="部门统计" :options="chartOptions" :series="series"></apexchart>
    </div>
    <div class="discribion" style="width: 35%;height: 300px;">
      <h3>分析报告</h3>
      <p  v-if="fenSum" style="line-height: 36px;">{{currtentYear}}年，您一共办理公文{{fenSum}}件，占同类公文的{{PeerNum}}%,其中{{thanAverageValue}}月份办理公文数量超过平均值,是您最忙的时候,您所办理的公文办结率达到{{banJie}}%，占行内同类公文办结数量的{{currtenreta}}%</p>
      <p v-else>未查询到您要分析的数据111</p>
    </div>
  </div>
</template>

<script>
    export default {
        name: "LineChart.vue",
        components:{
            // apexchart:VueApexCharts,
        },
        data() {
        return {
          series: [{
            data: [],
          }],
          chartOptions: {
            xaxis: {
              categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            },

          },
          currtentYear:'',
          currtenreta:'',
          fenSum:'',
          PeerNum:'',
          banJie:'',


          thanAverageValue:''

        }
      },
      methods:{
        //图表数据
        getData(data){
          console.log(data);
          // this.series.data=[];
          let arrdata = [];
          data.map((item)=>{
            arrdata.push(item.num)
          })
         // this.series[0].data = arrdata;

          this.$nextTick(()=>{
            this.series=[{
              data:arrdata,
            }];


          })

        },
      /*  getData1(data){
          console.log(data);
          // alert(JSON.stringify(data))


          this.currtenreta = parseFloat(data[0].reta*100).toFixed(2);

        },
        getData2(data){
          console.log(data);
          this.fenSum = data.num1;
        },
        getData3(data){
          console.log(data);
          if(data[0]==null){
            this.PeerNum = '0'
          }else{
            this.PeerNum = parseFloat(data[0].reta*100).toFixed(2);
          }


        },

        getData4(data){
          console.log(data);
          console.log('line----------------------------------',data)
          if(data[0]==null){
            this.banJie =0
          }else{
            this.banJie =parseFloat(data[0].reta*100).toFixed(2);
            this.currtentYear = data[1].year;
          }
        },*/
        getData5(res){

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
        }
      }

    }
</script>

<style scoped>

</style>