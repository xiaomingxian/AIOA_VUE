<template>
  <div>
    <a-drawer
      title="办理详情"
      :width="720"
      @close="onClose1"
      :visible="visible"
      :bodyStyle="{ paddingBottom: '80px' }"
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="是否公开:">
              <a-select :defaultValue="detailData.iis1" @change="getiIsOpen"
              >
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="办理状态:">
              <a-select :defaultValue="detailData.iisOpen" @change="getiIs1"
              >
                <a-select-option value="0">办理中</a-select-option>
                <a-select-option value="1">已办结</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="办理进度：">
              <a-textarea v-model="detailData.sopinion"

                          :rows="4"
                          placeholder="请填写办理意见"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="附件：">
              <div v-for="(item,index) in oaFileList" style="padding-left: 15px">
                <!--<div @click="openFile(9,item.sfileName)"><span class="hoverred">{{index}}、{{item.sfileName}}</span>-->
                <div class="qiCao"><span class="hoverred" @click="qiCao1(9,item)">{{index+1}}、{{item.sfileName}}</span>
                  <span class="delCss">
                <img :title="fileBtnName(1)" v-show="isSuffex(item.sfileName)" class="pices"
                     @click.stop="qiCao2(10,item)" src="@/assets/set.png"/>
                <img :title="fileBtnName(2)" class="pices" @click.stop="updateFileName(item)"
                     src="@/assets/setName.png"/>
                <img :title="fileBtnName(3)" class="pices" @click.stop="deleteFilesBtn(item,4)"
                     src="@/assets/delete.png"/>
                <img :title="fileBtnName(4)" v-show="oaFileList.length > 1 && index > 0" class="pices"
                     @click.stop="topFile(item,index,4)" src="@/assets/top.png"/>
                <img :title="fileBtnName(5)" v-show="oaFileList.length > 1 && index < oaFileList.length-1" class="pices"
                     @click.stop="lowFile(item,index,4)" src="@/assets/bottom.png"/>
              </span>
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,

        }"
      >
        <a-button :style="{ marginRight: '25px' }" type="primary" @click="onClose1">
          关闭
        </a-button>
        <a-button :style="{ marginRight: '25px' }" type="primary" @click="deleteDataInst">
          删除
        </a-button>
        <a-button :style="{ marginRight: '25px' }" type="primary" @click="fujian">
          上传附件
        </a-button>
        <a-button @click="onClose" type="primary">确定</a-button>
      </div>
    </a-drawer>
    <yin-ru-ban-wen-modal ref="banwenForm" @watchSub="showSub"></yin-ru-ban-wen-modal>
    <del-time ref="updateFileNameModal" @reloadAfterUpdate="reloadAfterUpdate"></del-time>
  </div>
