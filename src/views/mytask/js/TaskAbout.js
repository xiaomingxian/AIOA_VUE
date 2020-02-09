/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import {filterObj} from '@/utils/util';
import {deleteAction, downFile, getAction, postAction} from '@/api/manage'
import {ACCESS_TOKEN} from "@/store/mutation-types"
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {ntkoBrowser} from './ntkobackground.min.js'


export const taskAbout = {
  //接收父组件传值
  props: [],
  data() {
    return {
      url: {

      }
    }
  },
  created() {
  },
  methods: {
    doTask(record) {

      //查询---业务数据--流程信息
      var taskDetail = {}
      postAction(this.url.busDataAndColums, {tableName: record.table, busdataId: record.tableId}).then((res) => {

        taskDetail.data = res.oaBusdata
        taskDetail.data['iprocSetId'] = res.proSetId
        taskDetail.data['key'] = res.taskDefKey
        taskDetail.data.act_show = res.actShow
        taskDetail.data.page_ref = res.pageRef

        taskDetail.busFunction = res.busFunction
        taskDetail.detailList = res.detailList

        this.$refs[res.pageRef].showTaskInAct(taskDetail, record)
        this.$refs[res.pageRef].title = '任务办理'

      })

    },



  }

}