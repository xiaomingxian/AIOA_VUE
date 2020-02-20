<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="日程内容">
          <a-input placeholder="请输入日程内容" v-decorator="['stitle', {rules:[{required:true,message:'标题不能为空'}]}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="参与人员">
          <j-select-user-by-dep ref="joinpeopleComponent" v-decorator="[ 'suserNames', {rules:[{required:true,message:'参与人员不能为空'}]}]"   @senUserId="senUserId" @senUserName="senUserName" :userIdLists="userIdLists" v-model="userRealName" @getUD2="getUD2" ></j-select-user-by-dep>
          </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="日程地点">
          <a-input placeholder="请输入日程地点" v-decorator="['saddress', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="置顶">
          <a-radio-group  :defaultValue="0" v-decorator="['iisTop', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="领导日程">
          <a-radio-group  :defaultValue="0" v-decorator="['iisLeader', {}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="消息提醒">
          <a-select style="width: 200px;"
                    placeholder="消息提醒"
                    v-decorator="['iremindType', {}]">
            <a-select-option :value="1">10分钟前</a-select-option>
            <a-select-option :value="2">30分钟前</a-select-option>
            <a-select-option :value="3">1小时前</a-select-option>
            <a-select-option :value="4">2小时前</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="公开类型">
          <a-select style="width: 200px;"
                    placeholder="公开类型"
                    v-decorator="['iopenType', {}]">
            <a-select-option :value="1">全行</a-select-option>
            <a-select-option :value="2">分管</a-select-option>
            <a-select-option :value="3">部门内</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开始时间">
          <a-date-picker  @ok="getStartTime" showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dStartTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="结束时间">
          <a-date-picker  @ok="getEndTime" showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'dEndTime', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction,getAction,putAction,postAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'

  export default {
    name: "oaCalendarModal",
    inject:['reload'],
    components: {
      JSelectUserByDep
    },
    data () {
      return {
        ischeck:false,// 判断进入模态框此时状态   是编辑还是查看  默认为编辑
        richengData:'',//日程办公数据回显数据
        userlistid:'',//所选人员id  为字符串拼接
        usernamelistsarr:'',//所选人员 名称拼接    之前提交ids 字符拼接  现改为names 字符拼接
        selectusernames:[],
        userRealName:'',
        userIdLists:[],
        dstartTime:'',
        dendTime:'',
        userList:[],
        title:"新增",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          add: "/oaBus/Calendar/oaCalendar/add",
          edit: "/oaBus/Calendar/oaCalendar/edit",
        },
        username:''
      }
    },
    created () {
      const  userinfo =JSON.parse( localStorage.getItem('userdata')).userInfo;

   console.log(this.userRealName);
      this.username = userinfo.username;

    },
    methods: {
      //修改
   /*   dayAnnalysis(data){
        this.visible = true;
        this.userIdLists = Array.from(data.suserNameid);
        this.title = '编辑';
        this.ischeck = false;
        this.form.resetFields();
        this.model = Object.assign({},data);
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'stitle','iid','suserNames','saddress','iisTop','iisLeader','iremindType','iopenType','dStartTime','dEndTime','screateBy','ibusModelId','ibusFunctionId','ifunDataId'))
          //时间格式化
          console.log(this.model.suserNames);
          this.form.setFieldsValue({dStartTime:this.model.dStartTime?moment(this.model.dStartTime):null})
          this.form.setFieldsValue({dEndTime:this.model.dEndTime?moment(this.model.dEndTime):null})
          // this.form.setFieldsValue({suserNames:this.model.suserNames.replace(/,/g,'')})
          this.form.setFieldsValue({suserNames:this.model.suserNames})
          // this.form.setFieldsValue({suserNames:this.model.suserNames.substring(0,this.model.suserNames.lastIndexOf(',')).split(',')})
        });
      },*/
      add (add=true) {
        this.update(add=true);
        this.title = '新增';
      },
      senUserName(data){
        this.userRealName=data
        console.log(this.userRealName.toString())
        this.$nextTick(() => {
          this.form.setFieldsValue({suserNames:this.userRealName.toString()})
        });
      },
      senUserId(data){
        this.userIdLists = data
      },
      // 我的日程回显  record   回显方法调用来自于jeecgListMixin.js
      update (record) {
        this.title = '编辑';
        if(typeof (record)!='boolean'){
          if(this.username!=record.screateBy){
            this.$message.error('您没有权限编辑他人日程')
            return false;
          }
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          console.log(this.model.suserNames)
          this.form.setFieldsValue(pick(this.model,'stitle','iid','suserId','suserNames','saddress','iisTop','iisLeader','iremindType','iopenType','dStartTime','dEndTime','screateBy','ibusModelId','ibusFunctionId','ifunDataId'))
          //时间格式化
          this.form.setFieldsValue({dStartTime:this.model.dStartTime?moment(this.model.dStartTime):null})
          this.form.setFieldsValue({dEndTime:this.model.dEndTime?moment(this.model.dEndTime):null})
          this.form.setFieldsValue({suserNames:this.model.suserNames})
          console.log(this.model.suserNames)
          // this.form.setFieldsValue({suserNames:this.model.suserNames.substring(0,this.model.suserNames.lastIndexOf(',')).split(',')})
        //  this.form.setFieldsValue({suserNames:this.model.suserNames})
        });

      },
      //获取开始时间
      getStartTime(a){
        console.log(a._d);
        this.model.dStartTime = a._d;;
      },
      //获取结束时间
      getEndTime(a){
        console.log(a._d);
        this.model.dEndTime = a._d;

      },

      close () {
        this.$emit('close');
        this.$refs.joinpeopleComponent.myselfColse()
        // console.log(this.$refs.joinpeopleComponent.myselfColse());
        this.visible = false;
      //  myselfColse
      },
      handleOk () {
        // console.log(this.form.getFieldsValue('stitle'));
        // console.log(this.ischeck);
        // console.log(this.userRealName);
        // if(this.model.stitle==undefined){
        //   this.$message.warning("标题不能为空");
        //   return ;
        // }


        if(!this.ischeck){
          const that = this;
          // 触发表单验证
          this.form.validateFields((err, values) => {
            if (!err) {
              let formData = Object.assign(this.model, values);
              that.confirmLoading = true;
              let httpurl = '';
              let method = '';
              if(!this.model.iid){
                httpurl+=this.url.add;
                method = 'post';
                formData.dStartTime = this.timer( this.model.dStartTime);
                formData.dstartTime = this.timer( this.model.dStartTime);
                formData.dEndTime =this.timer(this.model.dEndTime)  ;
                formData.dendTime =this.timer(this.model.dEndTime)  ;
              }else{
                httpurl+=this.url.edit;
                method = 'put';
                formData.dStartTime = this.timer( this.model.dStartTime);
                formData.dstartTime = this.timer( this.model.dStartTime);
                formData.dEndTime =this.timer(this.model.dEndTime)  ;
                formData.dendTime =this.timer(this.model.dEndTime)  ;
              }
              formData.suserNames = this.model.suserNames;
              let ds = Object.keys(formData);
              putAction(httpurl,formData,method).then((res)=>{
                if(res.success){
                  that.$message.success(res.message);
                  // that.$emit('myrichenClose',true);
                  that.reload()
                }else{
                  that.$message.warning(res.message);
                }
              }).finally(() => {
                that.confirmLoading = false;
                that.close();
              })
            }
          })
        }else{
          this.$message.error('您现在为查看状态，不能更改')
          // this.close()
        }

      },
      handleCancel () {
        this.close()
        this.$refs.joinpeopleComponent.myselfColse()
      },
      timer(timeval){
        let date1 = new Date(timeval);
        let Y = date1.getFullYear();
        let M = date1.getMonth()+1;
        let D = date1.getDate();
        let newTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D)+" "+date1.toTimeString().substr(0,8);
        console.log(newTime);
        return newTime;
      }


    }
  }
</script>

<style lang="less" scoped>

</style>