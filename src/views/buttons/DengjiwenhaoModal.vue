<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleDenji"

    cancelText="关闭">

    <div class="box">
      <div class="line1">
        <p>
          <span>文件字</span>
          <a-select v-model="selectedModel" style="width: 200px" labelInValue="true" @change="getModalVal">
            <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </p>
        <p>
          <span>发送对象</span>
          <a-select style="width: 260px" v-model="secoendData">
            <a-select-option v-for="(item,index) in selectData" :key="index" :value="item.id">{{item.name}}
            </a-select-option>
          </a-select>
        </p>
      </div>

      <div class="line2">
        <p>
          <span>文件号</span>
          <a-input  v-model="docnum" style="width: 150px;" placeholder="文件号" @change="getNowNum($event)"></a-input>
          <a-button type="primary" style="margin-left: 10px;" @click="showTable">{{listName}}</a-button>
        </p>
        <p>
          <span>年份</span>
          <a-select v-model="defaultYear" style="width:260px" @change="changeYear">
            <a-select-option v-for="(item,index) in yearData" :key="index" :value="item.id">{{item.name}}
            </a-select-option>
          </a-select>
        </p>
      </div>

      <div class="line3">
        <p>
          <span>文件字号</span>
          <a-input v-model="docwordNum" style="width:150px;" placeholder="文件号" disabled></a-input>
        </p>

      </div>

      <template>
        <a-table
          :columns="columns"
          rowKey="iid"
          :dataSource="numLists"
          :loading="loading"
          @change="changePagenation"
          v-show="isshowTable">
          <!--:record="record.ibusdataId"-->
          <template slot="action" slot-scope="text, record">
            <div v-if="record.ibusdataId==='是'? false:true" class="editable-row-operations">
              <a @click="()=>use(record)">选择使用</a>&nbsp
              <a @click="()=>set(record)">设置线下占用</a>
            </div>
            <div v-else class="editable-row-operations" style="color: #999999;">
              <span>选择使用</span>&nbsp
              <span>设置线下占用</span>
            </div>
          </template>
        </a-table>
      </template>


      <!--设置线下占用modal-->
      <a-modal
        title="温馨提示"
        :visible="visible1"
        @ok="openok"
        @cancel="cancelModal"
      >
        <p>确定要设置线下占用吗？</p>
      </a-modal>

    </div>


  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "../../store/mutation-types";
  import pick from 'lodash.pick'
  import {getAction} from '@/api/manage'

  const columns = [
    {
      title: '空号',
      dataIndex: 'idocNum',
      width: '20%'
    },
    {
      title: '是否线下占用',
      dataIndex: 'ibusdataId',
      width: '20%'
    },

    {
      title: '操作',
      dataIndex: 'work',
      width: '20%',
      scopedSlots: {customRender: 'action'},
    },]

  const data = []
  export default {
    name: "DengjiwenhaoModal",
    data() {
      return {
        title: "登记文号",
        visible: false,
        visible1: false,  //线下占用modal
        docnumData: {
          id: '',
          docnum: ''
        },
        setid: '',
        loading: true,
        defaultYear: new Date().getFullYear(),
        model: {},
        listName: '展开空号列表',
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        columns,
        numId: '',
        numLists: [],
        modelData: '',
        docnum: '',
        docwordNum: '',
        isshowTable: false,
        yearData: [
          {id: new Date().getFullYear(), name: new Date().getFullYear()},
          {id: new Date().getFullYear() - 1, name: new Date().getFullYear() - 1}
        ],
        selectData: [],
        secoendData: '',//发送对象值
        selectedModel: '',
        wenhao: '',
        sendObj: '',
        table: '',
        functionId: '',
        busdataId: '',
        pagination: {
          current: '',
          total: '',
        },
        columns,
        data,
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
          // iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          namelist: "/papertitle/docNumSet/getDocNumList",
          numlist: "/docnum/docNumManage/getNumList",
          setNum: "/docnum/docNumManage/setNum",
          selectNum: "/docnum/docNumManage/selectNum",
          sendobj: "/papertitle/docNumSet/queryById",

        },
      }
    },
    created() {
    },
    methods: {
      //展开空号列表
      showTable() {
        console.log(Boolean(this.selectedModel));
        if (Boolean(this.selectedModel)) {
          // console.log(this.isshowTable);
          getAction(this.url.numlist, {iDocnumId: this.numId, sYear: this.defaultYear}).then((res) => {
            // console.log(res.result);
            //分页
            this.pagination.total = res.result.total;
            let resNumLists = res.result.records;
            resNumLists.map((item) => {
              if (!Boolean(item.ibusdataId)) {
                item.ibusdataId = '否'
              } else {
                item.ibusdataId = '是'
              }
            });
            this.numLists = resNumLists;
            this.loading = false;

          });

          if (this.isshowTable) {
            this.isshowTable = false;
            this.listName = '展开空号列表';
          } else {
            this.listName = '收起空号列表';
            this.isshowTable = true;
          }
        } else {

          this.$notification['warning']({
            message: '温馨提示',
            description: '先选择文件字'
          })
        }

      },
      //分页事件
      changePagenation(pagination) {
        // console.log(pagination);
        const pager = {...this.pagination};
        pager.current = pagination.current;
        this.pagination = pager;
        console.log(pager);

        getAction(this.url.numlist, {
          iDocnumId: this.numId,
          sYear: this.defaultYear,
          pageNo: this.pagination.current
        }).then((res) => {
          console.log(res.result);
          //分页
          this.pagination.total = res.result.total;
          let resNumLists = res.result.records;
          resNumLists.map((item) => {
            if (!Boolean(item.ibusdataId)) {
              item.ibusdataId = '否'
            } else {
              item.ibusdataId = '是'
            }
          });
          this.numLists = resNumLists;
        })

      },
      getNowNum(event){
        this.docnum = event.srcElement.value;
        this.docwordNum = this.selectedModel.label.trim() + '〔' + this.defaultYear + '〕' + this.docnum + '号';
      },
      dengji(record) {
        this.busdataId = record.i_id;
        this.functionId = record.i_bus_function_id;
        this.table = record.table;
        this.visible = true;
        this.getDocNumList();
      },
      close() {
        this.$emit('close');
        this.selectData = "",
        this.secoendData = "",
        this.selectedModel = "",
        this.wenhao = "",
        this.sendObj = "",
        this.table = "",
        this.functionId = "",
        this.busdataId = "",
        this.docnum = '',
        // this.docwordNum = '',
        this.visible = false;
      },
      handleOk() {
        let iSend = '';
        if (this.selectedModel) {
          if (this.secoendData === "上报") {
            iSend = 1;
          } else {
            iSend = 2;
          }
          getAction(this.url.setNum, {
            iDocnumId: this.numId,
            sYear: this.defaultYear,
            iDocNum: this.docnum,
            sBusdataTable: this.table,
            iBusdataId: this.busdataId,
            iSendObj: iSend
          }).then((res) => {
            this.docnumData.id = res.result.iid;
            this.docnumData.docnum = this.docwordNum;
            // alert(JSON.stringify(this.docnumData))
            this.$emit('saveDocNum', this.docnumData)
          })
          this.close()
        } else {
          this.$notification['warning']({
            message: '温馨提示',
            description: '先选择文件字'
          })
        }

      },
      handleDenji() {
        this.close()
      },
      use(e) {
        console.log(e);

        getAction(this.url.selectNum, {iId: e.iid, iBusdataId: this.busdataId}).then((res) => {
          let idocNum = e.idocNum;
          this.docnum = idocNum;
          this.docwordNum = this.wenhao.trim() + '〔' + this.defaultYear + '〕' + this.docnum + '号';
          getAction(this.url.numlist, {iDocnumId: this.numId, sYear: this.defaultYear}).then((res) => {
            console.log(res.result);
            //分页
            this.pagination.total = res.result.total;
            let resNumLists = res.result.records;
            resNumLists.map((item) => {
              if (!Boolean(item.ibusdataId)) {
                item.ibusdataId = '否'
              } else {
                item.ibusdataId = '是'
              }
            });
            this.numLists = resNumLists;
          })
        })
      },
      set(e) {
        console.log(e);
        this.visible1 = true;
        this.setid = e.iid;

      },
      //设置线下占用确定按钮
      openok() {
        getAction(this.url.selectNum, {
            iId: this.setid,
            iBusdataId: -1
          }
        ).then((res) => {
          getAction(this.url.numlist, {
            iDocnumId: this.numId,
            sYear: this.defaultYear,
            pageNo: this.pagination.current
          }).then((res) => {
            console.log(res.result);
            //分页
            this.pagination.total = res.result.total;
            let resNumLists = res.result.records;
            resNumLists.map((item) => {
              if (!Boolean(item.ibusdataId)) {
                item.ibusdataId = '否'
              } else {
                item.ibusdataId = '是'
              }
            });
            this.numLists = resNumLists;
          });
        })
        this.visible1 = false;
      },
      cancelModal() {
        this.visible1 = false;
      },
      //查询文件字列表
      getDocNumList() {
        //let that = this;
        let url = this.url.namelist;
        getAction(url, {iBusFunctionId: this.functionId}).then((res) => {
          this.modelData = res.result;

        })
      },
      getModalVal(val) {
        this.numId = val.key;
        this.wenhao = val.label;
        setTimeout(() => {
          console.log('-------', this.docnum)
          this.docwordNum = val.label.trim() + '〔' + this.defaultYear + '〕' + that.docnum + '号';
        }, 200)
        let that = this;
        let url = that.url.sendobj;
        getAction(url, {id: val.key}).then((res) => {
          that.docnum = res.result.idocNum+1;
          let iud = res.result.iutemplateId;
          let idd = res.result.idtemplateId;
          let arr = [];
          if (iud) {
            arr.push({id: '1', name: '上报'})
          } else {
            arr.splice(0, 1);

          }
          if (idd) {
            arr.push({id: '2', name: '下发'})
          } else {
            arr.splice(1, 2);

          }
          this.selectData = arr;
          console.log(this.selectData);
          this.secoendData = this.selectData[0].name;
          this.docwordNum = val.label.trim() + '〔' + this.defaultYear + '〕' + that.docnum + '号';
          // console.log(this.selectedModel)
          // this.docwordNum = that.modelData[val.key].name+that.docnum
        })
      },

      changeYear(e) {
        console.log(e);
        this.defaultYear = e;
        this.docwordNum = this.wenhao + '〔' + e + '〕' + this.docnum + '号';

      }
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