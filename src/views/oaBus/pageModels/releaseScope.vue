<template>
  <div style="padding: 10px">


    <a-radio-group v-model="iIsLimits"  @change="selectJG">
      <a-radio @click="selectFun(1)" :value="1">全行</a-radio>
      <a-radio @click="selectFun(2)" :value="2">部门</a-radio>
      <a-radio @click="selectFun(3)" :value="3">用户</a-radio>
    </a-radio-group>
    <a-button type="primary" @click="handerOk" v-show="false">发布</a-button>
    <a-row :gutter="24" v-show='iIsLimits==2'>
      <a-col :span="24">
        <a-form-item label="选择部门">
          <j-select-depart v-model="departId" @change="change"  :multi="true"></j-select-depart>
        </a-form-item>
      </a-col>

    </a-row>
    <a-row :gutter="24" v-show='iIsLimits==3'>
      <a-col :span="24">
        <a-form-item label="选择用户">
          <j-select-user-by-dep v-model="userRealName"  @change="change" :userIdLists="userIdLists" @senUserName="senUserName" @senUserId="userIds"></j-select-user-by-dep>
        </a-form-item>
      </a-col>

    </a-row>


    <!--<a-input-search
      v-model="selectedDepUsers"
      placeholder="请先选择用户"
      disabled
      @search="onSearchDepUser">
      <a-button slot="enterButton" :disabled="disabled">选择用户</a-button>
    </a-input-search>-->

  </div>
</template>

<script>
  import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
  import {getAction, postAction} from "@/api/manage";
  import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'

  export default {
    name: 'releaseScope',
    components: {
      JSelectDepart,
      JSelectUserByDep
    },
    props: {
      backData: {
        type: Object,
        required: false
      },
      modalWidth: {
        type: Number,
        default: 1250,
        required: false
      },
      value: {
        type: String,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    watch:{
      backData:function (value) {
        this.backData =value
        this.initData(value)
      },
      value(val) {
        this.selectedDepUsers = val
      }
    },
    inject: ['reload'],
    data() {
      return {
        userIdLists:'',
        selectedDepUsers: "",
        iIsLimits: '',
        departId: '',
        userRealName: '',
        userIdList:"",
        url: {
          commitPer: '/oaBus/oaBusdata/commitPer',
          updateBusdata: '/oaBus/dynamic/updateData', //修改发布状态
          deletePremit: '/oaBus/dynamic/deletePremit', //修改权限表发布数据并修改发布范围字段
        },
      }
    },
    created() {
    },
    mounted() {
      this.selectedDepUsers = this.value
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      initData(){
         this.$nextTick(()=>{
           // alert(JSON.stringify(this.backData))
           let value = this.backData
           let backData1 = value;
           if (backData1.i_bigint3 != undefined){
             this.iIsLimits = backData1.i_bigint3
           }else{
             this.iIsLimits = 1;
           }
           if (backData1.i_bigint3 == 2) {
             this.departId = backData1.s_varchar3
           }
           if (backData1.i_bigint3 == 3) {
             this.userRealName = backData1.s_varchar3
             this.userIdLists = backData1.s_varchar4.split(",")
           }
         })
      },
      userIds(data){
        // alert(data);
        this.userIdLists = data;
        this.$emit('userIDs',data)
      },
      //监听选择范围
      selectJG(e) {
        //全行
        if (e.target.value == 1) {
          let publish = {};
          publish.iIsLimits = e.target.value;
          this.$emit("change1", publish)
        }
      },
      senUserName(data){
        this.userRealName= data.toString()
        this.$emit('userNames',data)
      },
      //获取选择范围数据
      change(e) {
        // console.log(e);
        let publish = {};
        publish.iIsLimits = this.iIsLimits;
        if (this.iIsLimits == 2) {
          publish.departId = e;
        }
        if (this.iIsLimits == 3) {
          publish.userRealName = this.userRealName;
          publish.userIdList=this.userIdList;
        }
        this.$emit("change1", publish)

      },
      //通过组织机构筛选选择用户
      onSearchDepUser() {
        this.$refs.selectModal.showModal()
        this.onSearchDepUserCallBack('')
      },
      onSearchDepUserCallBack(selectedDepUsers) {
        this.selectedDepUsers = selectedDepUsers
        this.$emit("change", selectedDepUsers)
      },
      selectFun(index) {
        //alert(typeof  index)
        if (index == 3) {
          this.departId = '';
          this.iIsLimits = '';
          this.$refs.selectModal.showModal()
          this.onSearchDepUserCallBack('')
        } else if (index == 2) {
          this.userRealName = '';
          this.iIsLimits = '';
        } else if (index == 1) {
          this.userRealName = '';
          this.departId = '';
        }
      },
      //日期格式化
      dateFormat(date) {
        let date1 = new Date(date);
        let Y = date1.getFullYear();
        let M = date1.getMonth() + 1;
        let D = date1.getDate();
        let newTime = Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + date1.toTimeString().substr(0, 8);
        return newTime;
      },
      handerOk() {
        // console.log(JSON.stringify(this.backData))
        // console.log(this.userRealName)
        if (this.iIsLimits != "" && this.iIsLimits != undefined) {
          if (this.iIsLimits == 2 && this.departId == "") {
            this.$message.error("请选择部门")
            return
          }
          if (this.iIsLimits == 3 && this.userRealName == "") {
            this.$message.error("请选择用户")
            return
          }
        } else {
          this.$message.error("请选择发布范围")
          return
        }

        let json = {
          iIsLimits: this.iIsLimits,
          userRealName: this.userRealName,
          departId: this.departId,
          tableName: this.backData.table,
          busdataId: this.backData.i_id,
          functionId: this.backData.i_bus_function_id,
        }
        //发布数据
        postAction(this.url.commitPer, json).then(res => {
          if (res == "success") {
            let params = {};
            params.table = this.backData.table;
            params.i_id = this.backData.i_id;
            params.i_is_publish = 1; //发布状态 1 是 0 否
            params.d_datetime2 = this.dateFormat(new Date())
            params.d_datetime1 = this.backData.d_datetime1
            params.i_bigint3 = this.iIsLimits
            if (this.iIsLimits == 2 && this.departId != "") {
              params.s_varchar3 = this.departId
            }
            if (this.iIsLimits == 3 && this.userRealName != "") {
              params.s_varchar3 = this.userRealName

            }
            //更改发布状态
            postAction(this.url.updateBusdata,params).then(res => {
            })
            this.reload();
            this.$message.success("发布成功")
          } else {
            this.$message.error("发布失败")
          }
        });
      },
      //取消发布
      unpublish() {
        let params = {};
        params.table = this.backData.table;
        params.i_id = this.backData.i_id;
        // params.i_busdata_id = this.backData.i_id;
        params.i_bus_function_id = this.backData.i_bus_function_id;
        params.i_is_publish = '0';
        params.i_bigint3 = '0';
        params.d_datetime2 = this.dateFormat(new Date())
        postAction(this.url.updateBusdata,params).then(res => {

          //修改权限表发布数据并修改发布范围字段
          if (res.success) {
            // params.table = this.backData.table+"_permit";
            postAction(this.url.deletePremit,{'deletePremit':params}).then(res =>{
              if (res.success){
                this.reload();
                this.$message.success("取消发布成功");
              }else {
                this.$message.error("取消发布失败");
              }
            });
          } else {
            this.$message.error("取消发布失败");
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>