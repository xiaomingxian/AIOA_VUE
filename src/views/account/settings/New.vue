<template>
  <div class="wrap">
    <a-spin :spinning="confirmLoading">
    <a-form :form="form">

      <div style="width: 100%; display: flex;align-items: center;">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <img style="width: 41px;height: 32px;" src="../../../../src/assets/switchSet@2x.png"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <h3 style="padding: 4px 0 0 9px;font-weight: bolder;">功能样式配置</h3>
        </a-form-item>
      </div>

    <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol">
      <span >AI语音 :&nbsp&nbsp</span><a-switch @change="onChange1" v-model="iisAi" checked-children="是" un-checked-children="否"></a-switch>
      <span style="margin-left: 20px">待办工作即时消息提醒 :&nbsp&nbsp</span><a-switch @change="onChange2" v-model="iisMessages" checked-children="是" un-checked-children="否"></a-switch>
      <span style="margin-left: 20px">折叠展示数据 :&nbsp&nbsp</span><a-switch @change="onChange3" v-model="iisFold"  checked-children="是" un-checked-children="否"></a-switch>
      <span style="margin-left: 10px">默认首页风格 :&nbsp&nbsp</span><a-switch @change="onChange4" checked-children="日程办公" v-model="iisCalendar"   un-checked-children="传统首页"></a-switch>
    </a-form-item>

    <a-form-item
      style="padding-bottom: 20px;border-bottom: 1px solid;"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol">
      <span >字号 :&nbsp&nbsp</span>
      <a-radio-group
        style="font-weight: bolder;"
        name="radioGroup"
        v-model="iisFontSize"
       :defaultValue="2">
        <a-radio v-for="(atom,index) in fontSizeList" :value="parseInt(atom.value)">{{atom.text}}</a-radio>
      </a-radio-group>
    </a-form-item>

   <!-- <a-form-item
      :labelCol="labelCol"
      :wrapperCol="wrapperCol">
    <span>待办工作即时消息提醒 :&nbsp&nbsp</span><a-switch @change="onChange2" v-model="iisMessages" checked-children="是" un-checked-children="否"></a-switch>
    </a-form-item>-->
     <!-- <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        </a-form-item>-->
      <!--<a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
      <span>默认首页风格 :&nbsp&nbsp</span><a-switch @change="onChange4" checked-children="日程办公" v-model="iisCalendar"   un-checked-children="传统首页"></a-switch>
      </a-form-item>-->
      <!--<a-form-item-->
        <!--:labelCol="labelCol"-->
        <!--:wrapperCol="wrapperCol" >-->
        <!--<div style="width: 100%; display: flex;align-items: center;justify-content: space-between">-->
          <!--<span>时限待办纳入日程天数： &nbsp&nbsp</span>-->
          <!--<a-input style="width: 480px;" placeholder="时限待办纳入日程天数" v-model="icalendarDay" />-->
        <!--</div>-->
      <!--</a-form-item>-->

      <!--<a-form-item-->
        <!--:labelCol="labelCol"-->
        <!--:wrapperCol="wrapperCol" >-->
        <!--<div style="width: 100%; display: flex;align-items: center;justify-content: space-between">-->
          <!--<span>用户IP地址： &nbsp&nbsp</span>-->
          <!--&lt;!&ndash;<a-input style="width: 480px;" placeholder="用户IP地址" v-model="ip" />&ndash;&gt;-->
          <!--<a-input style="width: 480px;" placeholder="用户IP地址" v-model="ip" />-->
        <!--</div>-->
      <!--</a-form-item>-->

      <div style="width: 100%; display: flex;align-items: center;">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <img style="width: 44px;height: 44px;" src="../../../../src/assets/modelSet@2x.png"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol">
          <h3 style="padding: 4px 0 0 9px;font-weight: bolder;">首页模块配置</h3>
        </a-form-item>
      </div>

      <div style="width: 100%; display: flex;align-items: center;justify-content: space-between">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="列表办公(二行右侧)\日程办公">
          <a-select v-model="ibus1Id" style="width: 210px;">
            <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{"["+item.busModelName+"]"+item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="列表办公(三行左侧)">
          <a-select v-model="ibus2Id" style="width: 210px;">
            <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{"["+item.busModelName+"]"+item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
       <div style="width: 100%; display: flex;align-items: center;justify-content: space-between">
         <a-form-item
           :labelCol="labelCol"
           :wrapperCol="wrapperCol"
           label="列表办公(三行中侧)">
           <a-select  v-model="ibus3Id" style="width: 210px;">
             <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{"["+item.busModelName+"]"+item.sname}}
             </a-select-option>
           </a-select>
         </a-form-item>
         <a-form-item
           :labelCol="labelCol"
           :wrapperCol="wrapperCol"
           label="列表办公(三行右侧)">
           <a-select  v-model="ibus4Id" style="width: 210px;">
             <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{"["+item.busModelName+"]"+item.sname}}
             </a-select-option>
           </a-select>
         </a-form-item>
       </div>
      <div style="width: 100%; display: flex;align-items: center;justify-content: space-between">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="时限待办纳入日程天数：">
          <a-input style="width: 210px;" placeholder="时限待办纳入日程天数" v-model="icalendarDay" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="绑定IP地址：">
          <!--<a-input style="width: 480px;" placeholder="用户IP地址" v-model="ip" />-->
          <a-input style="width: 210px;" placeholder="绑定IP地址" v-model="ip" />
        </a-form-item>
      </div>

      <a-button icon="save" @click="handleOk" >保存</a-button>
      <!--<a-button icon="close-circle" @click="handleCeal" style="background: #b4d7ff;margin-left: 20px">取消</a-button>-->
    </a-form>
    </a-spin>
  </div>

