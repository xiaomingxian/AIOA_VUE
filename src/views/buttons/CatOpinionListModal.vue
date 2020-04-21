<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading" style="height: 400px; width:100%;overflow: auto">
    <div v-for="(item,index) in dataSource">
      <p class="title"><span>{{item.name}}</span></p>
      <a-table ref="table"
               size="middle"
               bordered
               :columns="columns"
               :dataSource="item.oa"
               :pagination="false"
      >
      </a-table>
    </div>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import {getAction} from '@/api/manage'

  export default {
    name: "UpdatePaperTitle",
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        dataSource: [],
        index: [],
        length: [],
        columns: [
          {
            title: '部门',
            width: 120,
            align: "center",
            dataIndex: 'sdeptName',
            customRender: (value, row, index) => {
              index = row.iid
              const obj = {
                children: value,
                attrs: {}
              };
              let merge = [];
              for (let i = 0; i < this.index.length; i += this.length[i]) {
                merge.push(this.index[i]);
              }
              for (let i = 0; i < merge.length; i++) {
                if (index === merge[i]) {
                  obj.attrs.rowSpan = this.length[merge[i]];
                }

                for (let j = 1; j < this.length[merge[i]]; j++) {
                  if (index === this.index[merge[i] + this.length[merge[i]] - j]) {
                    obj.attrs.rowSpan = 0;
                  }
                }
              }
              return obj
            }
          },
          {
            title: '姓名',
            align: "center",
            width: 120,
            dataIndex: 'sname'
          },
          {
            title: '意见',
            align: "left",
            dataIndex: 'sopinion',
          }
        ],
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
        validatorRules: {},
        url: {
          opinion: "/oaBus/oaBusdataOpinion/getOpinionList"
        },
      }
    },
    created() {

    },
    methods: {
      show(record) {
        console.log(record)
        this.visible = true;
        this.getOpinionList(record);
      },
      getOpinionList(record) {
        let url = this.url.opinion;
        getAction(url, {table:record.opinionTable, iBusdataId:record.i_id, sTaskdefKey:record.sTaskdefKey}).then((res) => {
          this.dataSource = res.result;

          var map = {}
          let collation = this.dataSource
          //type
          for (let i in collation) {
            let optionType = collation[i]
            //type-data
            for (let oaIndex in optionType.oa) {
              let key = optionType.name + '-' + optionType.oa[oaIndex].sdeptName
              if (map[key] == undefined) {
                map[key] = []
                map[key].push(optionType.oa[oaIndex])
              } else {
                map[key].push(optionType.oa[oaIndex])
              }
            }
          }
          // console.log('-------->>>>',JSON.stringify(map))
          let opinionData = JSON.parse(JSON.stringify(map));
          for (let i = 0; i < this.dataSource.length; i++) {
            for (let j = 0; j < this.dataSource[i].oa.length; j++) {
              this.index.push(this.dataSource[i].oa[j].iid);
              this.length.push(opinionData[this.dataSource[i].oa[j].opinionName + '-' + this.dataSource[i].oa[j].sdeptName].length);
            }

          }
        })
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        that.close();
      },
      handleCancel() {
        this.close()
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