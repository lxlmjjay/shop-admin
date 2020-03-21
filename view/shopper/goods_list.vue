<template>
  <div>
    <Card>
      <div>
        <!-- <Button @click="create" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">添加商品</Button> -->
      </div>
      <tables
        ref="tables"
        editable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"
      />
      <Modal v-model="approveShow" title="设置" width="760px" ok-text="提交" @on-ok="editFlag">
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
    </Card>
    <Modal
      v-model="couponShow"
      title="设置商品优惠卷"
      width="760px"
      ok-text="提交"
      @on-ok="setCoupon"
      @on-cancel="reset"
    >
      <Row>
        <Col>
          <h3>选择商品优惠卷：</h3>
          <Select v-model="coupon" multiple style="width:260px">
            <Option v-for="item in coupons" :value="item.id" :key="item.id">{{ item.desc }}</Option>
          </Select>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  findGoods,
  submitGoods,
  downGoods,
  editFlagScale,
  findGoodsFlag,
  getGoodsFlag
} from "@/api/shop/admin";

import { findCoupons, useCoupon, findGoodsCouponArr } from "@/api/shop/coupon";
export default {
  name: "admin_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "ID", key: "id", width: 100, ellipsis: true },
        { title: "名称", key: "name", width: 150, ellipsis: true },
        { title: "描述", key: "desc", width: 150, ellipsis: true },
        { title: "排序", key: "sort", width: 100, ellipsis: true },
        { title: "积分比例", key: "scale", width: 100, ellipsis: true },
        {
          title: "状态",
          key: "status",
          ellipsis: true,
          render: (h, params) => {
            let text = { 0: "草稿", 1: "待审核", 2: "已发布", 3: "禁用" };
            return h("span", {}, text[params.row.status]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 500,
          tooltip: true,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  style: {
                    marginRight: "8px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  directives: [
                    {
                      name: "button_access",
                      access: "goods_flag"
                    }
                  ],
                  on: {
                    click: () => {
                      let data = { id: params.row.id };
                      findGoodsCouponArr(data).then(res => {
                        this.coupon = res.data.data;
                        this.couponShow = true;
                      });
                      this.params = params;
                    }
                  }
                },
                "设置优惠"
              ),
              h(
                "Button",
                {
                  style: {
                    marginRight: "8px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  directives: [
                    {
                      name: "button_access",
                      access: "goods_flag"
                    }
                  ],
                  on: {
                    click: () => {
                      this.params = params;
                      this.data.scale = params.row.scale;
                      this.getFlag();
                      this.approveShow = true;
                    }
                  }
                },
                "修改积分或认证"
              ),
              h(
                "Button",
                {
                  style: {
                    marginRight: "8px"
                  },
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "goods_sku",
                        params: {
                          gid: params.row.id,
                          cid: params.row.cid,
                          page: this.currentPage
                        }
                      });
                    }
                  }
                },
                "设置sku"
              ),
              h(
                "Button",
                {
                  style: {
                    marginRight: "8px"
                  },
                  props: {
                    type: "success",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.submitGoods(params);
                    }
                  }
                },
                "提交审核"
              ),
              h(
                "Button",
                {
                  style: {
                    marginRight: "8px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "goods_edit",
                        params: {
                          gid: params.row.id,
                          cid: params.row.cid
                        }
                        /*query: {
                                            key: 'key',
                                            msgKey: this.msg
                                        }*/
                      });
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  style: {
                    marginRight: "8px"
                  },
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.downGoods(params);
                    }
                  }
                },
                "下架"
              )
            ]);
          }
        }
      ],
      tableData: [],
      isShow: false,
      approveShow: false, //修改积分或认证
      couponShow: false,
      total: 0,
      currentPage: 1,
      data: {},
      category: [],
      isEditing: false,
      rowId: 0,
      params: {},
      flags: [],
      coupons: [],
      coupon: []
    };
  },
  methods: {
    find(data) {
      findGoods(data).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.data;
      });
      findCoupons({ page: -1 }).then(res => {
        this.coupons = res.data.data;
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
    create() {
      this.isShow = true;
    },
    ok() {
      let data = {
        name: this.data.name
      };
      addGoodsFlag(data)
        .then(res => {
          this.find();
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    cancel() {
      this.data = {};
      this.isShow = false;
    },
    handleDelete(params) {
      let data = { id: params.row.id };
      delGoodsFlag(data)
        .then(res => {
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title)
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-add"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.append(data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-remove"
                }),
                on: {
                  click: () => {
                    this.remove(root, node, data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    append(data) {
      const children = data.children || [];
      children.push({
        title: "appended node",
        expand: true
      });
      this.$set(data, "children", children);
    },
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    submitGoods(params) {
      let data = { id: params.row.id };
      submitGoods(data)
        .then(res => {
          this.tableData[params.index].status = 1;
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    downGoods(params) {
      let data = { id: params.row.id };
      downGoods(data)
        .then(res => {
          this.tableData[params.index].status = 0;
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    editFlag() {
      let data = {
        id: this.params.row.id,
        scale: this.data.scale,
        fid: this.data.flag
      };
      editFlagScale(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.$Message.success(vo.msg);
            this.find({ page: this.currentPage });
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
        this.reset();
      });
    },
    getFlag() {
      let data = {
        id: this.params.row.id
      };
      getGoodsFlag(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.data.flag = res.data.data;
        } else if (vo.status == "tokenExpire" || vo.status == "tokenFail") {
          // token 过期 跳转登录页面 todo
          this.$Message.error("token 错误， 请重新登录");
        } else {
          this.$Message.error(vo.msg);
          return false;
        }
      });
    },
    setCoupon() {
      let data = {
        gid: this.params.row.id,
        id: this.coupon
      };
      useCoupon(data).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.$Message.success(vo.msg);
          this.reset();
        } else if (vo.status == "tokenExpire" || vo.status == "tokenFail") {
          // token 过期 跳转登录页面 todo
          this.$Message.error("token 错误， 请重新登录");
        } else {
          this.$Message.error(vo.msg);
          this.reset();
          return false;
        }
      });
    },
    changePage(page) {
      let data = { page: page };
      this.currentPage = page;
      this.find(data);
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
