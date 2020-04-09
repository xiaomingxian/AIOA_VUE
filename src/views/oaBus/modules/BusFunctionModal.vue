<template>
  <a-modal
    :title="title"
    :width="modelWidth"
    :visible="visible"
    :key="nowKey"
    destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">

    <div style="height: 500px; width:95% ;overflow: auto">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <!-- 主表单区域 -->

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="业务分类">
            <a-select v-model="iBMId" v-decorator="[ 'ibusModelId', {rules:[{required:true,message:'业务分类不能为空'}]}]">
              <a-select-option v-for="(item,index) in selectModelData" :key="index" :value="item.iid">
                {{item.sname}}
              </a-select-option>
            </a-select>
            <!--<a-input-number v-decorator="[ 'iBusModelId', {}]" />-->
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="业务名称">
            <a-input placeholder="请输入业务类型名称" v-decorator="['sname', {rules:[{required:true,message:'业务名称不能为空'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }]}]"/>
          </a-form-item>

          <!-- <a-form-item
             v-show="false"
             :labelCol="labelCol"
             :wrapperCol="wrapperCol"
             label="详情页面">
             <a-input-number placeholder="请选择对应的页面" disabled style="width: calc(100% - 130px);"
                             v-decorator="[ 'ipageId', {}]">

             </a-input-number>
           </a-form-item>-->

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="详情页面">
            <a-select placeholder="请选择对应的页面" style="width: calc(100% - 130px);" disabled v-decorator="[ 'ipageId', {rules:[{required:true,message:'详情页面不能为空'}]}]">
              <a-select-option v-for="(item,index) in dbtable" :key="index" :value="item.iid">
                {{item.spageName}}
              </a-select-option>
            </a-select>
            <!--<a-input-number placeholder="请选择对应的页面" disabled style="width: calc(100% - 130px);">

            </a-input-number>-->
            <span style="display: inline-block;width:130px;float: right;overflow: hidden;">
              <a-button type="primary" @click="selPage" icon="search" style="width: 130px">选择模板</a-button>
            </span>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="左侧参数">
            <a-input placeholder="请输入左侧参数" v-decorator="['sbusLeftParameter', {}]"/>
          </a-form-item>


          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="右侧参数">
            <a-input placeholder="请输入右侧参数" v-decorator="[ 'sbusRightParameter', {}]"/>
            <!--<span style="display: inline-block;width:81px;float: right;overflow: hidden;">
              <a-button type="primary" @click="openBusPage" icon="search" style="width: 81px">选择</a-button>
            </span>-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="业务优先级">
            <a-input placeholder="业务优先级" v-decorator="[ 'slevel', {rules:[{pattern:'^\\d{0,2}$',message:'请输入两位以内的数字'}]}]"/>
            <!--<span style="display: inline-block;width:81px;float: right;overflow: hidden;">
              <a-button type="primary" @click="openBusPage" icon="search" style="width: 81px">选择</a-button>
            </span>-->
          </a-form-item>


          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="插入机构">
            <a-radio-group :defaultValue="0" v-decorator="['iisUnit', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="插入部门">
            <a-radio-group :defaultValue="0" v-decorator="['iisDept', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!--<a-input placeholder="请输入是否插入部门" v-decorator="['iIsDept', {}]" />-->
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="编辑器">
            <a-radio-group :defaultValue="0" v-decorator="['iisEditor', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!--<a-input placeholder="请输入是否有编辑器(1、0)" v-decorator="['iIsEditor', {}]" />&ndash;&gt;-->
          </a-form-item>


          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="发送范围">
            <a-radio-group :defaultValue="0" v-decorator="['iisLimits', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="全文检索">
            <a-radio-group :defaultValue="0" v-decorator="['iisEs', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!--<a-input placeholder="请输入是否纳入全文检索(1、0)" v-decorator="['iIsEs', {}]" />-->
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="流程审批">
            <a-radio-group v-model="procDefKv" :defaultValue="0" v-decorator="['iisProc', {}]">
              <a-radio @click="procFunction(1)" :value="1">是</a-radio>
              <a-radio @click="procFunction(0)" :value="0">否</a-radio>
            </a-radio-group>

            <!--<a-input placeholder="请输入是否是流程审批(1、0)" v-decorator="['iIsLimits', {}]" />-->
          </a-form-item>
          <div class="returnBox" v-show="showFlag">
            <h3>流程配置</h3>
            <div>流程：{{nameProc}}</div>
            <div>意见：{{nameOpinion}}</div>
            <div>按钮：{{nameButton}}</div>
          </div>
          <div class="returnBox" v-show="showFlag2">
            <h3>流程配置</h3>
            <div>按钮：{{nameButton2}}</div>
          </div>
          <div class="ant-row ant-form-item">
            <div class="ant-col-xs-24 ant-col-sm-5 ant-form-item-label">
              <a-button @click="checkUnit" type="primary">业务所属机构</a-button>
            </div>
          </div>
          <!--机构的表格-->
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="index"
            :columns="columnsUnit"
            :dataSource="dataSourceUnit"
            :pagination="ipaginationUnit"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange">
          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确定删除吗?" @confirm="() => handleEditUnit(record)">
                  <a>删除</a>
            </a-popconfirm>
            <!--<a @click="handleEditUnit(record)">删除</a>-->
          </span>
          </a-table>
          <div class="ant-row ant-form-item">
            <div class="ant-col-xs-24 ant-col-sm-5 ant-form-item-label">
              <a-button @click="checkView" type="primary">数据查看权限</a-button>
            </div>
          </div>
          <!--权限的表格-->
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="index"
            :columns="columnsView"
            :dataSource="dataSourceView"
            :pagination="ipaginationView"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange">
          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确定删除吗?" @confirm="() => handleEditView(record)">
                  <a>删除</a>
            </a-popconfirm>
            <!--<a @click="handleEditView(record)">删除</a>-->
          </span>
          </a-table>


        </a-form>
      </a-spin>
      <!--
      :modal-width="modalWidth"
        :multi="multi"
        :rootOpened="rootOpened"
        :depart-id="value"
        选择部门
        -->

    </div>
    <!--数据查看权限的modal-->
    <j-select-depart-modal ref="innerDepartSelectModal" :multi="true" @ok="checkUnitOk"/>
    <bus-function-view-modal ref="refBusFunctionViewModal" @ok="busFunctionViewModalOk"/>
    <bus-function-proc-button-modal ref="refBusFunctionProcButtonModal" @ok="busFunProcButOpin"/>
    <bus-page-list-select ref="selectPageModel" @selectFinished="selectPageOk"></bus-page-list-select>
    <bus-fun-no-proc-button ref="BusFunNoProcButtonRef" @ok="busFunNoProcBut"/>
  </a-modal>
