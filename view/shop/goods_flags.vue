<template>
  <div>
    <Card>
      <div>
        <Button @click="create" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">添加商品认证</Button>
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
    <Modal
      v-model="isShow"
      title="添加商品认证"
      width="800px"
      @on-cancel="cancel"
      ok-text="提交"
      @on-ok="ok"
    >
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
      </Card>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { findGoodsFlag, delGoodsFlag, addGoodsFlag } from "@/api/shop/admin";
export default {
  name: "admin_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "ID", key: "id", sortable: true },
        { title: "名称", key: "name" },
        {
          title: "操作",
          key: "handle",
          options: ["delete"]
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
    find() {
      findGoodsFlag().then(res => {
        console.log(res.data);
        this.tableData = res.data.data;
      });
    },
    create() {
      this.isShow = true;
    },
    ok() {
      let data = {
        name: this.data.name
      };
      addGoodsFlag(data)
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
    cancel() {
      this.data = {};
      this.isShow = false;
    },
    handleDelete(params) {
      let data = { id: params.row.id };
      delGoodsFlag(data)
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
  }
};
</script>

<style>
</style>
