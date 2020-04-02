<template>
  <Card shadow style="height: 100%;width: 100%;overflow:hidden">
    <div>
      <Button
        @click="createOne"
        style="padding: 6px 12px;margin-bottom: 10px;"
        type="primary"
      >添加一级分类</Button>
    </div>
    <tree-table
      ref="tables"
      expand-key="id"
      :expand-type="false"
      :selectable="false"
      :columns="columns"
      :data="all"
    >
      <template slot="image" slot-scope="image">
        <img :src="image.row.image" alt style="height:100px;width:100px" />
      </template>
      <template slot="handle" slot-scope="scope">
        <Button @click="editOne(scope)" type="primary" size="small" style="margin-right:8px">修改</Button>
        <Button @click="delOne(scope)" type="error" size="small" style="margin-right:8px">删除</Button>
        <Button
          v-if="scope.row.level==1"
          @click="createOne(scope)"
          type="success"
          size="small"
          style="margin-right:8px"
        >添加子分类</Button>
      </template>
    </tree-table>
    <!-- <div class="department-outer">
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
    </div>-->
    <Modal v-model="isShowName" title="分类名称" width="760px" @on-cancel="resetData" @on-ok="submit">
      <div>
        <Input v-model="reqData.name" placeholder="请输入分类" clearable style="width:30%" />
      </div>
      <br />
      <div>
        商品图片
        <Button icon="ios-cloud-upload-outline" @click="uploadFile">上传图片</Button>&nbsp;
        <!-- 上传图片 -->
        <br />
        <br />
        <div v-if="imgShow" style="width: 200px">
          <img :src="reqData.imageUrl" style="width: 100px;height:100px" />
        </div>
      </div>
    </Modal>
    <Modal
      v-model="isShowDel"
      title="确认删除"
      width="300px"
      @on-ok="delFunSubmit"
      @on-cancel="resetData"
    >
      <div>确定要删除此节点吗？</div>
    </Modal>
    <Modal v-model="isUploadShow" title="上传图片" width="760px" footer-hide>
      <div>
        <!-- 图片剪裁 -->
        <Cropper @on-crop="saveImage" :ratio="1"></Cropper>
      </div>
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
import { uploadOne } from "@/api/file";
import { getOrgData } from "@/api/data";
import Cropper from "_c/cropper";
export default {
  name: "tree_table_page",
  components: {
    Cropper
  },
  data() {
    return {
      data: { id: 0, label: "商品分类", children: [] },
      zoom: 100,
      isShowName: false,
      isShowDel: false,
      isShowChild: false,
      isEditing: false,
      isUploadShow: false,
      imgShow: false,
      reqData: { imageUrl: "" },
      status: "",
      all: [],
      columns: [
        {
          title: "ID",
          key: "id",
          tooltip: true
        },
        {
          title: "名称",
          key: "label",
          tooltip: true
        },
        {
          title: "图片",
          key: "image",
          tooltip: true,
          type: "template",
          template: "image"
        },
        {
          title: "操作",
          key: "handle",
          type: "template",
          template: "handle"
        }
      ]
    };
  },
  computed: {},
  methods: {
    find() {
      findGoodsCategory().then(res => {
        if (res.data.status == "success") {
          this.all = res.data.data;
          let data = { id: 0, label: "商品分类", children: res.data.data };
          this.data = data;
        }
      });
    },
    setDepartmentData(data) {
      data.isRoot = true;
      return data;
    },
    createOne(params) {
      if (params.row) {
        this.reqData.parentId = params.row.id;
      }
      this.isShowName = true;
    },
    editOne(params) {
      this.reqData.id = params.row.id;
      this.reqData.name = params.row.label;
      this.reqData.imageUrl = params.row.image;
      this.imgShow = true;
      this.isShowName = true;
      this.isEditing = true;
    },
    delOne(params) {
      this.isShowDel = true;
      this.reqData.id = params.row.id;
    },
    changePanel(item) {
      this.isShowChild = item[0];
    },
    submit() {
      let data = {
        id: this.reqData.id,
        name: this.reqData.name,
        image: this.reqData.imageName
      };
      if (this.reqData.parentId > 0) {
        data.parentId = this.reqData.parentId;
      }
      if (this.isEditing) {
        this.editFunSubmit(data);
      } else {
        this.newFunSubmit(data);
      }
      //   switch (this.status) {
      //     case "edit":
      //       this.editFunSubmit(data);
      //       break;
      //     case "delete":
      //       this.delFunSubmit(data);
      //       break;
      //     case "new":
      //       data.parentId = this.reqData.id;
      //       this.newFunSubmit(data);
      //       break;
      //   }
    },
    editFunSubmit(data) {
      editGoodsCategory(data).then(res => {
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
    delFunSubmit() {
      let data = {
        id: this.reqData.id
      };
      delGoodsCategory(data).then(res => {
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
    uploadFile() {
      this.isUploadShow = true;
    },
    saveImage(blob) {
      let formData = new FormData();
      formData.append("from", "shop-category");
      formData.append("file", blob);
      uploadOne(formData).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.isUploadShow = false;
          this.imgShow = true;
          this.reqData.imageName = vo.data.name;
          this.reqData.imageUrl = vo.data.url;
        } else if (vo.status == "tokenExpire" || vo.status == "tokenFail") {
          // token 过期 跳转登录页面 todo
          this.$route.push({ name: "login" });
          this.$Message.error("token 错误， 请重新登录");
        } else {
          this.$Message.error(vo.msg);
          return false;
        }
      });
    },
    resetData() {
      this.reqData = {};
      this.imgShow = false;
      this.isShowName = false;
      this.isShowDel = false;
      this.isEditing = false;
      this.isUploadShow = false;
    }
  },
  mounted() {
    this.find();
  }
};
</script>

<style>
</style>
