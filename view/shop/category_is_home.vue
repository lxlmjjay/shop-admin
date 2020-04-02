<template>
  <div>
    <Card>
      <tables ref="tables" editable search-place="top" v-model="tableData" :columns="columns" />
    </Card>
    <Modal
      v-model="isShow"
      title="设置"
      width="760px"
      ok-text="提交"
      @on-ok="addSubmit"
      @on-cancel="reset"
    >
      <Row>
        <Col>
          <h3>图片链接：</h3>
          <Input v-model="data.url" placeholder="请输入名称..." style="width: 500px" />
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <h3>上传图片：</h3>
          <!-- <Input v-model="data.image" placeholder="请输入名称..." style="width: 500px" /> -->
          <div @click="uploadShow">
            <img :src="imageUrl" alt style="width:226px;height:100px" />
            &nbsp;&nbsp;
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff;"></Icon>
          </div>
        </Col>
      </Row>
    </Modal>
    <Modal v-model="isUploadShow" title="上传图片" width="760px" footer-hide>
      <div>
        <!-- 图片剪裁 -->
        <Cropper @on-crop="saveImage" :ratio="2.26"></Cropper>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import Cropper from "_c/cropper";
import { uploadOne } from "@/api/file";
import {
  findGoodsCategoryByLevel,
  setGoodsCategoryIsHome
} from "@/api/shop/admin";
export default {
  name: "category_is_home",
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
          title: "操作",
          key: "handle",
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
                      this.data.url = params.row.IsHomeUrl;
                      this.imageUrl = params.row.IsHomeImg;
                      this.isShow = true;
                      this.params = params;
                    }
                  }
                },
                "设置分类推荐"
              );
            }
          ]
        }
      ],
      tableData: [],
      isShow: false,
      isUploadShow: false,
      data: {},
      params: {},
      imageUrl: ""
    };
  },
  methods: {
    find() {
      findGoodsCategoryByLevel({ id: 2 }).then(res => {
        var vo = res.data;
        if (vo.status == "success" && vo.data != null) {
          console.log(res.data.data);
          this.total = res.data.total;
          this.tableData = res.data.data;
        }
      });
    },
    addSubmit() {
      let data = {
        id: this.params.row.Id,
        url: this.data.url,
        img: this.data.img
      };
      console.log(this.params);
      setGoodsCategoryIsHome(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.find();
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
      formData.append("from", "shop-category");
      formData.append("file", blob);
      uploadOne(formData).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.isUploadShow = false;
          this.imageUrl = vo.data.url;
          this.data.img = vo.data.name;
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
      this.data = {};
    }
  },
  mounted() {
    this.find();
  }
};
</script>
<style>
</style>
