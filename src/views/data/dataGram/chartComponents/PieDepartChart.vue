<template>
  <div style="width: 100%;display: flex;align-items: center;justify-content: space-between">
    <div style="width: 60%">
      <apexchart width="100%" type='pie' height="450" :options="chartOptions" :series="series"></apexchart>

    </div>
    <div class="discribion" style="width: 35%;height: 300px;">
      <h3>分析报告</h3>
      <p  v-if="fenSum" style="line-height: 36px;">{{currtentYear}}年，您一共办理公文{{fenSum}}件，占同类公文的{{PeerNum}}%,其中{{this.maxPartName}}办理公文数量最高
        ,是您最忙的时候,您所办理的公文办结率达到{{banJie}}%，占行内同类公文办结数量的{{currtenreta}}%</p>
      <p v-else>未查询到您要分析的数据</p>

    </div>
  </div>
</template>

<script>
  export default {
    name: "PieChart.vue",
    components:{
      // apexchart:VueApexCharts,
    },
    data() {
      return {
        // typeChart:'',//展示图标类型
        // showtype: true,

        // chart:{
        //   id:'chart',
        //   type:'pie'
        // },
        series: [],
        chartOptions: {
          labels: [],
          responsive:[{
            breakpoint : 480,
            options:{
              /* char:{
                 width:200
               },*/
              legend:{
                position : 'right'
              }
            }
          }]
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
        let catdata = [];
        data.map((item)=>{
          arrdata.push(item.num)
          catdata.push(item.s_create_dept)
        })
        this.series = arrdata;
        this.chartOptions = {
          labels: catdata
        };


        //  部门中最大值
        let maxPart =  arrdata.indexOf(Math.max(...arrdata));
        this.maxPartName = footer[maxPart];

      },
      // getData1(data){
      //   console.log(data);
      //   // alert(JSON.stringify(data))
      //
      //
      //   this.currtenreta = parseFloat(data[0].reta*100).toFixed(2);
      //
      // },
      // getData2(data){
      //   console.log(data);
      //   this.fenSum = data.num1;
      // },
      // getData3(data){
      //   console.log(data);
      //   if(data[0]==null){
      //     this.PeerNum = '0'
      //   }else{
      //     this.PeerNum = parseFloat(data[0].reta*100).toFixed(2);
      //   }
      //
      //
      // },
      //
      // getData4(data){
      //   console.log('piedepart----------------------------------------',data);
      //   if(data[0]==null){
      //     this.banJie =0
      //   }else{
      //     this.banJie =parseFloat(data[0].reta*100).toFixed(2);
      //     this.currtentYear = data[1].year;
      //
      //   }
      // }
      getData5(res){
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
    }

  }
</script>

<style scoped>

</style>