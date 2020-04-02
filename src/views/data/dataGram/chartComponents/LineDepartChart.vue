<template>
  <div style="width: 100%;display: flex;align-items: center;justify-content: space-between">
    <div style="width: 60%">
      <apexchart width="100%" type='line' height="450" title="部门统计" :options="chartOptions" :series="series"></apexchart>
    </div>
    <div class="discribion" style="width: 35%;height: 300px;">
      <h3>分析报告</h3>
      <p  v-if="fenSum" style="line-height: 36px;">{{currtentYear}}年，您一共办理公文{{fenSum}}件，占同类公文的{{PeerNum}}%,其中{{this.maxPartName}}办理公文数量最高,是您最忙的时候,您所办理的公文办结率达到{{currtenreta}}%，占行内同类公文办结数量的{{banJie}}%</p>
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
    methods:{
      //图表数据
      getData(data){
        console.log(data);
        // this.series.data=[];
        let arrdata = [];
        let   partdata= [];
        data.map((item)=>{
          arrdata.push(item.num)
          partdata.push(item.s_create_dept)
        })
        this.series[0].data = arrdata;
        this. chartOptions ={
          xaxis: {
            categories: partdata
          },

        };


        //  部门中最大值
        let maxPart =  arrdata.indexOf(Math.max(...arrdata));
        this.maxPartName = footer[maxPart];



      },
      getData1(data){
        console.log(data);
        // alert(JSON.stringify(data))

        this.currtentYear = data[1].year;

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
          this.PeerNum =  parseFloat(data[0].reta*100).toFixed(2) ;

        }


      },

      getData4(data){
        console.log('linedepart----------------------------------',data)
        if(data[0]==null){
          this.banJie =0
        }else{
          this.banJie =parseFloat(data[0].reta*100).toFixed(2);
        }
      }
    }

  }
</script>

<style scoped>

</style>