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
      <a-form :form="form" v-for="(atom,index) in searchColumns" :key="index">
        <a-form-item v-if="atom.s_dict_sql_key!=null && atom.s_dict_sql_key!=undefined"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="atom.s_column_name">
          <a-select @change="changeSelect($event,atom.s_table_column)"
                    placeholder="请选择">
          <a-select-option v-for="(item,index) in selectList" :key="item.i_id" :value="item.i_id">{{item.s_name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="atom.s_dict_sql_key==null || atom.s_dict_sql_key==undefined"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :label="atom.s_column_name">
        <a-input placeholder="请输入正确格式" v-decorator="[ atom.s_table_column, {}]"/>
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
    <!---->





      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { getAction,httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
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
      changeSelect(event, obj) {

        this.queryParam[obj] = event.toString();
        console.log('----------------------------------------------------------');
        console.log("object: " + obj + " value: " + event);
        console.log('----------------------------------------------------------');
        console.log(this.queryParam);
      },
      add () {
        this.edit({});
      },
      edit (record,searchColumns,tableName) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        console.log(record);
        // console.log( this.model);
        // httpAction(this.url.tableDataInfo, {iId: this.model.i_id,tableName:tableName},'post').then((res) => {
       //   console.log(res);
        // });
          console.log(tableName);
          this.tableName=tableName;
          console.log('--------------------根据表名和Id查询数据------------------------------');
          this.searchColumns=searchColumns;
        console.log(searchColumns);
        for (let i = 0; i < this.searchColumns.length; i++) {
          this.queryParam = Object.assign({}, this.queryParam, {[this.searchColumns[i].s_table_column]:''});
        }

        // console.log('-----------<<<<<<<<<<<<<<<<<<<<<<<<<<-----------------');
        // console.log(this.queryParam);
        // console.log("11111111111");


        for (let i = 0; i < this.searchColumns.length; i++) {
          this.modelByName.push(this.searchColumns[i].s_table_column)

        }

        this.$nextTick(() => {

          this.form.setFieldsValue(pick(this.model,this.modelByName))


          //时间格式化
          // this.form.setFieldsValue({dCreateTime:this.model.dCreateTime?moment(this.model.dCreateTime):null})
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
            // formData.dCreateTime = formData.dCreateTime?formData.dCreateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.dUpdateTime = formData.dUpdateTime?formData.dUpdateTime.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.dDatetime1 = formData.dDatetime1?formData.dDatetime1.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.dDatetime2 = formData.dDatetime2?formData.dDatetime2.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.dDatetime3 = formData.dDatetime3?formData.dDatetime3.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.dDatetime4 = formData.dDatetime4?formData.dDatetime4.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.dDatetime5 = formData.dDatetime5?formData.dDatetime5.format('YYYY-MM-DD HH:mm:ss'):null;
            // formData.dDatetime6 = formData.dDatetime6?formData.dDatetime6.format('YYYY-MM-DD HH:mm:ss'):null;
            console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnn------------");
            console.log(formData);

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