<style>

  /*.ant-tabs-nav-scroll{*/
    /*height:39px;*/
  /*}*/

  /*.ant-card-body .ant-tabs-bar{*/
    /*border:none;*/
  /*}*/

  /*.ant-card-body .ant-tabs-nav{*/
    /*!*background-color: #ffadd2;*!*/
    /*border:1px solid #909090;*/
    /*border-radius: 25%;*/
    /*height: 27px;*/
    /*top: 5px;*/
  /*}*/

  /*.ant-card-body .ant-tabs-bar .ant-tabs-tab{*/
    /*font-size: 14px;*/
    /*padding-top: 2px;*/
    /*margin-right: 0px;*/
    /*bottom: 1px;*/
  /*}*/

  /*.ant-card-body .ant-tabs-bar .ant-tabs-tab:hover{*/
    /*color: #0061cb;*/
  /*}*/

  /*.ant-card-body .ant-tabs-bar .ant-tabs-tab-active{*/
    /*color: #fff;*/
    /*background-color: #7d70ff;*/
    /*border-radius: 27%;*/
    /*height:27px;*/
  /*}*/

  /*.ant-card-body .ant-tabs-bar .ant-tabs-ink-bar-animated{*/
    /*display: none !important;*/
  /*}*/


</style>

<template>
  <div class="table-page-search-wrapper">
    <a-card :bordered=false>
      <a-form layout="inline" style="text-align: center; margin-top: 20px">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24" style="margin-left:249px;" @keyup.13="getPgSearchList">
              <a-select
                ref="isSearchWords"
                mode="combobox"
                labelInValue
                style="width: 100%"
                @search="fetchUser"
                @change="handleChange"
                :showArrow="false"
                :allowClear="true"
                :defaultActiveFirstOption="false"
                :notFoundContent="fetching ? undefined : null"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option v-for="d in data" :key="d.text">{{d.text}}</a-select-option>
            </a-select>
          </a-col>

          <a-col :md="2" :sm="24" >
            <span >
              <a-button type="primary" icon="search" @click="getPgSearchList">查询全部</a-button>&nbsp;
              <!--<a-button type="primary" icon="file-search" @click="getPgSearchList">文件检索</a-button>&nbsp;-->
              <!--<a-button type="primary" icon="solution" @click="getPgSearchList">公文检索</a-button>-->
            </span>
          </a-col>
        </a-row>
        <!--<a-row :gutter="48">-->
        <!--<a-col :md="24" :sm="24" >-->
        <!--<span class="table-page-search-submitButtons" :style="advanced && { overflow: 'hidden' } || {} ">-->
        <!--<a-button type="primary" @click="getPgSearchList">查询</a-button>-->
        <!--</span>-->
        <!--</a-col>-->
        <!--</a-row>-->
      </a-form>



      <a-tabs
        :default-active-key="0"
        @change="changeTabs"
      >
        <a-tab-pane :tab="titleItem.sname" v-for="(titleItem,titleIndex) in getPageList" :key="titleIndex">
          <a-list v-if="defaultActivityKey.toString()==0" size="large" :pagination="pagination" >
            <a-list-item :key="index" v-for="(item, index) in searchOut" @click="openDetial(dataSource[index].i_id,dataSource[index].table_name)">

              <a-list-item-meta>
                <a slot="title" style="white-space: nowrap;text-overflow:ellipsis;overflow: hidden;" v-html="dataSource[index].s_title"></a>
                <p slot="description" style="float: left;padding: 17px 27px 0 0;white-space: nowrap;text-overflow:ellipsis;overflow: hidden;" v-for="(atom, index) in searchOut[index]" v-html="atom"></p>
              </a-list-item-meta>

              </a-list-item>
          </a-list>

          <a-list v-else size="large" :pagination="pagination" >

            <a-list-item :key="index" v-for="(item, index) in searchOut" @click="openDetial(dataSource[index].tableId,dataSource[index].tableName)">

              <a-list-item-meta>
              <a slot="title" style="white-space: nowrap;text-overflow:ellipsis;overflow: hidden;" v-html="dataSource[index].sTitle"></a>
              <p slot="description" style="float: left;padding: 17px 27px 0 0;white-space: nowrap;text-overflow:ellipsis;overflow: hidden;" v-for="(atom, index) in searchOut[index]" v-html="atom"></p>
              </a-list-item-meta>

            </a-list-item>
          </a-list>
        </a-tab-pane>
      </a-tabs>


    </a-card>
  </div>
