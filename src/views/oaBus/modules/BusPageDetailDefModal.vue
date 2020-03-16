<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <div style="height: 500px;overflow: auto">
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

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="字段名">
            <a-input style="width: 50%" placeholder="请输入字段名" v-model="stableColumn"  v-decorator="['stableColumn', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="列名">
            <a-input style="width: 50%" placeholder="列名" v-decorator="['scolumnName', {rules:[{required:true}]}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="列输入类型">
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
            label="标题列">
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
            label="数据列排序">
            <a-input-number style="width: 50%" v-decorator="[ 'iorder', {}]" />
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
            label="数据字典类别">
            <a-select style="width: 50%" @change="dictIdClick" v-decorator="[ 'sdictId', {}]" >
              <a-select-option v-for="(item,index) in directOpt" :key="index" :value="item.dictCode">
                {{item.dictName}}
              </a-select-option>
            </a-select>
            <!--<a-input-number v-decorator="[ 'iBusModelId', {}]" />-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"

            :wrapperCol="wrapperCol"
            label="查询sql">
            <a-select  style="width: 50%" v-decorator="[ 'sdictSqlKey', {}]" @change="dictSqlClick">
              <a-select-option v-for="(item,index) in sqlOpt" :key="index" :value="item.value">
                {{item.text}}
              </a-select-option>
            </a-select>
            <!--<a-input-number v-decorator="[ 'iBusModelId', {}]" />-->
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
            label="java校验">
            <a-input  style="width: 50%" placeholder="请输入java校验规则，正则表达式" v-decorator="['scheckExpjava', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="sql校验">
            <a-input  style="width: 50%" placeholder="请输入数据校验sql" v-decorator="['scheckExpsql', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="js校验">
            <a-select  style="width: 50%" v-decorator="[ 'icheckExpjs', {}]">
              <a-select-option v-for="(item,index) in regulars" :key="index" :value="item.value">
                {{item.text}}
              </a-select-option>
            </a-select>
            <!--<a-input-number placeholder="请输入js校验规则，正则表达式（从数据字典查）" v-decorator="['icheckExpjs', {}]"/>-->
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="提示信息">
            <a-input  style="width: 50%" placeholder="请输入校验提示信息" v-decorator="['scheckShowmsg', {}]"/>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="公文传输字段">
            <a-input  style="width: 50%"  placeholder="请输入对应公文传输字段" v-decorator="['ssendKey', {}]"/>
            <span style="display: inline-block;width:200px;float: right;overflow: hidden;">
              <a-button type="primary" @click="updateDetail('ssendKey')"  style="width: 180px">修改全部【本业务类别】</a-button>
            </span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="档案系统字段">
            <a-input  style="width: 50%"  placeholder="请输入档案系统对应字段" v-decorator="['sarchivesKey', {}]"/>
            <span style="display: inline-block;width:200px;float: right;overflow: hidden;">
              <a-button type="primary" @click="updateDetail('sarchivesKey')"  style="width: 180px">修改全部【本业务类别】</a-button>
            </span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="书签字段">
            <a-input  style="width: 50%"  placeholder="书签字段" v-decorator="['smarkKey', {}]"/>
            <span style="display: inline-block;width:200px;float: right;overflow: hidden;">
              <a-button type="primary" @click="updateDetail('smarkKey')"  style="width: 180px">修改全部【本业务类别】</a-button>
            </span>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="备注">
            <a-input  style="width: 50%" placeholder="请输入业务数据列备注" v-decorator="['scolumnRemarks', {}]"/>
          </a-form-item>

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
        if(param[value]==undefined || param[value]==null ){
          param[value]= "00000" ;
        }
        postAction(this.url.updateDetail,param).then(res =>{
          if(res.success){
            this.$message.success("全部业务修改完成！！！")
            this.$emit('ok');
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
            this.$message.error("标题必须显示！！！");
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