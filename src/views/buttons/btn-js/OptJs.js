/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import {filterObj} from '@/utils/util';
import {deleteAction, downFile, getAction} from '@/api/manage'
import {ACCESS_TOKEN} from "@/store/mutation-types"

export const OptJs = {
  data() {
    return {

      justOne: false,
      jiShu: false,
      ouShu: false,
      opts:[],
      oneLine: {
        width: 100,
        height: 5,
        widthLeft: 100,
        heightLeft: 11,
        data: []
      },
      otherLine: {
        width: 100,
        height: 5,
        data: []
      },
      url:{
        insert:'',
        update:'',
      }
    }
  },
  created() {
  },
  methods: {
    //权限--自适应展示
    showOpt(opts) {
      this.$emit("optsReturn",opts)
      this.opts=opts
      this.ouShu = false
      this.jiShu = false

      let len = opts.length
      if (len == 1) {
        this.oneLine.width = 100
        this.oneLine.data = opts
        this.justOne = true
        return
      }

      if (len % 2 == 0) {
        //偶数
        //改变数据格式
        var newData = []
        for (var i = 0; i < len - 1; i += 2) {
          //一行放两条数据
          newData.push([opts[i], opts[i + 1]])
        }
        this.otherLine.data = newData
        this.ouShu = true
        // this.jiShu = false
        return
      }
      if (len % 2 != 0) {
        //基数
        this.oneLine.data = opts.slice(0, 3)

        var dd = opts.slice(3)
        var newData = []
        for (var i = 0; i < dd.length - 1; i += 2) {
          //一行放两条数据
          newData.push([dd[i], dd[i + 1]])
        }

        this.otherLine.data = newData
        this.jiShu = true
        if(len>3){
          this.ouShu = true
        }
        return
      }


      // if(this.ouShu&&this.jiShu){
      //   this.ouShu = false
      // }
    },
    clear(){
      this.oneLine.data=[]
      this.otherLine.data=[]
    }
  }

}