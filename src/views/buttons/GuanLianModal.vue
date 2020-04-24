<template>
  <a-modal
    title="关联文件"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="confirm"
    @cancel="handleCancel"
    okText="确定"
    cancelText="取消">


     <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="iid"
      :columns="columns"
      :customRow="doTask"
      :dataSource="dataSource"
      :pagination="ipagination"
      @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.iid)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

    </a-table>

  </a-modal>

</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  // import {httpAction, getAction,putAction, postAction, getRoleList, getUserList, getServiceList} from '@/api/manage'

  export default {
    name: "JinZhanModal",
    mixins: [JeecgListMixin],
    components: {

    },
    data() {
      return {
        visible:false,
        loading:false,
        //序号、业务功能、标题、关联类型、创建人、创建时间*
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '业务功能',
            align:"center",
            dataIndex: 'busModel'
          },
          {
            title: '标题',
            align:"center",
            dataIndex: 'sTitle'
          },
          {
            title: '关联类型',
            align:"center",
            dataIndex: 'fileType'
          },
          {
            title: '创建人',
            align:"center",
            dataIndex: 's_create_name'
          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime'
          },

        ],
        dataSource:[]

      }
    },
    methods: {

      show(e){
        this.visible = true

       // JSON.parse( JSON.stringify(e)).map((item,index)=>{
       //   item.indexx = index
       //   console.log(item)
       //
       // })
       //  console.log(e)

        this.dataSource = e


        // this.$refs.PingJia.traceP(this.proInstId);
      },

      handleCancel(){
        this.visible = false
      },
      doTask(record, index) {

        return {
          on: {
            click: (event) => {

              console.log(record)

              window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + record.s_b_busdata_table + '&busdataId=' + record.i_b_busdata_id + '&status=todo&navisshow=false&haveTask=true&task=' + JSON.stringify(record))

            }
          }
        }


      }

    }
  }

</script>

<style scoped>

</style>