<template>
  <div>
    <Card style="width:auto">
      分类：
      <Cascader :data="selectData.category" v-model="data.cid" style="width: 200px"></Cascader>
      <br />
      <div>
        名称：
        <Input v-model="data.name" placeholder="请输入名称..." style="width: 200px" />
      </div>
      <br />
      <div>
        描述：
        <Input v-model="data.desc" placeholder="请输入名称..." style="width: 200px" />
      </div>
      <br />
      <div>
        标签：
        <Select v-model="data.tagId" multiple style="width:260px">
          <Option v-for="item in selectData.tags" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <br />
      <div>
        商品图片
        <Button icon="ios-cloud-upload-outline" @click="uploadFile">上传图片</Button>&nbsp;
        <!-- 上传图片 -->
        <br />
        <br />
        <div v-if="imgShow" style="width: 200px">
          <img :src="data.imageUrl" style="width: 100px;height:100px" />
        </div>
      </div>
      <br />
      <div>
        <Button
          @click="createRow"
          style="padding: 6px 12px;margin-bottom: 10px;"
          type="primary"
        >添加商品SKU</Button>
      </div>
      <Card>
        <!-- 添加商品属性 -->
        <div v-for="(item,k) in tableRows" :value="k" :key="k">
          <Select label-in-value style="width:260px">
            <Option
              v-for="attr in selectData.saleAttrs"
              @click.native="perChange(k,attr)"
              :value="attr.id"
              :key="attr.id"
            >{{ attr.name }}</Option>
          </Select>属性值
          <span v-for="(it,v) in item.col" :value="v" :key="v">
            <Input
              v-model="it.inputVal"
              :value="it.inputVal"
              @on-blur="appendValue(k,v)"
              style="width: 100px"
            />&nbsp;
          </span>
          <Button
            @click="createCol(k)"
            style="padding: 6px 12px;margin-bottom: 10px;"
            type="primary"
          >添加值</Button>
          <br />
        </div>
        <br />
      </Card>
      <br />
      <Button @click="isSubmit" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">提交</Button>
    </Card>
    <Modal v-model="isUploadShow" title="上传图片" width="760px" footer-hide>
      <div>
        <!-- 图片剪裁 -->
        <Cropper @on-crop="saveImage"></Cropper>
      </div>
    </Modal>
    <Modal v-model="isShowSubmit" title="提交确认" confirm @on-ok="addGoods">
      <div>
        <!-- 图片剪裁 -->
        <h3>提交后商品SKU不能再次修改，确认提交吗？</h3>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import Cropper from "_c/cropper";
import { uploadOneToThumb } from "@/api/file";
import {
  findGoodsCategory2,
  findTags,
  findSaleAttrs,
  addGoods
} from "@/api/shop/admin";
export default {
  name: "admin_list",
  components: {
    Tables,
    Cropper
  },
  data() {
    return {
      selectData: {
        saleAttrs: [],
        tags: [],
        category: []
      },
      tableRows: [{ col: [{}], keyId: 0, keyName: "" }],
      tableCols: [{}],
      data: {
        sku: [],
        images: [],
        saleAttr: [{ id: 0, name: "", value: [] }],
        attrVal: ""
      },
      tableData: [],
      table: [],
      row: [],
      col: [],
      imgShow: false,
      isShowSubmit: false,
      isUploadShow: false,
      columns: [
        {
          title: "属性名称",
          key: "name",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.name
              },
              on: {
                "on-blur": event => {}
              }
            });
          }
        },
        {
          title: "属性值",
          key: "value",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.value
                //readonly:true
              },
              on: {}
            });
          }
        },
        {
          title: "操作",
          key: "action",
          sortable: false,
          width: 250,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      console.log(params.index);
                      console.log(this.tableData);
                      this.tableData.splice(params.index, 1);
                      console.log(this.tableData);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    find() {
      // 分类
      findGoodsCategory2()
        .then(res => {
          console.log(333, res.data);
          if (res.data.status == "success") {
            this.selectData.category = res.data.data;
          }
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
      // 标签
      findTags()
        .then(res => {
          console.log(444, res.data);
          if (res.data.status == "success") {
            this.selectData.tags = res.data.data;
          }
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
      findSaleAttrs()
        .then(res => {
          if (res.data.status == "success") {
            this.selectData.saleAttrs = res.data.data;
          }
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    // 添加销售属性
    createRow() {
      this.tableRows.push({ col: [{}], keyId: 0, keyName: "" });
    },
    createCol(k) {
      if (!this.data.saleAttr[k] || this.data.saleAttr[k].id <= 0) {
        alert("请先选择属性");
        return;
      }
      this.tableRows[k].col.push({});
      this.data.saleAttr[k].value.push("");
    },
    appendValue(k, v) {
      let input = this.tableRows[k].col[v].inputVal;
      if (!this.data.saleAttr[k]) {
        this.tableRows[k].col[v].inputVal = "";
        alert("请先选择属性");
        return;
      }
      this.data.saleAttr[k].value[v] = input;
    },
    perChange(k, attr) {
      if (attr.value == undefined) {
        attr.value = [];
      }
      this.data.saleAttr[k] = attr;
    },
    isSubmit() {
      this.isShowSubmit = true;
    },
    addGoods() {
      /**
 * 					{
						"cid":25,
						"cpath":[2,5,23],
						"name":"苹果 手机",
						"desc":"商品描述后台",
						"image":"filename",
						"sort":0,
						"tagId":[1,2,3],
						"saleAttr":[
							{
								"id":1,
								"name":"颜色",
								"value":["白色","红色","黑色"]
							},
							{
								"id":3,
								"name":"版本",
								"value":["64G","128G","256G"]
							}
						]
					}
 */
      if (!this.data.cid) {
        alert("商品分类不能为空");
        return;
      }
      let data = {
        cid: this.data.cid[this.data.cid.length - 1],
        cPath: this.data.cid,
        name: this.data.name,
        desc: this.data.desc,
        image: this.data.imageName,
        tagId: this.data.tagId,
        saleAttr: this.data.saleAttr
      };

      addGoods(data)
        .then(res => {
          if (res.data.status == "success") {
            this.$Message.success(res.data.msg);
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    uploadFile() {
      this.isUploadShow = true;
    },
    saveImage(blob) {
      let formData = new FormData();
      formData.append("from", "shop-goods");
      formData.append("file", blob);
      uploadOneToThumb(formData).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.isUploadShow = false;
          this.imgShow = true;
          this.data.imageUrl = vo.data.url;
          this.data.imageName = vo.data.name;
          console.log(666, this.data);
        } else if (vo.status == "tokenExpire" || vo.status == "tokenFail") {
          // token 过期 跳转登录页面 todo
          this.$route.push({ name: "login" });
          this.$Message.error("token 错误， 请重新登录");
        } else {
          this.$Message.error(vo.msg);
          return false;
        }
      });
    }
  },
  mounted() {
    // 查找商品分类 标签 平台属性
    this.find();
  }
};
</script>

<style>
</style>
