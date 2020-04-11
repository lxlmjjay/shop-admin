<template>
  <div>
    <div>
      <Button @click="add" type="primary">添加banner</Button>&nbsp;
    </div>
    <br />
    <Card>
      <tables
        ref="tables"
        editable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"
      />
    </Card>
    <Modal
      v-model="isShow"
      title="设置banner"
      width="760px"
      ok-text="提交"
      @on-ok="addSubmit"
      @on-cancel="reset"
    >
      <Row>
        <Col>
          <h3>banner名称：</h3>
          <Input v-model="data.Name" placeholder="请输入banner名称..." style="width: 200px" />&nbsp;
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <h3>图片链接商品id：</h3>
          <InputNumber :min="1" :precision="0" v-model="data.Cid" placeholder="请输入商品id..."></InputNumber>&nbsp;
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <h3>上传图片：</h3>
          <!-- <Input v-model="data.image" placeholder="请输入名称..." style="width: 500px" /> -->
          <div @click="uploadShow">
            <img :src="data.ImageUrl" alt style="width:226px;height:100px" />
            &nbsp;&nbsp;
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff;"></Icon>
          </div>
        </Col>
      </Row>
    </Modal>
    <Modal v-model="isUploadShow" title="上传图片" width="760px" footer-hide>
      <div>
        <!-- 图片剪裁 -->
        <Cropper @on-crop="saveImage" :ratio="2.2"></Cropper>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import Cropper from "_c/cropper";
import { uploadOne } from "@/api/file";
import { findBanner, addBanner, editBanner, delBanner } from "@/api/shop/admin";
export default {
  name: "shop_banner",
  components: {
    Tables,
    Cropper
  },
  data() {
    return {
      columns: [
        {
          title: "ID",
          key: "Id",
          ellipsis: true
        },
        {
          title: "标题",
          key: "Name",
          ellipsis: true
        },
        {
          title: "图片",
          key: "Image",
          ellipsis: true,
          render: (h, { row }) => {
            return (
              <img src={row.ImageUrl} alt style="width:220px;height:100px" />
            );
          }
        },
        {
          title: "连接商品id",
          key: "Cid",
          ellipsis: true
        },
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
                    cursor: "pointer",
                    marginRight: "8px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.data.Id = params.row.Id;
                      this.data.ImageUrl = params.row.ImageUrl;
                      this.data.Image = params.row.Image;
                      this.data.Name = params.row.Name;
                      this.data.Cid = params.row.Cid;
                      this.isEditing = true;
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
      isUploadShow: false,
      data: { Image: "", ImageUrl: "", Name: "", Cid: 0 },
      params: {},
      ImageUrl: "",
      isEditing: false
    };
  },
  methods: {
    find() {
      findBanner().then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.total = res.data.total;
          this.tableData = res.data.data;
        }
      });
    },
    add() {
      this.isShow = true;
    },
    addSubmit() {
      if (this.isEditing) {
        this.handleEdit();
      } else {
        this.handleAdd();
      }
    },
    handleAdd() {
      let data = {
        Image: this.data.Image,
        Name: this.data.name,
        Cid: this.data.cid
      };
      addBanner(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.reset();
          this.find();
          this.$Message.success(vo.msg);
        } else {
          this.$Message.error(vo.msg);
        }
      });
    },
    handleEdit() {
      let data = {
        Id: this.data.Id,
        Image: this.data.Image,
        Name: this.data.Name,
        Cid: this.data.Cid
      };
      console.log(this.params);
      editBanner(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.reset();
          this.find();
          this.$Message.success(vo.msg);
        } else {
          this.$Message.error(vo.msg);
        }
      });
    },
    handleDelete(params) {
      let data = { Id: params.row.Id };
      delBanner(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.$Message.success(vo.msg);
        } else {
          this.$Message.error(vo.msg);
        }
      });
    },
    uploadShow() {
      console.log(888);
      this.isUploadShow = true;
    },
    saveImage(blob) {
      let formData = new FormData();
      formData.append("from", "shop-banner");
      formData.append("file", blob);
      uploadOne(formData).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.isUploadShow = false;
          this.data.Image = vo.data.name;
          this.data.ImageUrl = vo.data.url;
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
    reset() {
      this.data = { Image: "", ImageUrl: "", Name: "", Cid: 0 };
      this.isEditing = false;
    }
  },
  mounted() {
    this.find();
  }
};
</script>
<style>
</style>
