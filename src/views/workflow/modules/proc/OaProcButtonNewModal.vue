<template>
  <a-modal
    :title="title"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOkIsCreate"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin tip="Loading..." :spinning="confirmLoading"  style="height: 400px; width:100%">
      <a-form :form="form">
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="主键id">-->
          <!--<a-input-number v-decorator="[ 'iId', validatorRules.iid ]" />-->
        <!--</a-form-item>-->
        <!--<a-form-item style="color: #1890ff;font-weight: 800;margin: 10px 0px;font-size: 16px;">-->
          <!--<span>流程定义KEY：</span>-->
          <!--<span>{{procDefKey}}</span>-->
          <!--&lt;!&ndash;<a-input style="width:300px;" placeholder="请输入流程定义KEY" v-decorator="['procDefKey', {}]" />&ndash;&gt;-->
        <!--</a-form-item>-->
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
        <!--label="按钮组合名称">-->
        <!--<a-input style="width:300px;" placeholder="请输入按钮组合名称" v-model="sbuttonSetName" />-->
          <!--<a-divider type="vertical"/>-->
          <!--<a-button @click="sbuttonNewName" type="primary" icon="plus">修改组合按钮名称</a-button>-->
        <!--</a-form-item>-->
        <!--水平分割-->
        <!--<a-divider />-->
        <span style="font-weight: 900;font-size: 16px;">环节按钮</span>
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="12" style="margin-top: 10px;margin-left: 42px;padding-bottom: 0px">
                <!--<template v-if="toggleSearchStatus">-->
                <a-col :md="15" :sm="8" >
                    <a-form-item label="流程任务">
                      <!--<a-input placeholder="请输入流程任务" v-model="queryParam.taskDefKey"></a-input>-->
                      <!--@change="handelChange"-->
                      <a-select
                        placeholder="请选择任务环节"
                        :getPopupContainer="triggerNode=>triggerNode.parentNode"
                        v-model="taskDefKey"
                        @change="selectHuan">
                        <a-select-option v-for="Activity in TaskLinkList" :value="Activity.id">
                          {{ Activity.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

              </a-row>
              <a-row :gutter="12" style="margin-top: 10px;margin-left: 42px;padding-bottom: 0px">
                <a-col :md="15" :sm="8">
                  <a-form-item label="操作按钮">
                    <!--<a-input placeholder="请输入按钮名称" v-model="queryParam.iButtonId"></a-input>-->
                    <a-select
                      placeholder="请选择按钮名称"
                      :getPopupContainer="triggerNode=>triggerNode.parentNode"
                      v-model="iButtonId"
                      @change="getButtonSetInfo">
                      <a-select-option  v-for="(oaButton,index) in buttonList" :key="index" :value="oaButton.iid">
                        {{ oaButton.sbtnName +"【"+oaButton.sexcbuttonId+"】"}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        <span style="font-weight: 900;font-size: 16px;">按钮显示控制</span>
        <!--水平分割-->
        <!--<a-divider />-->
        <div>

          <a-form  class="configBox">
            <a-row :gutter="48" style="margin-left: 25px">
              <template v-if="toggleSearchStatus">
                <!--<a-divider type="vertical" style="margin-left: 110px;"/>-->

                <!--<a-divider type="vertical"/>-->
                <!--<a-button   @click="deleteBtnSet" type="primary" icon="plus">保存当前配置</a-button>-->


                <div style="width: 95%;margin: 0 auto; display: flex;align-items: center;justify-content: flex-start">
                  <a-form-item style="display: flex;align-items: center;justify-content: flex-start;width: 200px;">
                    <span style="margin-left: 10px;" class="configOption">控 制：</span>
                    <a-radio-group @change="onipermitType" v-model="ipermitType">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item style="display: flex;align-items: center;justify-content: flex-start;margin-left: 60px;width: 270px;">
                    <span class="configOption">拟稿人：</span>
                    <a-radio-group  style="margin-left: 10px;" @change="oniisCreater" v-model="iisCreater">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </div>



                <div style="width: 95%;margin: 0 auto; display: flex;align-items: center;justify-content: flex-start">
                  <a-form-item  style="display: flex;align-items: center;justify-content: flex-start;width: 200px;">
                    <span style="margin-left: 10px;" class="configOption">读 者：</span>
                    <a-radio-group @change="oniisReader" v-model="iisReader">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item style=" display: flex;align-items: center;justify-content: flex-start;width: 200px;margin-left: 60px;">
                    <span class="configOption">已办用户：</span>
                    <a-radio-group @change="oniisLastsender" v-model="iisLastsender">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </div>


                <div style="width: 95%;margin: 0 auto; display: flex;align-items: center;justify-content: flex-start">
                  <a-form-item style=" display: flex;align-items: center;justify-content: flex-start;width: 200px;">
                    <span style="margin-left: 10px;" class="configOption">处理人：</span>
                    <a-radio-group @change="oniisTransactors" v-model="iisTransactors">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item style=" display: flex;align-items: center;justify-content: flex-start;width: 200px;margin-left: 60px;">
                  <span class="configOption">顺序号：</span>
                  <!--<a-input-number max="9999" style="margin-left: 10px" @change="oniorder" v-model="iorder" />-->
                  <!--<a-input maxLength="4" style="margin-left: 10px" @change="oniorder" v-model="iorder" />-->
                  <!--<a-input type="number" placeholder="请输入顺序" v-decorator="[ 'iorder', {rules:[{required:true ,message:'请输入排序号!'},{pattern: new RegExp(/^[0-9]\d*$/), message: '请输入数字'}] }]" />-->
                  <a-input min="0" type="number" style="margin-left: 10px;width: 120px;" v-model="iorder" @change="oniorder" oninput="if(value.length>4)value=value.slice(0,4)"/>
                </a-form-item>
              </div>




                <a-form-item  style="margin: 0px;">
                  <span style="margin-left: 30px" class="configOption">显示的角色：</span>
                  <a-select
                  mode="multiple"
                  style="width: 40%"
                  placeholder="请选择显示的角色"
                  @change="onChange2"
                  v-model="sRoles">
                  <a-select-option v-for="Activity in iisDefendLink" :value="Activity.id">
                  {{ Activity.roleName }}
                  </a-select-option>
                  </a-select>
                </a-form-item>
                <!--<a-form-item-->
                  <!--:labelCol="labelCol"-->
                  <!--:wrapperCol="wrapperCol"-->
                  <!--label="默认按钮配置">-->
                  <!--<a-radio-group @change="oniisDefault" v-model="iisDefault">-->
                    <!--<a-radio :value="1">是</a-radio>-->
                    <!--<a-radio :value="0">否</a-radio>-->
                  <!--</a-radio-group>-->
                  <!--<a-divider/>-->
                <!--</a-form-item>-->
              </template>
            </a-row>
          </a-form>
        </div>


        <!-- 操作按钮区域 -->
        <!--<div class="table-operator" style="margin-bottom: 20px;" >-->
          <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
          <!--<a-button style="margin-left: 10px;" type="primary" icon="download" @click="handleExportXls('发布类按钮描述')">导出</a-button>-->
          <!--<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"-->
          <!--@change="handleImportExcel">-->
          <!--<a-button style="margin-left: 10px;"  type="primary" icon="import">导入</a-button>-->
          <!--</a-upload>-->
          <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
            <!--<a-menu slot="overlay">-->
              <!--<a-menu-item key="1" @click="batchDel">-->
                <!--<a-icon type="delete"/>-->
                <!--删除-->
              <!--</a-menu-item>-->
            <!--</a-menu>-->
            <!--<a-button style="margin-left: 8px"> 批量操作-->
              <!--<a-icon type="down"/>-->
            <!--</a-button>-->
          <!--</a-dropdown>-->
        <!--</div>-->

        <!-- table区域-begin -->
        <!-- table区域-end -->

        <!-- 表单区域 -->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import OaButtonSetModal from './OaButtonSetModal'
  import OaButtonSetCatModel from './OaButtonSetCatModal'
  import {httpAction,getAction,deleteAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'


  export default {
    name: "OaProcButtonNewModal",
    mixins: [JeecgListMixin],
    components: {
      OaButtonSetModal,
      OaButtonSetCatModel
    },
    data() {
      return {
        sRoles: [],
        iisDefendLink:[],
        title: "",
        newCreate:true,//是否为新建
        visible: false,
        data: [],
        model: {},
        iorder:0,//顺序号
        ipermitType:0,//不控制
        iisCreater:0, //拟稿人
        iisReader:0, //读者
        iisLastsender:0, //已办用户
        iisTransactors:0, //处理人
        iisDefault:0, //默认按钮配置
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        btnSetModel:{},
        taskDefKey:'',
        sbuttonSetName:'',//组合按钮名称
        procDefKey:'',
        TaskLinkList:[],//任务环节列表
        TaskLinkId:'',//流程定义Id
        buttonList:[],//按钮列表
        iButtonId:'',
        toggleSearchStatusSet:true,//单独控制按钮
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          iId: {rules: [{required: true, message: '请输入主键id!'}]},
        },
        description: '发布类按钮描述管理页面',
        // 表头
        // columns: [
        //   {
        //     title: '操作',
        //     dataIndex: 'action',
        //     align: "center",
        //     scopedSlots: {customRender: 'action'},
        //   }
        // ],
        url: {
          list: "/oabuttonset/oaButtonSet/findById",
          delete: "/oabuttonset/oaButtonSet/delete",
          deleteBatch: "/oabuttonset/oaButtonSet/deleteBatch",
          exportXlsUrl: "oabuttonset/oaButtonSet/exportXls",
          importExcelUrl: "oabuttonset/oaButtonSet/importExcel",
          add: "/oabuttonset/oaButtonSet/add",
          edit: "/oabuttonset/oaButtonSet/edit",
        }
      }
    },
    created() {
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      //流程任务
      selectHuan(e){
        this.model.taskDefKey=e;
        console.log(e);

        this.getButtonSetInfo();
        // this.$forceUpdate();
      },
      //修改按钮名称
      sbuttonNewName(){
        const that = this;
        let httpurl = '';
        let method = '';
        if (!this.model.iid) {
          httpurl += "/oaprocbutton/oaProcButton/add";
          method = 'post';
        } else {
          httpurl += "/oaprocbutton/oaProcButton/edit";
          method = 'put';
        }

        this.model.sbuttonSetName=this.sbuttonSetName;
        // let formData = Object.assign(this.model, values);
        httpAction(httpurl, {iid:this.model.iid,sbuttonSetName:this.model.sbuttonSetName}, method).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.$emit('ok');
          } else {
            that.$message.warning(res.message);
          }
        })
      },
      getTaskLinkList(){//获取任务环节
        let url="/wf/process/actsList";
        getAction(url, {processDefinitionId: this.TaskLinkId}).then(res => {
          console.log('taskList----------------------------');
          this.TaskLinkList = res.result;
          if (this.taskDefKey==null || this.taskDefKey==''){
            this.taskDefKey=this.TaskLinkList[0].id;//得到默认值
          }
          this.getButtonSetInfo();
        })
      },
      getButtonList(){//按钮列表
        let url="/oabutton/oaButton/buttonList";
        getAction(url,{}).then(res=>{
          this.buttonList = res.result;
          console.log('btbt----------------------------');
          if ( this.iButtonId==null ||  this.iButtonId==''){
            this.iButtonId=this.buttonList[0].iid;
          }
          this.getButtonSetInfo();
        });
      },
      getButtonSetInfo(){//按钮改变时--请求表单数据若存在则回显
        this.iorder=0;//顺序号
        this.ipermitType=0;
        this.iisCreater=0;
        this.iisReader=0;
        this.iisLastsender=0;
        this.iisTransactors=0;
        this.iisDefault=0;
        this.sRoles=[];
        this.toggleSearchStatus=true;
        this.model.taskDefKey=this.taskDefKey;
        this.model.iButtonId=this.iButtonId;
        let url="oabuttonset/oaButtonSet/queryByTaskDefKeyAndBtnId";
        httpAction(url,{iProcButtonId:this.model.iid,procDefKey:this.model.procDefKey,taskDefKey:this.taskDefKey,iButtonId:this.iButtonId},'post').then(res=>{
//          console.log('...............................');
//          console.log(res.result);
          if (res.success) {
            this.btnSetModel = res.result;
            this.toggleSearchStatusSet=true;
            this.iorder=this.btnSetModel.iorder;
             if (this.model!=null&&this.btnSetModel.sroles!=null && this.btnSetModel.sroles!=''){
              this.sRoles=this.btnSetModel.sroles.split(',');
             }
            this.ipermitType=this.btnSetModel.ipermitType;
            this.iisCreater=this.btnSetModel.iisCreater;//拟稿人
            this.iisReader=this.btnSetModel.iisReader; //读者
            this.iisLastsender=this.btnSetModel.iisLastsender;//已办用户
            this.iisTransactors=this.btnSetModel.iisTransactors;//处理人
            this.iisDefault=this.btnSetModel.iisDefault;//默认按钮配置
          }else {
//            console.log('111111111111111111111111111111111');
            this.toggleSearchStatusSet=false;
            this.btnSetModel.iid = null;
            this.btnSetModel.sroles='';
            this.btnSetModel.iorder=0;
            this.btnSetModel.ipermitType=0;
            this.btnSetModel.iisCreater=0;//拟稿人
            this.btnSetModel.iisReader=0; //读者
            this.btnSetModel.iisLastsender=0;//已办用户
            this.btnSetModel.iisTransactors=0;//处理人
            this.btnSetModel.iisDefault=0;//默认按钮配置
          }
          this.confirmLoading = false;
        });
      },
      //点击删除按钮 前校验
      beforeConfirm(){
        // console.log(this.btnSetModel)
        if (this.btnSetModel.iid==null){
          this.$message.warning("当前信息不存在");
        }else {
          let url='oabuttonset/oaButtonSet/verButtonSetDelete';
          getAction(url,{id:this.btnSetModel.iid}).then(res=>{
            if (res.success){
              // this.$message.success(res.message);
              //调用弹框
              this.showConfirm();
            } else {
              this.deleteBtnSet();
            }
          });
        }


      },
      //弹框
      showConfirm(){
        let that=this;
        this.$confirm({
          title:'你确定要删除吗？',
          content:'您的某些业务已经使用了这套按钮',
          onOk(){
            that.deleteBtnSet();
          },
          onCancel(){
          }
        })
      },
      deleteBtnSet(){//删除操作
        if (this.btnSetModel.iid){
          var that = this;
          deleteAction(that.url.delete, {id: this.btnSetModel.iid}).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              // that.loadData();
              this.iorder=0;//顺序号
              this.ipermitType=0;
              this.iisCreater=0;
              this.iisReader=0;
              this.iisLastsender=0;
              this.iisTransactors=0;
              this.iisDefault=0;
              this.toggleSearchStatus=false;
              this.toggleSearchStatusSet=false;
            } else {
              that.$message.warning(res.message);
            }
          });
        }
      },
      oniorder() {
        // console.log('wwwwwwwwwwwwwwwwwww');
        this.btnSetModel.iorder=this.iorder;
        // console.log(this.iorder);
      },
      onipermitType() {
        this.btnSetModel.ipermitType=this.ipermitType;
      },
      oniisCreater() {
        this.btnSetModel.iisCreater=this.iisCreater;
      },
      oniisReader() {
        this.btnSetModel.iisReader=this.iisReader;
      },
      oniisLastsender() {
        this.btnSetModel.iisLastsender=this.iisLastsender;
      },
      oniisTransactors() {
        this.btnSetModel.iisTransactors=this.iisTransactors;
      },
      oniisDefault() {
        this.btnSetModel.iisDefault=this.iisDefault;
      },
      onChange2 (value) {
        console.log("55555555555555555555555");
        console.log(value.toString());
        this.btnSetModel.sroles=value.toString();
      },
      // loadData(iid) {
      //   getAction(this.url.list, {id: iid}).then(res => {
      //     this.data = res.result.records;
      //   })
      // },
      add() {
        this.btnSetModel.sroles=[];
        this.edit({});
      },
      editBefore(record,TaskLinkId,res){
        console.log('************************************');
        console.log(res);
        this.iButtonId=res.ibuttonId;
        this.taskDefKey=res.taskDefKey;
        this.edit(record,TaskLinkId);
      },
      edit(record,TaskLinkId) {
        this.confirmLoading = true;
        getAction('sys/role/queryall?_t=1577627530',{}).then(res=>{
         this.iisDefendLink=res.result;
        });

        //每次打开页面初始化值
       this.iorder=0;//顺序号
//        this.ipermitType=0;
        this.iisCreater=0;
        this.iisReader=0;
        this.iisLastsender=0;
        this.iisTransactors=0;
        this.iisDefault=0;
        this.toggleSearchStatus=false;

        this.TaskLinkId=TaskLinkId;

        this.model = Object.assign({}, record);
        this.procDefKey=this.model.procDefKey;
        this.sbuttonSetName=this.model.sbuttonSetName;

        this.form.resetFields();
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iid', 'procDefKey', 'sbuttonSetName'))
          //时间格式化
        });
        this.getTaskLinkList();//加载任务列表
        this.getButtonList();//加载按钮列表
        this.getButtonSetInfo();
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOkIsCreate(){
        if(this.iorder==null || this.iorder.length<1){
          this.$message.warning("顺序号不能为空");
        }else {
          if(this.newCreate==true && this.btnSetModel.iid==null){
            this.handleOk();
          }else if(this.newCreate==false && this.btnSetModel.iid!=null ){
            this.handleOk();
          }else if(this.newCreate==false && this.btnSetModel.iid==null){
            this.$message.warning("编辑时无法新增数据，请前往新建中操作");
          }else{
            this.$message.warning("当前环节下按钮已存在，无法重复添加");
          }
        }

      },
      handleOk() {
        // console.log('')
        const that = this;
        // 触发表单验证
        if (that.toggleSearchStatus==false){
          // this.close();
          //若删除当前配置默认确定为关闭
          that.$emit('ok');
        }

        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            // console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq----');
            if (this.btnSetModel.iid==null || !this.btnSetModel.iid) {
              this.btnSetModel.iprocButtonId=this.model.iid;
              this.btnSetModel.procDefKey=this.model.procDefKey;
              this.btnSetModel.taskDefKey=this.taskDefKey;
              this.btnSetModel.ibuttonId=this.iButtonId;
              console.log(this.btnSetModel);
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.btnSetModel, values);
            //时间格式化
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                 that.$message.warning(res.message);
              }
            }).finally(() => {
              this.clearData();
              that.confirmLoading = false;
                this.close();
            })
          }
        })
      },
      clearData(){
          this.data=[];
        this.iButtonId=null;
        this.taskDefKey=null;
      },
      handleCancel() {
        this.clearData();
        this.close()
      }

    },

  }
</script>

<style lang="less" scoped>
.configBox .configOption{
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
}
</style>