</template>

<script>
  import {httpAction, getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import BusPageListSelect from '../BusPageListSelect'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  //import JSelectDepartModal from './modal/JSelectDepartModal'
  import moment from "moment"
  import JSelectDepartModal from "../../../components/jeecgbiz/modal/JSelectDepartModal";
  import BusFunctionViewModal from "./BusFunctionViewModal";
  import BusFunctionProcButtonModal from "./BusFunctionProcButtonModal";
  import BusPageDetailDef from "../BusPageDetailDef";
  import BusFunNoProcButton from "./BusFunNoProcButton";

  export default {
    name: "BusFunctionModal",
    mixins: [JeecgListMixin],
    inject: ['reload'],
    components: {
      BusFunNoProcButton,
      BusPageDetailDef,
      BusFunctionProcButtonModal,
      BusFunctionViewModal,
      JSelectDepartModal,
      BusPageListSelect,
    },
    data() {
      return {
        title: "操作",
        visible: false,
        nowKey: '',
        selectModelData: [],
        procButtonOpinion: {},      //按钮意见数据
        //procButtonOpinionObj: {},   //按钮意见数据Obj
        roleObj: {},                //数据查看权限数据,放角色id
        deptObj: {},                //部门的相关数据
        dbtable: [],
        roleList: [],               //角色字典数据
        departList: [],             //部门字典数据
        nameProc: '',
        nameOpinion: '',
        nameButton: '',
        nameButton2: '',
        iBMId: '',
        modelWidth: '60%',
        procDefKv: '',
        showFlag: false,
        showFlag2: false,
        dataSourceView: [],
        dataSourceUnit: [],
        ipaginationView: {
          current: 1,
          pageSize: 100,
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
        },
        ipaginationUnit: {
          current: 1,
          pageSize: 100,
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
        },
        columnsUnit: [
          {
            title: '机构名字',
            align: "center",
            dataIndex: 'sunitId',
            customRender: (text) => {
              for (let i = 0; i < this.departList.length; i++) {
                if (text == this.departList[i].value) {
                  return this.departList[i].text;
                }
              }
              return text;
            }
          },
          {
            title: '部门名称',
            align: "center",
            dataIndex: 'sdeptId',
            customRender: (text) => {
              for (let i = 0; i < this.departList.length; i++) {
                if (text == this.departList[i].value) {
                  return this.departList[i].text;
                }
              }
              return text;
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        columnsView: [
          {
            title: '权限类型',
            align: "center",
            dataIndex: 'itype',
            customRender: (text) => {
              if (text == 1) {
                return '角色';
              } else if (text == 2) {
                return '角色+机构'
              } else if (text == 3) {
                return '角色+部门'
              } else if (text == 4) {
                return '角色+分管部门'
              } else {
                return text;
              }
            }

          },
          {
            title: '角色名称',
            align: "center",
            dataIndex: 'iroleId',
            customRender: (text) => {
              for (let i = 0; i < this.roleList.length; i++) {
                if (text == this.roleList[i].value) {
                  return this.roleList[i].text;
                }
              }
              return text;
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
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
        validatorRules: {},
        url: {
          add: "/oaBus/busFunction/add",
          edit: "/oaBus/busFunction/edit",
          queryInit: "/oaBus/busFunction/queryInit",
          queryRoleAndDepart: "/oaBus/busFunction/queryRoleAndDepart",
          getbusPageDetailList: "/oaBus/oaBusdata/getPageDataForm",
          orderTicketList: "/test/jeecgOrderMain/queryOrderTicketListByMainId",
          list: "/oaBus/busFunction/queryInit",
        },
      }
    },
    created() {

    },
    destroyed() {
      this.close();
    },
    methods: {

      //长度校验
      dealLenth(rule, value, callback){
        if (value.length <= 30 ) {
          callback();
        } else {
          callback('长度不可以超过15个汉字或者30个字符！！!');
        }
      },
      //查找数组下标
      findIndex(rec,array){
        for (let i = 0; i < array.length; i++) {
          if (rec == array[i]) {
            return i;
          }
        }
      },
      handleEditView(record) {
        let i = this.findIndex(record,this.dataSourceView);
        this.dataSourceView.splice(i,1)
      },
      handleEditUnit(record) {
        let i = this.findIndex(record,this.dataSourceUnit);
        this.dataSourceUnit.splice(i,1)
      },

      /* handleTableChange(pagination){
         console.log(pagination);
       },*/
      //选择无流程按钮后的逻辑
      busFunNoProcBut(res) {
        console.log(res)
        this.showFlag = false;
        this.showFlag2 = true;
        this.nameButton2 = res.sbuttonSetName;
        if(this.procButtonOpinion == null){
          this.procButtonOpinion = {};
        }
        this.procButtonOpinion.procDefKey = '';
        this.procButtonOpinion.iprocOpinionId = '';
        this.procButtonOpinion.iprocButtonId = res.iid;
        console.log(JSON.stringify(this.procButtonOpinion))
      },
      busFunProcButOpin(procButtonOpinion) {
        //this.procButtonOpinion = {};
        this.procButtonOpinion.procDefKey = procButtonOpinion.procDefKey.val;
        this.procButtonOpinion.iprocOpinionId = procButtonOpinion.iprocOpinionId.iid;
        this.procButtonOpinion.iprocButtonId = procButtonOpinion.iprocButtonId.iid;

        this.showFlag2 = false;
        this.showFlag = true;
        this.nameProc = procButtonOpinion.procDefKey.key;
        this.nameOpinion = procButtonOpinion.iprocOpinionId.sprocOpinionName;
        this.nameButton = procButtonOpinion.iprocButtonId.sbuttonSetName;
        //console.log(this.procButtonOpinionObj)
      },
      /*流程选择触发事件*/
      procFunction(e) {
        let param = '';
        if(this.procButtonOpinion != undefined && this.procButtonOpinion != null ){
          param = this.procButtonOpinion ;
        }

        if (e == 1) {
          this.$refs.refBusFunctionProcButtonModal.add(param);
        } else {
          this.$refs.BusFunNoProcButtonRef.add(param);
        }


      },
      /*选择查看权限*/
      busFunctionViewModalOk(roleObj) {
        this.dataSourceView.push(roleObj)
        console.log(roleObj);
      },
      checkView() {
        //console.log("业务机构选择");
        this.$refs.refBusFunctionViewModal.add();
      },
      /*选择业务机构*/
      checkUnit() {
        //console.log("业务机构选择");
        this.$refs.innerDepartSelectModal.show()
        // this.$refs.selectDepModel.show()
      },
      /*选择业务机构成功后返回后执行的函数*/
      checkUnitOk(rows, idstr) {

        console.log("当前选中部门ID", idstr)
        if (!rows) {
          this.departNames = ''
          this.departIds = ''
        } else {
          this.deptObj = {}
          for (let item of rows) {
            console.log("当前选中部门", item)
            if (item.orgType == 1) {
              this.deptObj = {"sunitId": item.id}
            } else {
              this.deptObj = {"sdeptId": item.id, "sunitId": item.parentId}
            }
            this.dataSourceUnit.push(this.deptObj)
          }
        }
        //this.$emit("change",this.departIds)
      },
      add() {
        this.edit({});
      },
      edit(record) {
        console.log(record) ;
        this.nowKey = (new Date()).valueOf();
        getAction(this.url.queryRoleAndDepart).then((res) => {
          if(res.success){
            this.roleList = res.result.roleList;
            this.departList = res.result.departList;

          }else{
          }
        });
        this.getSelection();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'ibusModelId', 'sname', 'ipageId', 'sbusLeftParameter','slevel', 'iisUnit', 'iisDept', 'sbusRightParameter', 'iisEditor', 'iisLimits', 'iisEs', 'iisProc', 'iprocSetId', 'screateBy', 'supdateBy'))
        });
        if (this.model.iid) {
          //查询出对应的基础数据
          getAction(this.url.queryInit, {functionId: this.model.iid}).then((rec) => {
            //console.log(JSON.stringify(rec))
            this.dataSourceUnit = rec.result.unitList;
            this.ipaginationUnit.total = rec.result.unitList.length;
            this.dataSourceView = rec.result.viewList;
            this.ipaginationView.total = rec.result.viewList.length;
            this.procButtonOpinion = rec.result.busProcSet

            //如果没有流程，则显示没有流程的按钮
            if (this.model.iisProc == 0) {
              this.showFlag = false;
              this.showFlag2 = true;
              //console.log("++++++++"+JSON.stringify(this.model))
              if (rec.result.procButton != undefined) {
                this.nameButton2 = rec.result.procButton.sbuttonSetName;
              }
            }
            //如果有流程的话，就将数据
            else if (this.model.iisProc == 1) {
              this.showFlag = true;
              this.showFlag2 = false;
              if (rec.result.procKey != undefined) {
                this.nameProc = rec.result.procKey[0];
              }
              if (rec.result.procOpinion != undefined) {
                this.nameOpinion = rec.result.procOpinion.sprocOpinionName;
              }
              if (rec.result.procButton != undefined) {
                this.nameButton = rec.result.procButton.sbuttonSetName;
              }
            } else {
              this.showFlag = false;
              this.showFlag2 = false;
            }
          })
        }

      },
      close() {

        this.deptObj = {};
        this.roleObj = {};
        this.procButtonOpinion = {};
        this.showFlag = false;
        this.showFlag2 = false;
        this.dataSourceUnit = [];
        this.dataSourceView = [];
        this.ipaginationUnit = {},
        this.ipaginationView = {},
        this.$emit('close');
        //this.reload();
        this.visible = false;
      },
      selPage() {
        this.$refs.selectPageModel.show()
      },

      //选择页面
      selectPageOk(data) {
        this.model.ipageId = data[0];
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'ipageId'))
        });

      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {

          if (!err) {
            console.log("in  " + values);
            that.confirmLoading = true;
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.iid) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            /*let httpurl = '/oaBus/busFunction/add';
            let method = 'post';*/
            let orderMainData = Object.assign(this.model, values);
            console.log("orderMainData " + orderMainData);

            /*  if(JSON.stringify(this.deptObj) == "{}" ){

              }*/
            let formData = {
              ...orderMainData,
              busFunctionUnit: this.dataSourceUnit,
              busFunctionView: this.dataSourceView,
              busProcSet: this.procButtonOpinion
            }

            console.log(formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })

          }
        })
      },
      handleCancel() {
        this.close()
      },
      //得到model和page的数据列，填充对应的下拉选
      getSelection() {
        let url = "/oaBus/busModel/modelList";
        getAction(url).then((res) => {
          /*map.put("modelList",paperList);
          map.put("pageList",busPageList);*/
          this.selectModelData = res.result.modelList;
          this.dbtable = res.result.pageList;
        })
      }

    }
  }
</script>

<style scoped lang="less">
  .returnBox {
    margin: 0 auto;
    width: 75%;
    margin-top: 20px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    border: 1px solid #dddddd;
    padding: 10px;

    div {
      width: 300px;
      margin-top: 10px;
    }

  }

  .ant-btn {
    padding: 0 5px;
    margin-left: 3px;
  }

  .ant-form-item-control {
    line-height: 0px;
  }

  /** 主表单行间距 */
  .ant-form .ant-form-item {
    margin-bottom: 10px;
  }

  /** Tab页面行间距 */
  .ant-tabs-content .ant-form-item {
    margin-bottom: 0px;
  }
</style>