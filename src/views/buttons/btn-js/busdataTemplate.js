/**
 * 业务页面公共模板js
 */
//import {filterObj} from '@/utils/util';
import {deleteAction, downFile, getAction, postAction} from '@/api/manage'
import {ACCESS_TOKEN} from "@/store/mutation-types"
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import {ntkoBrowser} from './ntkobackground.min.js'


export const busdataTemplate = {
  inject: ['reload'],
  data() {
    return {
      i_important: true,
      url: {
        queryOaFileList: "/oaBus/oaFile/queryOaFileList",
        queryBanWenList: "/oaBus/oaFile/queryBanWenList",
        insert: '/oaBus/dynamic/insert',//动态插入数据
        updateBusdata: '/oaBus/dynamic/update', //动态修改数据
        updateBusdataNoCheck: '/oaBus/dynamic/updateNoCheck', //动态修改数据,不开启流程
        getDictByKey: '/sys/dict/getDictItems/',
        downloadFiles: '/oaBus/oaFile/downloadZipFile', //下载附件
      }
    }
  },
  created() {

  },
  computed:{
    confirmUser(){
      return this.$store.state.confimePaiBan ;
    }
  },
  watch:{
    confirmUser(newVal,oldVal){
      console.log(newVal)
      this.backData.s_varchar1 = this.backData.s_create_name ;
      this.backData.s_varchar2 = this.$store.state.confimePaiBan.currentUsername ;
    }
  },
  methods: {

    //附件-修改附件名称
    updateFileName(item) {
      this.$refs.updateFileNameModal.show(item);
    },

    //附件-删除
    deleteFilesBtn(data, type) {
      let param = {}; //删除文件参数
      param.i_id = data.iid;
      param.table = 'oa_file';
      let isFile = {};   //是否有附件参数
      isFile.table = this.backDataRef.table;
      isFile.i_id = this.backDataRef.i_id;
      isFile.i_is_file = '0';
      if (type == 4) {
        if (this.oaFileList.length == 1 && this.banWenFileList.length == 0) {
          this.deleteFile(param, type);
          //是否有附件状态修改 1 是 0 否
          postAction('/oaBus/dynamic/updateData', isFile).then(res => {
          })
        } else {
          this.deleteFile(param, type);
        }
      }
      if (type == 6) {
        if (this.banWenFileList.length == 1 && this.oaFileList.length == 0) {
          this.deleteFile(param, type);
          //是否有附件状态修改 1 是 0 否
          postAction('/oaBus/dynamic/updateData', isFile).then(res => {
          })
        } else {
          this.deleteFile(param, type);
        }
      }
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
            this.getOaFiles(this.backData.table, this.backData.i_id);
          })
        }
        if (type == 6) {
          let param = {};
          param.id1 = item.iid;
          param.iorder1 = item.iorder;
          param.id2 = this.banWenFileList[index - 1].iid;
          param.iorder2 = this.banWenFileList[index - 1].iorder;
          postAction("/oaBus/oaFile/sortFile", param).then(res => {
            this.getBanWenFiles(this.backData.table, this.backData.i_id);
          })
        }

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
            this.getOaFiles(this.backData.table, this.backData.i_id);
          })
        }
      }
      if (type == 6) {
        if (index < this.banWenFileList.length - 1) {
          let param = {};
          param.id1 = item.iid;
          param.iorder1 = item.iorder;
          param.id2 = this.banWenFileList[index + 1].iid;
          param.iorder2 = this.banWenFileList[index + 1].iorder;
          postAction("/oaBus/oaFile/sortFile", param).then(res => {
            this.getBanWenFiles(this.backData.table, this.backData.i_id);
          })
        }
      }

    },

    //刷新附件列表
    reloadAfterUpdate() {
      this.getOaFiles(this.backData.table, this.backData.i_id);
      this.getBanWenFiles(this.backData.table, this.backData.i_id)
    },

    //公共调用-删除附件
    deleteFile(param, type) {
      //参数：1.i_id 2.table
      postAction('/oaBus/dynamic/delete', param).then(res => {
        if (type == 4) {
          this.getOaFiles(this.backData.table, this.backData.i_id);
        }
        if (type == 6) {
          this.getBanWenFiles(this.backData.table, this.backData.i_id);
        }
      })
    },

    //关注件--是否重要
    iIsImportant(date) {
      if (this.i_important) {
        this.backData.i_is_important = 1;
      } else {
        this.backData.i_is_important = 0;
      }
      postAction(this.url.updateBusdata, {
        'updateBusdata': this.backData
      }).then(res => {
        if (res.success) {
          if (this.i_important) {
            this.$message.success("设置成功")
          } else {
            this.$message.success("取消成功")
          }
          this.i_important = !this.i_important;
          this.$emit("getBackData", this.backData)
          //this.close();
        } else {
          this.$message.error("设置失败")
        }
      })
    },
    getBackDataNew() {
      return this.backData
    },
    //按钮-销毁
    destory(date) {
      var str = this.backData.s_cur_task_name.substring(0, this.backData.s_cur_task_name.indexOf("-"));
      // console.log(str)
      if (str != "end") {
        this.$message.error("请假未经同意禁止销假！")
        return;
      }
      //保存业务数据
      var time = new Date()
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var day = time.getDay();
      var hour = time.getDate();
      var minute = time.getMinutes();
      var second = time.getSeconds();
      var newTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
      console.log(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
      this.backData.d_datetime3 = newTime;   //设置状态为0
      postAction(this.url.updateBusdata, {
        'updateBusdata': this.backData
      }).then(res => {
        if (res.success) {
          this.$message.success("销假成功")
          this.$emit("getBackData", this.backData)
          //this.close();
        } else {
          this.$message.error("销假失败")
        }
      })
    },

    //数据校验
    checkData() {
      let result = true;
      let checkList = this.optionMap.checkList;
      let regulars = this.optionMap.regulars;
      if (checkList != undefined && checkList.length > 0) {
        for (let i = 0; i < checkList.length; i++) {
          //如果有js校验的话
          if (checkList[i].icheckExpjs != undefined && checkList[i].icheckExpjs != '' && checkList[i].icheckExpjs != null) {
            //let reg = ''
            for (let j = 0; j < regulars.length; j++) {
              if (checkList[i].icheckExpjs == regulars[j].value) {
                let reg = regulars[j].text;
                let inputVa = this.backData[checkList[i].stableColumn]
                if (!(inputVa == undefined)) {
                  if (!eval(reg).test(inputVa)) {
                    //this.$message.error(checkList[i].scolumnName + ":" + checkList[i].scheckShowmsg);
                    // this.$refs[checkList[i].scolumnName].
                    result = false;
                  }
                  break;
                } else {
                  //this.$message.error(checkList[i].scolumnName + ":" + checkList[i].scheckShowmsg);
                  result = false;
                }
              }
            }

          } else if (this.backData[checkList[i].stableColumn] == undefined || this.backData[checkList[i].stableColumn] == '') {
            // console.log(this.backData[checkList[i].stableColumn] + "....");
            if (checkList[i].scheckShowmsg == 'null') {//如果没有设置提示值
              if (checkList[i].scolumnName == '销假日期') {
                continue;
              }
              //   this.$message.error(checkList[i].scolumnName + ":" + "不能为空");
            } else {
              if (checkList[i].scolumnName == '销假日期') {
                continue;
              }
            }
            result = false;
          }
        }
      }
      return result;
    },
    saveNoCheck() {
      this.backData.i_urgency = localStorage.getItem('缓急:' + this.backData.table + this.backData.i_id)
      this.backData.i_urgency = this.backData.i_urgency == null ? 4 : this.backData.i_urgency

      let i_safetylevel = localStorage.getItem('密级:' + this.backData.table + this.backData.i_id)
      this.backData.i_safetylevel = i_safetylevel == null ? 1 : i_safetylevel

      postAction(this.url.updateBusdataNoCheck, this.backData).then(res => {
        if (res.success) {
          this.$message.success("保存成功")
          this.reload();
          this.$emit("getBackData", this.backData)
          //this.close();
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    //按钮-保存
    save(data) {
      let flag = this.nullText();
      if (flag) {
        return;
      }
      //校验发布范围
      if (this.publishData != undefined) {
        this.backData.i_bigint3 = this.publishData.iIsLimits; //发布范围
        if (this.publishData.iIsLimits == 2) {
          this.backData.s_varchar3 = this.publishData.departId;  //部门ids
        }
        if (this.publishData.iIsLimits == 3) {
          this.backData.s_varchar3 = this.publishData.userRealName; //所选用户
          this.backData.s_varchar4 = this.publishData.userIdS.toString();
        }
      }
      /*if (!this.checkData()) {
        return;
      }
*/
      //保存业务数据
      this.backData.i_is_display = "0"   //设置状态为0
      this.backData.i_is_es = 3; //是否已发送全文检索
      this.backData.i_urgency = localStorage.getItem('缓急:' + this.backData.table + this.backData.i_id)
      this.backData.i_urgency = this.backData.i_urgency == null ? 4 : this.backData.i_urgency

      let i_safetylevel = localStorage.getItem('密级:' + this.backData.table + this.backData.i_id)
      this.backData.i_safetylevel = i_safetylevel == null ? 1 : i_safetylevel
      if (this.backData.i_bigint3 == ""){
        this.backData.i_bigint3 = 0;
      }
      //火狐浏览器时间字段（d_datetime1）处理
      var internet = navigator.userAgent;
      if (/firefox/i.test(internet) && this.backData.d_datetime1 !=undefined && this.backData.d_datetime1 !=""){
        this.backData.d_datetime1 = this.backData.d_datetime1[0]+" "+ this.backData.d_datetime1[1].slice(0,8)
      }
      console.log(this.backData);
      postAction(this.url.updateBusdata, {
        'updateBusdata': this.backData
      }).then(res => {
        if (res.success) {
          if (data == true || data == undefined) {
            this.$message.success("保存成功")
          }
          this.reload();
          this.$emit("getBackData", this.backData)
          //this.close();
        } else {
          if (data == true || data == undefined) {
            this.$message.error("保存失败")
          }
        }
      })
    },

    //按钮-登记文号
    saveDocNum(data) {
      this.backData.s_file_num = data.docnum;
      this.backData.s_varchar8 = data.id //文号id
    },
    //按钮-引入公文链接
    saveGongwenData(data) {
      this.backData.s_file_num = data.sfileNum
      this.backData.s_create_dept = data.sdeptName
      this.backData.s_title = data.stitle
      this.backData.d_create_time = data.dcreateTime;
    },
    //按钮-封发日期
    saveDelTime(data) {
      this.backData.d_sealdate = data;
    },
    //获取附件列表
    getOaFiles(tableName, busDataId) {
      getAction(this.url.queryOaFileList,
        {tableName: tableName, busDataId: busDataId, sFileType: 4}).then(res => {
        this.oaFileList = res.result;
      })
    },
    //获取办文依据
    getBanWenFiles(tableName, busDataId) {
      getAction(this.url.queryBanWenList,
        {tableName: tableName, busDataId: busDataId, sFileType: 6}).then(res => {
        this.banWenFileList = res.result;
      })
    },
    //下载所有附件
    downAllFiles() {
      let config = {
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Expose-Headers": "Content-Disposition"
        },
        responseType: 'blob',//必须要写
      };
      this.$http.post(this.url.downloadFiles, this.oaFileList, config).then(res => {//tableSelection参数，我自己的是对象，后台用List接，可以看一downloadFile接口
        let data = res;
        if (this.backData.s_left_parameter == undefined) {
          this.backData.s_left_parameter = ""
        }
        if (this.backData.s_middle_parameter == undefined) {
          this.backData.s_middle_parameter = ""
        }
        if (this.backData.s_right_parameter == undefined) {
          this.backData.s_right_parameter = ""
        }
        let fileName = this.backData.s_left_parameter + this.backData.s_middle_parameter + this.backData.s_right_parameter + '_' + new Date().getTime() + '.zip';
        // console.log(fileName)
        // let contentDisposition ="attachment;filename=Desktop1574646488783.zip"
        // let fileName = contentDisposition.substring(contentDisposition.indexOf('=') + 1);
        let url = window.URL.createObjectURL(new Blob([data]));
        let edik = document.createElement('a');
        edik.style.display = 'none';
        edik.href = url;
        edik.setAttribute('download', fileName);
        document.body.appendChild(edik);
        //点击下载
        edik.click();
        // 释放掉blob对象
        window.URL.revokeObjectURL(edik);
        // 下载完成移除元素
        document.body.removeChild(edik);
      });
    },
    //发送通知
    submit(data) {
      this.$emit("saveInform", data)
    },
    //日期格式化
    dateFormat(date) {
      let date1 = new Date(date);
      let Y = date1.getFullYear();
      let M = date1.getMonth() + 1;
      let D = date1.getDate();
      let newTime = Y + '-' + (M < 10 ? "0" + M : M) + "-" + (D < 10 ? "0" + D : D) + " " + date1.toTimeString().substr(0, 8);
      return newTime;
    },
    //获取下一个月时间
    getNextMonth(date) {
      let time = new Date(date).getTime();
      let lastMonth = time + (60 * 60 * 1000 * 24 * 180); //3个月之后
      let newTime = new Date(lastMonth).toISOString().split(('T')[0]);
      return newTime;
    },
    downFileName(path) {
      // alert(path)
      let url = window._CONFIG['domianURL'] + "/papertitle/oaTemplate/download";
      window.open(url + "/" + path);
    },
    blurText(value, event, label) {

      let checkList = this.optionMap.checkList;

      if (checkList != undefined && checkList.length > 0) {

        if (event.prefixCls == "ant-input") {

          if (value == '' || value == undefined || value == null) {

            event.$el.style.borderColor = 'red';

          } else {

            event.$el.style.borderColor = '#d9d9d9';

          if(label == '标题'){
            let s_title =  value.replace(/，/g, '_');
            this.backData.s_title =  s_title.replace(/,/g, '_');
          }

          }

        } else if (event.prefixCls == "ant-select") {

          if (value == '' || value == undefined || value == null) {

            event.$el.childNodes[0].style.borderColor = 'red';

          } else {

            event.$el.childNodes[0].style.borderColor = '#d9d9d9';

          }

        } else if (event.prefixCls == "ant-calendar") {

          if (value.length == 1) {

            if (value == '' || value == undefined || value == null) {

              event.$el.childNodes[0].childNodes[0].style.borderColor = 'red';

            } else {

              event.$el.childNodes[0].childNodes[0].style.borderColor = '#d9d9d9';

            }
          } else if (value.length == 2) {

            if (value[0] == '' || value[1] == '' || value[0] == undefined || value[1] == undefined || value[0] == null || value[1] == null) {

              event.$el.childNodes[0].style.borderColor = 'red';

            } else {

              event.$el.childNodes[0].style.borderColor = '#d9d9d9';

            }
          }
        }
      }
    },
    nullText() {

      let checkList = this.optionMap.checkList;
      let regulars = this.optionMap.regulars;
      let flag = false;
      //let message = "红色区域为必填业务，请录入！";
      if (checkList != undefined && checkList.length > 0) {
        for (let i = 0; i < checkList.length; i++) {
          if (checkList[i].icolumnType == 1 || checkList[i].icolumnType == 3) {    //输入框
            if (this.$refs[this.s_varchar[i]].value == undefined || this.$refs[this.s_varchar[i]].value == '' || this.$refs[this.s_varchar[i]].value == null) {
              this.$refs[this.s_varchar[i]].$el.style.borderColor = 'red';
              //有js校验
              flag = true;
            } else {
              let checkJs = checkList[i].icheckExpjs;
              //如果有值的话，查看一下是否有js校验，有js校验的话，就将校验
              if (checkJs != undefined && checkJs != null && checkJs != "") {
                for (let j = 0; j < regulars.length; j++) {
                  if (checkList[i].icheckExpjs == regulars[j].value) {
                    let reg = regulars[j].text;   //取得js的正则表达式
                    console.log(reg)
                    if (!eval(reg).test(this.$refs[this.s_varchar[i]].value)) {     //判断
                      this.$refs[this.s_varchar[i]].$el.style.borderColor = 'red';
                      //message = checkList[i].scheckShowmsg;
                      flag = true;
                    }
                    break;
                  }
                }

              } else {//没有js校验的话，就将边框颜色变为正常
                this.$refs[this.s_varchar[i]].$el.style.borderColor = '#d9d9d9';
              }
            }
          } else if (checkList[i].icolumnType == 2) {
            if (this.$refs[this.s_varchar[i]].value == '' || this.$refs[this.s_varchar[i]].value == undefined || this.$refs[this.s_varchar[i]].value == null) {
              this.$refs[this.s_varchar[i]].$el.childNodes[0].style.borderColor = 'red';
              flag = true;
            } else {
              this.$refs[this.s_varchar[i]].$el.childNodes[0].style.borderColor = '#d9d9d9';
            }
          }
          /* else if(checkList[i].icolumnType == 3){    //文本框
             if (this.$refs[this.s_varchar[i]].value == '' || this.$refs[this.s_varchar[i]].value == undefined || this.$refs[this.s_varchar[i]].value == null) {
               this.$refs[this.s_varchar[i]].$el.style.borderColor = 'red';
               flag = true;
             }else {
               this.$refs[this.s_varchar[i]].$el.style.borderColor = '#d9d9d9';
             }

           }*/
          else if (checkList[i].icolumnType == 4) {
            if (this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[0].value == '' || this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[0].value == undefined || this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[0].value == null) {
              this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[0].style.borderColor = 'red';
              flag = true;
            } else {
              this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[0].style.borderColor = '#d9d9d9';
            }
          } else if (checkList[i].icolumnType == 5) {
            if (this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[0].value == '' || this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[2].value == '' || this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[0].value == undefined || this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[2].value == undefined || this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[0].value == null || this.$refs[this.s_varchar[i]].$el.childNodes[0].childNodes[2].value == null) {
              this.$refs[this.s_varchar[i]].$el.childNodes[0].style.borderColor = 'red';
              flag = true;
            } else {
              this.$refs[this.s_varchar[i]].$el.childNodes[0].style.borderColor = '#d9d9d9';
            }
          }
        }
        if (flag == true) {
          this.$message.error("请填写正确的数据！！！");
          this.$store.commit('changeCheckDataFlag', false)
        } else {
          this.$store.commit('changeCheckDataFlag', true)
        }
      }
      return flag;
    },
    //附件按钮--提示信息
    fileBtnName(type) {
      var typeName = '';
      if (type == 1) {
        typeName = "编辑文档";
        return typeName;
      }
      if (type == 2) {
        typeName = "修改附件名称";
        return typeName;
      }
      if (type == 3) {
        typeName = "删除";
        return typeName;
      }
      if (type == 4) {
        typeName = "向上";
        return typeName;
      }
      if (type == 5) {
        typeName = "向下";
        return typeName;
      }
    },
    //根据文件后缀控制编辑按钮显示
    isSuffex(fileName) {
      let suffex = fileName.slice(fileName.lastIndexOf(".") + 1);
      if (suffex == 'docx' || suffex == 'doc' || suffex == 'xlsx' || suffex == 'xls' || suffex == 'pptx'
        || suffex == 'ppt' || suffex == 'pdf' || suffex == 'wps') {
        return true;
      } else {
        return false;
      }
    },
    //打开附件
    qiCao1(index, item) {
      let fileName = item.sfilePath.slice(item.sfilePath.lastIndexOf("\\") + 1);
      let suffex = item.sfileName.slice(item.sfileName.lastIndexOf(".") + 1);
      if (suffex == 'docx' || suffex == 'doc' || suffex == 'xlsx' || suffex == 'xls' || suffex == 'pptx'
        || suffex == 'ppt' || suffex == 'pdf' || suffex == 'wps') {
        let param = {};
        param.sFilePath = item.sfilePath;
        postAction('/oaBus/oaFile/singleCopyFile', param).then(res => {
          let ntkoed = ntkoBrowser.ExtensionInstalled();
          if (ntkoed) {
            ntkoBrowser.openWindow(window.location.origin + "/ntko/editindex.html?cmd=" + index + "&fileName=" + fileName);
          } else {
            window.open(window.location.origin + "/ntko/exeindex.html")
          }
          window.ntkoCloseEvent = function () {
          }
        })
      } else {
        this.downFileName(item.sfilePath);
      }
    },
    //编辑附件
    qiCao2(index, item) {
      let param = {};
      param.sFilePath = item.sfilePath;
      postAction('/oaBus/oaFile/singleCopyFile', param).then(res => {
        if (res.success) {
          this.openFile(index, item);
        } else {
          this.$message.error("文件打开失败")
        }
      })
    },
    openFile(cmd, item) {
      let fileName = item.sfilePath.slice(item.sfilePath.lastIndexOf("\\") + 1);

      let ntkoed = ntkoBrowser.ExtensionInstalled();
      if (ntkoed) {
        ntkoBrowser.openWindow(window.location.origin + "/ntko/editindex.html?cmd=" + cmd + "&fileName=" + fileName + "&fileId=" + item.iid
          + "&fileType=" + item.sfileType + "&stable=" + item.stable +
          "&tableid=" + item.itableId);
      } else {
        window.open(window.location.origin + "/ntko/exeindex.html")
      }
      window.ntkoCloseEvent = function () {
      }


    },
  }
}