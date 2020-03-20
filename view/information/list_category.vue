<template>
  <div>
    <Card>
      <Button @click="addClick" style="margin-bottom: 10px;" type="primary">添加分类</Button>
      <tables
        ref="tables"
        editable
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"
      />
      <!-- <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button> -->
    </Card>
    <Modal v-model="addCategoryShow" title="添加分类" width="760px" ok-text="取消" cancel-text>
      <div>
        <div>
          <Input v-model="data.name" placeholder="分类名称" clearable style="width:300px;"></Input>
        </div><br/>
        <div>
          <Button @click="addc" type="success">保存</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { getTableData } from "@/api/data";
import {
  infomationCategoryList,
  infomationCategoryDel,
  infomationCategoryUpdate,
  infomationCategoryAdd
} from "@/api/information";
export default {
  name: "infomation_category_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        {
          title: "分类名称",
          key: "name",
        },
        {
          title: "创建时间",
          key: "created"
        },
        {
          title: "操作",
          key: "handle",
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  style: {
                    cursor: 'pointer',
                    margin: '8px'
                  },
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.addCategoryShow = true
                      this.data.name = params.row.name
                      this.data.id = params.row.id
                      this.editingRow = params.index
                    }
                  }
                },
                "编辑"
              );
            }
          ],
          options: ["delete"],
        }
      ],
      tableData: [],
      addCategoryShow: false,
      addCategoryName: "",
      addCategoryId: 0,
      data:{},
      editingRow :0,
    };
  },
  methods: {
    addClick() {
      this.addCategoryShow = true;
    },
    addc() {
      let data = {
        name: this.data.name
      };
      if (this.data.id){
        data.id = this.data.id
        infomationCategoryUpdate(data)
          .then(res => {
            const data = res.data;
            console.log(data)
            if (data.status == "success") {
              this.tableData[this.editingRow].name = this.data.name;
              this.$Message.success(data.msg);
              this.addCategoryShow = false;
              this.data = {}
            } else {
              this.$Message.error(data.msg);
            }

          })
          .catch(err => {});
      } else {
        infomationCategoryAdd(data).then(res => {
          if (res.status == 200) {
            var vo = res.data;
            if (vo.status == "success") {
              this.$Message.success(vo.msg);
              this.addCategoryShow = false;
              this.data = {}
              this.find()
            } else {
              this.$Message.error(vo.msg);
              return false;
            }
          } else {
            this.$Message.error("请求超时");
          }
        });
      }

    },
    handleDelete(params) {
      let data = {
        id: params.row.id
      };
      infomationCategoryDel(data)
        .then(res => {
          const data = res.data;
          if (data.status == "fail") {
            this.$Message.error(data.msg);
            return false;
          }
          this.$Message.success(data.msg);
        })
        .catch(err => {});
    },
    find(){
      infomationCategoryList().then(res => {
        if (res.data.status == "success") {
          this.tableData = res.data.data;
        }
      });
    },
  },
  mounted() {
    this.find()
  }
};
</script>

<style>
</style>
