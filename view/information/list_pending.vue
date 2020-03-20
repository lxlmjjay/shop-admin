<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable

        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"
        @on-approve="handleApprove"
        @on-edit="handleEdit"
        @on-view="handleView"
        @on-cancelApprove="handleCancelApprove"
        @on-search-custom="handleSearchCustom"
        @on-search-custom-change="handleSearchChange"
        @on-search-custom-clear="handleSearchClear"
        @on-save-edit="handleSortSave"
      />
      <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
    </Card>

    <Modal v-model="viewShow" title="资讯详情" width="760px" ok-text="取消" cancel-text>
      <Row>标题：{{viewData.title}}</Row>
      <Row>分类：{{viewData.category}}</Row>
      <Row>作者：{{viewData.author}}</Row>
      <Row>
        列表图：
        <div v-if="viewData.image !== null" style="width: 100px">
          <img :src="viewData.image" style="width: 100px;height:100px" />
        </div>
      </Row>
      <Row>摘要：{{viewData.abstract}}</Row>
      <Row>
        内容：
        <div v-html="viewData.content"></div>
      </Row>
      <Row>点攒数：{{viewData.thumbCount}}</Row>
      <Row>评论数：{{viewData.commentCount}}</Row>
      <Row>创建时间：{{viewData.created}}</Row>
    </Modal>
    <div style="margin-top:20px;float:right;margin-right:20px;">
      <Page :total="total" show-elevator :current="1" @on-change="changePage" />
    </div>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { escape2Html } from "@/libs/com";
import {
  infomationApprove,
  infomationDel,
  infomationList,
  infomationCancelApprove,
  infomationCategoryList,
  infomationEditSort,
  infomationGet
} from "@/api/information";
export default {
  name: "infomation_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        {
          title: "标题",
          key: "title",
          maxWidth: 200,
          ellipsis: true,
          filterable: true
        },
        {
          title: "分类",
          key: "category",
          maxWidth: 200,
          ellipsis: true,
          filterable: "select"
        },
        {
          title: "作者",
          key: "author",
          maxWidth: 200,
          ellipsis: true
        },
        {
          title: "排序",
          key: "sort",
          width: 150,
          // checkAccess: ["super_admin"],
          // sortable: "custom"
          editable: true,
          editShow: true //开启单元格编辑
        },
        {
          title: "状态",
          key: "status",
          width: 100,
          render: (h, params) => {
            let text = { 0: "草稿", 1: "待审核", 2: "已发布" };
            return h("span", {}, text[params.row.status]);
          }
        },
        {
          title: "创建时间",
          key: "created",
          maxWidth: 100
        },
        {
          title: "操作",
          key: "handle",
          options: ["view", "approve"]
        }
      ],
      statusText: { 1: "" },
      tableData: [],
      viewShow: false,
      viewData: {
        image: null
      },
      total: 0,
      cancelButtonShow: false,
      categoryList: [],
      searchData: {}
    };
  },
  methods: {
    initFind(data) {
      if (data) {
        data.status = 1
      } else {
        data = {status:1}
      }
      infomationList(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.total = res.data.total;
            this.tableData = res.data.data;
          } else {
            this.$Message.error(vo.msg);
          }
        } else {
          this.Message.error("请求超时");
        }
      });
    },
    changePage(page) {
      let data = this.searchData;
      data.page = page;
      this.initFind(data);
    },
    handleView(params) {
      this.viewData.title = params.row.title;
      this.viewData.category = params.row.category;
      this.viewData.author = params.row.author;
      this.viewData.status = params.row.status;
      this.viewData.created = params.row.created;
      infomationGet({ id: params.row.id }).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.handleViewData(vo.data);
          } else if (vo.status == "tokenExpire" || vo.status == "tokenFail") {
            // token 过期 跳转登录页面 todo
            this.$Message.error("token 错误， 请重新登录");
          } else {
            this.$Message.error(vo.msg);
            return false;
          }
        } else {
          this.$Message.error("请求超时");
        }
      });
    },
    handleViewData(data) {
      console.log(444, data);
      this.viewData.image = data.image;
      this.viewData.abstract = data.abstract;
      this.viewData.content = escape2Html(escape2Html(data.content));
      this.viewData.thumbCount = data.thumbCount;
      this.viewData.commentCount = data.commentCount;
      this.viewShow = true;
    },
    handleEdit(params) {
      // console.log("编辑parwwwams", params);
    },
    handleDelete(params) {
      let data = {
        id: params.row.id
      };
      infomationDel(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.$Message.success(vo.msg);
          } else {
            this.$Message.error(vo.msg);
          }
        } else {
          this.Message.error("请求超时");
        }
      });
    },
    handleApprove(params) {
      let data = {
        id: params.row.id
      };
      infomationApprove(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.$Message.success(vo.msg);
            this.tableData.splice(params.row.initRowIndex,1)
          } else {
            this.$Message.error(vo.msg);
          }
        } else {
          this.Message.error("请求超时");
        }
      });
    },
    handleCancelApprove(params) {
      let data = {
        id: params.row.id
      };
      infomationCancelApprove(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.$Message.success(vo.msg);
            let row = this.tableData[params.row.initRowIndex];
            row.status = 0;
            //删除取消提交按钮
            for (let i = 0; i < row.buttonAccess.length; i++) {
              if (row.buttonAccess[i] == "cancelApprove") {
                row.buttonAccess.splice(i, 1);
              }
            }
            row.buttonAccess.push("edit", "delete");
          } else {
            this.$Message.error(vo.msg);
          }
        } else {
          this.Message.error("请求超时");
        }
      });
    },
    // 编辑排序
    handleSortSave(params) {
      let oldsort = params.row.sort;
      let sort = parseInt(params.value);
      let data = {
        id: params.row.id,
        sort: sort
      };
      infomationEditSort(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
          } else if (vo.status == "tokenExpire" || vo.status == "tokenFail") {
            // token 过期 跳转登录页面 todo
            this.$Message.error("token 错误， 请重新登录");
          } else {
            this.$Message.error(vo.msg);
            this.tableData[params.row.initRowIndex].sort = oldsort;
            return false;
          }
        } else {
          this.$Message.error("请求超时");
        }
      });
    },
    // 搜索方法
    handleSearchCustom(key, value) {
      let data = {};
      let has = false;
      if (key == "category" && value > 0) {
        data.categoryId = value;
        has = true;
      }
      if (key == "title" && value.length > 0) {
        data.title = value;
        has = true;
      }
      if (has) {
        this.searchData = data;
        this.initFind(data);
      }
    },
    //改变select  给 搜索select 赋值
    handleSearchChange(column) {
      column.filters = this.categoryList;
    },
    handleSearchClear() {
      this.searchData = {};
      this.initFind();
    }
  },
  mounted() {
    this.initFind();
    // 搜索分类用
    infomationCategoryList().then(res => {
      if (res.data.status == "success") {
        this.categoryList = res.data.data;
      }
    });
  }
};
</script>
<style>
</style>
