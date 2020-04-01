<template>
  <div>
    <Card>
      <Tabs type="card">
        <TabPane label="所有订单列表">
          <tables
            ref="tables"
            search-place="top"
            v-model="tableData"
            :columns="columns"
            @on-view="handleView"
          />
          <div style="margin-top:20px;float:right;margin-right:20px;">
            <Page :total="total" show-elevator :current="1" @on-change="changePage" />
          </div>
        </TabPane>
        <!-- <TabPane label="待处理退货列表">
          <tables
            ref="tables1"
            search-place="top"
            v-model="tableDataReturn"
            :columns="columns"
            @on-view="handleView"
          />
        </TabPane>-->
      </Tabs>
    </Card>

    <Modal v-model="isShowView" title="子订单" width="780px" footer="hide">
      <tables ref="tables1" editable search-place="top" v-model="details" :columns="columnsDetail" />
    </Modal>
    <Modal v-model="isShowPost" title="确认发货" width="780px" @on-ok="handlePostOk">
      <Row>
        <Col>
          <h3>输入快递单号：</h3>
          <Input
            v-model="post.postNo"
            placeholder="请输入快递单号..."
            style="width: 200px"
            @on-blur="findPosts"
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <h3>选择快递公司：</h3>
          <Select
            v-model="post.postCode"
            style="width:260px"
            :label-in-value="true"
            @on-change="changePost"
          >
            <Option
              v-for="item in posts"
              :value="item.ShipperCode"
              :key="item.ShipperCode"
            >{{ item.ShipperName }}</Option>
          </Select>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { findOrders, findPosts, shipped } from "@/api/shop/order";
export default {
  name: "order_list",
  components: {
    Tables
  },
  data() {
    return {
      columnsDetail: [
        {
          title: "子订单ID",
          key: "detailId",
          width: 100,
          tooltip: true
        },
        {
          title: "商品ID",
          key: "goodsSkuId",
          width: 100,
          tooltip: true
        },
        {
          title: "商品名称",
          key: "goodsSkuName",
          width: 200,
          tooltip: true
        },
        {
          title: "商品编号",
          key: "goodsSkuNo",
          width: 150,
          tooltip: true
        },
        {
          title: "购买数量",
          key: "goodsCount",
          width: 100,
          tooltip: true
        },
        {
          title: "购买价格",
          key: "goodsPrice",
          width: 100,
          tooltip: true
        }
      ],
      columns: [
        {
          title: "订单号",
          key: "orderNo",
          width: 200,
          tooltip: true
        },
        {
          title: "订单金额",
          key: "totalAmount",
          width: 150,
          tooltip: true
        },
        {
          title: "优惠金额",
          key: "discountStore",
          width: 150,
          tooltip: true
        },
        {
          title: "实付金额",
          key: "payAmount",
          width: 150,
          tooltip: true
        },
        {
          title: "商品数量",
          key: "",
          width: 150,
          tooltip: true,
          render: (h, params) => {
            return h("span", {}, params.row.details.length);
          }
        },
        {
          title: "订单状态",
          key: "status",
          width: 200,
          tooltip: true,
          render: (h, params) => {
            let text = {
              // 订单状态 1未付款, 2已取消, 3已过期 4已付款,待发货,5已发货,6已完成,7申请退货,8已审核正在退货中,9退货完成
              1: "未付款",
              2: "已取消",
              3: "已过期",
              4: "已付款,待发货",
              5: "已发货",
              6: "已完成",
              7: "申请退货",
              8: "已审核正在退货中",
              9: "退货完成"
            };
            return h("span", {}, text[params.row.status]);
          }
        },
        {
          title: "操作",
          key: "handle",
          options: ["view"],
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
                      this.isShowPost = true;
                      this.params = params;
                    }
                  }
                },
                "确认发货"
              );
            }
          ]
        }
      ],
      tableData: [],
      tableDataReturn: [],
      details: [],
      isShowView: false,
      total: 0,
      currentPage: 1,
      isShowPost: false,
      //快递相关
      posts: [],
      post: { postNo: "", postCode: "", postName: "" },
      params: {}
    };
  },
  methods: {
    find(data) {
      findOrders(data).then(res => {
        var vo = res.data;
        if (vo.status == "success" && vo.data != null) {
          this.total = res.data.total;
          this.tableData = res.data.data;
        }
      });
    },
    findPosts() {
      if (this.post.postNo.length < 7) {
        this.$Message.error("单号不合法");
        return;
      }
      let data = {
        name: this.post.postNo
      };
      findPosts(data).then(res => {
        var vo = res.data;
        if (vo.status == "success" && vo.data != null) {
          this.posts = vo.data;
        }
      });
    },
    changePost(item) {
      this.post.postCode = item.value;
      this.post.postName = item.label;
    },
    handlePostOk() {
      if (
        this.params.row.orderNo.length < 8 ||
        this.post.postNo.length < 7 ||
        this.post.postName.length < 1 ||
        this.post.postCode.length < 1
      ) {
        this.$Message.error("单号不合法");
        return;
      }
      let data = {
        orderNo: this.params.row.orderNo,
        postNo: this.post.postNo,
        postName: this.post.postName,
        postCode: this.post.postCode
      };
      shipped(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.$Message.success(vo.msg);
        } else {
          this.$Message.error(vo.msg);
        }
      });
    },
    changePage(page) {
      this.currentPage = page;
      this.find({ page: this.currentPage });
    },
    handleView(params) {
      this.details = params.row.details;
      console.log(params);
      this.isShowView = true;
    },
    reset() {
      this.isShowView = false;
    }
  },
  mounted() {
    this.find({ page: this.currentPage });
  }
};
</script>
<style>
</style>
