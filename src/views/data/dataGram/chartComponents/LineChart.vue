<template>
  <div style="width: 100%;display: flex;align-items: center;justify-content: space-between">
    <div style="width: 60%">
      <apexchart width="100%" type='line' height="450" title="部门统计" :options="chartOptions" :series="series"></apexchart>
    </div>
    <div class="discribion" style="width: 35%;height: 300px;">
      <h3>分析报告</h3>
      <p  v-if="fenSum" style="line-height: 36px;">{{currtentYear}}年，您一共办理公文{{fenSum}}件，占同类公文的{{PeerNum}}%,其中{{thanAverageValue}}月份办理公文数量超过平均值,是您最忙的时候,您所办理的公文办结率达到{{currtenreta}}%，占行内同类公文办结数量的{{banJie}}%</p>
      <p v-else>未查询到您要分析的数据</p>
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
          this.series[0].data = arrdata;


        },
        getData1(data){
          console.log(data);
          // alert(JSON.stringify(data))

          this.currtentYear = data[1].year;

          this.currtenreta = data[0].reta*100;

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
            this.PeerNum = data[0].reta*100;
          }


        },

        getData4(data){
          console.log(data);
          console.log('line----------------------------------',data)
          if(data[0]==null){
            this.banJie =0
          }else{
            this.banJie =data[0].reta*100;
          }
        },
        getData5(data){
          let sds = [];
          data.map((item)=>{
            sds.push(item.i_create_month+'月');
          })
          this.thanAverageValue = sds.toString();
        }
      }

    }
</script>

<style scoped>

</style>