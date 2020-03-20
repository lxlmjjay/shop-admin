<template>
  <div>
    <Card>
      <div>
        <Button @click="create" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">添加管理员</Button>
      </div>
      <div>
        <tables
          ref="tables"
          editable
          search-place="top"
          v-model="tableData"
          :columns="columns"
          @on-delete="handleDelete"
        />
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </Card>
    <Modal
      v-model="isShow"
      title="添加管理员"
      width="800px"
      @on-cancel="cancel"
      ok-text="提交"
      @on-ok="ok"
    >
      <Card style="width:auto">
        <div>
          名称：
          <Input
            v-model="data.username"
            :disabled="isEditing"
            placeholder="请输入名称..."
            style="width: 200px"
          />
        </div>
        <br />
        <div v-if="!isEditing">
          密码：
          <Input
            v-model="data.password"
            type="password"
            password
            placeholder="密码不小于6位..."
            style="width: 200px"
          />
        </div>
        <br />
        <div>
          角色：
          <Select v-model="data.category" multiple style="width:200px">
            <Option v-for="item in category" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>
      </Card>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  findAdmin,
  findRoles,
  editAdmin,
  addAdmin,
  activateAdmin
} from "@/api/admin";
export default {
  name: "admin_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "ID", key: "id", sortable: true },
        { title: "名称", key: "username" },
        { title: "角色", key: "roleNames" },
        {
          title: "状态",
          key: "status",
          render: (h, params, vm) => {
            return h("div", {}, params.row.status == 1 ? "启用" : "禁用");
          }
        },
        {
          title: "操作",
          key: "handle",
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  style: {
                    cursor: "pointer",
                    marginRight: "5px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.isShow = true;
                      this.isEditing = true;
                      this.data.username = params.row.username;
                      this.data.category = params.row.roleIds;
                      this.rowId = params.row.id;
                    }
                  }
                },
                "修改角色"
              );
            },
            (h, params, vm) => {
              return h(
                "Button",
                {
                  style: {
                    cursor: "pointer",
                    marginRight: "5px"
                  },
                  props: {
                    type: params.row.status == 1 ? "error" : "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      let data = {
                        id: params.row.id,
                        status: params.row.status ? 0 : 1
                      };
                      activateAdmin(data)
                        .then(res => {
                          if (res.data.status == "tokenFail") {
                            //token 过期 跳login
                          } else if (res.data.status == "success") {
                            params.row.status = !params.row.status;
                            this.$Message.success(res.data.msg);
                          }
                        })
                        .catch(err => {});
                    }
                  }
                },
                params.row.status == 1 ? "禁用" : "启用"
              );
            }
          ]
        }
      ],
      tableData: [],
      isShow: false,
      total: 0,
      currentPage: 1,
      data: {},
      category: [],
      isEditing: false,
      rowId: 0
    };
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
      this.find(page);
    },
    findc() {
      findRoles().then(res => {
        console.log(res.data);
        this.category = res.data.data;
      });
    },
    find() {
      let data = {
        page: this.currentPage
      };
      findAdmin(data).then(res => {
        console.log(res.data);
        this.total = res.data.total;
        this.tableData = res.data.data;
      });
    },
    create() {
      this.isShow = true;
    },
    editFun() {
      let data = {
        id: this.rowId,
        roleIds: this.data.category
      };
      editAdmin(data)
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            this.$Message.success(res.data.msg);
            this.find();
          }
        })
        .catch(err => {});
      this.isEditing = false;
    },
    createFun() {
      let data = {
        username: this.data.username,
        password: this.data.password,
        roleIds: this.data.category
      };
      addAdmin(data)
        .then(res => {
          this.find();
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
      console.log(data);
    },
    ok() {
      if (this.isEditing) {
        this.editFun();
      } else {
        this.isEditing = false;
        this.createFun();
      }
    },

    cancel() {
      this.data = {};
      this.isShow = false;
      this.isEditing = false;
    },
    handleDelete(params) {
      let data = { id: params.row.id };
      delGroup(data)
        .then(res => {
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    }
  },
  mounted() {
    this.find(1);
    this.findc();
  }
};
</script>

<style>
</style>
