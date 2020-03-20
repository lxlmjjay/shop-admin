<template>
  <div>
    <Card>
      <div>
        <Button @click="create" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">添加平台属性</Button>
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
      <div style="margin-top:20px;float:right;margin-right:20px;">
        <Page :total="total" show-elevator :current="1" @on-change="changePage" />
      </div>
    </Card>
    <Modal v-model="isShow" title="添加平台属性" width="800px" ok-text="提交" @on-ok="submit">
      <Card style="width:auto">
        <div>
          商品分类：
          <Cascader :data="category" v-model="data.cPath" style="width: 200px"></Cascader>
        </div>
        <br />
        <div>
          属性名称：
          <br />
          <Input v-model="data.name" style="width: 200px" />
        </div>
        <br />
      </Card>
    </Modal>
    <Modal v-model="isShowVal" title="属性值" width="800px" ok-text="提交" @on-ok="editAttrVal">
      <Card style="width:auto">
        <br />属性值：
        <div v-for="(item, k) in attrValue" :key="item.id" :value="item.id">
          <Input v-model="item.value" disabled style="width: 200px" />&nbsp;
          <Button @click="delValConfirm(k, item.id)" size="small" type="error">删除</Button>
          <br />
          <br />
        </div>
      </Card>
    </Modal>
    <Modal v-model="isShowValName" title="添加属性值" width="800px" ok-text="提交" @on-ok="addVal">
      <Card style="width:auto">
        <div>
          属性值名称：
          <br />
          <Input v-model="data.valName" style="width: 200px" />
        </div>
        <br />
      </Card>
    </Modal>
    <Modal v-model="isShowConfirm" title="提交确认" confirm @on-ok="delVal">
      <div>
        <!-- 图片剪裁 -->
        <h3>删除后商品关联的属性值将一起删除，确认删除吗？</h3>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  findGoodsCategory2,
  findBaseAttr,
  editBaseAttr,
  addBaseAttr,
  getBaseAttr,
  addBaseAttrVal,
  editBaseAttrVal,
  delBaseAttrVal,
  delBaseAttr
} from "@/api/shop/admin";
export default {
  name: "admin_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "ID", key: "id", width: 200 },
        {
          title: "商品分类",
          key: "cPath",
          render: (h, params) => {
            return h("Cascader", {
              props: {
                disabled: true,
                data: this.category,
                value: params.row.cPath
              },
              on: {}
            });
          }
        },
        { title: "属性名称", key: "name" },
        {
          title: "操作",
          key: "handle",
          options: ["delete"],
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  style: {
                    marginLeft: "8px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.getVal(params);
                      this.params = params;
                      this.isShowVal = true;
                    }
                  }
                },
                "属性值"
              );
            },
            (h, params, vm) => {
              return h(
                "Button",
                {
                  style: {
                    marginLeft: "8px"
                  },
                  props: {
                    type: "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.params = params;
                      this.isShowValName = true;
                    }
                  }
                },
                "添加属性值"
              );
            }
          ]
        }
      ],
      category: [],
      tableData: [],
      isShow: false,
      isShowVal: false,
      isShowValName: false,
      isShowConfirm: false,
      total: 0,
      currentPage: 1,
      data: {},
      rowId: 0,
      params: {},
      attrValue: [],
      delData: { k: 0, id: 0 }
    };
  },
  methods: {
    find(data) {
      //平台属性
      findBaseAttr(data)
        .then(res => {
          if (res.data.status == "success") {
            this.tableData = res.data.data;
          }
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    findC() {
      // 分类
      findGoodsCategory2()
        .then(res => {
          console.log(333, res.data);
          if (res.data.status == "success") {
            this.category = res.data.data;
          }
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    create() {
      this.data.name = "";
      this.isShow = true;
    },
    changePage(page) {
      let data = { page: page };
      this.currentPage = page;
      this.find(data);
    },
    getVal(params) {
      let data = { id: params.row.id };
      getBaseAttr(data)
        .then(res => {
          this.attrValue = res.data.data;
          console.log(333, res.data);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    delValConfirm(k, id) {
      this.isShowConfirm = true;
      this.delData.k = k;
      this.delData.id = id;
    },
    delVal() {
      console.log(this.delData);
      let data = {
        id: this.delData.id
      };
      delBaseAttrVal(data)
        .then(res => {
          this.isShowVal = false;
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    addVal() {
      // {"baseAttrKeyId":1,"baseAttrKeyName":"尺寸","name":"3.5",cid}
      let data = {
        baseAttrKeyId: this.params.row.id,
        baseAttrKeyName: this.params.row.name,
        cid: this.params.row.cid,
        name: this.data.valName
      };
      addBaseAttrVal(data)
        .then(res => {
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
      this.reset();
    },
    editAttrVal() {
      let data = this.attrValue;
      editBaseAttrVal(data)
        .then(res => {
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    submit() {
      let cpath = this.data.cPath;
      if (cpath.length <= 0) {
        alert("分类id不能为空");
        return;
      }
      console.log(cpath);
      let data = {
        name: this.data.name,
        cid: cpath[cpath.length - 1]
      };
      addBaseAttr(data)
        .then(res => {
          let data = { page: this.currentPage };
          this.find(data);
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    reset() {
      this.data = {};
      this.isShow = false;
      this.isShowVal = false;
    },
    handleDelete(params) {
      let data = { id: params.row.id };
      delBaseAttr(data)
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
    this.findC();
    this.find({ page: 1 });
  }
};
</script>

<style>
</style>
