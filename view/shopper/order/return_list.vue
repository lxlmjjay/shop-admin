<template>
  <div>
    <Card>
      <Tabs type="card">
        <TabPane label="所有订单列表">
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
            @on-approve="handleApprove"
          />
        </TabPane>
      </Tabs>
    </Card>
    <Modal v-model="isShowConfirm" title="确认框" width="300px" @on-ok="handleApproveOk">
      <div>确定退款审核通过吗？</div>
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
          width: 200,
          tooltip: true
        },
        {
          title: "订单编号",
          key: "orderNo",
          width: 200,
          tooltip: true
        },
        {
          title: "商品编号",
          key: "skuNo",
          width: 150,
          tooltip: true
        },
        {
          title: "商品名称",
          key: "skuName",
          width: 200,
          tooltip: true
        },
        {
          title: "退单金额",
          key: "returnAmount",
          width: 100,
          tooltip: true
        },
        {
          title: "扣除优惠",
          key: "returnDiscount",
          width: 100,
          tooltip: true
        },
        {
          title: "退单数量",
          key: "returnCount",
          width: 100,
          tooltip: true
        },
        {
          title: "申请人",
          key: "userId",
          width: 150,
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
              2: "已审核，进行中",
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
          width: 200,
          tooltip: true
        },
        {
          title: "订单编号",
          key: "orderNo",
          width: 200,
          tooltip: true
        },
        {
          title: "商品编号",
          key: "skuNo",
          width: 150,
          tooltip: true
        },
        {
          title: "商品名称",
          key: "skuName",
          width: 200,
          tooltip: true
        },
        {
          title: "退单金额",
          key: "returnAmount",
          width: 100,
          tooltip: true
        },
        {
          title: "扣除优惠",
          key: "returnDiscount",
          width: 100,
          tooltip: true
        },
        {
          title: "退单数量",
          key: "returnCount",
          width: 100,
          tooltip: true
        },
        {
          title: "申请人",
          key: "userId",
          width: 150,
          tooltip: true
        },
        {
          title: "操作",
          key: "handle",
          options: ["view", "approve"]
        }
      ],
      tableData: [],
      tableDataReturn: [],
      isShowConfirm: false,
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
        if (vo.status == "success" && vo.data != null) {
          this.tableDataReturn = res.data.data;
        } else {
          this.$Message.error(vo.msg);
        }
      });
    },
    changePage(page) {
      this.currentPage = page;
      this.find({ page: this.currentPage });
    },
    handleApprove(params) {
      console.log("退款审核", params);
      this.isShowConfirm = true;
      this.params = params;
    },
    handleApproveOk() {
      let data = { returnNo: this.params.row.returnNo };
      returnApprove(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.$Message.success(vo.msg);
          this.findReturn();
        }
      });
    },
    reset() {
      this.isShowView = false;
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
