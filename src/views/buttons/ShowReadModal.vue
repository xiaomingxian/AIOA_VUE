<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭">
    <div v-for="(item,index) in dataSource" :key="index">
      <p class="title" @click="Clicks(index)"><span>{{deptName[index]}}</span><a-icon :ref="tables[index].down"  type="down" style="position: absolute;right: 5%;display: none;" /><a-icon :ref="tables[index].up"  type="up" style="position: absolute;right: 5%;display: block;" /></p>
      <a-table
        :ref="tables[index].table"
        size="middle"
        bordered
        :columns="columnss"
        :dataSource="dataSource[index]"
        :pagination="false"
      >
      </a-table>
    </div>
  </a-modal>
</template>

<script>
  import {getAction,postAction} from '@/api/manage'
  import moment from 'moment'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "showreadmodal",
    data() {

      return {
        tableName:'',
        busFunctionId:0,
        busDataId:0,
        columnss:[
          {
            title: '用户',
            align: "center",
            dataIndex: 'userName',
            width:'50%'
          },

          {
            title: '已读情况',
            align: "center",
            dataIndex: 'isRead',
            width:'50%',
            customRender: function (readCase) {
              if (readCase == '1') {
                return "已阅读";
              } else if (readCase == "0") {
                return "未查看";
              } else {
                return text;
              }
            }
            // width:'20%'
          },

        ],
        isShow:true,
        tables:[],
        dataSource: [],
        dataSources: [],
        deptName:[],
        message:'',
        index:[],
        length:[],
        title: "已读情况查看",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {

        },
      }
    },
    created() {

    },

    create(){
    },

    methods: {
      moment,
      showHead(tableName,busFunctionId,busDataId) {
        this.visible = true;
        this.tableName = tableName;
        this.busFunctionId = busFunctionId;
        this.busDataId = busDataId;
        this.getReadUserList();
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk(){
        this.close()
      },
      handleCancel() {
        this.close()
      },

      handleTableChange(pagination) {
        let currentClick = pagination.current;
        this.getReadUserList(currentClick);
      },

      getReadUserList(currentClick=1) {
        this.dataSource= [];
        let url = "/oaBus/oaBusdata/getReadCase";
        getAction(url, {urlParam:1,sBusdataTable:this.tableName,iBusFunctionId:this.busFunctionId,iBusdataId:this.busDataId,pageNo:currentClick}).then((res) => {

          this.dataSources = res.result.records;
          var map = {}
          let collation = res.result.records;
         for (let i in collation){
           let  key = collation[i].deptName;
           if (map[key] == undefined) {
             map[key] = []
             collation[i]["key"]=i
             map[key].push(collation[i])
           }else {
             collation[i]["key"]=i
             map[key].push(collation[i])

           }
         }
         let opinionData = JSON.parse(JSON.stringify(map));

              for (var i in  opinionData){
                for (let j in opinionData[i]){
                  this.index.push(parseInt(opinionData[i][j].key));
              this.length.push(opinionData[i].length);

            }
          }

          for (let i = 0; i < this.dataSources.length;i += this.length[i]) {
            this.dataSource.push(opinionData[this.dataSources[i].deptName]);
            this.deptName.push(this.dataSources[i].deptName);
          }

          for(let i = 0; i < this.dataSource.length;i++){
            this.tables.push({
              table:'tables'+i,
              down:'downs'+i,
              up:'up'+i
            })
          }

        });



      },

      Clicks(index){
        if(this.isShow == true){
          this.isShow = false;
          this.$refs[this.tables[index].table][0].$el.style.display = 'none';
          this.$refs[this.tables[index].down][0].style.display = 'block';
          this.$refs[this.tables[index].up][0].style.display = 'none';
        }else {
          this.isShow = true;
          this.$refs[this.tables[index].table][0].$el.style.display = 'block';
          this.$refs[this.tables[index].down][0].style.display = 'none';
          this.$refs[this.tables[index].up][0].style.display = 'block';
        }
        // console.log(this.$refs[this.tables[index].down])
      },

    }
  }
</script>

<style scoped lang="less">

  .title {
    width: 100%;
    height: 40px;
    background: #2eabff;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    /*letter-spacing: 20px;*/
    margin-top: 10px;

    span {
      margin-left: 20px;
    }
  }

</style>