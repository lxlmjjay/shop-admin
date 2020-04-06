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
    <Modal
      v-model="isShow.add"
      title="设置"
      width="760px"
      ok-text="提交"
      @on-ok="submit"
      @on-cancel="reset"
    >
      <Row>
        <Col>
          <div>
            名称：
            <Input v-model="data.desc" placeholder="优惠卷名称" clearable style="width:300px;"></Input>
          </div>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          类型：
          <Select v-model="data.type" style="width:260px">
            <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <br />
      <Row>
        <Col v-show="data.type ==1">
          优惠金额：
          <InputNumber v-model="data.value" :min="0" :precision="2"></InputNumber>
        </Col>
        <Col v-show="data.type ==2">
          商品折扣：
          <InputNumber v-model="data.sale" :min="0" :max="100" :precision="0"></InputNumber>% (90代表9折)
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          订单满
          <InputNumber v-model="data.canUse" :min="0" :precision="2"></InputNumber>元可用
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          使用范围：
          <Select v-model="data.scope" style="width:260px">
            <Option v-for="item in scopes" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          有效期：
          <Select v-model="data.isForever" style="width:260px">
            <Option v-for="item in times" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <br />
      <Row v-show="data.isForever ==2">
        <Col>
          <h3>请选择期限：</h3>
          <DatePicker
            v-model="data.time"
            type="datetimerange"
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
          tooltip: true
        },
        {
          title: "类型",
          key: "type",
          maxWidth: 200,
          tooltip: true,
          render: (h, params) => {
            let text = { 1: "代金券", 2: "折扣卷" };
            return h("span", {}, text[params.row.type]);
          }
        },
        {
          title: "价值",
          key: "",
          maxWidth: 200,
          tooltip: true,
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
          maxWidth: 200,
          tooltip: true,
          render: (h, params) => {
            return h("span", {}, "满" + params.row.canUse + "元可用");
          }
        },
        {
          title: "范围",
          key: "scope",
          maxWidth: 200,
          tooltip: true,
          render: (h, params) => {
            let text = { 1: "部分可用", 2: "店铺通用", 3: "平台通过" };
            return h("span", {}, text[params.row.scope]);
          }
        },
        {
          title: "有效期到",
          key: "endTime",
          maxWidth: 300,
          tooltip: true,
          render: (h, params) => {
            return h(
              "span",
              {},
              params.row.isForever == 1 ? "永久有效" : params.row.endTime
            );
          }
        },
        // {
        //   title: "状态",
        //   key: "status",
        //   maxWidth: 200,
        //   tooltip: true,
        //   render: (h, params) => {
        //     let text = { 1: "启用", 2: "禁用" };
        //     return h("span", {}, text[params.row.status]);
        //   }
        // },
        {
          title: "操作",
          key: "handle",
          width: 200,
          options: ["edit", "delete"]
        }
      ],
      tableData: [],
      isShow: { add: false },
      total: 0,
      currentPage: 1,
      isEditing: false,
      data: {
        desc: "",
        type: 1,
        sale: 90,
        isForever: 1,
        value: 10,
        canUse: 1,
        scope: 1,
        time: []
      },
      types: [
        { value: 1, label: "代金券" },
        { value: 2, label: "折扣卷" }
      ],
      times: [
        { value: 1, label: "长期有效" },
        { value: 2, label: "设置期限" }
      ],
      scopes: [
        { value: 1, label: "部分商品可用" },
        { value: 2, label: "全店通用" }
      ]
    };
  },
  methods: {
    find(data) {
      findCoupons(data).then(res => {
        var vo = res.data;
        if (vo.status == "success" && vo.data != null) {
          this.total = res.data.total;
          this.tableData = res.data.data;
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
        this.editFun();
      } else {
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
      console.log(this.data.time);
      if (this.data.desc.length == 0) {
        this.$Message.error("必须输入标题");
        return false;
      }
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
      this.data.scope = parseInt(params.row.scope);
      this.data.isForever = parseInt(params.row.isForever);
      this.data.time[0] = new Date(params.row.startTime);
      this.data.time[1] = new Date(params.row.endTime);
      this.data.sale = parseInt(params.row.sale);
      this.data.canUvaluese = parseFloat(params.row.value);
      this.isShow.add = true;
      this.isEditing = true;
      console.log(this.data.time);
    },
    submitData() {
      let data = {
        desc: this.data.desc,
        canUse: this.data.canUse,
        type: this.data.type,
        isForever: this.data.isForever,
        scope: this.data.scope
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
      this.data = {
        desc: "",
        type: 1,
        sale: 90,
        isForever: 1,
        value: 10,
        canUse: 1,
        scope: 1,
        time: []
      };
    }
  },
  mounted() {
    this.find({ page: this.currentPage });
  }
};
</script>
<style>
</style>
