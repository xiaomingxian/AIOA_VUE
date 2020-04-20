<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    destroyOnClose
    @cancel="handleCancel"
    cancelText="关闭">


    <a-spin :spinning="confirmLoading" style="height: 360px;overflow: auto">
      <a-form :form="form">

        <!--<a-form-item-->
        <!--:labelCol="labelCol"-->
        <!--:wrapperCol="wrapperCol"-->

        <!--label="节点Id选择">-->
        <!--<a-select placeholder="请选流程动节点Id" v-decorator="['actId', {}]">-->
        <!--<a-select-option v-for="(item,index) in dbactName" :key="index" :value="item.id">{{item.id}}-->
        <!--</a-select-option>-->
        <!--</a-select>-->
        <!--</a-form-item>-->


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="环节名称">
          <a-select placeholder="请选择环节名称" v-decorator="['actName', {}]" @change="actChange">
            <a-select-option v-for="(item,index) in dbactName" :key="index" :value="item.id">{{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审批角色">
          <a-select placeholder="请选择审批角色" v-decorator="['candidates', {}]">
            <a-select-option v-for="(item,index) in role" :key="index" :value="item.roleName">{{item.roleName}}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="查询范围">
          <a-select placeholder="请选择查询范围" v-decorator="['roleScope', {}]">
            <a-select-option v-for="(item,index) in roleScope" :key="index" :value="item.itemValue">{{item.itemText}}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="多实例">
          <a-radio-group buttonStyle="solid" defaultValue="false" v-decorator="['multAssignee', {} ]"
                         size="small">
            <a-radio-button value="false">否</a-radio-button>
            <a-radio-button value="true">是</a-radio-button>
          </a-radio-group>

        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="签发人">
          <a-radio-group buttonStyle="solid" defaultValue="false" v-decorator="['signer', {} ]"
                         size="small">
            <a-radio-button value="false">否</a-radio-button>
            <a-radio-button value="true">是</a-radio-button>
          </a-radio-group>

        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="可追加">
          <a-radio-group buttonStyle="solid" defaultValue="false" v-decorator="['isCanAdd', {} ]"
                         size="small">
            <a-radio-button value="false">否</a-radio-button>
            <a-radio-button value="true">是</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="可部门完成">
          <a-radio-group buttonStyle="solid" defaultValue="false" v-decorator="['isDeptFinish', {} ]"
                         size="small">
            <a-radio-button value="false">否</a-radio-button>
            <a-radio-button value="true">是</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户或部门">
          <a-radio-group buttonStyle="solid" defaultValue="user" v-decorator="['userOrRole', {} ]"
                         @change="isUserOrRole"
                         size="small">
            <a-radio-button value="user">用户</a-radio-button>
            <a-radio-button value="dept">部门</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <div v-show="isDept">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="部门类型选择">
            <a-select placeholder="请选择部门任务类型" mode="multiple" v-decorator="['depts', {}]">
              <a-select-option v-for="(item,index) in depts" :key="index" :value="item.itemValue">{{item.itemText}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>


        <!--<a-form-item-->
        <!--:labelCol="labelCol"-->
        <!--:wrapperCol="wrapperCol"-->
        <!--label="是否填写完意见就完成任务">-->
        <!--<a-radio-group buttonStyle="solid" defaultValue="false"-->
        <!--v-decorator="['completeTask', {} ]"-->
        <!--size="small">-->
        <!--<a-radio-button value="false">否</a-radio-button>-->
        <!--<a-radio-button value="true">是</a-radio-button>-->
        <!--</a-radio-group>-->
        <!--</a-form-item>-->

        <div v-show="canRecord">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="记录当前用户">
            <a-radio-group buttonStyle="solid" defaultValue="false" v-decorator="['recordCurrentuser', {} ]"
                           @change="recordUser" size="small">
              <a-radio-button value="false">不记录</a-radio-button>
              <a-radio-button value="true">记录</a-radio-button>
            </a-radio-group>
          </a-form-item>

          <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="是否使用记录的用户">-->
          <!--<a-radio-group buttonStyle="solid" defaultValue="false" v-decorator="['userRecordVal', {} ]"-->
          <!--size="small">-->
          <!--<a-radio-button value="false">不使用</a-radio-button>-->
          <!--<a-radio-button value="true">使用</a-radio-button>-->
          <!--</a-radio-group>-->
          <!--</a-form-item>-->


          <div v-show="isRecord">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="使用当前用户">
              <a-select placeholder="请选择环节名称" mode="multiple" v-decorator="['recordKeys', {}]">
                <a-select-option v-for="(item,index) in canUserRecorduser" :key="index"
                                 :value="item.id+'-'+item.assignee">{{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>

        </div>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {getAction, httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import DictItemModal from "../../system/modules/DictItemModal";

  export default {
    name: "oaProcActinstModal",
    components: {DictItemModal},
    data() {
      return {
        title: "操作",
        visible: false,
        actMsg: '',
        model: {},
        dbtable: '',
        dbactName: {},
        roleScope: [],
        deptTypes: [],
        allowMultis:[],
        depts: [],
        role: [],
        isDept: false,
        canRecord: true,//可以进行记录
        isRecord: false,//是否使用以用环节
        //可以使用记录用户的环节
        canUserRecorduser: [],
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
          iid: {rules: [{required: true, message: '请输入主键id!'}]},
        },
        url: {
          add: "/workflow/oaProcActinst/add",
          edit: "/workflow/oaProcActinst/edit",
          defKv: "/wf/process/defKv",
          actsList: "/wf/process/actsList",
          getDictByKey: '/sys/dict/getDictByKey',
          getRoleAll: '/sys/role/listAll'
        },
      }
    },
    created() {
    },
    methods: {
      actChange(item) {
        //看当前的节点性质是否允许记录用户
        for (let i of this.dbactName) {
          //节点是但单实例 且 assignee有人
          if (i.id == item) {
            if (i.allowMulti == false && i.assignee != null) {
              this.canRecord = true
            } else {
              this.canRecord = false
            }
          }
        }
      },
      recordUser(item) {
        this.isRecord = item.target.value == 'true'
      },
      handleAddMy(record) {
        this.actMsg = record
        this.actsList(record.key)
        // this.visible = true;
        this.add()
      },
      actsList(key) {
        //所有角色
        getAction(this.url.getRoleAll).then(res => {
          this.role = res.result
        })
        //该流程的所有环节
        getAction(this.url.actsList, {key: key}).then(res => {
          //将可使用记录用户的节点提取出来(单实例)
          this.canUserRecorduser = []
          for (let i of res.result) {
            //记录部门类型
            let id = i.id
            if (i.type == 'subProcess') {
              this.deptTypes.push(id)
            }
            if (!i.allowMulti && i.assignee != null) {
              this.canUserRecorduser.push(i)
            }
            if (i.allowMulti) {
              this.allowMultis.push(id)
            }
          }

          this.dbactName = res.result;
        });
        //角色范围
        getAction(this.url.getDictByKey, {dictKey: 'actProRoleScope'}).then(res => {
          this.roleScope = res.result
        });
        //子流程部门类型
        getAction(this.url.getDictByKey, {dictKey: 'actProDepts'}).then(res => {
          this.depts = res.result
        });


      },
      add() {
        this.edit({});
      },
      handleEditMy(record) {
        record.multAssignee = record.multAssignee ? 'true' : 'false'
        record.recordCurrentuser = record.recordCurrentuser ? 'true' : 'false'
        record.completeTask = record.completeTask ? 'true' : 'false'
        record.isCanAdd = record.isCanAdd ? 'true' : 'false'
        record.signer = record.signer ? 'true' : 'false'
        record.isDeptFinish = record.isDeptFinish ? 'true' : 'false'
        record.userRecordVal = record.userRecordVal ? 'true' : 'false'
        record.depts = (record.depts != null && (record.depts).indexOf(',') >= 0) ? (record.depts).split(',') : null

        this.isDept = record.userOrRole == 'dept'
        this.isRecord = record.recordCurrentuser == 'true'

        this.actsList(record.procDefKey)
        this.edit(record)
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'procDefKey', 'actId', 'actName', 'candidates',
            'multAssignee', 'signer', 'roleScope', 'completeTask', 'isCanAdd', 'isDeptFinish',
            'userOrRole', 'depts', 'recordCurrentuser', 'recordKeys', 'userRecordVal'))
          //时间格式化
        });

      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {

        const that = this;
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
            //时间格式化

            formData.procDefKey = this.actMsg.key


            for (let i in this.dbactName) {
              let t = this.dbactName[i]
              if (t.id == formData.actName) {
                formData.actId = t.id
                formData.actName = t.name
                formData.actType = t.type
                break
              }
            }

            if (formData.depts != undefined) {
              formData.depts = formData.depts.join(',')
            }
            formData.userOrRole = formData.userOrRole == undefined ? 'user' : formData.userOrRole

            if (formData.recordKeys != undefined && formData.recordKeys != null && formData.recordKeys.length > 0) {
              formData.recordKey = formData.recordKeys.join(",")
            }
            let flag = this.check(formData)
            if (flag) {
              return
            }


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
      check(formData) {
        if (formData.actName == undefined || formData.actName =='') {
          this.$message.warning('节点名称不能为空');
          this.confirmLoading = false;
          return true
        }
        if (formData.candidates == undefined || formData.candidates =='') {
          this.$message.warning('候选人角色不能为空');
          this.confirmLoading = false;
          return true
        }
        if (formData.roleScope == undefined || formData.roleScope =='') {
          this.$message.warning('候选人选择范围不能为空');
          this.confirmLoading = false;
          return true
        }
        if (formData.userOrRole == 'dept' && formData.actId != undefined && this.deptTypes.indexOf(formData.actId) < 0) {
          this.$message.warning('当前环节不支持部门类型配置,请修改');
          this.confirmLoading = false;
          return true
        }
        if (formData.multAssignee=='true'){
          if (this.allowMultis.indexOf(formData.actId)<0) {
            this.$message.warning('当前环节不支持多实例,请修改');
            this.confirmLoading = false;
            return true
          }
        }
        return false
      },
      handleCancel() {
        this.close();
      },
      isUserOrRole(value) {
        this.isDept = value.target.value == 'dept'
        // if (!this.isDept) {
        //   //清空部门选择
        // }
      }
    }
  }
</script>

<style lang="less" scoped>
</style>