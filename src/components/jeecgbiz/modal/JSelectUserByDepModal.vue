<template>
  <a-modal
    :width="modalWidth"
    :visible="visible"
    :title="title"
    @ok="handleSubmit"
    @cancel="close"
    cancelText="关闭"
    style="margin-top: -30px;"
    wrapClassName="ant-modal-cust-warp"
  >
    <div style="height: 650px;">
        <a-row :gutter="10" style="background-color: #ececec; padding: 10px; margin: -10px">
      <a-col :md="6" :sm="24">
        <a-card :bordered="false">
          <!--组织机构-->
          <div style="height:400px;overflow: auto">
          <a-directory-tree
            selectable
            :selectedKeys="selectedKeys"
            :checkStrictly="true"
            @select="this.onSelect"
            :dropdownStyle="{maxHeight:'100px',overflow:'auto'}"
            :treeData="departTree"
          />
          </div>
        </a-card>
      </a-col>
      <a-col :md="18" :sm="24">
        <a-card :bordered="false">
          用户账号:
          <a-input-search
            :style="{width:'150px',marginBottom:'15px'}"
            placeholder="请输入用户账号"
            v-model="queryParam.username"
            @search="onSearch"
          ></a-input-search>
          <a-button @click="searchReset(1)" style="margin-left: 20px" icon="redo">重置</a-button>
          <!--用户列表-->
          <a-table
            ref="table"
            :scroll="scrollTrigger"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange">
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    </div>
  </a-modal>
</template>

