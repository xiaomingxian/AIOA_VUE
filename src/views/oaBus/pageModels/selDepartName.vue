<template>
  <a-modal
    :title="title"
    :width="710"
    :height="450"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <!--
        <div style="display: flex;align-items: center;justify-content: center;height: 500px;overflow: auto">
    -->

      <div style="height:450px; margin: 0 auto ;overflow: auto;">


        <div>
          <h3>主送单位</h3>
          <a-transfer
            :dataSource="mockData1"
            :rowKey="record => record.value"
            :listStyle="{width: '300px',height: '300px',}"
            :targetKeys="targetKeys1"
            @change="handleChange1"
            :render="renderItem">
          </a-transfer>
        </div>
        <div>
          <h3>抄送单位</h3>
          <a-transfer
            :dataSource="mockData2"
            :rowKey="record => record.value"
            :listStyle="{width: '300px',height: '300px',}"
            :targetKeys="targetKeys2"
            @change="handleChange2"
            :render="renderItem">
          </a-transfer>
        </div>
        <div>
          <h3>内部发送</h3>
          <a-transfer
            :dataSource="mockData3"
            :rowKey="record => record.value"
            :listStyle="{width: '300px',height: '300px',}"
            :targetKeys="targetKeys3"
            @change="handleChange3"
            :render="renderItem">
          </a-transfer>
        </div>

      </div>

  </a-modal>
</template>
<script>

  import {getAction, postAction} from "../../../api/manage";

  export default {
    name: "selDepartName",
    data() {
      return {
        mockData1: [],
        mockData2: [],
        mockData3: [],
        targetKeys1: [],
        targetKeys2: [],
        targetKeys3: [],
        title: '选择部门',
        visible: false,
        url: {
          getDictByKey: "/sys/dict/getDictByKeyObj",
          getDictByKey2: "/sys/dict/getDictByKeyObj",
        }
      }
    },
    mounted() {
      this.getMock()
    },
    methods: {
      getMock() {
        const targetKeys = [];
        const mockData = [];
        for (let i = 0; i < 20; i++) {
          const data = {
            key: i.toString(),
            title: `content${i + 1}`,
            description: `description of content${i + 1}`,
            chosen: Math.random() * 2 > 1,
          };
          if (data.chosen) {
            targetKeys.push(data.key);
          }
          mockData.push(data);
        }
        this.mockData = mockData
        this.targetKeys = targetKeys
      },
      renderItem(item) {
        const customLabel = (
          <span class= "custom-item" >{item.text}< /span>
      );

        return {
          label: customLabel, // for displayed item
          value: item.title, // for title and filter matching
        };
      },
      handleChange(targetKeys, direction, moveKeys) {
        console.log(targetKeys, direction, moveKeys);
        this.targetKeys = targetKeys
      },
      show(param) {
        this.initData();
        if(param.str1 != undefined){
          this.targetKeys1 =  param.str1.split(',');
        }
        if(param.str2 != undefined){
          this.targetKeys2 =  param.str2.split(',');
        }
        if(param.str3 != undefined){
          this.targetKeys3 =  param.str3.split(',');
        }
        this.visible = true;
      },
      //初始化数据，查出部门名称对应的数据字典数据
      initData() {
        let url = this.url.getDictByKey;
        let url2 = this.url.getDictByKey2;

        getAction(url,{dictKey:"mainDoDepart"}).then((rec) => {
          this.mockData1 = rec.result;
          console.log(this.mockData1) ;
          this.mockData2 = rec.result;
        })
        getAction(url2,{dictKey:"insideDepart"}).then((rec) => {
          this.mockData3 = rec.result;
        })
      },
      handleOk() {
        let str1 = '';
        for(let i = 0 ; i < this.targetKeys1.length; i ++){
          if(i != this.targetKeys1.length -1 ){
            str1 += this.targetKeys1[i] + ',' ;
          }else{
            str1 += this.targetKeys1[i] ;
          }
        }
        let str2 = '';
        for(let i = 0 ; i < this.targetKeys2.length; i ++){
          if(i != this.targetKeys2.length -1 ){
            str2 += this.targetKeys2[i] + ',' ;
          }else{
            str2 += this.targetKeys2[i] ;
          }
        }
        let str3 = '';
        for(let i = 0 ; i < this.targetKeys3.length; i ++){
          if(i != this.targetKeys3.length -1 ){
            str3 += this.targetKeys3[i] + ',' ;
          }else{
            str3 += this.targetKeys3[i] ;
          }
        }
        let param= {str1:str1,str2:str2,str3:str3} ;
        //console.log(param)
        this.$emit('ok',param)
        this.close();
      },
      close() {
        this.targetKeys1 = [];
        this.targetKeys2 = [];
        this.targetKeys3 = [];
        this.mockData1 = [];
        this.mockData2 = [];
        this.mockData3 = [];
        this.visible = false;
      },

      handleCancel() {
        this.close();
      },

      handleChange1(index) {
        console.log(index)
        this.targetKeys1 = index;
      },
      handleChange2(index) {
        console.log(index)
        this.targetKeys2 = index;
      },
      handleChange3(index) {
        console.log(index)
        this.targetKeys3 = index;
      },

    },
  }
</script>




