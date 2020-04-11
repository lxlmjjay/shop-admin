<template>
  <div>
    <Card>
      <div>
        <div>当前状态：{{data.statusName}}</div>
        <br />
        <div>
          名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：
          <Input v-model="data.name" placeholder="请输入店铺名称..." style="width: 500px" />
        </div>
        <br />
        <div>
          品&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;牌：
          <Input v-model="data.brand" placeholder="请输入经营品牌..." style="width: 500px" />
        </div>
        <br />
        <div>
          标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;语：
          <Input v-model="data.slogan" placeholder="请输入店铺标语..." style="width: 500px" />
        </div>
        <br />
        <div>
          店铺地址：
          <Input v-model="data.address" placeholder="请输入店铺地址..." style="width: 500px" />
        </div>
        <br />
        <div>
          店铺头像：
          <!-- <Cropper @on-crop="saveImage" :ratio="1"></Cropper> -->
          <Upload
            :action="upload"
            :data="from"
            :on-success="uploadSuccessHeader"
            :max-size="2048"
            :headers="headers"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
          <img :src="headerUrl" alt style="width:100px;height:100px;" />
        </div>
        <br />
        <div>
          店铺二维码：
          <Upload
            :action="upload"
            :data="from"
            :on-success="uploadSuccessQr"
            :max-size="2048"
            :headers="headers"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
          <img :src="qrCodeUrl" alt style="width:100px;height:100px;" />
        </div>
        <Button @click="editFun" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">提交审核</Button>
      </div>
    </Card>
    <!-- <Modal v-model="isUploadShow" title="上传图片" width="760px" footer-hide>
      <div>
        <Cropper @on-crop="saveImage" :ratio="1.32"></Cropper>
      </div>
    </Modal>-->
  </div>
</template>

<script>
import Tables from "_c/tables";
import { baseUrl, getToken } from "@/libs/util";
import { editStore, myStore } from "@/api/shop/before";
import { uploadOne } from "@/api/file";
import Cropper from "_c/cropper";
export default {
  name: "admin_list",
  components: {
    Tables,
    Cropper
  },
  data() {
    return {
      columns: [
        { title: "ID", key: "id", sortable: true },
        { title: "粉丝数", key: "fansCount" },
        { title: "品牌", key: "brand" },
        { title: "地址", key: "address" },
        { title: "状态", key: "statusName" },
        { title: "创建时间", key: "created" },
        {
          title: "操作",
          key: "handle",
          options: [],
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  props: {},
                  on: {
                    click: () => {
                      console.log(params);
                      let _this = this;
                      getGroup(params.row.id)
                        .then(res => {
                          if (res.data.status == "tokenFail") {
                            //token 过期 跳login
                          } else if (res.data.status == "success") {
                            let data = res.data.data;
                            this.isShow = true;
                            this.isEditing = true;
                            this.isEditingRow = params.index;
                          }
                        })
                        .catch(err => {});
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
      data: { headerUrl: "", qrCodeUrl: "" },
      category: [],
      isEditing: false,
      isUploadShow: false,
      headerUrl: "",
      qrCodeUrl: "",
      rowId: 0,
      upload: baseUrl() + "/api/admin/uploadOne",
      headers: { token: getToken() },
      from: { from: "shop-store" }
    };
  },
  methods: {
    find() {
      myStore().then(res => {
        if (res.data.data != null) {
          this.data = res.data.data[0];
          this.qrCodeUrl = res.data.data[0].qrCodeUrl;
          this.headerUrl = res.data.data[0].headerUrl;
        }
      });
    },
    editFun() {
      let data = {
        id: this.data.id,
        name: this.data.name,
        brand: this.data.brand,
        address: this.data.address,
        slogan: this.data.slogan,
        header: this.data.header,
        qrCode: this.data.qrCode
      };
      editStore(data) //上传接口
        .then(res => {
          this.$Message.success(res.data.msg);
        })
        .catch(err => {
          this.$Message.error("添加失败");
        });
      this.isEditing = false;
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
    },
    saveImage(blob) {
      let formData = new FormData();
      formData.append("from", "shop-store");
      formData.append("file", blob);
      uploadOne(formData).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          console.log(1111, vo);
          this.data.headerUrl = vo.data.url;
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
    uploadSuccessHeader(data) {
      this.headerUrl = data.data.url;
      this.data.header = data.data.name;
    },
    uploadSuccessQr(data) {
      console.log(data);
      this.qrCodeUrl = data.data.url;
      this.data.qrCode = data.data.name;
    }
  },
  mounted() {
    this.find();
  }
};
</script>

<style>
</style>
