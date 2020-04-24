<template>
  <a-modal
    :title="title"
    :width="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @close="closePostpone"
    @cancel="closePostpone"
    cancelText="关闭">

    <!--<div class="box">-->
      <!--<td class="title" width="40%">-->
        <!--<center><h3>办理时限：</h3></center>-->
      <!--</td>-->
      <!--<td width="75%">-->
        <!--<a-date-picker @change="getDateTime2" ref="d_datetime2"-->
                       <!--showTime="true" format="YYYY-MM-DD HH:mm:ss"-->
                       <!--style="width: 80%">-->

        <!--</a-date-picker>-->
      <!--</td>-->
    <!--</div>-->

    <div class="box">
      <td class="title" width="40%">
        <center><h3>延期时间：</h3></center>
      </td>
      <td width="75%">
      <a-date-picker @change="getDateTime2" ref="d_datetime2"
                     showTime="true" format="YYYY-MM-DD HH:mm:ss"
                     style="width: 80%">

      </a-date-picker>
      </td>
    </div>

  </a-modal>
</template>

<script>
  import {httpAction, getAction, postAction} from '@/api/manage'

  export default {
    name: "datePostpone",
    data() {
      return {
        title: "督办延期",
        visible: false,
        backData:{},
        d_datetime1:"",
        d_datetime2:"",
        url: {
          updataAndaddlog: "/oadeferlog/oaDeferLog/updataOadataAndaddOaDeferLog",
        },
      }
    },
    created() {
    },
    methods: {

      getDateTime2(e,datetime2){
        // this.backData.d_datetime2 = datetime2;
        //新改时间
        this.d_datetime2=datetime2;
        // console.log(this.backData.d_datetime2);
      },

      //展示
      showPostpone(record) {
        this.backData=record
        // this.backData.i_id = record.i_id;
        // this.backData.table = record.table;
        //原来时间
        this.d_datetime1=record.d_datetime2;
        // console.log("-------------------->show",JSON.stringify(record));
        // console.log("-------------------->",JSON.stringify(this.backData));
        this.visible = true;
      },

      // close() {
      //   this.$emit('close');
      // },
      //确定按钮
      handleOk() {
        // console.log("-------------------->确定",this.d_datetime2);
        if (this.d_datetime2!="" && this.d_datetime2!=null){
          let param={
            //原来时间
            d_datetime1:this.d_datetime1,
            //新改时间
            d_datetime2:this.d_datetime2,

            i_id:this.backData.i_id,
            s_table:this.backData.table,
            // d_create_time:this.backData.d_create_time,
            s_create_name:this.backData.s_create_name,
            s_create_by:this.backData.s_create_by,
            i_bus_model_id:this.backData.i_bus_model_id,
            i_bus_function_id:this.backData.i_bus_function_id,
            s_create_dept:this.backData.s_create_dept,
            s_create_deptid:this.backData.s_create_deptid,
          }
          postAction(this.url.updataAndaddlog,param).then(res =>{
              if (res.success){
                this.$emit("showTime",this.d_datetime2);
                this.$message.success("延期修改成功");
              }else {
                this.$message.warning("延期修改失败")
              }
          })
        }
        this.visible = false;
      },


      closePostpone() {
        // this.close()
        // console.log("-------------------->关闭");
        // console.log("-------------------->关闭",JSON.stringify(this.backData));
        this.visible = false;
      },


    }
  }
</script>

<style lang="less" scoped>
  .box {
    width: 100%;
    height: auto;

    .line1 {
      display: flex;
      align-items: center;
      justify-content: space-between;

      p {
        span {
          margin-right: 25px;
        }
      }
    }

    .line2 {
      display: flex;
      align-items: center;
      justify-content: space-between;

      p {
        span {
          margin-right: 25px;
        }
      }
    }

    .line3 {
      display: flex;
      align-items: center;
      justify-content: space-between;

      p {
        span {
          margin-right: 10px;
        }
      }
    }

  }
</style>