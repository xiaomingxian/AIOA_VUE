<template>
  <global-layout @dynamicRouterShow="dynamicRouterShow">
    <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect"/>

    <div class="navbox"  v-show="navisshow">
      <a-tabs
        @contextmenu.native="e => onContextmenu(e)"
        v-if="multipage"
        :active-key="activePage"
        class="tab-layout-tabs"
        style="height:52px"
        :hide-add="true"
        type="editable-card"
        @change="changePage"
        @edit="editPage">
        <a-tab-pane :id="page.fullPath" :key="page.fullPath" v-for="page in pageList">
          <span slot="tab" :pagekey="page.fullPath" class="close">{{ page.meta.title }}</span>
        </a-tab-pane>
      </a-tabs>
    </div>


    <div style="margin: 12px 12px 0;">
      <transition name="page-toggle">
        <keep-alive v-if="multipage">
          <router-view/>
        </keep-alive>
        <router-view v-else/>
      </transition>
    </div>
  </global-layout>
</template>

<script>
  import Swiper from 'swiper/js/swiper.min.js'
  import 'swiper/css/swiper.min.css'
  import GlobalLayout from '@/components/page/GlobalLayout'
  import Contextmenu from '@/components/menu/Contextmenu'
  import {mixin, mixinDevice} from '@/utils/mixin.js'
  import {getAction, postAction} from "../../api/manage";

  const indexKey = '/dashboard/analysis'

  export default {
    name: 'TabLayout',
    inject: ['reload'],
    components: {
      GlobalLayout,
      Contextmenu
    },
    mixins: [mixin, mixinDevice],
    data() {
      return {
        navisshow:true,
        pageList: [],
        linkList: [],
        activePage: '',
        menuVisible: false,
        menuItemList: [
          {key: '1', icon: 'arrow-left', text: '关闭左侧'},
          {key: '2', icon: 'arrow-right', text: '关闭右侧'},
          {key: '3', icon: 'close', text: '关闭其它'}
        ],
        fileLists: '',   //获取store 中的值  this.$store.state.postDetialLists
        currtentRouterBusdataId: this.$route.query.busdataId,
        currtentRouterTableName: this.$route.query.tableName,
        currtentRouterName: this.$route.path,   //
        // navState:this.$store.state.navState     // 切换路由  监控不是“跳转测试”时  关闭大详情导航
        navState: true,  // 切换路由  监控不是“跳转测试”时  关闭大详情导航

        url: {
          optionAndBtn: '/oaBus/newTask/optionAndBtn',
          isHaveSaveBtn: '/oaBus/oaBusdata/haveSavePermission'

        }

      }
    },

    computed: {
      multipage() {
        //判断如果是手机模式，自动切换为单页面模式
        if (this.isMobile()) {
          return false
        } else {
          return this.$store.state.app.multipage
        }
      }
    },
    created() {

      if(!this.$route.query.navisshow){
        this.navisshow = true
      }else{
        this.navisshow = false
      }


      this.fileLists = this.$store.state.postDetialLists;
      // console.log(this.currtentRouterName);
      if (this.$route.path != indexKey) {
        this.pageList.push({
          name: 'dashboard-analysis',
          path: indexKey,
          fullPath: indexKey,
          meta: {
            icon: 'dashboard',
            title: '首页'
          }
        })
        this.linkList.push(indexKey)
      }
      this.pageList.push(this.$route)
      this.linkList.push(this.$route.fullPath)
      this.activePage = this.$route.fullPath


    },

    watch: {
      '$route': function (newRoute) {

        // console.log(this.$store.state.postDetialLists);
        // this.fileLists = this.$store.state.postDetialLists
        // 禁止跳转测试nav 按钮显示在到导航栏
        // console.log(newRoute.path.includes('Test-detailFile'));
        // alert(newRoute.path.includes('Test-detailFile'))
        console.log(this.pageList);


        this.navState = newRoute.path.includes('Test-detailFile');


        this.activePage = newRoute.fullPath
        if (!this.multipage) {
          this.linkList = [newRoute.fullPath]
          this.pageList = [Object.assign({}, newRoute)]
        } else if (this.linkList.indexOf(newRoute.fullPath) < 0) {
          this.linkList.push(newRoute.fullPath)
          this.pageList.push(Object.assign({}, newRoute))
        } else if (this.linkList.indexOf(newRoute.fullPath) >= 0) {
          let oldIndex = this.linkList.indexOf(newRoute.fullPath)
          let oldPositionRoute = this.pageList[oldIndex]
          this.pageList.splice(oldIndex, 1, Object.assign({}, newRoute, {meta: oldPositionRoute.meta}))
        }


      },
      'activePage': function (key) {
        let index = this.linkList.lastIndexOf(key)
        let waitRouter = this.pageList[index]
        this.$router.push(Object.assign({}, waitRouter));
      },
      'multipage': function (newVal) {
        if (!newVal) {
          this.linkList = [this.$route.fullPath]
          this.pageList = [this.$route]
        }
      }
    },
    methods: {

      beforeRouteLeave(to) {
        alert(to)
      },

      //打开大详情
      openEachDetialFile(index, tableName, id) {
        // 点击大详情列表  判断是否在大详情本页面
        let postDetialPage = this.$route.path.includes('Test-detailFile');
        if (postDetialPage) {
          //--------------------判断是否需要提醒----------------------
          //判断用户当前大详情是否有保存权限
          getAction(this.url.isHaveSaveBtn, {table: tableName, id: id}).then(res => {
            //返回值为true  时   弹窗提醒   相反则直接跳转不提醒
            // alert(1212)
            if (res.result) {
              this.$confirm({
                title: '请确认数据已保存！',
                onOk: () => {
                  let params = {tableName: tableName, busdataId: id};
                  this.$store.commit('changeDetialLast', params)
                  this.$router.push({path: '/mytask/taskList/Test-detailFile'})
                  this.reload()
                },
              })
            } else {
              let params = {tableName: tableName, busdataId: id};
              this.$store.commit('changeDetialLast', params)
              this.$router.push({path: '/mytask/taskList/Test-detailFile'})
              this.reload()
            }
          })
        } else {
          let params = {tableName: tableName, busdataId: id};
          this.$store.commit('changeDetialLast', params)
          // this.$store.commit('pushNewDetial',params)
          this.$router.push({path: '/mytask/taskList/Test-detailFile'})
          this.reload()
        }


      },

      //删除该业务详情
      cancelThisFile(index) {
        console.log(index);
        this.$store.commit('spliceThisArr', index)
        // console.log(this.$store.state.postDetialLists);
        let postDetialLists = this.$store.state.postDetialLists;
        let lastFile = this.$store.state.postDetialLists.length - 1
        // console.log(postDetialLists);
        // console.log(lastFile);
        // console.log(postDetialLists[lastFile]);
        if (postDetialLists.length == 1) {
          this.reload();
        } else {
          this.$router.push({path: '/mytask/taskList/Test-detailFile', query: postDetialLists[lastFile]})

        }
      },
      changePage(key) {
        this.activePage = key
      },
      editPage(key, action) {
        this[action](key)
      },
      removeQueryParams() {
        console.log('=====>>>>>>>>>>>>清除记录的缓存：：')
        let path = this.$route.path
        let userInfo = localStorage.getItem('userdata');
        if (userInfo == undefined) return
        let user = JSON.parse(userInfo)
        let uid = user.userInfo.id
        //清除记录的缓存
        localStorage.removeItem(uid + path)

      },
      remove(key) {
        if (key == indexKey) {
          this.$message.warning('首页不能关闭!')
          return
        }
        if (this.pageList.length === 1) {
          this.$message.warning('这是最后一页，不能再关闭了啦')
          return
        }
        this.removeQueryParams();

        this.pageList = this.pageList.filter(item => item.fullPath !== key)
        let index = this.linkList.indexOf(key)
        this.linkList = this.linkList.filter(item => item !== key)
        index = index >= this.linkList.length ? this.linkList.length - 1 : index
        this.activePage = this.linkList[index]
      },
      onContextmenu(e) {
        const pagekey = this.getPageKey(e.target)
        if (pagekey !== null) {
          e.preventDefault()
          this.menuVisible = true
        }
      },
      getPageKey(target, depth) {
        depth = depth || 0
        if (depth > 2) {
          return null
        }
        let pageKey = target.getAttribute('pagekey')
        pageKey = pageKey || (target.previousElementSibling ? target.previousElementSibling.getAttribute('pagekey') : null)
        return pageKey || (target.firstElementChild ? this.getPageKey(target.firstElementChild, ++depth) : null)
      },
      onMenuSelect(key, target) {
        let pageKey = this.getPageKey(target)
        switch (key) {
          case '1':
            this.closeLeft(pageKey)
            break
          case '2':
            this.closeRight(pageKey)
            break
          case '3':
            this.closeOthers(pageKey)
            break
          default:
            break
        }
      },
      closeOthers(pageKey) {
        let index = this.linkList.indexOf(pageKey)
        if (pageKey == indexKey) {
          this.linkList = this.linkList.slice(index, index + 1)
          this.pageList = this.pageList.slice(index, index + 1)
          this.activePage = this.linkList[0]
        } else {
          let indexContent = this.pageList.slice(0, 1)[0]
          this.linkList = this.linkList.slice(index, index + 1)
          this.pageList = this.pageList.slice(index, index + 1)
          this.linkList.unshift(indexKey)
          this.pageList.unshift(indexContent)
          this.activePage = this.linkList[1]
        }
      },
      closeLeft(pageKey) {
        if (pageKey == indexKey) {
          return
        }
        let tempList = [...this.pageList]
        let indexContent = tempList.slice(0, 1)[0]
        let index = this.linkList.indexOf(pageKey)
        this.linkList = this.linkList.slice(index)
        this.pageList = this.pageList.slice(index)
        this.linkList.unshift(indexKey)
        this.pageList.unshift(indexContent)
        if (this.linkList.indexOf(this.activePage) < 0) {
          this.activePage = this.linkList[0]
        }
      },
      closeRight(pageKey) {
        let index = this.linkList.indexOf(pageKey)
        this.linkList = this.linkList.slice(0, index + 1)
        this.pageList = this.pageList.slice(0, index + 1)
        if (this.linkList.indexOf(this.activePage < 0)) {
          this.activePage = this.linkList[this.linkList.length - 1]
        }
      },
      //update-begin-author:taoyan date:20190430 for:动态路由title显示配置的菜单title而不是其对应路由的title
      dynamicRouterShow(key, title) {
        let keyIndex = this.linkList.indexOf(key)
        if (keyIndex >= 0) {
          let currRouter = this.pageList[keyIndex]
          let meta = Object.assign({}, currRouter.meta, {title: title})
          this.pageList.splice(keyIndex, 1, Object.assign({}, currRouter, {meta: meta}))
        }
      }
      //update-end-author:taoyan date:20190430 for:动态路由title显示配置的菜单title而不是其对应路由的title
    }
  }
