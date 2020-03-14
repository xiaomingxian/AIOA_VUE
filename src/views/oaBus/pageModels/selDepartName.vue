<template>
  <a-modal
    :title="title"
    :width="850"

    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <!--
        <div style="display: flex;align-items: center;justify-content: center;height: 500px;overflow: auto">
    -->

    <div class="contentBox" >
      <div class="topBox">
          <div class="origionData">
            <h1 class="title">待选主送抄送单位</h1>
            <div class="left">
              <a-table
                ref="table"
                size="small"
                bordered
                rowKey="text"
                rowSelection
                :loading="loading"
                :columns="columns2"
                :customRow="zhuSongClickCheck"
                :dataSource="mockData1"
                :pagination="false"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                @change="handleTableChange"
              >
              </a-table>
            </div>
          </div>

          <div class="toGiveDataBox">
              <div class="toZhuSong">
                <h1 class="title">主送单位</h1>
                <div class="zhusongListBox">
                  <a-checkbox  style="margin-left: 8px" :indeterminate="indeterminate" @change="onCheckAllChange" :checked="checkAll">全选</a-checkbox>
                  <a-checkbox-group :options="departSelect" v-model="zhuSongCheckedList" @change="zhuSongOnChange" />
                </div>

                <div class="optionBox">
                  <a-button class="zhusongbtn_add" @click="toRight()">
                    <a-icon type="right"/>
                    添加
                  </a-button>
                  <a-button class="zhusongbtn_reduce" @click="toLeft()">
                    <a-icon type="left"/>
                    删除
                  </a-button>
                </div>
              </div>
              <div class="toChaoSong">
                <h1 class="title">抄送单位</h1>
                <div class="chaosongListBox">
                  <a-checkbox   style="margin-left: 8px"   :indeterminate="indeterminateChaoSong" @change="onCheckAllChangeChaoSong" :checked="checkAllChaoSong">全选</a-checkbox>
                  <a-checkbox-group :options="departSelectChaoSong" v-model="chaoSongCheckedList" @change="chaoSongOnChange" />
                </div>
                <div class="optionBox">
                  <a-button class="chaosongbtn_add" @click="toRightChaoSong()">
                    <a-icon type="right"/>
                    添加
                  </a-button>
                  <a-button class="chaosongbtn_reduce" @click="toLeftChaoSong()">
                    <a-icon type="left"/>
                    删除
                  </a-button>
                </div>
              </div>
          </div>
      </div>

      <div class="bottomBox">
          <div class="neibuFasong">
            <h1 class="title">待选内部发送单位</h1>
            <a-table
              ref="table"
              size="small"
              bordered
              rowKey="text"
              rowSelection
              :loading="loading"
              :columns="columns2"
              :customRow="neiBuClickCheck"
              :dataSource="mockData3"
              :pagination="false"
              :rowSelection="{selectedRowKeys: selectedRowKeysNeibu, onChange: onSelectChangeNeibu}"
              @change="handleTableChange"
            >
              <!--                :customRow="departClickCheck"-->
            </a-table>
          </div>

          <div class="toSelectBox">
            <h1 class="title">内部发送</h1>

            <div class="neibuListBox">
              <a-checkbox   style="margin-left: 8px"   :indeterminate="indeterminateNeibu" @change="onCheckAllChangeNeibu" :checked="checkAllNeibu">全选</a-checkbox>
              <a-checkbox-group :options="departSelectNeibu" v-model="checkedListNeibu" @change="onChangeNeibu" />
            </div>

            <div class="optionBox">
                  <a-button class="neibuBtn_add" @click="toRightNeibu()">
                    <a-icon type="right"/>
                    添加
                  </a-button>
                  <a-button class="neibuBtn_reduce" @click="toLeftNeibu()">
                    <a-icon type="left"/>
                    删除
                  </a-button>
                </div>
          </div>
      </div>

    </div>

  </a-modal>
