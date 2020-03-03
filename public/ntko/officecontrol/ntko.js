var urlContextPath = "/AIOA";//个人ip端口配置
var ntko = document.getElementById("TANGER_OCX");

function insertFromUrl(FileURL) {
  ntko.Activedocument.Application.Selection.Goto(-1, 0, 0, "zw1");//光标移动到书签
  ntko.addtemplatefromurl(FileURL);//在光标位置插入红头文档
}

//获取控件打开文档类型
function getDocType() {
  var doctype = ntko.DocType;
  switch (doctype) {
    case 1:
      fileType = "word";
      fileTypeSimple = "wrod";
      break;
    case 2:
      fileType = "Excel.Sheet";
      fileTypeSimple = "excel";
      break;
    case 3:
      fileType = "PowerPoint.Show";
      fileTypeSimple = "ppt";
      break;
    case 4:
      fileType = "Visio.Drawing";
      break;
    case 5:
      fileType = "MSProject.Project";
      break;
    case 6:
      fileType = "WPS Doc";
      fileTypeSimple = "wps";
      break;
    case 7:
      fileType = "Kingsoft Sheet";
      fileTypeSimple = "et";
      break;
    default :
      fileType = "unkownfiletype";
      fileTypeSimple = "unkownfiletype";
  }
}

//设置文件打开或者关闭
function setFileOpenedOrClosed(boolevalue) {
  IsFileOpened = boolevalue;
  fileType = ntko.DocType;
}

//获取控件对象，打开服务器上的文档
function intializePage(fileUrl) {
  Ntko_OpenDoc(fileUrl)
}

//打开服务器上的文档
function Ntko_OpenDoc(fileUrl) {
  ntko.BeginOpenFromURL(fileUrl);
}

//关闭页面保存
function onPageClose(cmd, stable, tableid, fileId,orgSchema) {
  if (!ntko.activeDocument.saved) {
    if (confirm("文档修改过,还没有保存,是否需要保存?")) {
      if (cmd == 1 || cmd == 2 || cmd == 7) {
        saveFileToUrl(cmd, stable, tableid,orgSchema);
      }
      //编辑底稿..4//校核正文..6
      if (cmd == 4 || cmd == 6 || cmd == 10 || cmd ==11) {
        saveOldFileToUrl(cmd, stable, tableid, fileId,orgSchema)
      }
    }
  } else {
    // alert("不保存");
  }
}

function saveOldFileToUrl(cmd, stable, tableid, fileId,orgSchema) {
  var fileType = "";
  var action = "";
  if (cmd == 4) {
    fileType = "1"
  }
  if (cmd == 6) {
    fileType = "2"
  }
  if (cmd == 4 || cmd == 6) {
    action = urlContextPath + "/ntko/filentko/edit?" + "stable=" + stable + "&tableid=" + tableid
                            + "&fileType=" + fileType+"&orgSchema="+orgSchema;
  } else if (cmd == 10 ) {
    action = urlContextPath + "/ntko/filentko/editFile?" + "fileId=" + fileId+"&orgSchema="+orgSchema;
  }else if (cmd ==11) {
    fileType="2";
    action = urlContextPath + "/ntko/filentko/editFile?" + "fileId=" + fileId  + "&fileType=" + fileType
                            +"&orgSchema="+orgSchema;
  }
  ntko.SaveToURL(action, "file");
}

//保存文件到服务器路径
function saveFileToUrl(cmd, stable, tableid,orgSchema) {
  var fileType = "";
  var action = "";
  if (cmd == 1) {
    fileType = "1"
  }
  if (cmd == 2) {
    fileType = "2"
  }
  if (cmd == 7) {
    fileType = "3"
  }
  if (cmd == 1 || cmd == 2 || cmd == 7) {
    action = urlContextPath + "/ntko/filentko/upload?" + "stable=" + stable + "&tableid=" + tableid
                            + "&fileType=" + fileType+"&orgSchema="+orgSchema;
  }
  ntko.SaveToURL(action, "file");
}

//获取文档格式
function getFileType() {
  // alert("进入文件类型中")
  var fileType = "";
  if (IsFileOpened) {
    switch (ntko.DocType) {
      case 0:
        fileType = "沒有文檔";
        break;
      case 1:
        fileType = "word";
        break;
      case 2:
        fileType = "Excel.Sheet";
        break;
      case 3:
        fileType = "PowerPoint.Show";
        break;
      case 4:
        fileType = "Visio.Drawing";
        break;
      case 5:
        fileType = "MSProject.Project";
        break;
      case 6:
        fileType = "WPS Doc";
        break;
      case 7:
        fileType = "Kingsoft Sheet";
        break;
      default :
        fileType = "unkownfiletype";
    }
  }
}

// 文件是否只读可编辑
function setReadOnly(boolevalue) {
  ntko.SetReadOnly(boolevalue);
}

// 设置是否显示修订痕迹
function setShowRevisions(boolevalue) {
  ntko.ActiveDocument.ShowRevisions = boolevalue;
}

// 设置文档进入或者退出痕迹保留状态
function setReviewMode(boolvalue) {
  ntko.ActiveDocument.TrackRevisions = boolvalue;
}

// 是否允许打印
function setFilePrint(boolvalue) {
  ntko.fileprint = boolvalue;
}

// 是否允许打印预览
function setFilePrintPreview(boolvalue) {
  ntko.FilePrintPreview = boolvalue;
}

//是否运行另存
function setFileSaveAs(boolvalue) {
  ntko.FileSaveAs = boolvalue;
}

//是否允许保存
function setFileSave(boolvalue) {
  ntko.FileSave = boolvalue;
}

//是否允许新建
function setFileNew(boolvalue) {
  ntko.FileNew = boolvalue;
}

//是否禁止拷贝
function setIsNoCopy(boolvalue) {
  ntko.IsStrictNoCopy = boolvalue;
}

//是否允许文件菜单的关闭项
function setFileOpen(boolvalue) {
  ntko.FileOpen = boolvalue;
}

//是否允许文件菜单的关闭项
function setFileClose(boolvalue) {
  ntko.FileClose = boolvalue;
}

function trim(str) {
  // 删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

function getBookMarkValue(BookName) {
  ntko.GetBookmarkValue(BookName);
}

function setBookmarkValue(BookName, value) {
  ntko.SetBookmarkValue(BookName, value)
}

function CurentTime() {
  var now = new Date();
  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var day = now.getDate();            //日
  var hh = now.getHours();            //时
  var mm = now.getMinutes();          //分
  var ss = now.getSeconds();          //分
  var clock = year + "-";
  if (month < 10)
    clock += "0";
  clock += month + "-";
  if (day < 10)
    clock += "0";
  clock += day + " ";
  if (hh < 10)
    clock += "0";
  clock += hh + ":";
  if (mm < 10) clock += '0';
  clock += mm + ":";
  if (ss < 10) clock += '0';
  clock += ss;
  return (clock);
}