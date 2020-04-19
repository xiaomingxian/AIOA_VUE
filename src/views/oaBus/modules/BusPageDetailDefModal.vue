<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <div style="height: 360px;overflow: auto">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">

          <div v-show="false">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="业务页面id">
              <a-input-number v-decorator="[ 'ibusPageId', {}]"/>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="业务功能id">
              <a-input-number v-decorator="[ 'ibusFunctionId', {}]"/>
            </a-form-item>
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              label="业务数据表名">
              <a-input placeholder="请输入业务数据表名" v-decorator="['sbusdataTable', {}]"/>
            </a-form-item>
          </div>
          <span style="font-weight: 900;font-size: 16px;">详情页面配置</span>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="字段名">
            <a-input style="width: 50%"  readonly v-model="stableColumn"  v-decorator="['stableColumn', {rules:[{required:true,message: '字段名不能为空'},{ min: 1, max: 50, message: '字段名长度不能超过50位！', trigger: 'blur' }]}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="含义">
            <a-input style="width: 50%" placeholder="含义"  v-decorator="['scolumnName', {rules:[{required:true,message: '含义不能为空'},{ min: 1, max: 50, message: '列名长度不能超过50位！', trigger: 'blur' }]}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="必填校验">
            <a-radio-group :defaultValue="0" v-decorator="['icheckIsNull', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!--<a-input placeholder="请输入是否必填校验" />-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="全文检索">
            <a-radio-group  :defaultValue="0" v-decorator="['iisEsquery', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!--<a-input placeholder="请输入是否作为列表查询条件" v-decorator="['iisListquery', {}]"/>-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="字段类型">
            <a-select style="width: 50%" disabled="disabled" v-decorator="[ 'icolumnType', {}]" >
              <a-select-option v-for="(item,index) in columnTypeList" :key="index" :value="parseInt(item.value)">
                {{item.text}}
              </a-select-option>
            </a-select>
            <!--<a-input-number v-decorator="[ 'iBusModelId', {}]" />-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="下拉选项">
            <a-select style="width: 50%" @change="dictIdClick" v-decorator="[ 'sdictId', {}]" >
              <a-select-option v-for="(item,index) in directOpt" :key="index" :value="item.dictCode">
                {{item.dictName}}
              </a-select-option>
            </a-select>
            <span style="font-size: 16px;display: inline-block;width:200px;float: right;margin-right:45px; overflow: hidden;">
              数据字典取值
            </span>
            <!--<a-input-number v-decorator="[ 'iBusModelId', {}]" />-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="下拉选项">
            <a-select  style="width: 50%" v-decorator="[ 'sdictSqlKey', {}]" @change="dictSqlClick">
              <a-select-option v-for="(item,index) in sqlOpt" :key="index" :value="item.value">
                {{item.text}}
              </a-select-option>
            </a-select>
            <span style="font-size: 16px;display: inline-block;width:200px;float: right;margin-right:45px; overflow: hidden;">
              SQL查询取值
            </span>
            <!--<a-input-number v-decorator="[ 'iBusModelId', {}]" />-->
          </a-form-item>
          <!--<a-form-item-->
            <!--:labelCol="labelCol"-->
            <!--:wrapperCol="wrapperCol"-->
            <!--label="java校验（未用）">-->
            <!--<a-input  style="width: 50%" placeholder="请输入java校验规则，正则表达式" v-decorator="['scheckExpjava', {rules:[{ min: 0, max: 250, message: 'java校验长度不能超过250位！', trigger: 'blur' }]}]"/>-->
          <!--</a-form-item>-->
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="合法性校验">
            <a-select  style="width: 50%" v-decorator="[ 'icheckExpjs', {}]">
              <a-select-option v-for="(item,index) in regulars" :key="index" :value="item.value">
                {{item.text}}
              </a-select-option>
            </a-select>
            <!--<a-input-number placeholder="请输入js校验规则，正则表达式（从数据字典查）" v-decorator="['icheckExpjs', {}]"/>-->
          </a-form-item>
          <span style="font-weight: 900;font-size: 16px;">数据列表配置</span><br>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="列表标题列">
            <a-radio-group  ref="refTitle"
                           v-model="titleModel"
                           :disabled="disableFlag"
                           @change="listTitleChange"
                            v-decorator="['iisListtitle', {}]">
              <a-radio  :value="1">是</a-radio>
              <a-radio  :value="0">否</a-radio>
            </a-radio-group>
            <!--<a-input placeholder="请输入是否作为列表标题列" />-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="列表顺序号">
            <a-input style="width: 50%" v-decorator="[ 'iorder', {rules:[{ pattern: /^[1-9]\d{0,3}$/, message: '输入0到4位的非零正整数' }]}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="查询条件">
            <a-radio-group  :defaultValue="0" v-decorator="['iisListquery', {}]">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
            <!--<a-input placeholder="请输入是否作为列表查询条件" v-decorator="['iisListquery', {}]"/>-->
          </a-form-item>
          <span style="font-weight: 900;font-size: 16px;">数据交换配置</span>
          <!--<a-form-item-->
            <!--:labelCol="labelCol"-->
            <!--:wrapperCol="wrapperCol"-->
            <!--label="提示信息">-->
            <!--<a-input  style="width: 50%" placeholder="请输入校验提示信息" v-decorator="['scheckShowmsg', {rules:[{ min: 0, max: 250, message: '提示信息长度不能超过250位！', trigger: 'blur' }]}]"/>-->
          <!--</a-form-item>-->
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="公文传输字段">
            <a-input  style="width: 50%"  placeholder="请输入对应公文传输字段" v-decorator="['ssendKey', {rules:[{ min: 0, max: 50, message: '公文传输字段长度不能超过50位！', trigger: 'blur' }]}]"/>
            <span style="display: inline-block;width:200px;float: right;margin-right:45px;overflow: hidden;">
              <a-button type="primary" @click="updateDetail('ssendKey')"  style="width: 180px">修改全部【本业务类别】</a-button>
            </span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="档案系统字段">
            <a-input  style="width: 50%"  placeholder="请输入档案系统对应字段" v-decorator="['sarchivesKey', {rules:[{ min: 0, max: 50, message: '档案系统字段长度不能超过50位！', trigger: 'blur' }]}]"/>
            <span style="display: inline-block;width:200px;float: right;margin-right:45px;overflow: hidden;">
              <a-button type="primary" @click="updateDetail('sarchivesKey')"  style="width: 180px">修改全部【本业务类别】</a-button>
            </span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="书签字段">
            <a-input  style="width: 50%"  placeholder="书签字段" v-decorator="['smarkKey', {rules:[{ min: 0, max: 30, message: '书签字段长度不能超过50位！', trigger: 'blur' }]}]"/>
            <span style="display: inline-block;width:200px;float: right;margin-right:45px; overflow: hidden;">
              <a-button type="primary" @click="updateDetail('smarkKey')"  style="width: 180px">修改全部【本业务类别】</a-button>
            </span>
          </a-form-item>
          <!--<a-form-item-->
            <!--:labelCol="labelCol"-->
            <!--:wrapperCol="wrapperCol"-->
            <!--label="特殊计算">-->
            <!--<a-input  style="width: 50%"  v-decorator="['scheckExpsql', {rules:[{ min: 0, max: 250, message: '不能超过250位！', trigger: 'blur' }]}]"/>-->
            <!--<span style="font-size: 16px;display: inline-block;width:200px;float: right;margin-right:45px; overflow: hidden;">-->
              <!--排版时，特殊书签计算-->
            <!--</span>-->
          <!--</a-form-item>-->
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="特殊计算">
            <a-select  style="width: 50%" v-decorator="[ 'sdictSqlKey', {}]" @change="dictSqlClick">
              <a-select-option v-for="(item,index) in sqlOpt" :key="index" :value="item.value">
                {{item.text}}
              </a-select-option>
            </a-select>
            <span style="font-size: 16px;display: inline-block;width:200px;float: right;margin-right:45px; overflow: hidden;">
              排版时，特殊书签计算
            </span>
          </a-form-item>
          <!--<a-form-item-->
            <!--:labelCol="labelCol"-->
            <!--:wrapperCol="wrapperCol"-->
            <!--label="备注">-->
            <!--<a-input  style="width: 50%" placeholder="请输入业务数据列备注" v-decorator="['scolumnRemarks',-->
            <!--{rules:[{ min: 0, max: 50, message: '备注长度不能超过50位！', trigger: 'blur' }]}]"/>-->
          <!--</a-form-item>-->
        </a-form>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
  import {httpAction, getAction,postAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "BusPageDetailDefModal",
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        directOpt: [],
        sqlOpt: [],
        regulars: [],
        //列输入类型
        columnTypeList: [],
        stableColumn: '',
        disableFlag: false,
        titleModel: '',
        labelCol: {
          xs: {span: 24},
          sm: {span: 6},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 18},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          iId: {rules: [{required: true, message: '请输入主键id!'}]},
        },
        url: {
          add: "/oaBus/busPageDetail/add",
          edit: "/oaBus/busPageDetail/edit",
          editOrAdd: "/oaBus/busPageDetail/editOrAdd",
          queryDirect: "/oaBus/busPageDetail/queryDirect",
          getInitDict: "/oaBus/busPage/getInitDict",
          columnTypeDict: "/sys/dict/getDictByKeyObj",
          updateDetail: "/oaBus/busPageDetail/updateDetail",
        },
      }
    },
    created() {
    },
    methods: {
      dealLenthJava(rule, value, callback){
        if (value.length <= 80 ) {
          callback();
        } else {
          callback('长度不可以超过80！！!');
        }
      },
      //长度校验
      dealLenth(rule, value, callback){
        if (value.length <= 30 ) {
          callback();
        } else {
          callback('长度不可以超过15个汉字或者30个字符！！!');
        }
      },
      updateDetail(value){
        let param ={
          ibusPageId:this.model.ibusPageId ,
          stableColumn:this.model.stableColumn,
          ibusFunctionId:this.model.ibusFunctionId,
        };
        /*console.log(this.model)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iid', 'ibusPageId', 'ibusFunctionId', 'sbusdataTable', 'stableColumn','icolumnType', 'scolumnName', 'iisListtitle','iorder','iisListquery', 'sdictId', 'sdictSqlKey', 'icheckIsNull', 'scheckExpjava', 'scheckExpsql', 'icheckExpjs', 'scheckShowmsg', 'ssendKey', 'sarchivesKey', 'iisDefault','smarkKey' ,'isetType', 'scolumnRemarks'))
          //时间格式化
        });*/
        param[value]=this.form.getFieldValue(value) ;
        if(param[value]==undefined || param[value]==null ||  param[value]==''){
          param[value]= "00000" ;
        }
        postAction(this.url.updateDetail,param).then(res =>{
          if(res.success){
            this.$message.success("全部业务修改完成！！！")
            this.$emit('ok');   //刷新父页面
            console.log(res)
          }

        })

      },
      listTitleChange(params){
        let param = params.target.value
        //alert(JSON.stringify(param.target.value))
        let str = this.model.stableColumn ;
        if(str == "s_title"){
          if(param == 0 || param == "0"){
            this.model.iisListtitle = 1 ;
            this.$message.error("标题必须为显示列！！！");
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'iisListtitle'))
            });
          }
        }else if(str == "d_create_time"){
          if(param == 0 || param == "0"){
            this.model.iisListtitle = 1 ;
            this.$message.error("创建时间必须为显示列！！！");
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'iisListtitle'))
            });
          }
        }
      },
      //dictId点击后sql为空
      dictIdClick(){
        this.form.setFieldsValue({
          sdictSqlKey: null,
        });
      },
      //sql点击后dictId为空
      dictSqlClick(){
        this.form.setFieldsValue({
          sdictId: null,
        });
      },
      getInitDict() {
        getAction(this.url.getInitDict).then(rec => {
          this.directOpt = rec.result.dicList;
          this.sqlOpt = rec.result.dictByCodeList;
          this.regulars = rec.result.regulars;

          for(let i = 0;i < this.regulars.length;i++){
            this.regulars[i].value = parseInt(this.regulars[i].value);
          }

        });
        getAction(this.url.columnTypeDict,{dictKey:"columnType"}).then(res=>{
          this.columnTypeList = res.result ;
        })
      },
      add() {
        this.edit({});
      },
      show() {
        this.visible = true;
      },
      edit(record, ibusPageId, ibusFunctionId, sbusdataTable) {
        this.getInitDict();
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.model.ibusPageId = ibusPageId;
        this.model.ibusFunctionId = ibusFunctionId;
        this.model.sbusdataTable = sbusdataTable;
        if(this.model.stableColumn == 's_title'){
          this.model.iisListtitle = 1;
        }else if(this.model.stableColumn == 'd_create_time'){
          this.model.iisListtitle = 1;
        }
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'iid', 'ibusPageId', 'ibusFunctionId', 'sbusdataTable', 'stableColumn','icolumnType', 'scolumnName', 'iisListtitle','iorder','iisListquery','iisEsquery', 'sdictId', 'sdictSqlKey', 'icheckIsNull', 'scheckExpjava', 'scheckExpsql', 'icheckExpjs', 'scheckShowmsg', 'ssendKey', 'sarchivesKey', 'iisDefault','smarkKey' ,'isetType', 'scolumnRemarks'))
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
          console.log("AAAA",err)
          if (!err) {
            that.confirmLoading = true;
            let httpurl = this.url.editOrAdd;
            let method = 'put';

            let formData = Object.assign(this.model, values);
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
              that.$emit('loading');
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