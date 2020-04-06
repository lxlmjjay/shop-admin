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
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            :before-upload="handleBeforeUpload"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
          <img :src="baseUrl+data.header" alt style="width:100px;height:100px;" />
        </div>
        <br />
        <div>
          店铺二维码：
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            :before-upload="handleBeforeUpload2"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
          <img :src="baseUrl+data.qrCode" alt style="width:100px;height:100px;" />
        </div>
        <Button @click="editFun" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">提交审核</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { editStore, myStore } from "@/api/shop/before";
import { baseImgUrl } from "@/libs/util";
export default {
  name: "admin_list",
  components: {
    Tables
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
      baseUrl: baseImgUrl(),
      rowId: 0
    };
  },
  methods: {
    find() {
      myStore().then(res => {
        if (res.data.data != null) {
          this.data = res.data.data[0];
          console.log(this.data);
        }
      });
    },
    editFun() {
      console.log(this.data);
      let formData = new FormData();
      formData.append("id", this.data.id);
      formData.append("name", this.data.name);
      formData.append("brand", this.data.brand);
      formData.append("address", this.data.address);
      formData.append("slogan", this.data.slogan);
      formData.append("header", this.data.header);
      formData.append("qrCode", this.data.qrCode);
      console.log(formData);
      editStore(formData) //上传接口
        .then(res => {
          console.log(this.data);
          this.$Message.success(res.data.msg);
          this.data = {};
        })
        .catch(err => {
          this.$Message.error("添加失败");
          this.data = {};
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
    handleBeforeUpload(file) {
      this.data.header = file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let res = reader.result;
        console.log(res);
        this.data.headerUrl = res; //将_base64赋值给图片的src，实现图片预览
      };
    },
    handleBeforeUpload2(file) {
      this.data.qrCode = file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let res = reader.result;
        console.log(res);
        this.data.qrCodeUrl = res; //将_base64赋值给图片的src，实现图片预览
      };
    }
  },
  mounted() {
    this.find();
  }
};
</script>

<style>
</style>
