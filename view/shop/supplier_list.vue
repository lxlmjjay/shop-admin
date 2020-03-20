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
              <tables
                ref="tables"
                search-place="top"
                v-model="tableData2"
                :columns="columns2"
              />
            </TabPane>
        </Tabs>
      </div>
    </Card>
    <Modal v-model="isShow" title="照片" width="800px" @on-cancel="cancel">
      <div v-for="file in files">
        <img :src="baseUrl+file" alt style="width:100%;" />
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { findSupplier, findSupplierPending,getSupplierFile,approvalSupplier } from "@/api/shop/admin";
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
        { title: "姓名", key: "name",tooltip:true },
        { title: "电话", key: "username" ,tooltip:true},
        // { title: "备用电话", key: "phone" ,tooltip:true},
        { title: "身份证", key: "idCard" ,tooltip:true},
        { title: "备注", key: "remark" ,tooltip:true},
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
                  props: {},
                  on: {
                    click: () => {
                      this.get(params.row.id)
                      this.isShow = true;
                    }
                  }
                },
                "查看"
              );
            },
          ]
        }
      ],
      columns2: [
        // { title: "ID", key: "id" },
        { title: "姓名", key: "name",tooltip:true },
        { title: "电话", key: "username" ,tooltip:true},
        // { title: "备用电话", key: "phone" ,tooltip:true},
        { title: "身份证", key: "idCard" ,tooltip:true},
        { title: "备注", key: "remark" ,tooltip:true},
        // { title: "状态", key: "statusName" },
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
                  props: {},
                  on: {
                    click: () => {
                      this.get(params.row.id)
                      this.isShow = true;
                    }
                  }
                },
                "查看"
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
                      this.approve(params.row.id, 1)
                    }
                  }
                },
                [h("Button", "通过")]
              );
            },
            (h, params, vm) => {
              return h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确定拒绝吗?"
                  },
                  on: {
                    "on-ok": () => {
                      this.approve(params.row.id, 2)
                    }
                  }
                },
                [h("Button", "拒绝")]
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
      files:[],
      baseUrl:baseImgUrl()
    };
  },
  methods: {
    find() {
      this.tableData = []
      this.tableData2 = []
      findSupplier()
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            if (res.data.data!=null){
              this.tableData = res.data.data
            }
          }
        })
        .catch(err => {});
      findSupplierPending()
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            if (res.data.data!=null){
              this.tableData2 = res.data.data
            }
          }
        })
        .catch(err => {});
    },
    get(id){
      let data = {
        id:id
      }
      getSupplierFile(data)
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            console.log(res.data)
            this.files = res.data.data
          }
        })
        .catch(err => {});
    },
    approve(id,status){
      let data = {id:id,status:status}
      approvalSupplier(data)
        .then(res => {
          if (res.data.status == "tokenFail") {
            //token 过期 跳login
          } else if (res.data.status == "success") {
            this.$Message.success("操作成功");
            this.find()
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