</template>

<script>
  import HeadInfo from '@/components/tools/HeadInfo'
  import { getAction, postAction } from '@/api/manage'
  // import jsonp from 'fetch-jsonp';
  import querystring from 'querystring';
  import debounce from 'lodash/debounce';

  export default {
    name: "TestStandardList",
    components: {
      HeadInfo
    },
    data() {
      this.lastFetchId = 0;
      this.fetchUser = debounce(this.fetchUser, 800);
      return {
        defaultActivityKey:'0',//默认为第一个tab
        data: [],
        fetching: false,
        getPageList: [
          {
            sname:'全文检索'
          },
          {
            sname:'附件检索'
          }
        ],
        search: '全文检索',
        textData:[],
        attachmentData:[],
        dataSource: [],
        searchOut: [],
        pagination: {
          current: 1,
          pageSize: 10,
          // pageSizeOptions: ['5', '10', '15', '20', '25', '30'],
          showTotal: (total, range) => {
            return "共" + total + "条"
          },
          // showQuickJumper: true,
          // showSizeChanger: true,
          total: 0,
          onChange:pageindex=>{
            console.log(pageindex);
            this.current = pageindex;
            console.log(this.defaultActivityKey);
            //检测测试为全文检索  还是附件检索
            if(this.defaultActivityKey=='0'){
              //全文检索
              this.FilterAllFiles(this.search,pageindex);
            }else{
              //附件检索
              this.FuJianFiles(this.search,pageindex);
            }
          }
        },
      }
    },
    created() {
      // if(this.$route.query.searchWords){
      //   this.$nextTick(function(){
      //     console.log('00000000000000000000000000000000000')
      //     console.log(this.$refs.isSearchWords)
      //
      //     this.$refs.isSearchWords.$el.childNodes[0].innerText = this.$route.query.searchWords;
      //   },500)
      //   this.FilterAllFiles(this.$route.query.searchWords);
      // }else {
      //   return;
      // }
    },
    destroyed(){
      this.dataDestroy();
    },
    methods: {
      //---切换页签-----
      changeTabs(e){
        // console.log(e);
        //切换Tabs时  清空dataSourse
        this.dataSource = [];
        this.searchOut = [];
        this.defaultActivityKey = e.toString();
        // let reg = new RegExp("^[0-9]*$");
        //点击查询按钮检测  检测是否填写
        if(this.search) {
          // if(!reg.test(this.search)) {
            //若用户已填写 判断此时Tab 是全文检索0   附件检索1
            if (e == '0') {
              //全文检索
              this.FilterAllFiles(this.search);
            } else {
              //附件检索
              this.FuJianFiles(this.search);
            }

          // } else {

            // this.$message.error('请输入搜索内容')
          //   return;
          //
          // }

        }

      },
      //---切换分页-----
      changePage(e){
        // console.log(e);
      },
      fetchUser(value) {
        // console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.data = [];
        this.fetching = true;
        let url = "/oaEs/oaelasticsearch/getsearch";
        // let reg = new RegExp("^[0-9]*$");
        // if(!reg.test(value)) {
            postAction(url, {keyWord: value}).then((res) => {
              if (fetchId !== this.lastFetchId) {
                // for fetch callback order
                return;
              }
              for(let i = 0;i<res.result.length;i++){
                this.data.push({
                  text: res.result[i].keyWord,
                  value: res.result[i].id
                });
              }
              this.fetching = false;
            });

          // } else {

            // this.$message.error('请输入搜索内容')
          //   return;
          //
          // }

      },
      handleChange(obj) {

        console.log('000000000t34t636000000000')
        console.log(this.$refs.isSearchWords)

        //判断  全文检索搜索框是否输入    检测输入变化则赋值  否则清空变量
        if(obj){
          // console.log(obj);
          this.search = obj.key;
        }else{
          this.search = '';
        }
        // Object.assign(this, {
        //   value,
        //   data: [],
        //   fetching: false,
        // });
      },
      getTextSearch(defaultActivityKey) {

        // console.log(this.search);
        // console.log(defaultActivityKey);

        //点击查询按钮检测  检测是否填写
        if(this.search){
          // let reg = new RegExp("^[0-9]*$");
          // if(!reg.test(this.search)) {
            //若用户已填写 判断此时Tab 是全文检索0   附件检索1
            if(defaultActivityKey=='0'){
              //全文检索
              this.FilterAllFiles(this.search);
            }else{
              //附件检索
              this.FuJianFiles(this.search);
            }

            // }else{
            //   return;
            // }
          }else{

          htis.$message.error('请输入搜索内容')

          }

      },
      //--------全文检索------------
      FilterAllFiles(serchval,pageindex='1'){
        let url = "/oaEs/oaelasticsearch/list";
        postAction(url, {keyWord:serchval,pageNo:pageindex}).then((res) => {
          console.log('=====================================');
          console.log(res);
          if(res.success){
            this.pagination.total =  res.result.total;
            this.dataSource = res.result.records;

            this.searchOut = JSON.parse(JSON.stringify(this.dataSource,function(key,value){
              if(key == 'i_id' ||key  == 'i_bus_function_id' || key == 'table_name' || key == 's_title'){
                return undefined;
              }else{
                return value;
              }
            }))

          }else{
            this.$message.error('查询失败')
          }

          // for (let i = 0; i < res.result.records.length; i++) {
          //   this.textData.push({
          //     title: res.result.records[i].s_cur_proc_name,
          //     description: res.result.records[i].s_title,
          //   });
          // }
        });
      },
      //--------附件检索-------------
      FuJianFiles(serchval,pageindex='1') {
        let url = "/oaEs/oaelasticsearch/oafile";
        postAction(url, {keyWord:serchval,pageNo:pageindex}).then((res) => {
          if(res.success){
            this.pagination.total =  res.result.total;
            this.dataSource = res.result.records;

            this.searchOut = JSON.parse(JSON.stringify(this.dataSource,function(key,value){
              if(key == 'i_id' ||key  == 'tableName' || key == 'tableId' || key == 'sFileType' || key == 'iOrder'){
                return undefined;
              }else{
                return value;
              }
            }))

          }else{
            this.$message.error('查询失败')
          }
          // for (let i = 0; i < res.result.records.length; i++) {
          //   this.attachmentData.push({
          //     title: res.result.records[i].s_file_name,
          //     description: res.result.records[i].s_title,
          //   });
          // }
        });
      },
      getPgSearchList(iBMId) {

        // console.log(iBMId);

        // for(let i=0;i<this.dataSource.length;i++){
        //   this.dataSource[i].length=0;
        // }

        this.getTextSearch(this.defaultActivityKey);

        // this.getAttachmentSearch(iBMId);
        //
        // this.dataSource.push(this.textData,this.attachmentData);

      },

      //全文检索  点击打开大详情   需要  tableName
      openDetial(i_id,tableName){
        let checkjururl = "/oaBus/oaBusdata/checkBusData";
        console.log("=============")
        postAction(checkjururl, {tableName:tableName,id:i_id}).then((res) => {
          console.log("---------------------")
          if(res){
            window.open(window.location.origin+'/mytask/taskList/Test-detailFile?tableName='+tableName+'&busdataId='+i_id+'&navisshow=false')
          }else{
            this.$message.error('没有权限打开')
          }
        })
      },
      dataDestroy(){
        this.pagination = [];
        this.textData = [],
        this.attachmentData = [],
        this.dataSource = [];
        this.searchOut = [];
      }
    }
  }
</script>

<style lang="scss" scoped>
  .table-page-search-submitButtons .ant-btn{
    background:linear-gradient(180deg,rgba(115,128,255,1),rgba(47,86,255,1)) repeat scroll 0% 0%;
    margin-right:10px;
  }

  .table-page-search-submitButtons .ant-btn svg{
    fill:cyan;
  }

  /deep/.ant-card-body{
    min-height: 650px !important;
  }
  /deep/.ant-spin-container{
    min-height: 400px !important;
  }


  .ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
  }

  .list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
      line-height: 20px;
    }
    p {
      margin-top: 4px;
      margin-bottom: 0;
      line-height: 22px;
    }
  }
</style>