</script>

<style lang="scss" scoped>
  .navbox {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;


  }

  .detailFileItemBox {
    width: 20%;
    height: 50px;
    background: #ffffff;
    display: flex;
    align-items: center;
    /*background: darkcyan;*/
    margin: 0 auto;
    /*overflow-x: scroll;*/

    .itemBox {
      height: 100%;
      line-height: 50px;
      margin-left: 45px;

      .active {
        color: #2eabff;
      }

      .close:hover {
        color: #999999;
        cursor: pointer;
      }

      .text:hover {
        color: #2eabff;
        cursor: pointer;
      }


    }

    .dropdown {
      width: 100%;
      height: 100%;
    }

    /*.navLists{*/
    /*width: 92%;*/
    /*height: 100%;*/
    /*background: darkgoldenrod;*/

    /*.swiper-slide{*/
    /*width: 150px !important;*/
    /*!*background: darkcyan;*!*/
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: space-around;*/

    /*.close:hover{*/
    /*color: #999999;*/
    /*cursor: pointer;*/
    /*}*/
    /*.text:hover{*/
    /*color: #2eabff;*/
    /*cursor: pointer;*/
    /*}*/
    /*}*/
    /*}*/
  }

  /*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

  .page-transition-enter {
    opacity: 0;
  }

  .page-transition-leave-active {
    opacity: 0;
  }

  .page-transition-enter .page-transition-container,
  .page-transition-leave-active .page-transition-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  /*美化弹出Tab样式*/
  .ant-tabs-nav-container {
    margin-top: 4px;
  }

  /* 修改 ant-tabs 样式 */
  .tab-layout-tabs.ant-tabs {
    width: 100%;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    background-color: white;
    padding: 0 20px;

    .ant-tabs-bar {
      margin: 4px 0 0;
      border: none;
    }

  }

  .ant-tabs {

    &.ant-tabs-card .ant-tabs-tab {

      padding: 0 24px !important;
      background-color: white !important;
      margin-right: 10px !important;

      .ant-tabs-close-x {
        width: 12px !important;
        height: 12px !important;
        opacity: 0 !important;
        cursor: pointer !important;
        font-size: 12px !important;
        margin: 0 !important;
        position: absolute;
        top: 36%;
        right: 6px;
      }

      &:hover .ant-tabs-close-x {
        opacity: 1 !important;
      }

    }

  }

  .ant-tabs.ant-tabs-card > .ant-tabs-bar {
    .ant-tabs-tab {
      border: none !important;
      border-bottom: 1px solid transparent !important;
    }

    .ant-tabs-tab-active {
      border-color: #1890ff !important;
    }
  }


</style>