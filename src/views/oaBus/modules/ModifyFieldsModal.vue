<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form" v-if="searchColumns" v-for="(atom,index) in searchColumns" :key="index">
       <!--输入框-->
        <a-form-item v-if="atom.i_column_type==1 && atom.s_table_column!='d_sealdate'"   v-show="atom.s_table_column!='i_id'"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="atom.s_column_name">
        <a-input maxLength="20" :placeholder="'请输入正确的'+atom.s_column_name" v-decorator="[ atom.s_table_column, {}]"/>
        </a-form-item>
        <!--下拉列表-------------------start---------------->
        <!--密级-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='i_safetylevel'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectNum($event,atom.s_table_column)"
                    v-model="model.i_safetylevel"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.i_safetylevel_option" :key="item.value" :value="item.value*1">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--缓急-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='i_urgency'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectNum($event,atom.s_table_column)"
                    v-model="model.i_urgency"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.i_urgency_option" :key="item.value" :value="item.value*1">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar4 公开理由-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar4' && functionId==131"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar4"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in xxgkList" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar5  不公开理由-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar5' && functionId==131"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                     v-decorator="['model.s_varchar5', {rules: [{ required: model.s_varchar4=='bgk'?true:false, message: '请选择不公开理由' }]}]"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in bgklyList" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar4-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar4' && functionId!=131"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar4"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.s_varchar4_option" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar5-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar5' && functionId!=131"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar5"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.s_varchar5_option" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar1-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar1'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar1"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.s_varchar1_option" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar2-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar2'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar2"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.s_varchar2_option" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar3-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar3'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar3"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.s_varchar3_option" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar6-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar6'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar6"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.s_varchar6_option" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar7-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar7'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar7"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.s_varchar7_option" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar8-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar8'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar8"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.s_varchar8_option" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <!--s_varchar9-->
        <a-form-item v-if="atom.i_column_type==2 && atom.s_table_column=='s_varchar9'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-select @change="changeSelectString($event,atom.s_table_column)"
                    v-model="model.s_varchar9"
                    :placeholder="'请选择'+atom.s_column_name">
            <a-select-option v-for="(item,index) in optionMap.s_varchar9_option" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>

        <!--下拉列表-------------------end---------------->

        <!--文本框-->
        <a-form-item v-if="atom.i_column_type==3 && atom.s_table_column!='d_sealdate'" v-show="atom.s_table_column!='i_id'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-textarea  maxLength="50"  :placeholder="'请输入正确的'+atom.s_column_name" v-decorator="[ atom.s_table_column, {}]"/>
        </a-form-item>
        <!--日期框-->
        <a-form-item v-if="atom.i_column_type==4||atom.i_column_type==5" v-show="atom.s_table_column!='i_id'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="atom.s_column_name">
          <a-date-picker showTime="true" format="YYYY-MM-DD HH:mm:ss"  v-decorator="[ atom.s_table_column, {}]"/>
        </a-form-item>
        <a-form-item v-if="atom.s_table_column=='d_sealdate'" v-show="atom.s_table_column!='i_id'"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     :label="atom.s_column_name">
          <a-date-picker showTime="true" format="YYYY-MM-DD"  v-decorator="[ atom.s_table_column, {}]"/>
        </a-form-item>
        <!--单选框-->
        <a-form-item v-if="atom.i_column_type==6" v-show="atom.s_table_column!='i_id'"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="atom.s_column_name">
          <a-radio-group   v-decorator="[atom.s_table_column, {} ]">
            <a-radio-button value="1">是</a-radio-button>
            <a-radio-button value="0">否</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <!--placeholder="'请输入'+'atom.s_table_column'"-->

        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="业务模块id">-->
          <!--<a-input-number v-decorator=" iBusFunctionId  [ 'iBusModelId', validatorRules.iId]" />-->
        <!--</a-form-item>-->
        <!--<a-form-item-->
          <!--:labelCol="labelCol"-->
          <!--:wrapperCol="wrapperCol"-->
          <!--label="业务功能id">-->
          <!--<a-input-number v-decorator="[ 'iBusFunctionId', {}]" />-->
        <!--</a-form-item>-->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getAction,postAction,httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import ATextarea from "ant-design-vue/es/input/TextArea";

  export default {
    components: {ATextarea},
    name: "modifyFieldsModel",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        tableName:'',
        searchColumns:[],
        queryParam: {},
        modelByName: [],
//     下拉列表集中定义---------------start---------------------
        optionMap: {
          type: Object,
          required: false
        },
        functionId:'',
        xxgkList:[],
        bgklyList:[],

//     下拉列表集中定义---------------end---------------------
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          iId:{rules: [{ required: true, message: '请输入主键id!' }]},
        },
        url: {
          // add: "/oaBus/oaBusdata/add",
          edit1: "/modify/fields/updateAll",
          tableDataInfo: "/modify/fields/queryOaBusdataByTableId"
        },
      }
    },
    created () {
    },

    methods: {
//      moment,
      changeSelectString(event, obj) {
        this.model[obj] = event.toString();
        console.log('----------------------------------------------------------');
        console.log("key: " + obj + " value: " + event);
        console.log('----------------------------------------------------------');
        console.log(this.model);
      },
      changeSelectNum(event, obj) {
        this.model[obj] = event;
      },
      add () {
        this.edit({});
      },
      edit (record,functionId,tableName) {
        this.functionId=functionId;
//        console.log("ywwuwaid-------------")
//        console.log(this.functionId)
        //参数为3：查询对应的不公开理由
//        if( this.functionId==131){
          postAction("/oaBus/oaBusdata/querySysDictData",{param:3}).then((res) => {
//            console.log("公开理由-------------")
//            console.log(res)
            this.xxgkList = res.result.xxgk;
            this.bgklyList = res.result.bgkly;
          })
//        }

//        console.log(record);
        this.tableName=tableName;
        httpAction("/modify/fields/queryOaBusPageDetailColumns", {functionId: functionId,iid:record.i_id,tableName:tableName},'post').then((res) => {
//          console.log('--------------------根据业务Id查询数据------------------------------');
//          console.log(res);
          this.searchColumns=res.result.allColumsList;
          record=res.result.data[0];
          this.optionMap=res.result.columnAlldata;
//          console.log(this.searchColumns);
          this.form.resetFields();
          this.model = Object.assign({}, record);
          this.visible = true;
          for (let i = 0; i < this.searchColumns.length; i++) {
            this.queryParam = Object.assign({}, this.queryParam, {[this.searchColumns[i].s_table_column]:''});
          }
          for (let i = 0; i < this.searchColumns.length; i++) {
            this.modelByName.push(this.searchColumns[i].s_table_column)
          }
            this.$nextTick(() => {
                this.form.setFieldsValue(pick(this.model,this.modelByName))
              //时间格式化
               this.form.setFieldsValue({d_create_time:this.model.d_create_time?moment(this.model.d_create_time):null})
              this.form.setFieldsValue({d_update_time:this.model.d_update_time?moment(this.model.d_update_time):null})
              this.form.setFieldsValue({d_sealdate:this.model.d_sealdate?moment(this.model.d_sealdate):null})
              this.form.setFieldsValue({d_datetime1:this.model.d_datetime1?moment(this.model.d_datetime1):null})
              this.form.setFieldsValue({d_datetime2:this.model.d_datetime2?moment(this.model.d_datetime2):null})
              this.form.setFieldsValue({d_datetime3:this.model.d_datetime3?moment(this.model.d_datetime3):null})
              this.form.setFieldsValue({d_datetime4:this.model.d_datetime4?moment(this.model.d_datetime4):null})
              this.form.setFieldsValue({d_datetime5:this.model.d_datetime5?moment(this.model.d_datetime5):null})
              this.form.setFieldsValue({d_datetime6:this.model.d_datetime6?moment(this.model.d_datetime6):null})
            });

        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.i_id){
              httpurl+=this.url.add;
              method = 'put';
            }else{
              httpurl+=this.url.edit1;
              method = 'post';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
//            console.log("shijian-------------------------------------------")
//            console.log(formData)
            formData.d_create_time = formData.d_create_time?formData.d_create_time.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.d_update_time = formData.d_update_time?formData.d_update_time.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.d_sealdate !=null?formData.d_sealdate.format('YYYY-MM-DD'):null;
            formData.d_datetime1 = formData.d_datetime1?formData.d_datetime1.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.d_datetime2 = formData.d_datetime2?formData.d_datetime2.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.d_datetime3 = formData.d_datetime3?formData.d_datetime3.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.d_datetime4 = formData.d_datetime4?formData.d_datetime4.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.d_datetime5 = formData.d_datetime5?formData.d_datetime5.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.d_datetime6 = formData.d_datetime6?formData.d_datetime6.format('YYYY-MM-DD HH:mm:ss'):null;


            httpAction(httpurl,{formData,tableName:this.tableName},method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })



          }
        })
      },
      handleCancel () {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>