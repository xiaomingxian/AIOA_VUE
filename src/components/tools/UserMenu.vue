<template>
  <div class="user-wrapper" :class="theme">
    <!--<span class="action">
      <a class="logout_title" target="_blank" href="http://jeecg-boot.mydoc.io">
        <a-icon type="question-circle-o"></a-icon>
      </a>
    </span>-->
    <header-notice class="action"/>
    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
       <!-- <a-avatar class="avatar" size="small" :src="getAvatar()"/>-->
        <span v-if="isDesktop()" style="color: #fff;">欢迎您，{{ nickname() }}</span>
      </span>
      <!--<span>新建任务</span>-->
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <!--<a-menu-item key="0">
          <router-link :to="{ name: 'account-center' }">
            <a-icon type="user"/>
            <span>个人中心</span>
          </router-link>
        </a-menu-item>-->
        <a-menu-item key="1">
          <router-link :to="{ name: 'account-settings-new' }">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3"  @click="systemSetting">
           <a-icon type="tool"/>
           <span>系统设置</span>
        </a-menu-item>
        <a-menu-item key="4" @click="updatePassword">
          <a-icon type="setting"/>
          <span>密码修改</span>
        </a-menu-item>
        <a-menu-item key="5" @click="updateCurrentDepart">
          <a-icon type="cluster"/>
          <span>切换部门</span>
        </a-menu-item>

       <!-- <a-menu-item key="2" disabled>
          <a-icon type="setting"/>
          <span>测试</span>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>-->
      </a-menu>
    </a-dropdown>
    <span class="action">

      <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
       <a class="logout_title" href="javascript:" @click="showNewTaskPage" @mouseenter="showUserFun">
        <a-icon type="code"/>
        <span v-if="isDesktop()">&nbsp;新建任务</span>
      </a>
      </span>

      <a-menu v-if="saveData != ''" slot="overlay" class="user-dropdown-menu-wrapper" style="background: #d6ebff;padding-bottom: 40px;position: absolute;top: 0;right: 0;">

       <a-card style="width: 650px;" title="我的收藏" :headStyle="{background:'#d6ebff',fontWeight:'bolder'}">
          <a-card-grid v-for="(atom,index) in saveData" @click="jumpX(atom)" style="width: 25%;text-align: center;cursor: pointer;"><a-icon :type="atom.icon"></a-icon><p style="padding-top: 14px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{atom.s_name}}</p></a-card-grid>
        </a-card>

      </a-menu>
    </a-dropdown>

    </span>
    <span class="action">
      <a class="logout_title" href="javascript:;" @click="handleLogout">
        <a-icon type="logout"/>
        <span v-if="isDesktop()">&nbsp;退出登录</span>
      </a>
    </span>
    <user-password ref="userPassword"></user-password>
    <depart-select ref="departSelect" :closable="true" title="部门切换"></depart-select>
    <setting-drawer ref="settingDrawer" :closable="true" title="系统设置"></setting-drawer>
    <create-task ref="createTask"></create-task>
    <new-task-modal ref="newTask"></new-task-modal>
  </div>

</template>

<script>
  import HeaderNotice from './HeaderNotice'
  import UserPassword from './UserPassword'
  import SettingDrawer from "@/components/setting/SettingDrawer";
  import DepartSelect from './DepartSelect'
  import { mapActions, mapGetters } from 'vuex'
  import { mixinDevice } from '@/utils/mixin.js'
  import newTaskModal from '@/views/mytask/modules/newTaskModal'
  import {getAction, postAction} from "../../api/manage";


  export default {
    name: "UserMenu",
    mixins: [mixinDevice],
    components: {
      HeaderNotice,
      UserPassword,
      DepartSelect,
      SettingDrawer,
      newTaskModal

    },
    props: {
      theme: {
        type: String,
        required: false,
        default: 'dark'
      }
    },
    data() {
      return {
       saveData: [],
       iconList: [
         {icon:'form'},
         {icon:'pushpin'},
         {icon:'star'},
         {icon:'paper-clip'}
       ],
        num: 0
      }
    },
    methods: {
      ...mapActions(["Logout"]),
      ...mapGetters(["nickname", "avatar","userInfo"]),
      getAvatar(){
        // console.log('url = '+ window._CONFIG['imgDomainURL']+"/"+this.avatar())
        return window._CONFIG['imgDomainURL']+"/"+this.avatar()
      },
      jumpX(atom){
        let param = {
          modelId: atom.i_bus_model_id,
          functionId: atom.i_bus_function_id,
        }
        postAction("/oaBus/oaBusdata/queryNewTaskMsg", param).then(res => {
          if (res.success) {
            window.open(window.location.origin + '/mytask/taskList/Test-detailFile?tableName=' + res.result.tableName + '&busdataId=' + res.result.busdataId + '&status=newtask&navisshow=false')
          } else {
            this.$message.error(res.message)
          }
        });
      },
      handleLogout() {
        const that = this

        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗 ?',
          onOk() {
            return that.Logout({}).then(() => {
                window.location.href="/";
              //window.location.reload()
            }).catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
          },
          onCancel() {
          },
        });
      },
      updatePassword(){
        let username = this.userInfo().username;
        this.$refs.userPassword.show(username)
      },
      showUserFun(){
        getAction("/sys/user/showUserFun",{userId:this.userInfo().id}).then(res =>{
          this.saveData = res.result;
          for(let i = 0;i < this.saveData.length;i++){
            if(i % 4 == 0 && i > 0){
              this.num++;
              if(this.num > 3){
                this.num = 0;
              }
            }
            this.saveData[i] = Object.assign(this.saveData[i],this.iconList[this.num]);
          }
        })
      },
      //新建任务
      showNewTaskPage() {
        // let userId=this.userInfo().id;
        // console.log("------------------222223333"+JSON.stringify(userId));
        this.$refs.newTask.show(this.userInfo().id);
        this.$refs.newTask.title = '新建任务'
      },//详情收藏展示

      updateCurrentDepart(){
        this.$refs.departSelect.show()
      },
      systemSetting(){
        this.$refs.settingDrawer.showDrawer()
      }
    }
  }
</script>

<style scoped>
  .logout_title {
    color: #fff;
    text-decoration: none;
  }

  /deep/.ant-card-head-title{
     border-left: 4px solid #00c6ff;
     line-height: 0;
     padding-left: 10px;
     margin-top: 7px;
  }
</style>