</template>
<script>

  import {getAction, postAction} from "../../../api/manage";
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'


  export default {
    name: "selDepartName",
    mixins: [JeecgListMixin],
    data() {
      return {
        mockData1: [],
        mockData2: [],
        mockData3: [],
        targetKeys1: [],
        targetKeys2: [],
        targetKeys3: [],
        indeterminate: false,
        checkAll: false,
        title: '选择部门',
        visible: false,
        url: {
          getDictByKey: "/sys/dict/getDictByKeyObj",
          getDictByKey2: "/sys/dict/getDictByKeyObj",
          list: "/sys/dict/getDictByKeyObj",
        },
        columns2: [
          {
            title: '部门名称',
            align: "center",
            dataIndex: 'text'
          }
        ],
        //主送的原始数
        departSelect:[],
        //主送的已选中的数据
        zhuSongCheckedList:[],
        selectionRows:[],
        //源数据中的已选择的数据
        selectedRowKeys:[],

        //抄送相关数据，
        indeterminateChaoSong: false ,
        checkAllChaoSong: false ,
        //抄送的所有数据
        departSelectChaoSong: [] ,
        //抄送的已选择的数据
        chaoSongCheckedList: [] ,


        indeterminateNeibu:false ,
        checkAllNeibu:false ,
        //内部发送右边源数据
        departSelectNeibu:[],
        //内部发送右边已选择的数据
        checkedListNeibu:[],
        //内部发送源数据已近选择的数据
        selectedRowKeysNeibu:[],

      }
    },
    mounted() {
      this.getMock()
    },
    watch:{
      'departSelect':function () {
        if(this.departSelect.length == 0 ){
          this.indeterminate = false ;
          this.checkAll = false ;
        }
      },
      'departSelectChaoSong':function () {
        if(this.departSelectChaoSong.length == 0 ){
          this.indeterminateChaoSong = false ;
          this.checkAllChaoSong = false ;
        }
      },
      'departSelectNeibu':function () {
        if(this.departSelectNeibu.length == 0 ){
          this.indeterminateNeibu= false ;
          this.checkAllNeibu = false ;
        }
      }
    },
    methods: {
      //内部发送单选事件
      onChangeNeibu(checkedList){
        //this.checkAllChaoSong = checkedList.length === this.departSelectChaoSong.length;
        this.indeterminateNeibu = !!checkedList.length && checkedList.length < this.departSelectNeibu.length;
        this.checkAllNeibu = checkedList.length === this.departSelectNeibu.length;
      },
      //抄送全选事件，
      onCheckAllChangeChaoSong(e){
        Object.assign(this, {
          chaoSongCheckedList: e.target.checked ? this.departSelectChaoSong : [],
          indeterminateChaoSong: false,
          checkAllChaoSong: e.target.checked,
        });
      },

      onCheckAllChangeNeibu(e){
        Object.assign(this, {
          checkedListNeibu: e.target.checked ? this.departSelectNeibu : [],
          indeterminateNeibu: false,
          checkAllNeibu: e.target.checked,
        });
      },
      //抄送的单选事件
      chaoSongOnChange(checkedList){
        console.log(checkedList)
        this.indeterminateChaoSong = !!checkedList.length && checkedList.length < this.departSelectChaoSong.length;
        this.checkAllChaoSong = checkedList.length === this.departSelectChaoSong.length;
      },
      //主送单位单选  选择的复选框事件
      zhuSongOnChange(checkedList) {
        console.log(checkedList)
        this.indeterminate = !!checkedList.length && checkedList.length < this.departSelect.length;
        this.checkAll = checkedList.length === this.departSelect.length;
      },
      // 主送单位全选  选择的复选框事件
      onCheckAllChange(e) {
        Object.assign(this, {
          zhuSongCheckedList: e.target.checked ? this.departSelect : [],
          indeterminate: false,
          checkAll: e.target.checked,
        });
        console.log("全选：",this.zhuSongCheckedList)
        //this.zhuSongCheckedList
      },
      //主送单位单独选择的复选框事件
     /* onChangeCheck(item){
        console.log(item)
        // let zhusongCheckTexts
      },*/
      onSelectChange(res){
        console.log(res) ;
        this.selectedRowKeys= res;
      },
      onSelectChangeNeibu(res){
        console.log(res) ;
        this.selectedRowKeysNeibu= res;
      },
      handleTableChange(rowKeys, rows){
        console.log(rowKeys)
        console.log(rows)
      },
      //点击某一行
      zhuSongClickCheck(res){
        return {
          on: {
            click: (e) => {
              //console.log(res);
              //console.log(this.selectedRowKeys);
              if(this.selectedRowKeys.includes(res.text)){
                let k = this.findIndex(res.text,this.selectedRowKeys)
                this.selectedRowKeys.splice(k,1)
              }else{
                this.selectedRowKeys.push(res.text)
              }
            }
          }
        }
      },
      //点击部门行 选中
      neiBuClickCheck(res) {

        return {
          on: {
            click: (e) => {

              if(this.selectedRowKeysNeibu.includes(res.text)){
                let k = this.findIndex(res.text,this.selectedRowKeysNeibu)
                this.selectedRowKeysNeibu.splice(k,1)
              }else{
                this.selectedRowKeysNeibu.push(res.text)
              }

            }
          }
        }
      },
      //内部发送
      toRightNeibu(){
        console.log(this.selectedRowKeysNeibu)
        for(let i = 0 ; i < this.selectedRowKeysNeibu.length ; i ++){
          this.departSelectNeibu.push(this.selectedRowKeysNeibu[i])
        }
        //从源数据中删除
        for(let i = 0 ; i < this.selectedRowKeysNeibu.length; i ++){
          for(let j = 0 ; j < this.mockData3.length ; j ++){
            if(this.selectedRowKeysNeibu[i] == this.mockData3[j].text ){
              this.mockData3.splice(j,1);
              break ;
            }
          }
        }
        this.selectedRowKeysNeibu = [];  // 清空源数据中已经选中的数据
      },
      //内部发送中的向左传
      toLeftNeibu() {
        //let list = this.zhuSongCheckedList ;
        console.log(this.checkedListNeibu.length) ;
        //
        for(let i = 0; i < this.checkedListNeibu.length ; i ++){
          let item = {text:this.checkedListNeibu[i],value:this.checkedListNeibu[i]} ;
          this.mockData3.push(item)     //将数据插入到原数据中
        }
        if(this.checkedListNeibu.length == this.departSelectNeibu.length){
          this.departSelectNeibu = [] ;
          this.checkedListNeibu = [] ;
        }else{
          for(let i = 0; i < this.checkedListNeibu.length ; i ++){
            console.log(this.departSelectNeibu)
            let j = this.findIndex(this.checkedListNeibu[i],this.departSelectNeibu) ;
            this.departSelectNeibu.splice(j,1);
          }
        }
        this.checkedListNeibu = [] ;  //将主送中的已选中的数据清空
      },
      //抄送的选择，
      toRightChaoSong(){
        for(let i = 0 ; i < this.selectedRowKeys.length ; i ++){
          this.departSelectChaoSong.push(this.selectedRowKeys[i])
        }
        //从源数据中删除
        for(let i = 0 ; i < this.selectedRowKeys.length; i ++){
          for(let j = 0 ; j < this.mockData1.length ; j ++){
            if(this.selectedRowKeys[i] == this.mockData1[j].text ){
              this.mockData1.splice(j,1);
              break ;
            }
          }
        }
        this.selectedRowKeys = [];  // 清空源数据中已经选中的数据
      },
      //穿梭方法实现
      toRight() {
        console.log(this.selectedRowKeys);
        for(let i = 0 ; i < this.selectedRowKeys.length ; i ++){
          this.departSelect.push(this.selectedRowKeys[i])
        }
        //this.departSelect = this.selectedRowKeys;

        //从源数据中删除
        for(let i = 0 ; i < this.selectedRowKeys.length; i ++){
          for(let j = 0 ; j < this.mockData1.length ; j ++){
            if(this.selectedRowKeys[i] == this.mockData1[j].text ){
              this.mockData1.splice(j,1);
              break ;
            }
          }
        }
        this.selectedRowKeys = [];  // 清空源数据中已经选中的数据

      },
      toLeftChaoSong() {
        //1.从主送中移除
        for(let i = 0; i < this.chaoSongCheckedList.length ; i ++){
          let item = {text:this.chaoSongCheckedList[i],value:this.chaoSongCheckedList[i]} ;
          this.mockData1.push(item)     //将数据插入到原数据中
        }
        if(this.chaoSongCheckedList.length == this.departSelectChaoSong.length){
          this.departSelectChaoSong = [] ;
          this.chaoSongCheckedList = [] ;
        }else{
          for(let i = 0; i < this.chaoSongCheckedList.length ; i ++){
            let j = this.findIndex(this.chaoSongCheckedList[i],this.departSelectChaoSong) ;
            this.departSelectChaoSong.splice(j,1);
          }
        }
        this.chaoSongCheckedList = [] ;  //将抄送中的已选中的数据清空
      },
      //查找数组下标
      findIndex(rec,array){
        for (let i = 0; i < array.length; i++) {
          if (rec == array[i]) {
            return i;
          }
        }
      },
      toLeft() {
        //let list = this.zhuSongCheckedList ;
        console.log(this.zhuSongCheckedList.length) ;
        //1.从主送中移除，
        for(let i = 0; i < this.zhuSongCheckedList.length ; i ++){
          let item = {text:this.zhuSongCheckedList[i],value:this.zhuSongCheckedList[i]} ;
          this.mockData1.push(item)     //将数据插入到原数据中
        }
        if(this.zhuSongCheckedList.length == this.departSelect.length){
          this.departSelect = [] ;
          this.zhuSongCheckedList = [] ;
        }else{
          for(let i = 0; i < this.zhuSongCheckedList.length ; i ++){
            console.log(this.departSelect)
            let j = this.findIndex(this.zhuSongCheckedList[i],this.departSelect) ;
            this.departSelect.splice(j,1);
          }
        }
        this.zhuSongCheckedList = [] ;  //将主送中的已选中的数据清空
      },

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
      //从一个数组中去除这个数组中已经包含的东西
      removeArray(aimArray,sourceArray){

        if(sourceArray.length <= 0 ){
          return ;
        }
        console.log("as")
        console.log(sourceArray)
        //判断是否为带dictId的源数据
        //从源数据中删除
        for(let i = 0 ; i < aimArray.length; i ++){
          for(let j = 0 ; j < sourceArray.length ; j ++){
            if(this.aimArray[i] == sourceArray[j].text ){
              this.sourceArray.splice(j,1);
              break ;
            }
          }
        }

       /* }else{  //普通数组
          for(let i = 0; i < aimArray.length ; i ++){
            let k = this.findIndex(aimArray[i],sourceArray) ;
            sourceArray.splice(k,1);
          }
        }*/
      },
      show(param) {
        this.initData(param);
        //处理数据回显的问题
        this.visible = true;
      },
      //初始化数据，查出部门名称对应的数据字典数据
      initData(param) {
        let url = this.url.getDictByKey;
        let url2 = this.url.getDictByKey2;

        getAction(url,{dictKey:"mainDoDepart"}).then((rec) => {
          this.mockData1 = rec.result;
          this.mockData2 = rec.result;
          if(param.str1 != undefined){
            this.departSelect =  param.str1.split(',');
            for(let i = 0 ; i < this.departSelect.length; i ++){
              for(let j = 0 ; j < this.mockData1.length ; j ++){
                if(this.departSelect[i] == this.mockData1[j].text ){
                  this.mockData1.splice(j,1);
                  break ;
                }
              }
            }
            //this.removeArray(this.departSelect,this.mockData1) ;
          }
          if(param.str2 != undefined&& param.str2 != null && param.str2 != ''){
            this.departSelectChaoSong =  param.str2.split(',');
            for(let i = 0 ; i < this.departSelectChaoSong.length; i ++){
              for(let j = 0 ; j < this.mockData1.length ; j ++){
                if(this.departSelectChaoSong[i] == this.mockData1[j].text ){
                  this.mockData1.splice(j,1);
                  break ;
                }
              }
            }
          }


        })
        getAction(url2,{dictKey:"insideDepart"}).then((rec) => {
          this.mockData3 = rec.result;
          if(param.str3 != undefined && param.str3 != null && param.str3 != ''){
            this.departSelectNeibu =  param.str3.split(',');
            for(let i = 0 ; i < this.departSelectNeibu.length; i ++){
              for(let j = 0 ; j < this.mockData3.length ; j ++){
                if(this.departSelectNeibu[i] == this.mockData3[j].text ){
                  this.mockData3.splice(j,1);
                  break ;
                }
              }
            }
          }
        })
      },
      handleOk() {
        let str1 = '';
        for(let i = 0 ; i < this.departSelect.length; i ++){
          if(i != this.departSelect.length -1 ){
            str1 += this.departSelect[i] + ',' ;
          }else{
            str1 += this.departSelect[i] ;
          }
        }
        let str2 = '';
        for(let i = 0 ; i < this.departSelectChaoSong.length; i ++){
          if(i != this.departSelectChaoSong.length -1 ){
            str2 += this.departSelectChaoSong[i] + ',' ;
          }else{
            str2 += this.departSelectChaoSong[i] ;
          }
        }
        let str3 = '';
        for(let i = 0 ; i < this.departSelectNeibu.length; i ++){
          if(i != this.departSelectNeibu.length -1 ){
            str3 += this.departSelectNeibu[i] + ',' ;
          }else{
            str3 += this.departSelectNeibu[i] ;
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
        this.departSelect = [];
        this.departSelectChaoSong = [];
        this.departSelectNeibu = [];
        this.chaoSongCheckedList = [];
        this.zhuSongCheckedList = [];
        this.checkedListNeibu = [];
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
<style lang="less" scoped>
  .contentBox{
    width: 100%;
    height: 500px;
    overflow: auto;scrollbar-width: none;

    .topBox{
      position: relative;
      width: 100%;
      height: 650px;
      /*background: #DD4A68;*/
      display: flex;
      align-items: center;
      justify-content: space-between;
      .origionData{
        /*width: 320px;*/
        width: 340px;

        height: 650px;
        /*height: auto;*/
        border: 1px solid #dddddd;
        padding-bottom: 15px;
        /*margin-bottom: 100px;*/
        .title{
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border-bottom: 1px solid #dddddd;
          font-size: 16px;

        }
        .left {
          width: 100%;
          /*height: 300px;*/
          height: 500px;
          overflow-y: scroll;

        }
      }

      .toGiveDataBox{
        width: 340px;

        /*height: 100%;*/
        /*min-height: 350px;*/
        /*height: auto;*/
        /*border: 1px solid #dddddd;*/
        /*background: #dddddd;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        .toChaoSong{
          margin-top: 20px;
        }
        .toZhuSong,.toChaoSong{
          width: 100%;
          /*min-height: 350px;*/

          border: 1px solid #dddddd;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;

          .title{
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            border-bottom: 1px solid #dddddd;
            font-size: 16px;

          }
          .zhusongListBox{
            width: 100%;
            height: 260px;

            /deep/.ant-checkbox-group{
              width: 95%;
              height: 95%;
              margin: 10px auto;
              /*background: #dddddd;*/
              overflow-y: scroll;

              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              /deep/.ant-checkbox-group-item{
                margin-top: 10px;
              }
            }


          }
          .chaosongListBox{
            width: 100%;
            height: 260px;
            /*background: #dddddd;*/

            /deep/.ant-checkbox-group{
              width: 95%;
              height: 90%;
              margin: 10px auto;
              /*background: #dddddd;*/
              overflow-y: scroll;

              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              /deep/.ant-checkbox-group-item{
                margin-top: 10px;
              }
            }
          }
          .optionBox{
            display: flex;
            align-content: center;
            justify-content: space-between;
            /*width: 60%;*/
            /*margin: 10px 0;*/
            .zhusongbtn_add{
              position: absolute;
              top: 120px;
              left: 360px;
            }
            .zhusongbtn_reduce{
              position: absolute;
              top: 230px;
              left: 360px;
            }

            .chaosongbtn_add{
              position: absolute;
              bottom: 200px;
              left: 360px;
            }
            .chaosongbtn_reduce{
              position: absolute;
              bottom: 100px;
              left: 360px;
            }
          }

        }
      }


    }
    .bottomBox{
      position: relative;
      width: 100%;
      height: 300px;
      /*background: #dddddd;*/
      margin-top: 20px;
      border: 1px solid #dddddd;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .neibuFasong{
        /*width: 30%;*/
        width: 340px;
        height: 100%;
        /*background: #00A0E9;*/
        border-right: 1px solid #dddddd;
        overflow-y: scroll;

        .title{
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border-bottom: 1px solid #dddddd;
          font-size: 16px;

        }

      }
      .toSelectBox{
        /*width: 69%;*/
        width: 340px;

        height: 100%;
        /*background: #00DB00;*/
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        border-left: 1px solid #dddddd;

        .title{
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border-bottom: 1px solid #dddddd;
          font-size: 16px;

        }
        .neibuListBox{
          width: 100%;
          height: 200px;
          /*background: #dddddd;*/

          /deep/.ant-checkbox-group{
            width: 95%;
            height: 90%;
            margin: 10px auto;
            /*background: #dddddd;*/
            overflow-y: scroll;

            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            /deep/.ant-checkbox-group-item{
              margin-top: 10px;
            }
          }
        }

        .optionBox{
          display: flex;
          align-content: center;
          justify-content: space-between;
          width: 60%;
          margin: 0px auto;
          margin-bottom: 10px;

          .neibuBtn_add{
            position: absolute;
            top: 100px;
            left: 360px;
          }

          .neibuBtn_reduce{
            position: absolute;
            bottom: 100px;
            left: 360px;
          }
        }
      }
    }

  }
</style>




