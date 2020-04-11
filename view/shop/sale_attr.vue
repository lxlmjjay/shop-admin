<template>
  <div>
    <div>
      <Button @click="addSaleAttr" type="primary">添加属性</Button>&nbsp;
    </div>
    <br />
    <Card>
      <div>
        <tables ref="tables" editable search-place="top" v-model="tableData" :columns="columns" />
      </div>
    </Card>
    <Modal v-model="isShow" title="操作" width="800px" @on-cancel="cancel" @on-ok="addSubmit">
      属性名称：
      <Input v-model="data.name" placeholder="请输入名称..." style="width: 500px" />
      <br />
    </Modal>
  </div>
</template>
<script>
import Tables from "_c/tables";
import { findSaleAttrs, addSaleAttr } from "@/api/shop/admin";
export default {
  name: "community_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "ID", key: "id" },
        { title: "名称", key: "name" },
        {
          title: "操作",
          key: "handle",
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.data.name = params.row.name;
                      this.data.id = params.row.id;
                      this.isShow = true;
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
      data: {}
    };
  },
  methods: {
    find() {
      this.tableData = [];
      findSaleAttrs()
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            console.log(res.data);
            if (res.data.data != null) {
              this.tableData = res.data.data;
            }
          }
        })
        .catch(err => {});
    },
    cancel() {
      this.data = {};
      this.isShow = false;
    },
    addSaleAttr() {
      this.isShow = true;
    },
    addSubmit() {
      let data = { name: this.data.name };
      if (this.data.id > 0) {
        data.id = this.data.id;
      }
      addSaleAttr(data).then(res => {
        if (res.data.status == "tokenFail") {
          //token 过期 跳login
        } else if (res.data.status == "success") {
          this.find();
          this.$Message.success(res.data.msg);
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    handleSuccess(res, file) {
      //   this.data.imageUrl = window.URL.createObjectURL(file)
    }
  },
  mounted() {
    this.find();
  }
};
</script>

<style>
</style>
