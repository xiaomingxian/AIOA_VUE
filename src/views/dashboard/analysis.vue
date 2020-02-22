<template>
  <div class="wrap">

    <day-analysis  v-if="Boolean(iisCalendar)"></day-analysis>
    <new-one-parts v-else></new-one-parts>
  </div>
</template>


<script>
  import { httpAction,getAction,postAction } from '@/api/manage'
  import NewOneParts from './NewOneParts'
  import DayAnalysis from './DayAnalysis'


  export default {
    data () {
      return {
        iisCalendar:0

      }
    },
    components:{
      NewOneParts,
      DayAnalysis
    },
    created () {
      // alert(this.indexState)
      console.log(this.$store.state.indexState);
      //獲取用戶基本信息
      const  userid =JSON.parse( localStorage.getItem('userdata')).userInfo.id;
      console.log(userid);
      this.userid = userid;

    //  ---------判断当前用户是否开启了默认首页或者日程办公---------------------------
      let indexUrl = "/testt/sysUserSet/Home?&sUserId="+this.userid;
      getAction(indexUrl).then((res) => {
        console.log(res);
        let iisCalendar = res.result.iisCalendar;
        this.iisCalendar = iisCalendar;
        
        console.log(iisCalendar);
      });

    },
    mounted() {
      // let height = document.body.clientHeight-135;
      // document.querySelector('.wrap').style.height = height +'px'
      // alert(height)

    },
    activated () {
      this.showTitleBg();
    },
    methods: {
      showTitleBg(){

        document.getElementsByClassName('header')[0].style.top = '0px';
        document.getElementsByClassName('trigger')[0].style.top = '5px';
        document.getElementsByClassName('user-wrapper')[0].style.top = '0px';

      }
    }


  }
</script>
