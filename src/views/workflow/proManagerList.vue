<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="12" :sm="8">
            <a-form-item label="流程名称">
              <a-input  v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :md="6" :sm="8">-->
            <!--<a-form-item label="流程key">-->
              <!--<a-input  v-model="queryParam.key"></a-input>-->
            <!--</a-form-item>-->
          <!--</a-col>-->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" >
              <a-button type="primary" ref="reSearchQuery" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="display: flex">

      <!--:beforeUpload="beforeUpload"-->
      <!--<a-upload name="file" :multiple="true"  :action="url.fileUpload" :headers="headers" :fileList="fileList"-->
                   <!--@change="handleChange">-->

        <!---->
        <!--<a-button @click="handleAdd" type="primary" icon="plus">画流程图</a-button>-->
        <a-button @click="showUpload"  >
          <a-icon  type="upload"  />
          上传流程图
        </a-button>
      <a-button @click="bpmn_create"  >
          <a-icon  type="primary"  />
          画流程图
        </a-button>
      <!--</a-upload>-->

      <!--<a-dropdown v-if="selectedRowKeys.length > 0">-->
        <!--<a-menu slot="overlay">-->
          <!--<a-menu-item key="1" @click="dels(0)">-->
            <!--<a-icon type="delete"/>-->
            <!--删除-->
          <!--</a-menu-item>-->
          <!--&lt;!&ndash;<a-menu-item key="1" @click="dels(1)">&ndash;&gt;-->
          <!--&lt;!&ndash;<a-icon type="delete"/>&ndash;&gt;-->
          <!--&lt;!&ndash;级联删除&ndash;&gt;-->
          <!--&lt;!&ndash;</a-menu-item>&ndash;&gt;-->
        <!--</a-menu>-->
        <!--<a-button style="margin-left: 8px"> 批量操作-->
          <!--<a-icon type="down"/>-->
        <!--</a-button>-->
      <!--</a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
        <!--<i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{-->
        <!--selectedRowKeys.length }}</a>项-->
        <!--<a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
      <!--</div>-->

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="deploymentId"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        :rowClassName="(record,index) => {
              let className  = 'light-row';
              if (index % 2 === 1) className = 'dark-row';
              return className;
          }"
      >

        <span slot="action" slot-scope="text, record">
       <a @click="showPic(record)"> 流程图</a>

      <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>


                <!--<a>-->
                <!--<a-popconfirm title="是否级联删除?"-->
                <!--@confirm="confirmdel(record.deploymentId,1)"-->
                <!--@cancel="cancel"-->
                <!--okText="确认"-->
                <!--cancelText="取消"> 级联删除</a-popconfirm>-->
                <!--</a>-->
                      <!--<a @click="active(record)"> 激活</a>-->
                      <!--<a @click="disactiveProcess(record)"> 挂起</a>-->
                     <a @click="buttonPermission(record)"> 按钮权限</a>
                     <a @click="opinionConfigure(record)"> 意见配置</a>
                     <a @click="newIncreased(record)"> 环节配置</a>
                     <a @click="copyProc(record)">一键复制</a>
                     <a @click="editPro(record)">流程源码</a>
                      <a>
                        <a-popconfirm title="是否删除?"
                                      @confirm="confirmdel(record.deploymentId,0)"
                                      @cancel="cancel"
                                      okText="确认"
                                      cancelText="取消"> 删除</a-popconfirm>
                      </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <pic-modal ref="picModal" @ok="modalFormOk"></pic-modal>
    <edit-pro ref="editPro" @reload="reload"></edit-pro>
    <OaProcButtonFast-Modal ref="OaProcButtonFastModal" @ok="modalFormOk"></OaProcButtonFast-Modal>
    <OaProcOpinionConfigure-Modal ref="OaProcOpinionConfigureModal" @ok="modalFormOk"></OaProcOpinionConfigure-Modal>
    <oa-proc-actinst-list ref="oaProcActinstList"></oa-proc-actinst-list>

    <copy-proc-modal ref="copyProc" @reload="reload"></copy-proc-modal>

    <upload-proc ref="upload" @reload="reload"></upload-proc>

    <bpmn-on-line ref="bpmnOnLine"></bpmn-on-line>
  </a-card>
</template>

