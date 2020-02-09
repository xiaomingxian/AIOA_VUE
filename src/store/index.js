import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
      isHaveSaveBtn:false,
      postDetialLists:[
        // {tableName:'oa_busdata70',busdataId:598},
        // {tableName:'oa_busdata40',busdataId:598},

      ],
      //下一任务校验成功标志 true为校验成功 可以进行下一任务，false：校验没通过，不可以进行下一任务
      checkDataFlag:true
  },
  mutations: {
      hasSaveBtn(e,params){
        this.state.isHaveSaveBtn = params.ishave
      },
      pushNewDetial(e,params){
        this.state.postDetialLists.push({tableName:params.tableName,busdataId:params.busdataId});
      },
      spliceThisArr(e,index){
        this.state.postDetialLists.splice(index,1)
      },
      changeCheckDataFlag(e,bool){
        this.state.checkDataFlag = bool ;
      }
  },
  actions: {

  },
  getters
})
