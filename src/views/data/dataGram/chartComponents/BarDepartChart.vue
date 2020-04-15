<template>
  <div style="width: 100%;display: flex;align-items: center;justify-content: space-between">
    <!--<apexchart width="60%" style="margin-top: 20px;" type="bar" height="400"  title="月份排行" :options="chartOptions" :series="series" ></apexchart>-->
    <div style="width: 60%">
      <apexchart width="100%" type='bar' height="450" title="部门统计" :options="chartOptions" :series="series"></apexchart>
    </div>
    <div class="discribion" style="width: 35%;height: 300px;">
      <h3>分析报告</h3>
      <p  v-if="fenSum" style="line-height: 36px;">{{currtentYear}}年，您一共办理公文{{fenSum}}件，占同类公文的{{PeerNum}}%,其中{{this.maxPartName}}办理公文数量最高,是您最忙的时候,您所办理的公文办结率达到{{banJie}}%，占行内同类公文办结数量的{{currtenreta}}%</p>
      <p v-else>未查询到您要分析的数据</p>
    </div>
  </div>

</template>

<script>

  export default {
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
            categories: []
          },

        },
        currtentYear:'',
        currtenreta:'',
        fenSum:'',
        PeerNum:'',
        banJie:'',


        maxPartName:''


      }
    },
    created(){


    },
    updated(){

    },

    methods:{
      //图表数据  按月统计展示
      getData(data){
        let arrdata = [];
        let footer = [];
        data.map((item)=>{
          arrdata.push(item.num)
          footer.push(item.s_create_dept)
        })
        this.series[0].data = arrdata;
        this.chartOptions = {
          xaxis: {
            categories: footer
          },

        }


        //  部门中最大值
        let maxPart =  arrdata.indexOf(Math.max(...arrdata));
        this.maxPartName = footer[maxPart];

      },
     /* getData1(data){
        console.log(data);


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
        console.log('bardepart----------------------------------',data)
        if(data[0]==null){
          this.banJie =0
        }else{
          this.banJie =parseFloat(data[0].reta*100).toFixed(2);
          this.currtentYear = data[1].year;
        }
      },*/
      getData5(res){
        console.log(res)
        /*  let sds = [];
          data.map((item)=>{
            sds.push(item.i_create_month+'月');
          })
          this.thanAverageValue = sds.toString();*/
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

  }
</script>

<style scoped>

</style>