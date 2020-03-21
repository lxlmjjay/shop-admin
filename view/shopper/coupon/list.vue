<template>
  <div>
    <Button @click="add" style="margin-bottom: 10px;" type="primary">添加优惠卷</Button>
    <Card>
      <tables
        ref="tables"
        editable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"
        @on-edit="handleEdit"
      />
      <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
    </Card>
    <div style="margin-top:20px;float:right;margin-right:20px;">
      <Page :total="total" show-elevator :current="1" @on-change="changePage" />
    </div>

    <Modal v-model="isShow.add" title="设置" width="760px" ok-text="提交" @on-ok="submit">
      <Row>
        <Col>
          <h3>名称：</h3>
          <div>
            <Input v-model="data.desc" placeholder="优惠卷名称" clearable style="width:300px;"></Input>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>类型：</h3>
          <Select v-model="data.type" style="width:260px">
            <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row v-show="data.type ==1">
        <Col>
          <h3>优惠金额：</h3>
          <InputNumber v-model="data.value" :min="0" :precision="2"></InputNumber>
        </Col>
      </Row>
      <br />
      <Row v-show="data.type ==2">
        <Col>
          <h3>商品折扣：</h3>
          <InputNumber v-model="data.sale" :min="0" :max="100" :precision="0"></InputNumber>% (90代表9折)
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>使用限制：</h3>订单满
          <InputNumber v-model="data.canUse" :min="0" :precision="2"></InputNumber>元可用
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>有效期：</h3>
          <Select v-model="data.isForever" style="width:260px">
            <Option v-for="item in times" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row v-show="data.isForever ==2">
        <Col>
          <h3>请选择期限：</h3>
          <DatePicker
            v-model="data.time"
            format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            split-panels
            placeholder="Select date"
            style="width: 300px"
          ></DatePicker>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  findCoupons,
  addCoupon,
  editCoupon,
  delCoupon
} from "@/api/shop/coupon";
export default {
  name: "goods_list_confirm",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        {
          title: "标题",
          key: "desc",
          maxWidth: 200,
          ellipsis: true
        },
        {
          title: "类型",
          key: "type",
          maxWidth: 200,
          ellipsis: true,
          render: (h, params) => {
            let text = { 1: "代金券", 2: "折扣卷" };
            return h("span", {}, text[params.row.type]);
          }
        },
        {
          title: "价值",
          key: "",
          maxWidth: 200,
          ellipsis: true,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.type == 1
                ? "￥" + params.row.value
                : params.row.sale + " 折"
            );
          }
        },
        {
          title: "满减",
          key: "canUse",
          width: 200,
          ellipsis: true,
          render: (h, params) => {
            return h("span", {}, "满" + params.row.canUse + "元可用");
          }
        },
        {
          title: "有效期到",
          key: "endTime",
          width: 200,
          ellipsis: true
        },
        {
          title: "状态",
          key: "status",
          width: 200,
          ellipsis: true,
          render: (h, params) => {
            let text = { 1: "启用", 2: "禁用" };
            return h("span", {}, text[params.row.status]);
          }
        },
        {
          title: "操作",
          key: "handle",
          options: ["edit", "delete"]
        }
      ],
      tableData: [],
      isShow: { add: false },
      total: 0,
      currentPage: 1,
      isEditing: false,
      data: { type: 1, sale: 90, isForever: 1, value: 10, canUse: 1 },
      types: [
        { value: 1, label: "代金券" },
        { value: 2, label: "折扣卷" }
      ],
      times: [
        { value: 1, label: "长期有效" },
        { value: 2, label: "设置期限" }
      ]
    };
  },
  methods: {
    find(data) {
      findCoupons(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.total = res.data.total;
          this.tableData = res.data.data;
        } else {
          this.$Message.error(vo.msg);
        }
      });
    },
    changePage(page) {
      this.currentPage = page;
      this.find({ page: this.currentPage });
    },
    add() {
      this.isShow.add = true;
    },
    submit() {
      if (this.isEditing) {
        console.log(8989);
        this.editFun();
      } else {
        console.log(2222);
        this.addFun();
      }
    },
    editFun() {
      let data = this.submitData();
      data.id = this.data.id;
      editCoupon(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.$Message.success(vo.msg);
          this.find({ page: this.currentPage });
          this.reset();
        } else {
          this.$Message.error(vo.msg);
        }
      });
      this.isEditing = false;
    },
    addFun() {
      let data = this.submitData();
      addCoupon(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.$Message.success(vo.msg);
          this.find({ page: this.currentPage });
          this.reset();
        } else {
          this.$Message.error(vo.msg);
        }
      });
    },
    handleDelete(params) {
      let data = {
        id: params.row.id
      };
      delCoupon(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.$Message.success(vo.msg);
          this.find({ page: this.currentPage });
          this.reset();
        } else {
          this.$Message.error(vo.msg);
        }
      });
      console.log(params);
    },
    handleEdit(params) {
      this.data.id = params.row.id;
      this.data.desc = params.row.desc;
      this.data.canUse = parseFloat(params.row.canUse);
      this.data.type = parseInt(params.row.type);
      this.data.isForever = parseInt(params.row.isForever);
      this.data.startTime = params.row.startTime;
      this.data.sale = parseInt(params.row.sale);
      this.data.canUvaluese = parseFloat(params.row.value);
      this.isShow.add = true;
      this.isEditing = true;
    },
    submitData() {
      let data = {
        desc: this.data.desc,
        canUse: this.data.canUse,
        type: this.data.type,
        isForever: this.data.isForever
      };
      if (this.data.isForever == 2) {
        data.startTime = this.data.time[0];
        data.endTime = this.data.time[1];
      }
      if (this.data.type == 1) {
        data.value = this.data.value;
      } else {
        data.sale = this.data.sale;
      }
      return data;
    },
    reset() {
      this.isShow = { add: false };
      this.data = { type: 1, sale: 90, isForever: 1, value: 10, canUse: 1 };
    }
  },
  mounted() {
    this.find({ page: this.currentPage });
  }
};
</script>
<style>
</style>
