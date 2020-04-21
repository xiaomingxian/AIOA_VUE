<template>
  <div style="width: 100%;display: flex;align-items: center;justify-content: space-between">
    <!--<apexchart width="60%" style="margin-top: 20px;" type="bar" height="400"  title="月份排行" :options="chartOptions" :series="series" ></apexchart>-->
    <template v-if="banjielvNum">
      <div style="width: 60%">
        <apexchart width="100%" type='radialBar' height="450" :options="chartOptions" :series="series"></apexchart>
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

        banJie:'',//办结率

        banjielvNum:true,
        thanAverageValue:''


      }
    },
    created(){

    },
    methods:{
      //图表数据   获取父级传参   subData
      show(a,b){
        // alert(data)
        let url =  '/oadatafetailedinst/oaDatadetailedInst/findRate'
        getAction(url,{proInstId:a,itableId:b}).then((res) => {
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
      },
    }

  }
</script>

<style scoped>

</style>