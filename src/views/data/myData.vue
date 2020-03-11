<template>
  <a-card :bordered="false" :loading="loading">
    <div class="searchBox">
        <p>
          <span>所属模块：</span>
          <a-select style="width: 260px;"  placeholder="请选择所属模块（必选项）" :defaultValue="ModelData[0].iid"  @change="getModelVal">
            <a-select-option v-for="(item,index) in ModelData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </p>

      <p>
        <span>所属业务：</span>
        <a-select style="width: 260px;" :allowClear='allowClear' ref="dsdsds"  v-model="defaultValue"   placeholder="请选择所属业务" @change="getProVal">
          <a-select-option v-for="(item,index) in ProData"  :key="index" :value="item.iid">{{item.sname}}
          </a-select-option>
        </a-select>
      </p>

      <p>
        <span>申请年份：</span>
        <a-select style="width: 260px;"   placeholder="请选择申请年份（必选项）" :defaultValue="YearData[0].year" @change="getYearVal">
          <a-select-option v-for="(item,index) in YearData" :key="index" :value="item.year">{{item.year}}
          </a-select-option>
        </a-select>
      </p>

      <p>
        <!--<a-button type="primary" @click="startAnalysis">开始数据分析</a-button>-->
      </p>
    </div>

    <a-tabs @change="getTabVal">

      <a-tab-pane  tab="分布情况" key="1">

      </a-tab-pane>

      <a-tab-pane  tab="办结率" key="2">
      </a-tab-pane>

    </a-tabs>
    <!--<Banjie v-show="false"    ref="banjieCompoment"/>-->
    <Distribution @startAnalysis="startAnalysis" v-show="tabShow==1?true:false" ref="distributionComponent"/>
    <Banjie  v-show="tabShow==2?true:false"    ref="banjieCompoment"/>
  </a-card>
</template>

