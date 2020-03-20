<template>
  <div>
    <Card>
      <div>
        <Button @click="create" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">申请成为商家</Button>
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
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </Card>
    <Modal
      v-model="isShow"
      title="创建群"
      width="800px"
      @on-cancel="cancel"
      ok-text="提交"
      @on-ok="submit"
    >
      <Card style="width:auto">
        <div>
          姓名：
          <Input v-model="data.name" placeholder="请输入群名称..." style="width: 200px" />
        </div>
        <br />
        <div>
          电话：
          <Input v-model="data.phone" placeholder="请输入群名称..." style="width: 200px" />
        </div>
        <br />
        <div>
          请选择群图片
          <Upload
            multiple
            action="//jsonplaceholder.typicode.com/posts/"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
          <!-- <img :src="data.imageUrl" alt style="width:100px;height:100px;" /> -->
        </div>
        <br />
      </Card>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";

import { baseImgUrl } from "@/libs/util";
import {
  findGroups,
  delGroup,
  createGroup,
  getGroup,
  editGroup,
  findFlags
} from "@/api/community";
import { testAddSupplier } from "@/api/shop/before";

export default {
  name: "community_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "ID", key: "id", sortable: true },
        { title: "社群名称", key: "groupName", sortable: true },
        { title: "群人数", key: "counts" },
        { title: "最多允许人数", key: "limit" },
        { title: "创建者", key: "creator" },
        { title: "状态", key: "status" },
        {
          title: "操作",
          key: "handle",
          options: ["delete"],
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
                      //   getGroup(params.row.id)
                      //     .then(res => {
                      //       if (res.data.status == "tokenFail") {
                      //         //token 过期 跳login
                      //       } else if (res.data.status == "success") {
                      //         let data = res.data.data;
                      //         _this.data.id = data.id;
                      //         _this.data.groupName = data.groupName;
                      //         _this.data.category = data.cid;
                      //         _this.data.imageUrl = baseImgUrl() + data.image;
                      //         _this.data.limit = data.limit;
                      //         _this.data.inviteCode = data.inviteCode;
                      //         _this.data.longitude = data.longitude;
                      //         _this.data.latitude = data.latitude;
                      //         this.isShow = true;
                      //         this.isEditing = true;
                      //         this.isEditingRow = params.index;
                      //       }
                      //     })
                      //     .catch(err => {});
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
      groupname: "默认群名称",
      //   membersName: "",
      isShow: false,
      data: { imageUrl: "" }, //创建、编辑 数据
      total: 0,
      current: 1,
      isEditing: false,
      isEditingRow: 0,
      currentPage: 0,
      flags: [],
      isOping: false, //防止连续提交
      files: []
    };
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
      this.findGroup(page);
    },
    edit() {},
    submit() {
      if (!this.isEditing) {
        this.createFun();
      } else {
        this.editFun();
      }
    },
    createFun() {
      let formData = new FormData();
      formData.append("name", this.data.name);
      formData.append("phone", this.data.phone);
      for (let i = 0; i < this.files.length; i++) {
        formData.append("files", this.files[i].file, this.files[i].filename);
      }
      console.log(11122, this.formData);
      testAddSupplier(formData) //上传接口
        .then(res => {
          if (res.data.status == "tokenFail") {
          } else if (res.data.status == "fail") {
          } else {
            console.log(888, res.data);
          }
        })
        .catch(err => {
          this.$Message.error("添加失败");
        });
      this.data = {};
      this.files = [];
    },
    editFun() {
      let formData = new FormData();
      formData.append("id", this.data.id);
      formData.append("groupName", this.data.groupName);
      formData.append("category", this.data.category);
      formData.append("image", this.data.image);
      formData.append("limit", this.data.limit);
      formData.append("inviteCode", this.data.inviteCode);
      formData.append("longitude", this.data.longitude);
      formData.append("latitude", this.data.latitude);
      editGroup(formData) //上传接口
        .then(res => {
          console.log(this.data);
          this.tableData[this.isEditingRow].groupName = this.data.groupName;
          this.$Message.success(res.data.msg);
          this.data = {};
        })
        .catch(err => {
          this.$Message.error("添加失败");
          this.data = {};
        });
      this.isEditing = false;
    },
    create() {
      this.isShow = true;
    },
    cancel() {
      this.data = {};
      this.isShow = false;
    },
    handleDelete(params) {
      let data = { id: params.row.id };
      delGroup(data)
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
      let f = { file: file, filename: file.name };
      this.files.push(f);
      //   console.log(33333,this.files)
      //   let reader = new FileReader();
      //   reader.readAsDataURL(file);
      //   reader.onload = () => {
      //     let res = reader.result;
      //     console.log(res);
      //     this.data.imageUrl = res; //将_base64赋值给图片的src，实现图片预览
      //   };
    },
    findGroup(page) {
      let data = {
        page: page
      };
      findGroups(data).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    findFlag() {
      findFlags().then(res => {
        this.flags = res.data.data;
      });
    }
  },
  mounted() {
    this.findGroup(1);
    this.findFlag();
  }
};
</script>

<style>
</style>
