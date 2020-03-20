<template>
  <Card shadow style="height: 100%;width: 100%;overflow:hidden">
    <div class="department-outer">
      <div class="zoom-box">
        <zoom-controller v-model="zoom" :min="20" :max="200"></zoom-controller>
      </div>
      <div class="view-box">
        <org-view
          v-if="data"
          :data="data"
          :zoom-handled="zoomHandled"
          @on-menu-click="handleMenuClick"
        ></org-view>
      </div>
    </div>
    <Modal v-model="isShowName" title="分类名称" width="760px" @on-ok="submit">
      <div>
        <Input v-model="reqData.name" placeholder="请输入分类" clearable style="width:30%" />
      </div>
    </Modal>
    <Modal v-model="isShowDel" title="确认删除" width="300px" @on-ok="submit">
      <div>确定要删除此节点吗？</div>
    </Modal>
  </Card>
</template>

<script>
import {
  findGoodsCategory,
  editGoodsCategory,
  addGoodsCategory,
  delGoodsCategory
} from "@/api/shop/admin";
import OrgView from "../components/org-tree/components/org-view.vue";
import ZoomController from "../components/org-tree/components/zoom-controller.vue";
import { getOrgData } from "@/api/data";
import "../components/org-tree/index.less";
const menuDic = {
  edit: "编辑分类名称",
  detail: "查看部门",
  new: "新增子分类",
  delete: "删除分类"
};
export default {
  name: "org_tree_page",
  components: {
    OrgView,
    ZoomController
  },
  data() {
    return {
      data: null,
      zoom: 100,
      isShowName: false,
      isShowDel: false,
      reqData: {},
      status: ""
    };
  },
  computed: {
    zoomHandled() {
      return this.zoom / 100;
    }
  },
  methods: {
    find() {
      findGoodsCategory().then(res => {
        console.log(res.data);
        if (res.data.status == "success") {
          let data = { id: 0, label: "商品分类", children: res.data.data };
          this.data = data;
        }
      });
    },
    setDepartmentData(data) {
      data.isRoot = true;
      return data;
    },
    handleMenuClick({ data, key }) {
      console.log(data, key);
      this.status = key;
      this.reqData.id = data.id;
      switch (key) {
        case "edit":
          this.reqData.name = data.label;
          this.isShowName = true;
          break;
        case "delete":
          this.isShowDel = true;
          break;
        case "new":
          this.isShowName = true;
          break;
      }
      // this.$Message.success({
      //   duration: 5,
      //   content: `点击了《${data.label}》节点的'${menuDic[key]}'菜单`
      // });
    },
    submit() {
      let data = { id: this.reqData.id, name: this.reqData.name };
      switch (this.status) {
        case "edit":
          this.editFunSubmit(data);
          break;
        case "delete":
          this.delFunSubmit(data);
          break;
        case "new":
          data.parentId = this.reqData.id;
          this.newFunSubmit(data);
          break;
      }
    },
    editFunSubmit(data) {
      editGoodsCategory(data).then(res => {
        console.log(res.data);
        if (res.data.status == "success") {
          this.find();
          this.resetData();
          this.$Message.success(res.data.msg);
        } else {
          this.resetData();
          this.$Message.error(res.data.msg);
        }
      });
    },
    delFunSubmit(data) {
      delGoodsCategory(data).then(res => {
        console.log(res.data);
        if (res.data.status == "success") {
          this.find();
          this.resetData();
          this.$Message.success(res.data.msg);
        } else {
          this.resetData();
          this.$Message.error(res.data.msg);
        }
      });
    },
    newFunSubmit(data) {
      addGoodsCategory(data).then(res => {
        console.log(res.data);
        if (res.data.status == "success") {
          this.find();
          this.resetData();
          this.$Message.success(res.data.msg);
        } else {
          this.resetData();
          this.$Message.error(res.data.msg);
        }
      });
    },
    resetData() {
      this.reqData = {};
    }
  },
  mounted() {
    this.find();
  }
};
</script>

<style>
</style>
