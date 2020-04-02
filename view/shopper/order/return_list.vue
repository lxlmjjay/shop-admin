<template>
  <div>
    <Card>
      <Tabs type="card">
        <TabPane label="所有售后订单列表">
          <tables ref="tables" search-place="top" v-model="tableData" :columns="columns" />
          <div style="margin-top:20px;float:right;margin-right:20px;">
            <Page :total="total" show-elevator :current="1" @on-change="changePage" />
          </div>
        </TabPane>
        <TabPane label="待处理退货列表">
          <tables
            ref="tables1"
            search-place="top"
            v-model="tableDataReturn"
            :columns="columnsReturn"
          />
        </TabPane>
      </Tabs>
    </Card>
    <Modal v-model="isShowConfirm" title="确认框" width="300px" @on-ok="handleApproveOk(1)">
      <div>确定同意退款吗？</div>
    </Modal>
    <Modal v-model="isShowConfirm2" title="确认框" width="300px" @on-ok="handleApproveOk(2)">
      <div>确定拒绝退款吗？</div>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { findReturnOrders, returnApprove } from "@/api/shop/order";
export default {
  name: "order_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        {
          title: "退单编号",
          key: "returnNo",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "订单编号",
          key: "orderNo",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "商品编号",
          key: "skuNo",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "商品名称",
          key: "skuName",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "退单金额",
          key: "returnAmount",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "扣除优惠",
          key: "returnDiscount",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "退单数量",
          key: "returnCount",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "申请人",
          key: "userId",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "状态",
          key: "status",
          tooltip: true,
          render: (h, params) => {
            let text = {
              // 状态 1申请中 2 商家审核，正在退货 3 完成
              1: "待审核",
              2: "已审核",
              3: "已完成"
            };
            return h("span", {}, text[params.row.status]);
          }
        }
      ],
      columnsReturn: [
        {
          title: "退单编号",
          key: "returnNo",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "订单编号",
          key: "orderNo",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "商品编号",
          key: "skuNo",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "商品名称",
          key: "skuName",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "退单金额",
          key: "returnAmount",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "扣除优惠",
          key: "returnDiscount",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "退单数量",
          key: "returnCount",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "申请人",
          key: "userId",
          maxWidth: 200,
          tooltip: true
        },
        {
          title: "操作",
          key: "handle",
          options: ["view"],
          width: 200,
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
                      this.isShowConfirm = true;
                      this.params = params;
                    }
                  }
                },
                "同意"
              );
            },
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
                      this.isShowConfirm2 = true;
                      this.params = params;
                    }
                  }
                },
                "拒绝"
              );
            }
          ]
        }
      ],
      tableData: [],
      tableDataReturn: [],
      isShowConfirm: false,
      isShowConfirm2: false,
      total: 0,
      currentPage: 1,
      params: {}
    };
  },
  methods: {
    find(data) {
      findReturnOrders(data).then(res => {
        var vo = res.data;
        if (vo.status == "success" && vo.data != null) {
          this.total = res.data.total;
          this.tableData = res.data.data;
        }
      });
    },
    findReturn() {
      let data = { page: -1, status: 1 };
      findReturnOrders(data).then(res => {
        var vo = res.data;
        this.tableDataReturn = [];
        if (vo.status == "success") {
          if (vo.data == null) {
            this.tableDataReturn = [];
          } else {
            this.tableDataReturn = res.data.data;
          }
        }
      });
    },
    changePage(page) {
      this.currentPage = page;
      this.find({ page: this.currentPage });
    },
    handleApproveOk(isYes) {
      let data = { returnNo: this.params.row.returnNo, isYes: isYes };
      returnApprove(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.find({ page: this.currentPage });
          this.findReturn();
          this.$Message.success("操作成功");
        }
      });
    },
    reset() {
      this.isShowView = false;
      this.isShowConfirm = false;
      this.isShowConfirm2 = false;
    }
  },
  mounted() {
    this.find({ page: this.currentPage });
    this.findReturn();
  }
};
</script>
<style>
</style>
