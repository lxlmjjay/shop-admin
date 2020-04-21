<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-approve="handleApprove"
        @on-view="handleView"
        @on-search-custom="handleSearchCustom"
        @on-search-custom-change="handleSearchChange"
        @on-search-custom-clear="handleSearchClear"
        @on-save-edit="handleSortSave"
      />
      <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
    </Card>

    <Modal v-model="approveShow" title="设置" width="760px" ok-text="提交" @on-ok="approve">
      <Row>
        <Col>
          <h3>积分百分比：</h3>
          <InputNumber v-model="data.scale" :min="0" :precision="0"></InputNumber>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <h3>添加认证：</h3>
          <Select v-model="data.flag" :label-in-value="true" multiple style="width:260px">
            <Option v-for="item in flags" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </Col>
      </Row>
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
  findGoodsConfirm,
  findGoodsFlag,
  goodsApprove,
  getGoodsFlag,
  goodsListReject
} from "@/api/shop/admin";
export default {
  name: "goods_list_confirm",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        {
          title: "ID",
          key: "id",
          tooltip: true
        },
        {
          title: "标题",
          key: "name",
          tooltip: true
        },
        {
          title: "简介",
          key: "desc",
          tooltip: true
        },
        {
          title: "排序",
          key: "sort",
          tooltip: true,
          // checkAccess: ["super_admin"],
          // sortable: "custom"
          editable: true,
          editShow: true //开启单元格编辑
        },
        {
          title: "操作",
          key: "handle",
          width: 200,
          options: ["view", "approve"],
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
                      let data = { id: params.row.id };
                      goodsListReject(data)
                        .then(res => {
                          if (res.data.status == "tokenFail") {
                            this.$Message.error("请重新登录");
                            this.$router.push({
                              name: "login"
                            });
                            //token 过期 跳login
                          } else if (res.data.status == "success") {
                            this.$Message.success(res.data.msg);
                            this.find({ page: this.currentPage });
                          } else {
                            this.$Message.error(res.data.msg);
                          }
                        })
                        .catch(err => {});
                    }
                  }
                },
                "拒绝"
              );
            }
          ]
        }
      ],
      statusText: { 1: "" },
      tableData: [],
      approveShow: false,
      viewData: {
        image: null
      },
      total: 0,
      currentPage: 1,
      cancelButtonShow: false,
      categoryList: [],
      searchData: {},
      data: { scale: 0, flag: [] },
      flags: []
    };
  },
  methods: {
    find(data) {
      if (data) {
        data.status = 1;
      } else {
        data = { status: 1 };
      }
      findGoodsConfirm(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.total = res.data.total;
            this.tableData = res.data.data;
          }
        } else {
          this.Message.error("请求超时");
        }
      });
    },
    findFlags() {
      findGoodsFlag().then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.flags = vo.data;
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
      this.currentPage = page;
      this.find(data);
    },
    handleView(params) {
      this.$router.push({
        name: "goods_list_confirm_sku",
        params: {
          gid: params.row.id,
          cid: params.row.cid,
          page: this.currentPage
        }
      });
    },
    handleApprove(params) {
      this.data.scale = params.row.scale;
      this.params = params;
      this.approveShow = true;
      let data = { id: params.row.id };
      getGoodsFlag(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.data.flag = vo.data;
          } else {
            this.$Message.error(vo.msg);
          }
        } else {
          this.Message.error("请求超时");
        }
      });
    },
    approve() {
      let data = {
        id: this.params.row.id,
        scale: this.data.scale,
        fid: this.data.flag
      };
      goodsApprove(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.$Message.success(vo.msg);
            this.find({ page: 1 });
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
        this.reset();
      });
    },
    // 编辑排序
    handleSortSave(params) {},
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
        this.find(data);
      }
    },
    //改变select  给 搜索select 赋值
    handleSearchChange(column) {
      column.filters = this.categoryList;
    },
    handleSearchClear() {
      this.searchData = {};
      this.find();
    },
    reset() {
      this.data = {};
    }
  },
  mounted() {
    if (this.$route.params.page) {
      this.currentPage = this.$route.params.page;
    }
    this.find({ page: this.currentPage });
    this.findFlags();
  }
};
</script>
<style>
</style>
