<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading" style="height: 400px; width:100%;overflow: auto">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="所属机构">
          <a-select v-model="selectedUnit" @change="getUnitVal">
            <a-select-option v-for="(item,index) in unitData" :key="index" :value="item.id">{{item.departName}}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务分类">
          <a-select v-model="selectedModel" @change="getModalVal">
            <a-select-option v-for="(item,index) in modelData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="业务功能">
          <!--:defaultValue=1 -->
          <a-select v-model="selectedFunction" placeholder="" v-decorator="[ 'ibusFunctionId', {}]"
                    ref="sss" id="selop">
            <a-select-option v-for="(item,index) in functionList" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
          <!--          <a-input v-else placeholder="暂无匹配业务"></a-input>-->
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文号名称">
          <a-input placeholder="" v-decorator="['sname', validatorRules.sname]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="文号规则">
          <a-input placeholder="" v-decorator="['sdocRule', validatorRules.sdocRule]"/>
        </a-form-item>
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="当前文号">-->
        <!--          <a-input-number placeholder="" v-decorator="['idocNum', {}]"/>-->
        <!--        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上报模版">
          <a-select v-decorator="[ 'iutemplateId', {}]">
            <a-select-option v-for="(item,index) in upData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="下发模版">
          <a-select v-decorator="[ 'idtemplateId', {}]">
            <a-select-option v-for="(item,index) in downData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="办文单模板">
          <a-select v-decorator="[ 'iatemplateId', {}]">
            <a-select-option v-for="(item,index) in officeData" :key="index" :value="item.iid">{{item.sname}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="序号">
          <a-input v-decorator="[ 'iorder', validatorRules.iorder]"/>
          <!--          <a-input-number v-model="iorder" :min="1" :max="100000"/>-->
        </a-form-item>

        <!--部门分配-->
        <a-form-item label="部门分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled">
          <a-input-group style="display: inline-flex">
            <a-input
              style="pointer-events: auto"
              placeholder="点击右侧按钮选择部门"
              v-model="checkedDepartNameString"
              disabled>
            </a-input>
            <a-button icon="search" @click="onSearch">选择</a-button>
          </a-input-group>
          <a-input type="hidden" placeholder="" v-decorator="['selecteddeparts']"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注">
          <a-textarea placeholder="" v-decorator="['sremarks',validatorRules.sremarks]"/>
        </a-form-item>

      </a-form>

    </a-spin>
    <select-depart-window ref="SelectDepartWindow" @ok="modalFormOk"></select-depart-window>
  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import {getAction} from '@/api/manage'
  // 引入搜索部门弹出框的组件
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import {addUser, editUser, queryUserRole, queryall} from '@/api/api'
  import {disabledAuthFilter} from "@/utils/authFilter"
  import {duplicateCheck} from '@/api/api'
  import SelectDepartWindow from "../../system/modules/SelectDepartWindow";
  import {postAction} from '@/api/manage'
  import SplitPanel from "../../jeecg/SplitPanel";

  export default {
    name: "DocNumSetModal",
    components: {
      SplitPanel,
      SelectDepartWindow
    },
    data() {
      return {
        ids: '',
        title: "操作",
        visible: false,
        // iorder: 0,
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
        loading: false,// 加载状态
        form: this.$form.createForm(this),
        validatorRules: {
          // ibusFunctionId:{rules: [{ required: true, message: '请输入主键id!' }]},
          // ibusModelId:{rules: [
          //     { required: true, message: '请选择业务分类！' },
          //   ]},
          // ibusUnitId:{rules: [
          //     { required: true, message: '请输入所属机构！' },
          //   ]},
          // ibusFunctionId:{rules: [
          //     { required: true, message: '请输入业务名称！' },
          //   ]},
          sname: {
            rules: [
              {required: true, message: '请输入文号名称！'},
              {min: 1, max: 50, message: '文号名称长度不能超过50位！', trigger: 'blur'}
            ]
          },
          iorder: {
            rules: [
              {required: false, pattern: /^[1-9]\d{0,4}$/, message: '请输入长度不超过5位的正整数！'},
              // {min: 1, max: 11, message: '长度在 1 到 11 个字符'}
            ]
          },
          sdocRule: {
            rules: [
              {min: 1, max: 50, message: '文号规则长度不能超过50位！', trigger: 'blur'}
            ]
          },
          sremarks: {
            rules: [
              {min: 1, max: 50, message: '备注长度不能超过50位！', trigger: 'blur'}
            ]
          },
        },
        url: {
          add: "/papertitle/docNumSet/add",
          edit: "/papertitle/docNumSet/edit",
          userWithDepart: "/papertitle/docNumSet/getDocDepartsList",
          userId: "/sys/user/generateUserId"
        },
        selectedModel: null,
        selectedUnit: null,
        selectedFunction: null,
        allowClear: false,
        modelData: [],
        functionList: [],
        functionData: [],
        upData: [],
        downData: [],
        officeData: [],
        unitData: [],
        //部门控件
        departDisabled: false, //是否是我的部门调用该页面
        roleDisabled: false, //是否是角色维护调用该页面
        modalWidth: 800,
        drawerWidth: 700,
        modaltoggleFlag: true,
        confirmDirty: false,
        selectedDepartKeys: [], //保存用户选择部门id
        checkedDepartKeys: [],
        checkedDepartNames: [], // 保存部门的名称 =>title
        checkedDepartNameString: "", // 保存部门的名称 =>title
        userId: "", //保存用户id
        disableSubmit: false,
        userDepartModel: {userId: '', departIdList: []}, // 保存SysUserDepart的用户部门中间表数据需要的对象
      }
    },
    created() {
      this.initData();
      // const token = Vue.ls.get(ACCESS_TOKEN);
      // this.headers = {"X-Access-Token": token}
    },
    methods: {
      initData() {
        this.getBusModelList();
        this.getUnitList();
        this.getTemplateUp();
        this.getTemplateDown();
        this.getTemplateOffice();
      },
      add() {
        this.selectedUnit = this.unitData[0].id;
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.userId = record.iid;
        // this.iorder = record.iorder
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iid', 'ibusModelId', 'ibusUnitId', 'ibusFunctionId', 'iorder', 'sname', 'sdocRule', 'idocNum', 'iutemplateId', 'idtemplateId', 'iatemplateId', 'sremarks', 'screateBy', 'supdateBy'))
        });
        this.selectedModel = record.ibusModelId;
        if (Object.keys(record).length !== 0) {
          this.selectedUnit = record.ibusUnitId;
          //选中所选业务
          this.initFunctionList(this.selectedModel, this.selectedUnit);
          this.selectedFunction = record.ibusFunctionId;
        }
        // 调用查询用户对应的部门信息的方法
        this.checkedDepartKeys = [];
        this.loadCheckDeparts();
      },
      //初始化业务
      initFunctionList(model, unit) {
        let url = "/papertitle/docNumSet/busFunctionList";
        getAction(url, {iBusModelId: model, iBusUnitId: unit}).then((res) => {
          this.functionList = res.result;
        })
      },
      //查询机构
      getUnitList() {
        let url = '/sys/sysDepart/query';
        getAction(url, {orgType: '1'}).then(res => {
          this.unitData = res.result;
        })
      },
      //下拉选列表-所属模块
      getBusModelList() {
        let url = "/papertitle/docNumSet/busModelList";
        getAction(url).then((res) => {
          console.log(res.result);
          this.modelData = res.result;
        })
      },
      //选择模块--》更新查业务
      getModalVal(model) {
        this.model.ibusModelId = model;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'ibusModelId'))
        });
        if (this.selectedUnit === null) {
          return;
        }
        // console.log(value);
        let url = "/papertitle/docNumSet/busFunctionList";
        getAction(url, {iBusModelId: model, iBusUnitId: this.selectedUnit}).then((res) => {
          if (res.result === null) {
            this.$message.error("请确认该机构该业务类别是否有对应的的业务功能！")
          }
          this.loading = true;
          this.functionList = res.result;
          this.selectedFunction = null;
          this.form.setFieldsValue({
            ibusFunctionId: ''
          })
        })
      },
      //选择模块--》更新查业务
      getUnitVal(unit) {
        let url = "/papertitle/docNumSet/busFunctionList";
        if (this.selectedModel === undefined) {
          return;
        }
        getAction(url, {iBusModelId: this.selectedModel, iBusUnitId: unit}).then((res) => {
          if (res.result === null) {
            this.$message.error("请确认该机构该业务类别是否有对应的的业务功能！")
          }
          this.loading = true;
          this.functionList = res.result;
          this.selectedFunction = null;
          this.form.setFieldsValue({
            ibusFunctionId: ''
          })
        })
      },
      //下拉选列表-上报
      getTemplateUp() {
        let url = "/papertitle/oaTemplate/templateList?type=1";
        getAction(url).then((res) => {
          this.upData = res.result;
        })
      },
      //下拉选列表-下发
      getTemplateDown() {
        let url = "/papertitle/oaTemplate/templateList?type=2";
        getAction(url).then((res) => {
          this.downData = res.result;
        })
      },
      //下拉选列表-办公单
      getTemplateOffice() {
        let url = "/papertitle/oaTemplate/templateList?type=3";
        getAction(url).then((res) => {
          this.officeData = res.result;
        })
      },
      loadCheckDeparts() {
        let that = this;
        if (!that.userId) {
          return
        }
        getAction(that.url.userWithDepart, {userId: that.userId}).then((res) => {
          that.checkedDepartNames = [];
          if (res.success) {
            for (let i = 0; i < res.result.length; i++) {
              that.checkedDepartNames.push(res.result[i].title);
              this.checkedDepartNameString = this.checkedDepartNames.join(",");
              that.checkedDepartKeys.push(res.result[i].key);
            }
            that.userDepartModel.departIdList = that.checkedDepartKeys
          } else {
            console.log(res.message);
          }
        })
      },
      // 搜索用户对应的部门API
      onSearch() {
        this.$refs.SelectDepartWindow.add(this.checkedDepartKeys, this.userId);
      },
      // 获取用户对应部门弹出框提交给返回的数据
      modalFormOk(formData) {
        this.checkedDepartNames = [];
        this.selectedDepartKeys = [];
        this.checkedDepartNameString = '';
        this.userId = formData.userId;
        this.userDepartModel.userId = formData.userId;
        for (let i = 0; i < formData.departIdList.length; i++) {
          this.selectedDepartKeys.push(formData.departIdList[i].key);
          this.checkedDepartNames.push(formData.departIdList[i].title);
          this.checkedDepartNameString = this.checkedDepartNames.join(",");
        }
        this.userDepartModel.departIdList = this.selectedDepartKeys;
        this.checkedDepartKeys = this.selectedDepartKeys  //更新当前的选择keys
        // console.log("=====>" + this.checkedDepartKeys);
      },
      refresh() {
        this.selectedDepartKeys = [];
        this.checkedDepartKeys = [];
        this.checkedDepartNames = [];
        this.checkedDepartNameString = "";
        this.userId = ""
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.userDepartModel = {userId: '', departIdList: []};
        this.checkedDepartNames = [];
        this.checkedDepartNameString = '';
        this.checkedDepartKeys = [];
        this.selectedDepartKeys = [];
        this.functionList = [];
      },
      handleOk() {
        const that = this;
        if (this.selectedModel == null) {
          this.$message.error("请选择业务分类！")
        }
        if (this.selectedFunction == null) {
          this.$message.error("请选择业务功能！")
        }
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
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
            let formData = Object.assign(this.model, values);
            formData.ibusModelId = this.selectedModel;
            formData.ibusFunctionId = this.selectedFunction;
            formData.ibusUnitId = this.selectedUnit;
            // formData.iorder = this.iorder;
            formData.selecteddeparts = this.userDepartModel.departIdList.length > 0 ? this.userDepartModel.departIdList.join(",") : '';
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


    }
  }
</script>

<style lang="less" scoped>

</style>