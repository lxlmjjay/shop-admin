<template>
  <div>
    <img src alt style="width:100%;" />
    <Card>
      <div>
        <tables
          ref="tables"
          editable
          search-place="top"
          v-model="tableData"
          :columns="columns"
          @on-delete="handleDelete"
        />
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </Card>
    <Modal v-model="isShow" title="照片" width="800px" @on-cancel="cancel">
      正面照:
      <div>
        <img :src="this.img0" alt style="width:100%;" />
      </div>反面照:
      <div>
        <img :src="this.img1" alt style="width:100%;" />
      </div>手持照:
      <div>
        <img :src="this.img2" alt style="width:100%;" />
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  findGroups,
  delGroup,
  createGroup,
  getGroup,
  editGroup
} from "@/api/community";
import { get_member_confirm, get_image, confirm } from "@/api/userRegister";
export default {
  name: "community_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "电话号码", key: "mobile" },
        { title: "姓名", key: "name" },
        { title: "Name_id", key: "name_id" },
        {
          title: "操作",
          key: "handle",
          //   options: ["delete"],
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  props: {},
                  on: {
                    click: () => {
                      this.isShow = true;
                      this.getImage(params.row.mobile, 0);
                      this.getImage(params.row.mobile, 1);
                      this.getImage(params.row.mobile, 2);
                    }
                  }
                },
                "查看"
              );
            },
            (h, params, vm) => {
              return h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确定审核通过吗?"
                  },
                  on: {
                    "on-ok": () => {
                      this.to_confirm(params.row.mobile, 1);
                    }
                  }
                },
                [h("Button", "通过")]
              );
            },
            (h, params, vm) => {
              return h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确定拒绝吗?"
                  },
                  on: {
                    "on-ok": () => {
                      this.to_confirm(params.row.mobile, 3);
                    }
                  }
                },
                [h("Button", "拒绝")]
              );
            }
          ]
        }
      ],
      tableData: [],
      isShow: false,
      total: 0,
      currentPage: 0,
      img0: "", //正面照
      img1: "", //反面照
      img2: "" //手持照
    };
  },
  methods: {
    to_confirm(mobile, type) {
      //num：1认证通过 3认证拒绝
      let data = {
        mobile: mobile,
        admin: parseInt(this.$store.state.user.userName),
        token: this.$store.state.user.time_token,
        num: type
      };
      confirm(data).then(res => {
        if (res.data.status == "success") {
          this.$Message.success("操作成功");
          this.getList();
        } else if (res.data.error == "error_token") {
          this.$Message.error("token 错误请重新登录");
          //跳转登录页面
        } else {
          this.$Message.error("管理员错误");
        }
      });
    },
    getImage(mobile, type) {
      let data = {
        admin: parseInt(this.$store.state.user.userName),
        token: this.$store.state.user.time_token,
        mobile: mobile,
        num: type
      };
      get_image(data).then(res => {
        if (res.data.status == "error") {
          if (res.data.error == "error_token" || res.data.token == "NUll") {
            this.$Message.error("token 错误请重新登录");
            //跳转登录页面
          } else {
            this.$Message.error("管理员错误");
          }
        } else {
          var blob;
          if (typeof res.data == "string") {
            blob = new Blob([res.data], { type: "image/jpeg" });
          } else {
            blob = res.data;
          }
          console.log(blob);
          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            let res = reader.result;
            console.log(res);
            if (type === 0) {
              this.img0 = res; //将_base64赋值给图片的src，实现图片预览
            } else if (type == 1) {
              this.img1 = res; //将_base64赋值给图片的src，实现图片预览
            } else if (type == 2) {
              this.img2 = res; //将_base64赋值给图片的src，实现图片预览
            }
          };
        }
      });
    },
    changePage(page) {
      this.currentPage = page;
      this.getList();
    },
    cancel() {
      this.data = {};
      this.isShow = false;
    },
    handleDelete(params) {},
    handleSuccess(res, file) {
      //   this.data.imageUrl = window.URL.createObjectURL(file)
    },
    getList() {
      /**
{
    "Page":1,
    "limit":2,
    "item":"reward",
    "DESC":1,
    "admin":15910918033,
    "token":"3c7b03e7be68a0557c307a2fb4bd122047562f761ba0b0d5015bfb472166a32c"
}
       */
      let data = {
        admin: parseInt(this.$store.state.user.userName),
        token: this.$store.state.user.time_token
      };
      get_member_confirm(data).then(res => {
        if (res.data.status == "success") {
          let data = res.data.data;
          // this.total = data.info[0].Num;
          this.tableData = data;
        } else if (res.data.error == "error_token") {
          this.$Message.error("token 错误请重新登录");
          //跳转登录页面
        } else {
          this.$Message.error("管理员错误");
        }
      });
    }
  },
  mounted() {
    console.log(this.$store.state.user.time_token);
    this.getList();
  }
};
</script>

<style>
</style>