<script>
  import editPro from './modules/editPro'
  import Vue from 'vue'
  import picModal from './modules/picModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {ACCESS_TOKEN} from "../../store/mutation-types";
  import {deleteAction, getAction,postAction} from "../../api/manage";
  import OaProcButtonFastModal from "./modules/OaProcButtonFastModal";
  import OaProcOpinionConfigureModal from "./modules/OaProcOpinionConfigureModal";
  import oaProcActinstList from './oaProcActinstList'
  import copyProcModal from './modules/copyProcModal'
  import uploadProc from './modules/uploadProc'
  import bpmnOnLine from './modules/bpmn-online'

  export default {
    name: "proManagerList",
    mixins: [JeecgListMixin],
    components: {
      uploadProc,
      OaProcButtonFastModal,
      OaProcOpinionConfigureModal,
      picModal,
      editPro,
      oaProcActinstList,
      copyProcModal,
      bpmnOnLine
    },
    data() {
      return {
        fileList: '',
        headers: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        description: 'proManager管理页面',
        iisFontSize: '16px',
        datasource: [],
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          // {
          //   title: '流程定义id',
          //   align: "center",
          //   dataIndex: 'id'
          // },
          {
            title: '流程名称',
            align: "center",
            width: 200,
            dataIndex: 'name'
          },
          // {
          //   title: '流程KEY',
          //   align: "center",
          //   width: 200,
          //   dataIndex: 'key'
          // },
          {
            title: '版本',
            align: "center",
            width: 60,
            dataIndex: 'version'
          },
          // {
          //   title: '部署id',
          //   align: "center",
          //   dataIndex: 'deploymentId'
          // },
          // {
          //   title: '英文名',
          //   align: "center",
          //   width: 200,
          //   dataIndex: 'resourceName'
          // },
          {
            title: '描述',
            align: "left",
            dataIndex: 'description'
          },
          // {
          //   title: '激活状态',
          //   align: "center",
          //   dataIndex: 'sus'
          // },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            width: 150,
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          //
          fileUpload:  window._CONFIG['domianURL'] +'/wf/process/deploy',
          list: "/wf/process/processQuery",
          delete: "/wf/process/processDel",
          active: '/wf/process/activeProcess',
          disactiveProcess: "/wf/process/disactiveProcess",
          deleteBatch: "/wf/process/processDel"
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created() {
      this.setFontSize();
    },
    methods: {
      setFontSize(){
        const  userid =JSON.parse( localStorage.getItem('userdata')).userInfo.id;
        let url = "/testt/sysUserSet/queryByUserId";
        getAction(url,{userId:userid}).then((res) => {
          if(res.result.iisFontSize == 1){
            this.iisFontSize = '18px';
          }else if(res.result.iisFontSize == 3){
            this.iisFontSize = '14px';
          }else{
            this.iisFontSize = '16px';
          }
          document.getElementsByClassName('ant-table')[0].style.fontSize = this.iisFontSize;
        })
      },
      bpmn_create() {
        this.$refs.bpmnOnLine.visible=true

      },
      reload() {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        // this.fileList = []
        this.selectedRowKeys = []
        // this.loading = true;
        getAction(this.url.list).then((res) => {
          // if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
          // }
          // if (res.code === 510) {
          //   this.$message.warning(res.message)
          // }
          // this.loading = false;
          //
        })

      },
      showUpload(){
        this.$refs.upload.show()
      }
      ,
      beforeUpload: function (file, fileList) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      handleChange(info) {
        this.fileList = info.fileList


        if (info.file.status == 'done') {

          this.$message.success(`${info.file.name} 文件上传成功`)

          this.reload()
        } else if (info.file.status == 'error') {
          this.$message.error(`${info.file.name} 文件上传失败`)
          this.reload()
        }
        // this.fileList=[]

      },
      dels(cascade) {

        var ids = "";
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ",";
        }
        this.confirmdel(ids, cascade)

        this.reload()

      },
      confirmdel(id, cascade) {
        var flag = cascade == 0 ? false : true

        deleteAction(this.url.delete+'?ids='+id+'&cascade='+flag).then(res=>{
          if (res.success) {
            this.$message.success(res.message)
            this.reload()

          } else {

            if(res.message=='Transaction rolled back because it has been marked as rollback-only'){

              this.$message.error('流程已关联业务,无法删除')

            }else {
              this.$message.error(res.message)
            }
          }
        })

      },
      cancel() {
        console.log('------->取消选择')
      },
      active(record) {
        if (!record.suspended) {
          this.$message.error('已是激活状态，请勿重复操作')
          return
        }

        getAction(this.url.active+'?id='+record.id).then(res=>{
          if (res.success) {
            this.$message.success('激活成功')
          } else {
            this.$message.error('激活失败')
          }
        })

        this.reload()
      },
      disactiveProcess(record) {
        // var that = this
        if (record.suspended) {
          this.$message.error('已是挂起状态，请勿重复操作')
          return
        }


        getAction(this.url.disactiveProcess+'?id='+record.id).then(res=>{
          if (res.success) {
            this.$message.success('挂起成功')
          } else {
            this.$message.error('挂起失败')
          }
        })

        this.reload()
      },
      showPic(record) {
        this.$refs.picModal.show(record.id)
        this.$refs.picModal.title = record.name
      },
      editPro(record) {
        this.$refs.editPro.editPro(record.id, record.name)
        this.$refs.editPro.title = '流程源码'
        this.reload()
      },
      buttonPermission(record) {
        this.$refs.OaProcButtonFastModal.show1(record.id, record.key);
        this.$refs.OaProcButtonFastModal.title = '权限配置';
        this.reload()
      },
      opinionConfigure(record) {
        this.$refs.OaProcOpinionConfigureModal.show1(record.id, record.key);
        this.$refs.OaProcOpinionConfigureModal.title = '意见配置';
        this.reload()
      },
      newIncreased(record) {
        this.$refs.oaProcActinstList.show(record);
      },
      /**
       * 复制流程图
       */
      copyProc(record) {
        this.$refs.copyProc.proMSg = record
        this.$refs.copyProc.show()
      }

    }

  }
</script>
<style scoped>
</style>