</template>
<script>
  import { colorList } from '@/components/tools/setting'
  import ASwitch from 'ant-design-vue/es/switch'
  import AList from "ant-design-vue/es/list"
  import AListItem from "ant-design-vue/es/list/Item"
  import { mixin } from '@/utils/mixin.js'
  import { httpAction,getAction,postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import ImgDragSort from "../../jeecg/ImgDragSort";


  const Meta = AListItem.Meta

  export default {
    data () {
      return {
        userid:'',
        iid:'',
        labelCol: {
          /*xs: { span: 24 },
          sm: { span: 5 },*/
        },
        wrapperCol: {
         /* xs: { span: 24 },
          sm: { span: 16 },*/
        },
        confirmLoading: false,
        selectedModel: null,
        modelData: [],
        url: {
          add: "/testt/sysUserSet/add",
          edit: "/testt/sysUserSet/edit",
          changIp: "/sys/user/changeIP",
          sysDict: "/sys/dict/getDictByKeyObj",
        },
        form: this.$form.createForm(this),
        model: {},
        // getdata:null,
        iisAi:false,
        iisMessages:false,
        iisFold:false,
        iisCalendar:false,
        iisFontSize: 2,
        fontSizeList: [],
        ibus1Id:'',
        ibus2Id:'',
        ibus3Id:'',
        ibus4Id:'',
        icalendarDay:'',
        checked:true,
        ip:'',
        // isnewbody:''
      }
    },
   inject:['reload'],
    created () {
      this.InitializeQuery();
      this.getBusModelList();
      //查询字体大小
      this.getFontSizeFun();
    },
    watch: {
      selectedModel: 'getBusModelList'
    },
    components: {
      ImgDragSort,
      AListItem,
      AList,
      ASwitch,
      Meta
    },
    mixins: [mixin],
    methods: {
      //获取字体大小的字典值
      getFontSizeFun(){
        getAction(this.url.sysDict,{dictKey:'fontSize'}).then((res) =>{
          this.fontSizeList = res.result;
        })
      },
      //下拉选列表-所属功能
      getBusModelList() {
        let url = "/oaBus/Calendar/oaCalendar/getFunctionName";
        getAction(url).then((res) => {
          console.log(res.result);
          this.modelData = res.result;
        })
      },

      // 确认提交按钮   新增与编辑 判断
      handleOk(){
        console.log(this.isnewbody);
        let subdata = {
          iid:this.isnewbody ?this.getdata.iid:'',
          ibus1Id:this.ibus1Id,
          ibus2Id:this.ibus2Id,
          ibus3Id:this.ibus3Id,
          ibus4Id:this.ibus4Id,
          iisAi:this.iisAi?1:0,
          iisMessages:this.iisMessages?1:0,
          iisFold:this.iisFold?1:0,
          iisCalendar:this.iisCalendar?1:0,
          iisFontSize:this.iisFontSize,
          icalendarDay:Number(this.icalendarDay)
        }
        let   param = {
          ip:this.ip,
        }
        //编辑接口
        if(this.isnewbody){
          // console.log(subdata.iisCalendar);
          if(param.ip == this.isnewbody.ip){//ip没有改动
            postAction(this.url.edit,subdata).then((res) => {
              this.$message.success(res.message);
              this.InitializeQuery();
            })
             console.log(this.isnewbody.ip)
           //ip有修改


          }
         else{
            postAction(this.url.changIp, param).then((res) => {
              postAction(this.url.edit,subdata).then((res) => {
                this.$message.success(res.message);
                this.InitializeQuery();
              })
            })


          }



        }else{

           //  新增接口
          postAction(this.url.add,subdata).then((res) => {
              console.log(res.result);
              this.$message.success(res.message);
              this.InitializeQuery();
            // window.location.reload()
            // if(subdata.iisCalendar==1){
            //   this.$store.commit('setIndexOne')
            // }else{
            //   this.$store.commit('setIndexTwo')
            // }
            // console.log('//////////////////-----------------'+this.$store.state.indexState);

          })
          postAction(this.url.changIp,param).then((res) => {
          })
        }
      },
      InitializeQuery(){
        const  userid =JSON.parse( localStorage.getItem('userdata')).userInfo.id;
        console.log(userid);
        this.userid = userid;
        let url = "/testt/sysUserSet/queryByUserId";
        getAction(url,{userId:userid}).then((res) => {
          this.iisFontSize = res.result.iisFontSize;
          console.log(res.result);
          this.isnewbody = res.result;
          this.getdata = res.result;
          //是否閱讀
          if(this.getdata.iisAi){
            this.iisAi = true;
          }
          //是否消息提醒
          if(this.getdata.iisMessages){
            this.iisMessages = true;
          }
          //是否展示數據
          if(this.getdata.iisFold){
            this.iisFold = true;
          }
          //是否日程辦公
          if(this.getdata.iisCalendar){
            this.iisCalendar = true;
          }


          this.ibus1Id = this.getdata.ibus1Id;
          this.ibus2Id = this.getdata.ibus2Id;
          this.ibus3Id = this.getdata.ibus3Id;
          this.ibus4Id = this.getdata.ibus4Id;

          this.icalendarDay = this.getdata.icalendarDay;

          if(this.getdata.ip != '' || this.getdata.ip != null){
            this.ip = this.getdata.ip;
          }else{
            this.ip = '';
          }



        });
      },
    /*  handleCeal(){
           this.InitializeQuery();
       /!* this.reload();*!/
      },*/
      onChange1 (checked) {

          if(checked){
            this.iisAi = 1;
          }else{
            this.iisAi = 0;
          }},
      onChange2 (checked) {
        console.log(checked);
          if(checked){
            this.iisMessages = 1;
          }else{
            this.iisMessages = 0;
          } },
          onChange3 (checked) {
          if(checked){
            this.iisFold = 1;
          }else{
            this.iisFold = 0;
          }},
         onChange4 (checked) {
          if(checked){
            this.iisCalendar = 1;
          }else{
            this.iisCalendar = 0;
          }},
      close () {
        this.visible = false;
      },
    }
  }
</script>
<style scoped lang="less">
  .wrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>