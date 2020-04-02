<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin  tip="Loading..."  :spinning="confirmLoading" style="height: 360px;margin-left: 50px">
      <a-form :form="form">

        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="主键id">-->
          <!--<a-input-number v-decorator="[ 'iId', validatorRules.iid ]" />-->
        <!--</a-form-item>-->
        <a-form-item style="color: #1890ff;font-weight: 800;margin: 10px 0px;font-size: 16px;">
          <span>流程定义KEY：</span>
          <!--<a-input placeholder="请输入流程定义KEY" v-decorator="['procDefKey', {}]" />-->
          <span >{{procDefKey}}</span>
        </a-form-item>
        <!--<a-form-item-->
        <!--:labelCol="labelCol"-->
        <!--:wrapperCol="wrapperCol"-->
        <!--label="意见框组合名称">-->
        <!--<a-input style="width: 300px" placeholder="请输入意见框组合名称" v-model="sprocOpinionName"/>-->
          <!--<a-divider type="vertical"/>-->
          <!--<a-button @click="iTaskOpinionNewName" type="primary" icon="plus">修改意见框组合名称</a-button>-->
        <!--</a-form-item>-->
        <!--水平分割-->
        <!--<a-divider style="margin-top: 0px"/>-->
        <span style="font-weight: 1000;font-size: 16px;">选择(非特殊情况办文单类型选空):</span>
        <!--<a-divider/>-->
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="12" style="margin-top: 25px;margin-left: 35px">
              <!--<template v-if="toggleSearchStatus">-->
              <a-col :md="10" :sm="8">
                <a-form-item label="流 程 任 务">
                  <!--<a-input placeholder="请输入流程任务" v-model="queryParam.taskDefKey"></a-input>-->
                  <!--@change="handelChange"-->
                  <a-select
                    placeholder="请选择任务环节"
                    v-model="taskDefKey"
                    @change="onTasklink">
                    <a-select-option v-for="Activity in TaskLinkList" :value="Activity.id">
                      {{ Activity.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <!--<a-col :md="6" :sm="8">-->
                <!--<a-form-item label="按钮列表">-->
                  <!--&lt;!&ndash;<a-input placeholder="请输入按钮名称" v-model="queryParam.iButtonId"></a-input>&ndash;&gt;-->
                  <!--<a-select-->
                    <!--placeholder="请选择按钮名称"-->
                    <!--v-model="iButtonId"-->
                    <!--@change="getButtonSetInfo">-->
                    <!--<a-select-option  v-for="(oaButton,index) in buttonList" :key="index" :value="oaButton.iid">-->
                      <!--{{ oaButton.sbtnName }}-->
                    <!--</a-select-option>-->
                  <!--</a-select>-->
                <!--</a-form-item>-->
              <!--</a-col>-->
              <!--</template>-->
              <!--<a-col :md="6" :sm="8" >-->
              <!--<span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">-->
              <!--<a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
              <!--<a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
              <!--<a @click="handleToggleSearch" style="margin-left: 8px">-->
              <!--{{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--<a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--</a>-->
              <!--</span>-->
              <!--</a-col>-->
            </a-row>

            <a-row :gutter="12" style="margin-left: 35px">
              <a-col :md="10" :sm="8">
                <a-form-item label="办文单类型">
                  <a-select v-model="type" @change="getType">
                    <a-select-option v-for="(item,index) in typeList" :key="index" :value="item.itemValue">{{item.itemText}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col>
                <a-button style="margin-left: 10px;" v-if="toggleSearchStatusSet"   @click="beforeConfirm" type="primary" icon="plus">删除当前配置</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <!--水平分割-->
        <!--<a-divider style="margin: 0px"/>-->
        <!-- table区域-begin -->
        <!-- table区域-end -->
        <span style="font-weight: 1000;font-size: 16px;">配置:（位置相同名称必须一致）</span>
        <!-- 表单区域 -->
        <div>
          <a-form>
            <a-row :gutter="48" style="margin-left: 25px">
              <template v-if="toggleSearchStatus">
                <!--<a-divider type="vertical" style="margin-left: 110px;"/>-->
                <!--<a-divider type="vertical"/>-->
                <!--<a-form-item-->
                <!--:labelCol="labelCol"-->
                <!--:wrapperCol="wrapperCol"-->
                <!--label="流程按钮关联ID">-->
                <!--<a-input-number v-decorator="[ 'iprocOpinionId', {}]" />-->
                <!--</a-form-item>-->
                <!--<a-form-item-->
                <!--:labelCol="labelCol"-->
                <!--:wrapperCol="wrapperCol"-->
                <!--label="业务流程配置ID">-->
                <!--<a-input-number v-decorator="[ 'iprocSetId', {}]" />-->
                <!--</a-form-item>-->
                  <!--<a-form-item-->
                    <!--:labelCol="labelCol"-->
                    <!--:wrapperCol="wrapperCol"-->
                    <!--label="业务功能">-->
                    <!--<a-select v-model="iProcSetId" @change="getFunctionId">-->
                      <!--<a-select-option v-for="(item,index) in selectList" :key="index" :value="item.iprocSetId">{{item.sname}}-->
                      <!--</a-select-option>-->
                    <!--</a-select>-->
                  <!--</a-form-item>-->
                <a-form-item
                  style="margin:20px;">
                  <span style="font-size: 16px;color: rgba(0, 0, 0, 0.85);">页面意见框位置：</span>
                  <a-input-number max="9999" @change="onitaskOpinionOrder" v-model="itaskOpinionOrder" />
                </a-form-item>
                <a-form-item
                  style="margin:20px;">
                  <span style="font-size: 16px;color: rgba(0, 0, 0, 0.85);">页面意见框名称：</span>
                  <a-input maxLength="50" style="width: 180px" @change="onitaskOpinionName" v-model="itaskOpinionName" />
                  <span v-show="showName" style="margin-left: 10px;color: red">序号为{{itaskOpinionOrder}}的意见框名字必须为"{{opinionName}}"。</span>
                </a-form-item>

<!--<div v-show="show">-->
<div>
  <!--<a-form-item  style="margin:20px;">-->
    <!--<span>办文单意见类型:</span>-->
    <!--<a-select style="margin-left:15px;width: 330px" v-model="type" @change="getType">-->
      <!--<a-select-option v-for="(item,index) in typeList" :key="index" :value="item.itemValue">{{item.itemText}}-->
      <!--</a-select-option>-->
    <!--</a-select>-->
  <!--</a-form-item>-->
</div>


                <!--<a-form-item-->
                  <!--:labelCol="labelCol"-->
                  <!--:wrapperCol="wrapperCol"-->
                  <!--label="">-->
                  <!--<a-input-hide v-model="procDefKey" />-->
                <!--</a-form-item>-->
              </template>
            </a-row>
          </a-form>
        </div>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction,getAction,postAction,deleteAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import ACol from "ant-design-vue/es/grid/Col";


  export default {
    name: "OaProcOpinionNewModal",
    mixins: [JeecgListMixin],
    components: {
      ACol
    },
    data() {
      return {
        title: "操作",
        visible: false,
        show:false,//意见类型--显示控制
        procDefKey:'',
        showName:false,//是否显示提示
        opinionName:'',//后台产生的名字
        typeList:[],
        taskDefKey:'',
        type:'',//意见框类型：取数据字典下拉列表
        sprocOpinionName:'',//意见组合名称
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        opinionSetModal:{
          itaskOpinionName:'',//意见框名称
          itaskOpinionOrder:0,//意见框位置
        },
        itaskOpinionName:'',//意见框名称
        itaskOpinionOrder:0,//意见框位置
        TaskLinkList:[],//任务环节列表
        TaskLinkId:'',//流程定义Id
//业务模块---------------
//         selectList: [],
        // timeList:[],
        // iProcSetId:'',


        confirmLoading: false,
        toggleSearchStatusSet:true,
        form: this.$form.createForm(this),
        validatorRules: {
          iId: {rules: [{required: true, message: '请输入主键id!'}]},
        },
        url: {
          list: "/oaopinionset/oaOpinionSet/list",
          delete: "/oaopinionset/oaOpinionSet/delete",
          deleteBatch: "/oaopinionset/oaOpinionSet/deleteBatch",
          exportXlsUrl: "oaopinionset/oaOpinionSet/exportXls",
          importExcelUrl: "oaopinionset/oaOpinionSet/importExcel",
          add: "/oaopinionset/oaOpinionSet/add",
          edit: "/oaopinionset/oaOpinionSet/edit"
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
      getType(re){
//        console.log("010101001010103478382348323432-----------")
//        console.log(this.type)
//        console.log(this.typeList)
          this.opinionSetModal.type=this.type;
//        console.log(this.opinionSetModal.type)
        this.onTasklink();
      },
      //修改意见组合名称
      iTaskOpinionNewName(){
        const that = this;
        let httpurl = '';
        let method = '';
        if (!this.model.iid) {
          httpurl += this.url.add;
          method = 'post';
        } else {
          httpurl += this.url.edit;
          method = 'put';
        }
        this.model.sprocOpinionName=this.sprocOpinionName;
        // let formData = Object.assign(this.model, values);
        httpAction(httpurl, {iid:this.model.iid,sprocOpinionName:this.model.sprocOpinionName,
          procDefKey: this.model.procDefKey}, method).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.$emit('ok');
          } else {
            that.$message.warning(res.message);
          }
        })
      },
      getTypeList(){//获取意见类型列表
      let url="/sys/dict/getDictByKey";
      getAction(url, {dictKey: 'type'}).then(res => {
//        console.log('--------------------意见类型-下拉列表------------------------------');
//        console.log(res);
        this.typeList=res.result;
        if (this.type==null||this.type==''){
          this.type=this.typeList[0].itemValue;//得到默认值
        }
        if (this.taskDefKey!=null &&this.type!=null){
          this.onTasklink();
        }
      });
      },
      getTaskLinkList(){//获取任务环节
        let url="/wf/process/actsList";
        getAction(url, {processDefinitionId: this.TaskLinkId}).then(res => {
          this.TaskLinkList = res.result;
          if (this.taskDefKey==null||this.taskDefKey==''){
            this.taskDefKey=this.TaskLinkList[0].id;//得到默认值
          }
          if (this.taskDefKey!=null &&this.type!=null){
            this.onTasklink();
          }
        });
      },
      onTasklink() {//请求表单数据
        //初始化
        this.showName==false//隐藏错误
        this.toggleSearchStatus=true;
        this.itaskOpinionName='';//意见框名称
        this.itaskOpinionOrder=0;//意见框位置
        // this.iProcSetId='';
//        console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmm');
//        console.log(this.type);
        let url="/oaopinionset/oaOpinionSet/queryByTaskDefKey";
        postAction(url, {type:this.type,taskDefKey: this.taskDefKey,iProcOpinionId: this.model.iid,procDefKey: this.procDefKey}).then(res => {
          this.model.taskDefKey=this.taskDefKey;
          if (res.success) {
            this.toggleSearchStatusSet=true;
            this.opinionSetModal=res.result;
            // this.iProcSetId=this.opinionSetModal.iprocSetId;
            this.itaskOpinionName=this.opinionSetModal.itaskOpinionName;//拟稿人
            this.itaskOpinionOrder=this.opinionSetModal.itaskOpinionOrder; //读者
//            this.type=this.opinionSetModal.type//意见框类型
          } else {
            this.opinionSetModal.iid = null;
            this.toggleSearchStatusSet=false;
            // this.opinionSetModal.iProcSetId='';
            this.opinionSetModal.itaskOpinionName='';//意见框名称
            this.opinionSetModal.itaskOpinionOrder=0;//意见框位置
//            this.opinionSetModal.type=''//意见框类型
          }
          this.confirmLoading = false;//让loading消失
        })
      },
      onitaskOpinionOrder(){
        this.opinionSetModal.itaskOpinionOrder=this.itaskOpinionOrder;
        this.jiaoYanXuh();
      },
      onitaskOpinionName(){
        // console.log('-=-=_+_+_+_+_+++++++',JSON.stringify(this.itaskOpinionName));
        this.opinionSetModal.itaskOpinionName=this.itaskOpinionName;
        this.jiaoYanXuh();
      },
      jiaoYanXuh(){//改变时赋值并校验
        let url="/oaopinionset/oaOpinionSet/queryByOrderAndKey";
        httpAction(url, {itaskOpinionOrder:this.itaskOpinionOrder,
          procDefKey: this.model.procDefKey,iid:this.opinionSetModal.iid,iProcOpinionId:this.model.iid}, 'post').then((res) => {
          if (res.success) {
            // console.log("ffffffffffffffffffffffffffff");
            // console.log(res);
            if (res.result!=null && this.itaskOpinionName==res.result[0].itaskOpinionName){
              this.showName=false;
            } else {
              if (res.result==null){
              this.showName=false;
              }else {
                this.showName=true;
                this.opinionName=res.result[0].itaskOpinionName;
              }
            }
          } else {
            this.$message.warning(res.message);
          }
        })
      },
      //点击删除按钮 前校验
      beforeConfirm(){
        // console.log(this.btnSetModel)
        if (this.opinionSetModal.iid==null){
          this.$message.warning("当前信息不存在");
        }else {
          let url='/oaopinionset/oaOpinionSet/verButtonSetDelete';
          getAction(url,{id:this.opinionSetModal.iid}).then(res=>{
            if (res.success){
              // this.$message.success(res.message);
              //调用弹框
              this.showConfirm();
            } else {
              this.deleteOpinionSet();
            }
          });
        }


      },
      //弹框
      showConfirm(){
        let that=this;
        this.$confirm({
          title:'你确定要删除吗？',
          content:'您的某些业务已经使用了这套意见',
          onOk(){
            that.deleteOpinionSet();
          },
          onCancel(){
          }
        })
      },
      deleteOpinionSet(){
        if (this.opinionSetModal.iid){
          var that = this;
          deleteAction(that.url.delete, {id: this.opinionSetModal.iid}).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              // that.loadData();
              this.itaskOpinionName='';//意见框名称
              this.itaskOpinionOrder=0;//意见框位置
              this.toggleSearchStatus=false;
              this.toggleSearchStatusSet=false;
//              this.opinionSetModal.type=''//意见框类型
              that.$emit('ok');
              that.close();
            } else {
              that.$message.warning(res.message);
            }

          });
        }
      },
      add() {
        this.edit({});
      },
      editBeforelvjian(record,TaskLinkId,res){
        this.showName=false;
        this.type=res.type;
        if (this.type===null||this.type===''){
//          console.log("`1`1`1`1``1`1111111111")
          this.type='9999';
        }
        this.taskDefKey= res.taskDefKey;
        this.editlvjian(record,TaskLinkId);
      },
      editlvjian(record,TaskLinkId) {
//        console.log("fdsfasafadfasdfsadfsadfsadfas")
//        console.log(this.type);
        this.confirmLoading = true;
        this.toggleSearchStatus=false;
        this.itaskOpinionName='';//意见框名称
        this.itaskOpinionOrder=0;//意见框位置
//        this.opinionSetModal.type=''//意见框类型
        //record---为上一页面数据，TaskLinkId---流程定义Key
        // console.log('------------------888888888');
        this.TaskLinkId=TaskLinkId;
//        console.log(this.TaskLinkId);
        this.getTaskLinkList();//获取任务环节下拉列表
        this.getTypeList();//获取意见类型下拉列表
        this.getFunctionList();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        // console.log(this.model);
        this.sprocOpinionName=this.model.sprocOpinionName;
        this.procDefKey=this.model.procDefKey;
        this.visible = true;
        // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
        // console.log(record);
        if (this.model.procDefKey=="sendFile_hang"){
          this.show=true;
        }else {
          this.show=false;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iid', 'procDefKey','sprocOpinionName'))
          //时间格式化
        });
        //默认加载回显第一个
        this.onTasklink();
      },
      getFunctionList(){//获取全部业务下拉列表;
//        console.log('--------------------获取全部业务下拉列表-下拉列表------------------------------');

        let url = "/modify/fields/queryBusList";
        getAction(url, {}).then((res) => {

          this.selectList = res.result;
          // this.timeList = res.d_create_time;
        });
      },
      getFunctionId(){
        // this.opinionSetModal.iprocSetId=this.iProcSetId;
        //   console.log('----------busFunction----------queryById------------------------------');
        //   console.log(this.opinionSetModal.iprocSetId);
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },

      handleOk() {
        // this.opinionSetModal.iProcSetId=this.iProcSetId;
//        console.log('-=-=-=',JSON.stringify(this.opinionSetModal));
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
//            console.log('----------------------------------090');
//            console.log(this.opinionSetModal);
            if (this.opinionSetModal.iid==null || this.opinionSetModal.iid == undefined || !this.opinionSetModal.iid) {
//              console.log('----------------------------------09111111');
              this.opinionSetModal.iprocOpinionId=this.model.iid;
              this.opinionSetModal.procDefKey=this.model.procDefKey;
              this.opinionSetModal.taskDefKey=this.taskDefKey;
              this.opinionSetModal.type=this.type;
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.opinionSetModal, values);
            if (this.showName==false){//校验没问题时才能提交
              //时间格式化
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
            }else {
              that.$message.warning("相同序号，意见名称必须相同");
              that.close();
            }

          }
        })
      },
      handleCancel() {
        this.close()
      }

    }

  }
</script>

<style lang="less" scoped>

</style>