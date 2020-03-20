<template>
  <div>
    <Card>
      <div>
        <Button @click="create" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">添加角色</Button>
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
      </div>
    </Card>
    <Modal v-model="isShow" title="添加角色" width="800px" @on-cancel="cancel" ok-text="提交" @on-ok="ok">
      <Card style="width:auto">
        <div>
          名称：
          <Input
            v-model="data.name"
            :disabled="isEditing"
            placeholder="请输入名称..."
            style="width: 200px"
          />
        </div>
        <br />
        <div>
          权限：
          <Select v-model="data.access" multiple style="width:500px">
            <Option v-for="item in access" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>
      </Card>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { findRoles, findAccess, editAccess, addRole } from "@/api/admin";
export default {
  name: "admin_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "ID", key: "id", sortable: true },
        { title: "名称", key: "name", sortable: true },
        { title: "权限", key: "accessNames", sortable: true },
        {
          title: "操作",
          key: "handle",
          // options: ["delete"],
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  style: {
                    marginRight: "8px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.isShow = true;
                      this.isEditing = true;
                      this.data.name = params.row.name;
                      this.data.access = params.row.accessIds;
                      this.rowId = params.row.id;
                    }
                  }
                },
                "编辑"
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
      access: [],
      rowId: 0,
      isEditing: false
    };
  },
  methods: {
    find() {
      findRoles().then(res => {
        console.log(res.data);
        this.tableData = res.data.data;
      });
    },
    create() {
      this.isEditing = false;
      this.isShow = true;
    },
    editFun() {
      let data = {
        id: this.rowId,
        aids: this.data.access
      };
      editAccess(data)
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
        name: this.data.name,
        aids: this.data.access
      };
      addRole(data)
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
    },
    handleDelete(params) {
      //角色id
      // let data = { id: params.row.id };
      // delGroup(data)
      //   .then(res => {
      //     this.$Message.success(res.data.msg);
      //   })
      //   .catch(function(response) {
      //     console.log(response);
      //     return false;
      //   });
    },
    findAccess() {
      findAccess()
        .then(res => {
          this.access = res.data.data;
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    }
  },
  mounted() {
    this.find();
    this.findAccess();
  }
};
</script>

<style>
</style>