<script>
  import {httpAction,getAction} from '@/api/manage'
  import Distribution from './dataGram/Distribution'
  import Banjie from './dataGram/Banjie'
    export default {
      name: "dataAnalysis",
      components: {
          Distribution,
          Banjie
      },
      inject:['reload'],
      filters:{
        numberSlipce(val){
          if(val%1===0){
            return  val;
          }else{
            return (val).toFixed(2);
          }
          // return val*100
        }
      },
      data() {
        return {
          defaultValue:'',
          //ModelData[0].sname
          tabShow:1,
          loading:false,
          fenbuqingkuang:false,
          allowClear:true,
          cheackModel:'',
          cheackPro:'',
          cheackYear:'',

          ModelData:[],
          ProData:[],
          YearData:[],

          userid:'',//人员id
          departid:'',//部门id
          parentid:'',//单位id

          subData : {   //提交数据   提交前动态修改部门id  人员id   或者单位id
            modelId:this.cheackModel,
            iBusFunctionId:this.cheackPro?this.cheackPro:'',
            iCreateYear:this.cheackYear,
            // sCreateBy:this.userid
          },
          initModal:'',
          initYear:''
        }
      },
      created(){

        //獲取用戶基本信息
        const  userinfo =JSON.parse( localStorage.getItem('userdata'));
        this.userid = userinfo.userInfo.id;// 人员id
        this.departid = userinfo.departs[0].id;//部门id
        this.parentid = userinfo.departs[0].parentId; //单位id

        //加载基本数据    所属模块列表   申请年份列表
        this.getBusModelList();
        this.getYearList();
        //  初始化 加载图表
        setTimeout(()=>{
          this.startAnalysis(this.initModal,this.initYear,'')
          let url = "/oaBus/busModelPermit/findFunctionListByModelId?id="+ this.initModal;
          getAction(url).then((res)=>{
            this.ProData = res.result;
          })
        },1000)


      },
      mounted(){


      },
      watch:{
        $route(to,from){
         this.startAnalysis();
        }

      },
      methods:{
        getTabVal(e){
          this.tabShow = e;
          this.startAnalysis();
        },
        //所属模块数据列表
        getBusModelList() {
          let url = "/papertitle/docNumSet/busModelList";
          getAction(url).then((res) => {
            this.ModelData = res.result;
            this.initModal = this.ModelData[0].iid;

            // alert( res.result[0].iid)
            // this.defaultValue = res.result[0].iid
          })
        },

        // 所属业务模块数据  参数依赖于所属模块 所选id
        getProList(value){
          let url = "/oaBus/busModelPermit/findFunctionListByModelId?id="+value;
          getAction(url).then((res)=>{
            this.ProData = res.result;
          })

        },
        //所属年份列表数据
        getYearList(){
          let url = '/data/dataAnalysis/analysis';
          getAction(url).then((res)=>{
            // alert(JSON.stringify(res.year))
            this.YearData = res.year;
            this.initYear = this.YearData[0].year;
            // console.log(res);
          })
        },
        //切换部门时所加载动画
        loadingAnimation(){
          // this.loading = true;
          // setTimeout(()=>{
          //   this.loading = false;
          // },500)
        },

        //------------------------------------------------------------------------------------------------------------
        //获取选值    所属模块value   此value值时所属业务的方法的基本参数
        getModelVal(e){
          this.cheackModel = e;
          this.subData.modelId = e;

          //获取对应业务列表  所需的模块儿id
          this.getProList(e);
          this.cheackPro = '';
          this.defaultValue = ''

            console.log(this.$refs.dsdsds);
          let initYear = this.YearData[0].year;
          //  初始化 加载图表
          this.startAnalysis(e,this.cheackYear?this.cheackYear:initYear,this.cheackPro?this.cheackPro:'')
        },
        //获取选值    所属业务value
        getProVal(e){
          this.cheackPro = e;
          this.subData.iBusFunctionId = e;



          let initModal = this.ModelData[0].iid;
          let initYear = this.YearData[0].year;
          //  初始化 加载图表
          this.startAnalysis(this.cheackModel?this.cheackModel:initModal,this.cheackYear?this.cheackYear:initYear,e)

        },
        //获取选值    申请年份value
        getYearVal(e){
          this.cheackYear = e;
          this.subData.iCreateYear = e;


          let initModal = this.ModelData[0].iid;
          //  初始化 加载图表
          this.startAnalysis(this.cheackModel?this.cheackModel:initModal,e,this.cheackPro?this.cheackPro:'')

          // alert(this.cheackModel)

        },

        //------------------------------------------------------------------------------------------------------------


        //开始分析件按钮    传递values  到接口方法参数
        startAnalysis(initModal=this.subData.modelId,initYear=this.subData.iCreateYear,initYewu=this.subData.iBusFunctionId){

            if(!Boolean(initModal)||!Boolean(initYear)){
                this.$message.warning('所属模块与申请年份为必选项')
            }else{

              const urlStr = this.$route.path;
              if(urlStr.endsWith('myData')){
                // alert('我的数据')
                // this.loadingAnimation();
                //  为对象新增属性
                // Object.assign(this.subData,{'sCreateBy':this.userid})
                this.subData={   //提交数据   提交前动态修改部门id  人员id   或者单位id
                    modelId:this.cheackModel?this.cheackModel :this.ModelData[0].iid,
                    iBusFunctionId:this.cheackPro?this.cheackPro:'',
                    iCreateYear:this.cheackYear?this.cheackYear:this.YearData[0].year,
                    sCreateBy:this.userid
                }

              }else if(urlStr.endsWith('dataAnalysis')){
                // alert('部门数据')
                // this.loadingAnimation();
                //  为对象新增属性
                // Object.assign(this.subData,{'sCreateDeptid':this.departid})
                this.subData={   //提交数据   提交前动态修改部门id  人员id   或者单位id
                  modelId:this.cheackModel?this.cheackModel :this.ModelData[0].iid,
                  iBusFunctionId:this.cheackPro?this.cheackPro:'',
                  iCreateYear:this.cheackYear?this.cheackYear:this.YearData[0].year,
                  sCreateDeptid:this.departid
                }

              }else if (urlStr.endsWith('unitidData')) {
                // alert('单位数据数据')
                // this.loadingAnimation();
                //  为对象新增属性
                // Object.assign(this.subData,{'sCreateUnitid':this.parentid})
                this.subData={   //提交数据   提交前动态修改部门id  人员id   或者单位id
                  modelId:this.cheackModel?this.cheackModel :this.ModelData[0].iid,
                  iBusFunctionId:this.cheackPro?this.cheackPro:'',
                  iCreateYear:this.cheackYear?this.cheackYear:this.YearData[0].year,
                  sCreateUnitid:this.parentid
                }


              }


              //------------------------------子组件方法调用 传参 subData     子组件分别为分布情况、办结率----------------------------------------------

              this.$refs.distributionComponent.getSubData(this.subData);
              this.$refs.banjieCompoment.getSubData(this.subData);

              // this.$refs.distributionComponent.asDepartCheack(this.subData);


            }
        },



      },
    }
</script>

<style scoped lang="less">
    .searchBox{
      width: 100%;
      height: 60px;
      border-bottom: 1px solid #cccccc;

      display: flex;

      p{
        margin-left: 20px;
      }
      p:first-child{
        margin-left: 0px;
      }
      p:last-child{
        margin-left: 50px;
      }
    }
</style>