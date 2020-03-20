<template>
  <div>
    <div>
      <Button @click="setScore" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">设置积分</Button>
    </div>
    <Card>
      <div>
        <h3>总奖励： {{reward_sum}}</h3>
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
            <Page :total="total" :page-size="20" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </Card>
    <Modal
      v-model="isShow"
      title="积分设置"
      width="800px"
      @on-cancel="cancel"
      ok-text="提交"
      @on-ok="setScoreImp"
    >
      <div>
        <Input v-model="score" placeholder="请输入积分..." style="width: 200px" />
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
import { get_member, set_give_jifen, get_give_jifen } from "@/api/userRegister";
export default {
  name: "community_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "User_id", key: "usr_id" },
        { title: "Name_id", key: "name_id" },
        { title: "姓名", key: "name" },
        { title: "电话号码", key: "mobile" },
        { title: "积分", key: "jifen" },
        { title: "状态", key: "confirm" }
        // {
        //   title: "状态",
        //   key: "confirm",
        //   render:(h, params, vm) => {
        //     let status = ""
        //     if (params.row.confirm == 1){status = "通过"}
        //     if (params.row.confirm == 3){status = "拒绝"}
        //       return h('div',{},status)
        //   }
        // },
      ],
      tableData: [],
      isShow: false,
      total: 0,
      currentPage: 0,
      score: 0,
      reward_sum: 0
    };
  },
  methods: {
    setScore() {
      this.isShow = true;
      //获取积分
      get_give_jifen()
        .then(res => {
          if (res.data.status == "success") {
            this.score = res.data.give_jifen;
          } else {
            this.$Message.error("获取积分错误");
          }
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    setScoreImp() {
      let data = {
        give_jifen: this.score,
        admin: parseInt(this.$store.state.user.userName),
        token: this.$store.state.user.time_token
      };
      console.log(data);
      set_give_jifen(data)
        .then(res => {
          if (res.data.status == "success") {
            this.$Message.success("积分设置成功");
          } else if (res.data.error == "error_token") {
            this.$Message.error("token 错误请重新登录");
            //跳转登录页面
          } else {
            this.$Message.error("管理员错误");
          }
        })
        .catch(function(response) {
          console.log(response);
          return false;
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
    handleDelete(params) {
      delGroup(params.row.id)
        .then(res => {
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc:
          "文件 " + file.name + " 格式不正确，请上传 jpg 或 png 格式的图片。"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleSuccess(res, file) {
      console.log(11111, res, file);
      //   this.data.imageUrl = window.URL.createObjectURL(file)
      console.log(this);
    },
    handleBeforeUpload(file) {
      this.data.image = file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let res = reader.result;
        console.log(res);
        this.data.imageUrl = res; //将_base64赋值给图片的src，实现图片预览
      };
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
        Page: this.currentPage == 0 ? 1 : this.currentPage,
        limit: 20,
        item: "reward",
        DESC: 1,
        admin: parseInt(this.$store.state.user.userName),
        token: this.$store.state.user.time_token
      };
      get_member(data).then(res => {
        if (res.data.status == "success") {
          let data = res.data.data;
          this.total = data.info[0].Num;
          this.reward_sum = data.info[0].reward_sum;
          this.tableData = data.member_info;
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
    this.getList();
  }
};
</script>

<style>
</style>
