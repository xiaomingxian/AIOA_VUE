<template>
  <div style="width: 100%;display: flex;align-items: center;justify-content: space-between">
    <!--<apexchart width="60%" style="margin-top: 20px;" type="bar" height="400"  title="月份排行" :options="chartOptions" :series="series" ></apexchart>-->
    <div style="width: 60%">
      <apexchart  type='bar' height="450px;" title="部门统计" :options="chartOptions" :series="series"></apexchart>
    </div>
    <div class="discribion" style="width: 35%;height: 300px;">
        <h3>分析报告</h3>
        <p v-if="fenSum" style="line-height: 36px;">{{currtentYear}}年，您一共办理公文{{fenSum}}件，占同类公文的{{PeerNum}}%,其中{{maxMounth+1}}月份办理公文数量最高，{{thanAverageValue}}超过平均值,是您最忙的时候,您所办理的公文办结率达到 {{banJie}}%，占行内同类公文办结数量的{{currtenreta}}%</p>
        <p v-else>未查询到您要分析的数据</p>
    </div>
  </div>

</template>

<script>

  export default {
        inject:['reload'],
        name: "BarChart.vue",
        // props:{
        //   bardata:{
        //     type:Object,
        //
        //   }
        // },
         filters:{
            numberSlipce(val){
              if(val%1===0){
                return  val;
              }else{
                return  parseFloat(val).toFixed(2);
              }
              // return val*100
            }
        },
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

          maxMounth:'',//最大值
          thanAverageValue:'', //平均值
          isHaveDta:false
        }
      },
    created(){
      // console.log();
      // alert(this.bardata)

    },
    updated(){

    },

      methods:{
        //图表数据  按月统计展示
        getData(data) {



          let data1 = JSON.stringify(data);
          console.log(JSON.parse(data1));
          let arrdata = [];
          JSON.parse(data1).map((item) => {
            arrdata.push(item.num)
          })

          this.$nextTick(()=>{
            this.series=[{
              data:arrdata,
            }];


          })

          // console.log(arrdata);
          // this.series[0].data = [0, 0, 12, 4, 0, 0, 0, 0, 0, 0, 0, 0];



          //  月份中最大值
          this.maxMounth = arrdata.indexOf(Math.max(...arrdata));

        },

          getData5(res){

        console.log(res)
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

      },
      destroyed(){
          // this.getData();
      }

    }
</script>

<style scoped>

</style>