<template>
  <div>
    <Card>
      <div>
        <Tabs type="card">
          <TabPane label="所有商家列表">
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
          </TabPane>
          <TabPane label="待审核商家列表">
            <tables ref="tables" search-place="top" v-model="tableData2" :columns="columns2" />
          </TabPane>
        </Tabs>
      </div>
    </Card>
    <Modal v-model="isShow" title="照片" width="800px" @on-cancel="cancel">
      店铺名称：{{data.name}}
      <br />
      经营品牌：{{data.brand}}
      <br />
      店铺地址：{{data.address}}
      <br />
      店铺标语：{{data.slogan}}
      <br />店铺头像：
      <br />
      <img :src="data.header" alt style="width:20%;" />
      <br />店铺二维码：
      <br />
      <img :src="data.qrCode" alt style="width:20%;" />
      <br />
    </Modal>
  </div>
</template>
<script>
import Tables from "_c/tables";
import {
  findStore,
  findStorePending,
  getStorePending,
  approveStore
} from "@/api/shop/admin";
import { baseImgUrl } from "@/libs/util";
export default {
  name: "community_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        // { title: "ID", key: "id" },
        { title: "店铺名称", key: "name", tooltip: true },
        { title: "经营品牌", key: "brand", tooltip: true },
        { title: "粉丝数量", key: "fansCount", tooltip: true },
        { title: "创建时间", key: "created", tooltip: true },
        { title: "状态", key: "statusName" },
        // { title: "创建时间", key: "created" ,tooltip:true},
        {
          title: "操作",
          key: "handle",
          //   options: ["delete"],
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      // this.get(params.row.id);
                      this.data.name = params.row.name;
                      this.data.brand = params.row.brand;
                      this.data.address = params.row.address;
                      this.data.slogan = params.row.slogan;
                      this.data.header = params.row.header;
                      this.data.qrCode = params.row.qrCode;
                      this.isShow = true;
                    }
                  }
                },
                "查看"
              );
            }
          ]
        }
      ],
      columns2: [
        // { title: "ID", key: "id" },
        { title: "店铺名称", key: "name", tooltip: true },
        { title: "经营品牌", key: "brand", tooltip: true },
        { title: "粉丝数量", key: "fansCount", tooltip: true },
        { title: "创建时间", key: "created", tooltip: true },
        // { title: "创建时间", key: "created" ,tooltip:true},
        {
          title: "操作",
          key: "handle",
          width: 300,
          //   options: ["delete"],
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "8px"
                  },
                  on: {
                    click: () => {
                      this.get(params.row.id);
                      this.isShow = true;
                    }
                  }
                },
                "查看修改数据"
              );
            },
            (h, params, vm) => {
              return h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确定审核通过吗?"
                  },

                  on: {
                    "on-ok": () => {
                      this.approve(params.row.id, 1);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "8px"
                      }
                    },
                    "通过"
                  )
                ]
              );
            },
            (h, params, vm) => {
              return h(
                "Poptip",
                {
                  props: {
                    size: "small",
                    type: "primary",
                    confirm: true,
                    title: "确定拒绝吗?"
                  },
                  on: {
                    "on-ok": () => {
                      this.approve(params.row.id, 2);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        marginRight: "8px"
                      }
                    },
                    "拒绝"
                  )
                ]
              );
            }
          ]
        }
      ],
      tableData: [],
      tableData2: [],
      isShow: false,
      total: 0,
      currentPage: 0,
      files: [],
      baseUrl: baseImgUrl(),
      data: {}
    };
  },
  methods: {
    find() {
      this.tableData = [];
      this.tableData2 = [];
      findStore()
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            console.log(res.data);
            if (res.data.data != null) {
              this.tableData = res.data.data;
            }
          }
        })
        .catch(err => {});
      findStorePending()
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            if (res.data.data != null) {
              this.tableData2 = res.data.data;
            }
          }
        })
        .catch(err => {});
    },
    get(id) {
      let data = {
        id: id
      };
      getStorePending(data)
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            console.log(res.data);
            this.data = res.data.data;
          }
        })
        .catch(err => {});
    },
    approve(id, status) {
      let data = { id: id, status: status };
      approveStore(data)
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            this.$Message.success("操作成功");
            this.find();
          } else {
            this.$Message.error("操作失败");
          }
        })
        .catch(err => {});
    },
    changePage(page) {
      this.currentPage = page;
      this.find();
    },
    cancel() {
      this.data = {};
      this.isShow = false;
    },
    handleDelete(params) {},
    handleSuccess(res, file) {
      //   this.data.imageUrl = window.URL.createObjectURL(file)
    }
  },
  mounted() {
    this.find();
  }
};
</script>

<style>
</style>