<script>
  import {filterObj} from '@/utils/util'
  import {queryDepartTreeList, getUserList, queryUserByDepId, queryUserRoleMap} from '@/api/api'

  export default {
    inject:['reload'],
    name: 'JSelectUserByDepModal',
    components: {},
    props: ['modalWidth','userIdLists'],
    data() {
      return {
        queryParam: {
          username: "",
        },
        columns: [
          {
            title: '用户账号',
            align: 'center',
            dataIndex: 'username'
          },
          {
            title: '真实姓名',
            align: 'center',
            dataIndex: 'realname'
          },
          {
            title: '角色名称',
            align: 'center',
            dataIndex: 'roleName'
          },
          {
            title: '性别',
            align: 'center',
            dataIndex: 'sex',
            customRender: function (text) {
              if (text === 1) {
                return '男'
              } else if (text === 2) {
                return '女'
              } else {
                return text
              }
            }
          },
          {
            title: '手机号码',
            align: 'center',
            dataIndex: 'phone'
          },
          {
            title: '邮箱',
            align: 'center',
            dataIndex: 'email'
          }
        ],
        scrollTrigger: {},
        dataSource: [],
        selectedKeys: [],
        userNameArr: [],

        chooseUserId: [],

        departName: '',
        userRolesMap: {},
        title: '根据部门选择用户',
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
        selectedRowKeys: [],
        selectedRows: [],
        departTree: [],
        visible: false,
        form: this.$form.createForm(this)
      }
    },
    created() {

      // console.log(this.userIdLists);
      //
      // this.userIdLists =this.selectedRowKeys;
      // 该方法触发屏幕自适应
      this.resetScreenSize();
      this.queryUserRoleMap();
    },
    methods: {
      letMeClear(){
        // this.selectedRowKeys = [];
        // this.selectedRows= [],
        //   this.departTree= [],
        // console.log(this.selectedRowKeys );console.log(this.selectedRows );
        // this.ipagination.current = 1;
        // alert(2222)

        this.reload()
      },
      loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams();//查询条件
        getUserList(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.assignRoleName(this.dataSource);
            this.ipagination.total = res.result.total;
          }
        })
      },
      queryUserRoleMap() {
        queryUserRoleMap().then((res) => {
          if (res.success) {
            this.userRolesMap = res.result;
            this.loadData();
          }
        })
      },
      // 触发屏幕自适应
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 500) {
          this.scrollTrigger = {x: 800};
        } else {
          this.scrollTrigger = {};
        }
      },
      showModal(useridlists) {
         console.log(useridlists);
        if( useridlists !==undefined){
          useridlists.map((item)=>{
            // console.log(item.toString());
            this.selectedRowKeys.push(item.toString())
          })
        }
        // this.selectedRowKeys =['2','3'];
        console.log(this.selectedRowKeys );
        this.visible = true;
        this.assignRoleName(this.dataSource);
        this.queryDepartTree();
        this.form.resetFields();
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      getQueryField() {
        let str = 'id,';
        for (let a = 0; a < this.columns.length; a++) {
          str += ',' + this.columns[a].dataIndex;
        }
        return str;
      },
      searchReset(num) {
        let that = this;
        if (num !== 0) {
          that.queryParam = {};
          that.loadData(1);
        }
        that.selectedRowKeys = [];
        that.userNameArr = [];
        that.selectedKeys = [];
      },
      close() {
        // this.searchReset(0);
        this.selectedRowKeys = [];
        this.visible = false;
      },
      handleTableChange(pagination, filters, sorter) {
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc';
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handleSubmit() {
        this.chooseUserId = [];
        this.chooseUserName = [];
        let that = this;
        for (let i = 0, len = this.selectedRowKeys.length; i < len; i++) {
         // this.getUserNames(this.selectedRowKeys[i]);
          //获取选中的用户id
          this.chooseUserId.push(this.selectedRowKeys[i]);
        }
        for (let i = 0, len = this.selectionRows.length; i < len; i++) {
          //获取选中的用户名字
          this.chooseUserName.push(this.selectionRows[i].realname);
        }
        that.$emit('ok', that.userNameArr.join(','));
        that.$emit('getUserId', this.chooseUserId);
        that.$emit('getUserName', this.chooseUserName);

        that.close();
        return this.chooseUserId;

      },
      // 遍历匹配,获取用户真实姓名
      getUserNames(rowId) {
        let dataSource = this.dataSource;
        for (let i = 0, len = dataSource.length; i < len; i++) {
          if (rowId === dataSource[i].id) {
            this.userNameArr.push(dataSource[i].realname);

          }
        }

      },
      // 点击树节点,筛选出对应的用户
      onSelect(selectedKeys) {
        if (selectedKeys[0] != null) {
          this.queryUserByDepId(selectedKeys); // 调用方法根据选选择的id查询用户信息
          if (this.selectedKeys[0] !== selectedKeys[0]) {
            this.selectedKeys = [selectedKeys[0]];
          }
        }
      },
      onSelectChange(selectedRowKeys, selectionRows) {

        console.log(selectedRowKeys);
        console.log(selectionRows);
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      onSearch() {
        this.loadData(1);
      },
      // 根据选择的id来查询用户信息
      queryUserByDepId(selectedKeys) {
        queryUserByDepId({id: selectedKeys.toString()}).then((res) => {
          if (res.success) {
            this.dataSource = res.result;
            this.ipagination.total = res.result.length;
            this.assignRoleName(this.dataSource);
          }
        })
      },
      // 传入用户id,找到匹配的角色名称
      queryUserRole(userId) {
        let map = this.userRolesMap;
        let roleName = [];
        for (var key in map) {
          if (userId === key) {
            roleName.push(map[key]);
          }
        }
        return roleName.join(',');
      },
      queryDepartTree() {
        queryDepartTreeList().then((res) => {
          if (res.success) {
            this.departTree = res.result;
          }
        })
      },
      // 为角色名称赋值
      assignRoleName(data) {
        let userId = '';
        let role = '';
        for (let i = 0, length = data.length; i < length; i++) {
          userId = this.dataSource[i].id;
          role = this.queryUserRole(userId);
          this.dataSource[i].roleName = role;
        }
      },
      modalFormOk() {
        this.loadData();
      }
    }
  }
</script>

<style scoped>
  .ant-table-tbody .ant-table-row td {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }
</style>