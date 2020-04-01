<template>
  <div>
    <Card>
      <div>
        <tables
          ref="tables"
          editable
          search-place="top"
          v-model="tableData"
          :columns="columns"
          @on-delete="handleDelete"
          @on-approve="handleApprove"
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
      @on-ok="cancel"
    >
      <Card style="width:auto">
        <div>
          群 名 称：
          <Input disabled v-model="data.groupName" placeholder="请输入群名称..." style="width: 200px" />
        </div>
        <!-- <br />
        <div>
          群 分 类：
          <Select v-model="data.category" style="width:200px">
            <Option v-for="item in flags" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>-->
        <br />
        <div>
          群图片：
          <img :src="imgUrl" alt style="width:100px;height:100px;" />
        </div>
        <br />
        <div>
          限制人数：
          <InputNumber disabled v-model="data.limit" :min="1" :max="2147483647" :precision="0"></InputNumber>
        </div>
        <br />
        <div>
          邀 请 码：
          <Input disabled v-model="data.inviteCode" placeholder="请输邀请码..." style="width: 200px" />
        </div>
        <br />
        <div>
          东&nbsp;&nbsp;&nbsp;&nbsp; 经：
          <Input
            disabled
            v-model="data.longitude"
            placeholder="请输入经度如：116.3400833900..."
            style="width: 200px"
          />
        </div>
        <br />
        <div>
          北&nbsp;&nbsp;&nbsp;&nbsp; 伟：
          <Input
            disabled
            v-model="data.latitude"
            placeholder="请输入伟度如：39.9997921000..."
            style="width: 200px"
          />
        </div>
      </Card>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";

import { baseUrl, getToken } from "@/libs/util";
import {
  findGroups,
  delGroup,
  createGroup,
  getGroup,
  editGroup,
  approve
} from "@/api/community";
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
        {
          title: "操作",
          key: "handle",
          options: ["approve"],
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
                      console.log(params);
                      getGroup(params.row.id)
                        .then(res => {
                          if (res.data.status == "tokenFail") {
                            this.$Message.error("请重新登录");
                            //token 过期 跳login
                          } else if (res.data.status == "success") {
                            console.log(res.data);
                            this.data = res.data.data;
                            this.imgUrl = res.data.data.image;
                            this.isShow = true;
                          }
                        })
                        .catch(err => {});
                    }
                  }
                },
                "查看"
              );
            }
          ]
        }
      ],
      tableData: [],
      groupname: "默认群名称",
      //   membersName: "",
      isShow: false,
      data: {}, //创建、编辑 数据
      total: 0,
      current: 1,
      isEditing: false,
      isEditingRow: -1,
      currentPage: 1,
      flags: [],
      isOping: false, //防止连续提交
      uploadUrl: baseUrl() + "/api/admin/uploadOne",
      headers: { token: getToken() },
      imgUrl: ""
    };
  },
  methods: {
    find(data) {
      data.status = 1;
      findGroups(data).then(res => {
        var vo = res.data;
        if (vo.status == "success" && vo.data != null) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    changePage(page) {
      this.currentPage = page;
      this.find({ page: page });
    },
    dataReset() {
      this.data = {};
      this.imgUrl = "";
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
      if (res.status == "success") {
        this.imgUrl = res.data.url;
        this.data.image = res.data.name;
      }
      console.log(11111, res, file);
      //   this.data.imageUrl = window.URL.createObjectURL(file)
      console.log(this);
    },
    // findFlag() {
    //   findFlags().then(res => {
    //     this.flags = res.data.data;
    //   });
    // },
    handleApprove(params) {
      let data = { id: params.row.id };
      approve(data)
        .then(res => {
          console.log(this.data);
          if (res.data.status == "success") {
            this.tableData.splice(params.index, 1);
            this.$Message.success(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("添加失败");
          this.data = {};
        });
    }
  },
  mounted() {
    this.find({ page: 1 });
  }
};
</script>

<style>
</style>
