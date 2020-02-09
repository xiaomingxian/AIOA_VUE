<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleDenji"
    cancelText="关闭">

  <div class="box">
      <div class="line1">
        <p>
          <span>文字类别</span>
          <a-select v-model="selectedModel" style="width: 260px;margin-left:13px;">
            <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}</a-select-option>
          </a-select>
        </p>
        <p>
          <span>文件字号</span>
          <a-input  v-model="fileNum" style="width: 280px;"></a-input>
        </p>
      </div>

    <div class="line2">
        <p>
          <span>文件标题</span>
          <a-input  v-model="fileTitle"  style="width: 150px;" ></a-input>
          <a-button @click="selectOfficeList" type="primary" style="margin-left: 10px;">查询</a-button>
        </p>
    </div>

    <a-table
       rowKey="iid"
      :columns="columns"
      :dataSource="officeListData"
      :pagination="pagination"
       @change="changePagenation">
      <template slot="action" slot-scope="text, record">
          <a @click="()=>use(record)">引入</a>
      </template>
    </a-table>
  </div>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {getAction} from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  const  columns = [
    {
      title:'文件字号',
      align:"center",
      dataIndex:'sfileNum',
      // width:'20%'
    },
    {
      title:'文件标题',
      align:"center",
      dataIndex:'stitle',
      // width:'20%'
    },

    {
      title:'单位',
      align:"center",
      dataIndex:'sdeptName',
      // width:'20%'
    },
    {
      title:'时间',
      align:"center",
      dataIndex:'dcreateTime',
      // width:'20%'
    },
    {
      title:'操作',
      align:"center",
      dataIndex:'work',
      // width:'45%',
      scopedSlots: { customRender: 'action' },

    },]

  export default {
    name: "YinRuFuJianModal",
    data () {
      this.dateFormat = "YYYY-MM-DD hh:mm:ss";
      return {
        title:"引入公文链接",
        visible: false,
        model: {},
        columns,
        modelData:'',
        officeListData:[], //列表数据
        fileNum:'',        //查询条件 文件字号
        fileTitle:'',     //查询条件 文件标题
        selectedModel:'',
        pagination:{
          current:'',
          total:'',
        },
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
        // iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          doctype:"/oaBus/busModel/getDocType",
          officelist:"/oaBus/oaBusdata/getOfficeList"
        },
      }
    },
    created(){
      this.getSelection();
    },
    methods: {
      yinru(record) {
        this.visible = true;
      },

      //查询文件类别
      getSelection(){
        getAction(this.url.doctype).then((res)=>{
          this.modelData = res.result;
        })
      },
      //查询公文链接列表
      selectOfficeList(){
        getAction(this.url.officelist,{
                  iBusModelId:this.selectedModel,
                  sFileNum:this.fileNum,
                  sTitle:this.fileTitle,
                  sBusdataTable:'oa_busdata10'
        }).then((res)=>{
          //时间戳转时间
          res.result.records.map((item)=>{
            let date1 = new Date(item.dcreateTime);
            let Y = date1.getFullYear();
            let M = date1.getMonth()+1;
            let D = date1.getDate();
            let newTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D)+" "+date1.toTimeString().substr(0,8);
            console.log(newTime);
            item.dcreateTime = newTime;
          });

          this.officeListData = res.result.records;
          this.pagination.total = res.result.total;

        })
      },
      //分页事件
      changePagenation(pagination){

        console.log(pagination);
        const pager = {...this.pagination};
        pager.current = pagination.current;
        this.pagination = pager;
        console.log(pager);

        getAction(this.url.officelist,{
          iBusModelId:this.selectedModel,
          sFileNum:this.fileNum,
          sTitle:this.fileTitle,
          sBusdataTable:'oa_busdata10',
          pageNo:this.pagination.current
        }).then((res)=>{
          //时间戳转时间
          res.result.records.map((item)=>{
            let date1 = new Date(item.dcreateTime);
            let Y = date1.getFullYear();
            let M = date1.getMonth()+1;
            let D = date1.getDate();

            let newTime = Y+'-'+(M<10? "0"+M :M)+"-"+(D<10? "0"+D:D)+" "+date1.toTimeString().substr(0,8);
            console.log(newTime);

            item.dcreateTime = newTime;
          });

          this.officeListData = res.result.records;
          this.pagination.total = res.result.total;
        })

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      use(e){
        console.log(e);
        this.visible = false;
        this.$emit('gongwenData',e);
      },
      handleOk () {
        this.close()
      },
      handleDenji () {
        this.close()
      }

    }
  }
</script>

<style lang="less" scoped>
  .box{
    width: 100%;
    height: auto;

    .line1{
      display: flex;
      align-items: center;
      justify-content: space-between;
      p{
        span{
          margin-right: 25px;
        }
      }
    }

    .line2{
      display: flex;
      align-items: center;
      justify-content: space-between;
      p{
        span{
          margin-right: 25px;
        }
      }
    }
    .line3{
      display: flex;
      align-items: center;
      justify-content: space-between;
      p{
        span{
          margin-right: 10px;
        }
      }
    }

  }
</style>