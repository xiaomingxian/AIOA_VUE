<template>
 <div>
   <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
     <div class="salesCard">
         <div>
            <div class="optionsNav">
               <p>
                 <a-button  key="1" :type="showtype==1?primary:'default'"   @click="getShowType(1)">按月统计展示</a-button>
                 <a-button style="margin-left: 10px;"  key="2"  :type="showtype==2?primary:'default'" @click="getShowType(2)">按主办部门展示</a-button>
               </p>
              <span class="lineNav">
                <span @click="showTypeChart(0)" :style="typeChart==0? 'color:#2eabff':'color:rgba(0, 0, 0, 0.65)'">柱状图</span >
                  <a-divider type="vertical" />
                <span @click="showTypeChart(1)" :style="typeChart==1? 'color:#2eabff':'color:rgba(0, 0, 0, 0.65)'">饼状图</span>
                   <a-divider type="vertical" />
                <span @click="showTypeChart(2)" :style="typeChart==2? 'color:#2eabff':'color:rgba(0, 0, 0, 0.65)'">折线图</span>
                 <a-divider type="vertical" />
              </span>
            </div>
            <!--<apexchart width="60%" style="margin-top: 20px;" type="bar" height="400" v-if="showtype==1?true:false" title="月份排行" :options="chartOptions" :series="series" ></apexchart>-->
          <!--按月统计展示-->
           <bar-chart v-show="showtype==1&&typeChart==0?true:false" ref="bar"></bar-chart>
           <pei-chart v-show="showtype==1&&typeChart==1?true:false" ref="pie"> </pei-chart>
           <line-chart v-show="showtype==1&&typeChart==2?true:false" ref="line"> </line-chart>

           <!--按主办部门展示-->
           <bar-depart-chart v-show="showtype==2&&typeChart==0?true:false" ref="departbar"></bar-depart-chart>
           <pie-depart-chart v-show="showtype==2&&typeChart==1?true:false" ref="deparpie"></pie-depart-chart>
           <line-depart-chart  v-show="showtype==2&&typeChart==2?true:false" ref="deparline"></line-depart-chart>


         </div>
        <div>
       </div>
     </div>
   </a-card>
 </div>
</template>

<script>

  import Bar from '@/components/chart/Bar'
  import PeiChart from './chartComponents/PieChart'
  import BarChart from './chartComponents/BarChart'
  import LineChart from './chartComponents/LineChart'
  import { getLoginfo,getVisitInfo } from '@/api/api'
  import {httpAction,getAction,downFile} from '@/api/manage'
  import BarDepartChart  from './chartComponents/BarDepartChart'
  import LineDepartChart  from './chartComponents/LineDepartChart'
  import PieDepartChart  from './chartComponents/PieDepartChart'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util';

  export default {
      name: "Distribution",
      mixins:[JeecgListMixin],
      components: {
          BarDepartChart,
          LineDepartChart,
          PieDepartChart,
          // Bar,
          BarChart,
          PeiChart,
          LineChart
        },
      data() {
        return {
          queryParam:{

          },
          code: '',
          primary:'primary',// 按钮高亮处理
          loading:false,
          typeChart:0,//展示图标类型
          typeModelName:'bar',
          showtype:1,// 按月统计 主办部门
          subData:'',


          bardata:null,
          basedata:null,  // 按月查询基础数据
          basedata1:null,  // 按部门查询基础数据

        }
      },
      created() {
      ///data/dataAnalysis/HandlingRate
      },
      methods: {
        // 柱状图 饼图  折线图
        showTypeChart(e= this.typeChart){
            this.typeChart = e;
            if(e==0){
              if(this.showtype==1){
                this.$refs.bar.getData(this.basedata);
              }else{
                this.$refs.departbar.getData(this.basedata1);
              }

            }else if(e==1){
              if(this.showtype==1){
                this.$refs.pie.getData(this.basedata);
              }else{
                this.$refs.deparpie.getData(this.basedata1);
              }

            }else{
              if(this.showtype==1){
                this.$refs.line.getData(this.basedata);
              }else{
                this.$refs.deparline.getData(this.basedata1);
              }

            }

        },
        downLoad(){
          this.subData.type = this.showtype;
            console.log(this.subData);
          let config = {
            headers: {
              'Content-Type': 'application/json',
              "Access-Control-Expose-Headers": "Content-Disposition"
            },
            responseType: 'blob',//必须要写
          };
          getAction('/data/dataAnalysis/exportXls', this.subData,config).then((res)=>{
            let data = res;
            let fileName= "sdffhgjksh.xls"
            let url = window.URL.createObjectURL(new Blob([data]));
            console.log(new Blob([data]));

            let edik = document.createElement('a');
            edik.style.display = 'none';
            edik.href = url;
            edik.setAttribute('download', fileName);
            document.body.appendChild(edik);
            //点击下载
            edik.click();
            // 释放掉blob对象
            window.URL.revokeObjectURL(edik);
            // 下载完成移除元素
            document.body.removeChild(edik);





          })

        },
        // 按月统计  或者 主办部门  切换
       getShowType(e){
         this.showtype = e;
         this.getSubData(this.subData);

       },
        //图表数据  接收父及页面回传的  subData
        getSubData(data){

          this.subData = data;
          if(this.showtype==1){
            let url = '/data/dataAnalysis/myAnalysis';  //按月查询图标基本数据
            getAction(url,data).then((res)=>{
              console.log('**************************************',res);
              this.basedata = res;
              //初始化主动调用  默认 初始化为柱状图 即 “0”
              this.showTypeChart()
            })
          }else{
            let url1 = '/data/dataAnalysis/MyDepart';//按部门查询图标基本数据
            getAction(url1,data).then((res)=>{
              this.basedata1 = res;
              //初始化主动调用  默认 初始化为柱状图 即 “0”
              this.showTypeChart()
            })

          }


          let url6 = "/data/dataAnalysis/MonthAverage";   // 超过平均值月份
          getAction(url6,data).then((res) => {
            console.log(res);
            this.$refs.bar.getData5(res);
            this.$refs.pie.getData5(res);
            this.$refs.line.getData5(res);

            this.$refs.departbar.getData5(res);
            this.$refs.deparpie.getData5(res);
            this.$refs.deparline.getData5(res);

          })


        },

        // 按部门查询
        // asDepartCheack(data){
        //   // 按部门显示  查询部门
        //     console.log(data);
        //   let url = '/data/dataAnalysis/MyDepart';
        //   getAction(url,data).then((res)=>{
        //     this.basedata = res;
        //     this.showTypeChart()
        //     // console.log(res);
        //     // this.$refs.departbar.getData(res);
        //     // this.$refs.deparpie.getData(res);
        //     // this.$refs.deparline.getData(res);
        //   })
        //
        // },


      }
    }
</script>

<style scoped lang="less">

  .optionsNav{
    width: 100%;
    /*background: darkcyan;*/
    display: flex;
    align-items: center;
    justify-content: space-between;
    p{
     width: 190px;
      display: flex;
      /*background: darkcyan;*/
      justify-content: space-between;
    }
    .lineNav{
      span:hover{
        color: #2eabff;
        cursor: pointer;
      }
    }
  }

</style>