</template>
<script>
  import {deleteAction, downFile, getAction, postAction} from '@/api/manage'
  import YinRuBanWenModal from "../buttons/YinRuBanWenModal";
  import {busdataTemplate} from "@/views/buttons/btn-js/busdataTemplate";
  import DelTime from "../buttons/DelTimeModal";
  import {systemTool} from '@/views/buttons/btn-js/systemTools.js'
  import {ntkoBrowser} from '@/views/buttons/btn-js/ntkobackground.min.js'

  export default {
    name: "detailedInst",
    mixins: [busdataTemplate,systemTool,ntkoBrowser],
    components: {DelTime, YinRuBanWenModal},
    // props: {
    //   detailData:{
    //     type: String,
    //     required: true
    //   }
    // },
    data() {
      return {
        visible: false,
        oaFileList: [],
        banWenFileList: [],
        tableName: "oa_datadetailed_inst",
        // detailData:{},
        detailData: {
          iid: 0,
          stable: "",
          itableId: 0,
          sopinion: "",
          iisOpen: 0,
          iis1: 0,
          iis2: 0,
          ddatetime1: "",
          screateName: "",
          screateBy: "",
          screateDept: "",
          screateDeptid: "",
          cmd: 1,
        },
      };
    },
    created() {

    },
    methods: {
      showDrawer12(data) {
        // this.detailData={};
        // console.log(this.detailData)
        this.detailData.cmd = data.cmd;
        this.detailData.iid = data.iid;
        this.detailData.stable = data.sTable;
        this.detailData.itableId = data.iTableId;
        this.detailData.sopinion = "";
        this.detailData.screateBy = data.sCreateBy;
        this.detailData.screateName = data.sCreateName;
        this.detailData.screateDept = data.sCreateDept;
        this.detailData.screateDeptid = data.sCreateDeptid;
        // console.log("===========================>>>111111!!!"+JSON.stringify(data))
        // console.log("==========================>>>111111!!!"+JSON.stringify(this.detailData))
        let detailedInst = {
          s_table: data.sTable,
          i_table_id: data.iTableId,
          s_create_name: data.sCreateName,
          s_create_by: data.sCreateBy,
          s_create_dept: data.sCreateDept,
          s_create_deptid: data.sCreateDeptid
        };
        if (this.detailData.cmd == 1) {
          var addurl = "/oadatafetailedinst/oaDatadetailedInst/adddatadetailedInst";
          postAction(addurl, detailedInst).then(res => {
            this.detailData.iid = res.result;
          })
        }
        this.visible = true;
      },

      showDrawer22(data) {
        // alert(JSON.stringify(data))
        // this.detailData=data;
        console.log("==========================>>>000!!!~~~~~~" + JSON.stringify(data))
        this.detailData.cmd = data.cmd;
        this.detailData.iid = data.iid;
        this.detailData.stable = data.stable;
        this.detailData.itableId = data.itableId;
        this.detailData.sopinion = data.sopinion;
        this.detailData.screateBy = data.screateBy;
        this.detailData.screateName = data.screateName;
        this.detailData.screateDept = data.screateDept;
        this.detailData.screateDeptid = data.screateDeptid;
        this.detailData.iis1 =data.iis1;
        this.detailData.iis2 =data.iis2;
        this.detailData.iisOpen =data.iisOpen;
        console.log("==========================>>>111111!!!~~~~~~" + JSON.stringify(this.detailData))
        // let detailedInst = {
        //   s_table: this.detailData.sTable,
        //   i_table_id: this.detailData.iTableId,
        //   s_create_name: this.detailData.sCreateName,
        //   s_create_by: this.detailData.sCreateBy,
        //   s_create_dept: this.detailData.sCreateDept,
        //   s_create_deptid: this.detailData.sCreateDeptid
        // };
        // console.log("==========================>>>111111!!!~~~~~~"+JSON.stringify(detailedInst))
        // if (this.detailData.cmd == 1) {
        //   var addurl = "/oadatafetailedinst/oaDatadetailedInst/adddatadetailedInst";
        //   postAction(addurl, detailedInst).then(res => {
        //     this.detailData.iId = res.result;
        //   })
        // }
        this.getOaFiles(this.tableName, this.detailData.iid);
        this.visible = true;
      },

      onClose1() {
        this.visible = false;
      },

      onClose() {
        let detailedInst = {
          i_id: this.detailData.iid,
          s_table: this.detailData.stable,
          i_table_id: this.detailData.itableId,
          s_opinion: this.detailData.sopinion,
          i_is_open: this.detailData.iisOpen,
          i_is_1: this.detailData.iis1,
          s_create_name: this.detailData.screateName,
          s_create_by: this.detailData.screateBy,
          s_create_dept: this.detailData.screateDept,
          s_create_deptid: this.detailData.screateDeptid,
          cmd: this.detailData.cmd
        };
        // console.log("================================>>>4444444"+JSON.stringify(this.detailData.iTableId))
        var updataurl = "/oadatafetailedinst/oaDatadetailedInst/updatadetailedInst";
        if (this.detailData.cmd == 1) {
          postAction(updataurl, detailedInst).then(res => {
            if (res.success) {
              this.$message.success("新建办理成功");
              // let cmd=3;
              this.$emit('ok');
            } else {
              this.$message.warning("新建办理失败")
            }
          })
        } else if (this.detailData.cmd == 2) {
          console.log("~~~~~~~~~~~~~~~~~~!~~~~~~", JSON.stringify(detailedInst))
          postAction(updataurl, detailedInst).then(res => {
            if (res.success) {
              this.$message.success("更新办理成功");
              // let cmd=3;
              this.$emit('ok');
            } else {
              this.$message.warning("更新办理失败")
            }
          })
        }
        this.visible = false;
      },

      deleteDataInst() {
        var updataurl = "/oadatafetailedinst/oaDatadetailedInst/deteledetailedInst";
        getAction(updataurl, {iId: this.detailData.iid}).then(res => {
          if (res.success) {
            this.$message.success("删除办理成功");
            let cmd = 3;
            this.$emit('ok', cmd);
          } else {
            this.$message.warning("删除办理失败")
          }
        })
        this.visible = false;
      },

      getiIs1(num) {
        this.detailData.iis1 = parseInt(num);
      },
      getiIsOpen(num) {
        this.detailData.iisOpen = parseInt(num);
      },
      fujian() {
        let param = {};
        param.table = this.tableName,
          param.i_id = this.detailData.iid,
          console.log("===========================>>>!!!!222222附件" + JSON.stringify(this.detailData.iId))
        alert(JSON.stringify(param))
        this.$refs.banwenForm.show(param);
        this.$refs.banwenForm.title = "引入附件";
        this.$refs.banwenForm.disableSubmit = false;
      },
      upDataDetail() {
        var updataStatsurl = "/oadatafetailedinst/oaDatadetailedInst/updataDetailedIsStats";
        getAction(updataStatsurl, {iId: this.detailData.iid}).then(res => {
          if (res.success) {
            // this.$message.success("删除办理成功");
          } else {
            // this.$message.warning("删除办理失败")
          }
        })
      },
      showSub() {
        // let param={};
        // param.table="oa_busdata40"
        // param.i_id=1
        let table = this.tableName;
        let id = this.detailData.iid
        console.log("===========================>>>!!!!附件" + JSON.stringify(this.detailData.iId))
        console.log("--------------->>确定")
        this.getOaFiles(table, id)
      },

      //附件-修改附件名称
      updateFileName(item) {
        this.$refs.updateFileNameModal.show(item);
      },
      //刷新附件列表
      reloadAfterUpdate() {
        this.getOaFiles(this.tableName, this.detailData.iid);
      },

      //附件-删除
      deleteFilesBtn(data, type) {
        let param = {}; //删除文件参数
        param.i_id = data.iid;
        param.table = 'oa_file';
        postAction('/oaBus/dynamic/delete', param).then(res => {
          if (type == 4) {
            this.getOaFiles(this.tableName, this.detailData.iid);
          }
        });
        if (type == 4) {
          this.deleteFile(param, type);
          //是否有附件状态修改 1 是 0 否
          // postAction('/oaBus/dynamic/updateData', isFile).then(res => {
          // })
        }
      },
      //公共调用-删除附件
      deleteFile(param, type) {
        //参数：1.i_id 2.table
        postAction('/oaBus/dynamic/delete', param).then(res => {
          if (type == 4) {
            this.getOaFiles(this.tableName, this.detailData.iid);
          }
        })
      },
      //附件-向上
      topFile(item, index, type) {
        if (index > 0) {
          if (type == 4) {
            let param = {};
            param.id1 = item.iid;
            param.iorder1 = item.iorder;
            param.id2 = this.oaFileList[index - 1].iid;
            param.iorder2 = this.oaFileList[index - 1].iorder;
            postAction("/oaBus/oaFile/sortFile", param).then(res => {
              this.getOaFiles(this.tableName, this.detailData.iid);
            })
          }
        }
      },

      // 打开附件
      qiCao1(index, item) {
        // let fileName = item.sfilePath.slice(item.sfilePath.lastIndexOf("\\") + 1);
        let suffex = item.sfileName.slice(item.sfileName.lastIndexOf(".") + 1);
        if (suffex == 'docx' || suffex == 'doc' || suffex == 'xlsx' || suffex == 'xls' || suffex == 'pptx'
          || suffex == 'ppt' || suffex == 'pdf' || suffex == 'wps') {
          let param = {};
          param.sFilePath = item.sfilePath;
          postAction('/oaBus/oaFile/singleCopyFile', param).then(res => {
            getAction("/sys/user/getLoginInfo", {}).then(res => {
              this.orgSchema = res.orgSchema;
              if (this.orgSchema == null) {
                this.orgSchema = "";
              }
              postAction("/ntko/filentko/getPasswordCode").then(res => {
                if (res.success) {
                  let browerN = systemTool.getBrowserInfo() + '';//浏览器
                  this.os = systemTool.getOS();//系统
                  let a = browerN.substr(0, 1);
                  if (a == "f") {
                    this.brower = browerN.substr(0, 7);
                    this.browerNum = browerN.substr(8, 4);
                  } else if (a == "c") {
                    this.brower = browerN.substr(0, 6);
                    this.browerNum = browerN.substr(7, 2);
                  }
                  this.password = res.result;
                  let ntkoed = ntkoBrowser.ExtensionInstalled();
                  alert(ntkoed)
                  if (ntkoed) {
                    if (this.os != 'Win7' && this.os != 'Win10') {
                      if (this.brower == "chrome") {
                        if (this.browerNum <= 42) {
                          window.open("/ntko/xpeditindex.html?cmd="+ + index + "&fileId=" + item.iid + "&password=" + this.password
                            + "&orgSchema=" + this.orgSchema + "&url=" + window._CONFIG['domianURL']);
                        } else {
                          alert("您的浏览器版本太高，控件无法正常使用，请安装chrome42以下版本！");
                        }
                      }
                      if (this.brower == "firefox") {
                        if (this.browerNum <= 52.3) {
                          window.open("/ntko/xpeditindex.html?cmd=" + index + "&fileId=" + item.iid + "&password=" + this.password
                            + "&orgSchema=" + this.orgSchema + "&url=" + window._CONFIG['domianURL']);
                        } else {
                          alert("您的浏览器版本太高，控件无法正常使用，请安装firefox52.3以下版本！");
                        }
                      }
                    }else {
                      ntkoBrowser.openWindow("/ntko/editindex.html?cmd=" + index + "&fileId=" + item.iid + "&password=" + this.password
                        + "&orgSchema=" + this.orgSchema + "&url=" + window._CONFIG['domianURL']);
                    }
                  } else {
                    window.open("/ntko/exeindex.html")
                  }
                  window.ntkoCloseEvent = function () {
                  }
                } else {
                  this.$message.error(res.message)
                }
              });
            });
          })
        } else {
          this.downFileName(item);
        }
      },

      //附件-向下
      lowFile(item, index, type) {
        if (type == 4) {
          if (index < this.oaFileList.length - 1) {
            let param = {};
            param.id1 = item.iid;
            param.iorder1 = item.iorder;
            param.id2 = this.oaFileList[index + 1].iid;
            param.iorder2 = this.oaFileList[index + 1].iorder;
            postAction("/oaBus/oaFile/sortFile", param).then(res => {
              this.getOaFiles(this.tableName, this.detailData.iid);
            })
          }
        }
      },
    },
  };
</script>