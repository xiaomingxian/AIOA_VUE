<template>
  <div>
    <a-drawer
      title="办理详情"
      :width="720"
      @close="onClose2"
      :visible="visible"
      :bodyStyle="{ paddingBottom: '80px' }"
    >
      <a-form :form="form" layout="vertical" hideRequiredMark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="是否公开:">
              <a-select :value="detailInsrtData.iisOpen" @change="getiIsOpen"
              >
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="办理状态:">
              <a-select :value="detailInsrtData.iis1" @change="getiIs1"
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
              <a-textarea v-model="detailInsrtData.sopinion"
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
        <a-button @click="updataDInst" type="primary">确定</a-button>
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
  import {systemTool} from "../buttons/btn-js/systemTools"
  import {ntkoBrowser} from '../buttons/btn-js/ntkobackground.min.js'

  export default {
    name: "detailedInst",
    mixins: [busdataTemplate, systemTool, ntkoBrowser],
    components: {DelTime, YinRuBanWenModal},
    props: {
      dataed: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        aaa: this.dataed,
        visible: false,
        oaFileList: [],
        banWenFileList: [],
        tableName: "oa_datadetailed_inst",
        cmd: 1,
        detailiid: 0,
        dListiid: 0,
        detailInsrtData: {
          iid: 0,
          stable: "",
          itableId: 0,
          sopinion: "",
          iisOpen: "",
          iis1: "",
          iis2: "",
          ddatetime1: "",
          screateName: "",
          screateBy: "",
          screateDept: "",
          screateDeptid: "",
        },
        resultData: {},
      };
    },

    watch: {
      value(val) {
        this.dataed = val
      },
      aaa(val) {
        this.$emit("dataup", val)
      }
    },

    created() {
    },
    methods: {
      //新增按钮展示赋值
      showaddDrawer(data, cmd) {
        this.cmd = cmd;
        this.detailInsrtData.iid = data.iid;
        this.detailInsrtData.stable = data.stable;
        this.detailInsrtData.itableId = data.itableId;
        this.detailInsrtData.sopinion = "";
        this.detailInsrtData.screateBy = data.screateBy;
        this.detailInsrtData.screateName = data.screateName;
        this.detailInsrtData.screateDept = data.screateDept;
        this.detailInsrtData.screateDeptid = data.screateDeptid;
        this.detailInsrtData.iis1 = "0";
        this.detailInsrtData.iisOpen = "0";
        // console.log("===========================>>>新增子组件展示!!!---" + JSON.stringify(this.detailData))
        // console.log("==========================>>>新增子组件展示22222!!!----" + JSON.stringify(data))
        let detailedInst = {
          s_table: data.stable,
          i_table_id: data.itableId,
          s_create_name: data.screateName,
          s_create_by: data.screateBy,
          s_create_dept: data.screateDept,
          s_create_deptid: data.screateDeptid
        };

        // console.log("===========================>>>新增子组件展示-----参数!!!---" + JSON.stringify(detailedInst))
        if (this.cmd == 1) {
          var addurl = "/oadatafetailedinst/oaDatadetailedInst/adddatadetailedInst";
          postAction(addurl, detailedInst).then(res => {
            this.detailiid = res.result;
            // console.log("===========================>>>新增子组件展示-----明细iD----!!!---" + JSON.stringify(this.detailiid))

            this.getOaFiles(this.tableName, this.detailiid);
            this.visible = true;
          })
        }
      },

      //列表对象展示
      showDrawerList(data, cmd) {
        this.cmd = cmd;
        // this.detailData.cmd = data.cmd;
        // this.detailInsrtData.iid = data.iid;
        this.dListiid = data.iid;
        this.detailInsrtData.stable = data.stable;
        this.detailInsrtData.itableId = data.itableId;
        this.detailInsrtData.sopinion = data.sopinion;
        this.detailInsrtData.screateBy = data.screateBy;
        this.detailInsrtData.screateName = data.screateName;
        this.detailInsrtData.screateDept = data.screateDept;
        this.detailInsrtData.screateDeptid = data.screateDeptid;
        this.detailInsrtData.iis1 = String(data.iis1);
        this.detailInsrtData.iis2 = data.iis2;
        this.detailInsrtData.iisOpen = String(data.iisOpen);
        // console.log("==========================>>>编辑进子组件!!!~~~~~~" + JSON.stringify(this.detailInsrtData))
        // console.log("==========================>>>编辑进子组件!!!~~~~~~" + JSON.stringify(data))
        this.getOaFiles(this.tableName, this.dListiid);
        this.visible = true;
      },

      onClose1() {
        // console.log("8888888888888")
        this.changevisible();
      },

      onClose2() {
        // console.log("999999999")
        // this.changevisible();
        this.visible = false
      },

      //确定更新数据
      updataDInst() {
        // console.log("999999999", this.detailiid)
        let detailedInst = {
          i_id: this.detailiid,
          s_table: this.detailInsrtData.stable,
          i_table_id: this.detailInsrtData.itableId,
          s_opinion: this.detailInsrtData.sopinion,
          i_is_open: this.detailInsrtData.iisOpen,
          i_is_1: this.detailInsrtData.iis1,
          s_create_name: this.detailInsrtData.screateName,
          s_create_by: this.detailInsrtData.screateBy,
          s_create_dept: this.detailInsrtData.screateDept,
          s_create_deptid: this.detailInsrtData.screateDeptid,
          cmd: this.cmd
        };
        let detailedInstList = {
          i_id: this.dListiid,
          s_table: this.detailInsrtData.stable,
          i_table_id: this.detailInsrtData.itableId,
          s_opinion: this.detailInsrtData.sopinion,
          i_is_open: this.detailInsrtData.iisOpen,
          i_is_1: this.detailInsrtData.iis1,
          s_create_name: this.detailInsrtData.screateName,
          s_create_by: this.detailInsrtData.screateBy,
          s_create_dept: this.detailInsrtData.screateDept,
          s_create_deptid: this.detailInsrtData.screateDeptid,
          cmd: this.cmd
        };
        // console.log("================================>>>确定更新数据----确定按钮-----" + JSON.stringify(detailedInst))
        var updataurl = "/oadatafetailedinst/oaDatadetailedInst/updatadetailedInst";
        if (this.cmd == 1) {
          postAction(updataurl, detailedInst).then(res => {
            if (res.success) {
              this.$message.success("新建办理成功");
              this.$emit('refresh');
            } else {
              this.$message.warning("新建办理失败")
            }
          })
        } else if (this.cmd == 2) {
          postAction(updataurl, detailedInstList).then(res => {
            if (res.success) {
              this.$message.success("更新办理成功");
              this.$emit('refresh');
            } else {
              this.$message.warning("更新办理失败")
            }
          })
        }
        this.changevisible();
        this.visible = false
      },
      //删除按钮
      deleteDataInst() {
        var updataurl = "/oadatafetailedinst/oaDatadetailedInst/deteledetailedInst";
        getAction(updataurl, {iId: this.dListiid}).then(res => {
          if (res.success) {
            this.$message.success("删除办理成功");
            this.$emit('refresh');
            this.visible = false
          } else {
            this.$message.warning("删除办理失败")
          }
        })
      },

      //引入附件
      fujian() {
        let param = {};
        param.table = this.tableName,
          param.i_id = this.detailiid,
          this.$refs.banwenForm.show(param);
        this.$refs.banwenForm.title = "引入附件";
        this.$refs.banwenForm.disableSubmit = false;
      },
      //更新临时数据
      upDataDetailStats(num) {
        var updataStatsurl = "/oadatafetailedinst/oaDatadetailedInst/updataDetailedIsStats";
        getAction(updataStatsurl, {iId: this.detailiid, num: num}).then(res => {
          if (res.success) {
            // this.$message.success("");
          } else {
            // this.$message.warning("")
          }
        })
      },

      getiIs1(num) {
        this.detailInsrtData.iis1 = num;
      },

      getiIsOpen(num) {
        this.detailInsrtData.iisOpen =num;
      },

      changevisible() {
        if (this.oaFileList.length <= 0) {
          let num = 0;
          this.upDataDetailStats(num);
        } else {
          let num = 1;
          this.upDataDetailStats(num);
        }
        this.visible = false;
      },

      //**************************************************附件

      showSub() {
        let table = this.tableName;
        let id=this.detailiid;
        if (this.cmd==2){
          id=this.dListiid;
        }
        // console.log("===========================>>>!!!!附件" + JSON.stringify(this.detailiid))
        // console.log("--------------->>确定")
        this.getOaFiles(table, id)
      },

      //附件-修改附件名称
      updateFileName(item) {
        this.$refs.updateFileNameModal.show(item);
      },
      //刷新附件列表
      reloadAfterUpdate() {
        let id=this.detailiid;
        if (this.cmd==2){
          id=this.dListiid;
        }
        this.getOaFiles(this.tableName, id);
      },

      //附件-删除
      deleteFilesBtn(data, type) {
        let param = {}; //删除文件参数
        param.i_id = data.iid;
        param.table = 'oa_file';
        postAction('/oaBus/dynamic/delete', param).then(res => {
          if (type == 4) {
            let id=this.detailiid;
            if (this.cmd==2){
              id=this.dListiid;
            }
            this.getOaFiles(this.tableName, id);
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
            let id=this.detailiid;
            if (this.cmd==2){
              id=this.dListiid;
            }
            this.getOaFiles(this.tableName, id);
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
              let id=this.detailiid;
              if (this.cmd==2){
                id=this.dListiid;
              }
              this.getOaFiles(this.tableName, id);
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
                          window.open("/ntko/xpeditindex.html?cmd=" + +index + "&fileId=" + item.iid + "&password=" + this.password
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
                    } else {
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
              let id=this.detailiid;
              if (this.cmd==2){
                id=this.dListiid;
              }
              this.getOaFiles(this.tableName, id);
            })
          }
        }
      },
    },
  };
</script>

<style scoped>
  .delCss {
    width: 23.3%
  }
</style>
