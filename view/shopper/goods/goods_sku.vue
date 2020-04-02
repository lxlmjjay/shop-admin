<template>
  <div>
    <Card style="width:auto">
      <div>
        <Button @click="returnList" type="primary">返回列表</Button>&nbsp;
      </div>
      <br />
      <div v-for="(items,skuId) in sku" :value="skuId" :key="skuId">
        <Col span="3">
          <span
            v-for="item in items"
            :value="item.saleAttrValueName"
            :key="item.saleAttrValueId"
          >{{item.saleAttrValueName}}&nbsp;&nbsp;</span>
        </Col>
        <!-- sku 开始 -->
        <span style="margin-left:50px">
          <!-- <Button @click="mod0(skuId,1)" size="small" type="primary">平台属性</Button>&nbsp; -->
          <Button @click="mod0(skuId,2)" size="small" type="primary">商品属性</Button>&nbsp;
          <Button @click="mod0(skuId,3)" size="small" type="primary">上传图片</Button>&nbsp;
          <Button @click="mod0(skuId,4)" size="small" type="primary">编辑详情</Button>&nbsp;
          <!-- <Button @click="mod0(skuId,5)" size="small" type="primary">促销活动</Button>&nbsp; -->
          <Button @click="mod0(skuId,6)" size="small" type="primary">设置库存</Button>&nbsp;
        </span>
        <br />
        <br />
        <!-- sku结束 -->
      </div>
    </Card>
    <!-- 弹窗开始 -->
    <Modal
      v-model="isShow.a1"
      title="平台属性"
      width="800px"
      @on-cancel="cancel"
      ok-text="保存"
      @on-ok="submit1"
    >
      <Card style="width:auto">
        <div v-for="items in baseAttrs" :key="items.id">
          <Col span="2">{{ items.name }}</Col>
          <Col>
            <Select
              v-model="items.obj"
              :label-in-value="true"
              multiple
              style="width:260px"
              @on-change="changeBaseAttr(items)"
            >
              <Option v-for="item in items.value" :value="item.id" :key="item.id">{{ item.value }}</Option>
            </Select>
          </Col>
          <br />
        </div>
      </Card>
    </Modal>
    <Modal
      v-model="isShow.a2"
      title="sku属性"
      width="800px"
      @on-cancel="cancel"
      ok-text="保存"
      @on-ok="submit2"
    >
      <Card style="width:auto">
        <div>
          编码：
          <Input v-model="data.skuNo" placeholder="请输入商品编码..." style="width: 200px" />
        </div>
        <br />
        <div>
          描述：
          <Input
            v-model="data.desc"
            type="textarea"
            :rows="4"
            style="width: 500px"
            placeholder="请输入商品描述..."
          />
        </div>
        <br />
        <div>
          单价：
          <InputNumber :min="0.01" :precision="2" v-model="data.price"></InputNumber>
        </div>
        <br />
        <div>
          折扣价：
          <InputNumber :min="0.01" :precision="2" v-model="data.salePrice"></InputNumber>
        </div>
        <br />
        <div>
          重量：
          <InputNumber :min="0.01" :precision="2" v-model="data.weight"></InputNumber>&nbsp;&nbsp;
          <Select v-model="data.weightUnit" style="width:150px">
            <Option v-for="it in weightUnit" :value="it.id" :key="it.id">{{ it.weightUnit }}</Option>
          </Select>
        </div>
        <br />
        <div>
          是否支持积分兑换：
          <Select v-model="data.isScore" style="width:260px">
            <Option v-for="it in isScoreArr" :value="it.value" :key="it.value">{{ it.label }}</Option>
          </Select>
        </div>
        <br />
        <div v-show="data.isScore==1">
          设置积分：
          <InputNumber :min="0.01" :precision="2" v-model="data.score"></InputNumber>
        </div>
        <br />
      </Card>
    </Modal>
    <Modal
      v-model="isShow.a3"
      title="选择标签"
      width="800px"
      @on-cancel="cancel"
      ok-text="保存"
      @on-ok="submit3"
    >
      <Card style="width:100%;height:150px">
        <RadioGroup v-model="data.radio">
          <div class="demo-upload-list" v-for="item in uploadList" :key="item.name">
            <div>
              <img :src="item.url" />
            </div>
            <div>
              <Radio @on-change="changeRadio(item)" border></Radio>
            </div>
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </div>
        </RadioGroup>
        <Button
          @click="uploadOne"
          style="padding: 6px 12px;margin-bottom: 10px;"
          type="primary"
        >上传图片</Button>
        <!-- <Upload
          ref="upload"
          :show-upload-list="false"
          :default-file-list="defaultList"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :headers="headers"
          :data="{'from':'shop-sku'}"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
          type="drag"
          :action="upload"
          style="display: inline-block;width:58px;"
        >
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>-->
      </Card>
    </Modal>
    <Modal v-model="isUploadShow" title="上传图片" width="760px" footer-hide>
      <div>
        <!-- 图片剪裁 -->
        <Cropper @on-crop="saveImage" :ratio="1"></Cropper>
      </div>
    </Modal>
    <Modal
      v-model="isShow.a4"
      title="sku详情"
      width="80%"
      height="100%"
      @on-cancel="cancel"
      ok-text="保存"
      @on-ok="submit4"
    >
      <Card style="width:auto">
        <!-- <Input v-model="data.detail" placeholder="请输入群名称..." style="width: 200px" /> -->
        <editor
          id="editor"
          ref="editor"
          :from="from"
          v-model="data.detail"
          @on-change="handleChange"
        />
      </Card>
    </Modal>
    <Modal
      v-model="isShow.a5"
      title="选择标签"
      width="800px"
      @on-cancel="cancel"
      ok-text="保存"
      @on-ok="submit5"
    >
      <Card style="width:auto"></Card>
    </Modal>
    <Modal
      v-model="isShow.a6"
      title="设置库存"
      width="800px"
      @on-cancel="cancel"
      ok-text="保存"
      @on-ok="submit6"
    >
      <Card style="width:auto">
        总库存：{{stockDB}} &nbsp;&nbsp;&nbsp;
        可用库存：{{stockRedis}}&nbsp;&nbsp;&nbsp;
        锁定库存：{{stockDB-stockRedis}}&nbsp;&nbsp;&nbsp;
        <br />
        <br />
        <div>
          重新设置库存：
          <InputNumber :min="0" :precision="0" v-model="stockNew"></InputNumber>
        </div>
      </Card>
    </Modal>
    <!-- 弹窗结束 -->
  </div>
</template>

<script>
import Editor from "_c/editor";
import Tables from "_c/tables";
import {
  findGoodsBaseAttrForSku,
  findSkuByGid,
  getSkuImages,
  addSkuImages,
  getSkuDetail,
  addSkuDetail,
  getSkuGoods,
  addSkuGoods,
  addSkuBaseAttr,
  getSkuBaseAttr,
  setGoodsSkuStock,
  getGoodsSkuStock,
  findWeightUnit
} from "@/api/shop/admin";
import { uploadOne } from "@/api/file";
import Cropper from "_c/cropper";
import { baseUrl, getToken } from "@/libs/util";
import { escape2Html } from "@/libs/com";
import store from "@/store";
export default {
  name: "admin_list",
  components: {
    Tables,
    Editor,
    Cropper
  },
  data() {
    return {
      gid: 0,
      cid: 0,
      skuId: 0,
      select: {},
      baseAttrs: [],
      dataBaseAttr: [],
      isShow: {
        a1: false,
        a2: false,
        a3: false,
        a4: false,
        a5: false,
        a6: false
      },
      isUploadShow: false,
      data: {
        detail: "",
        baseAttrs: [],
        price: 0,
        salePrice: 0,
        isScore: 1,
        weightUnit: 1
      },
      images: [],
      baseAttrArr: [],
      sku: [],
      uploadList: [],
      defaultList: [],
      upload: baseUrl() + "/api/admin/uploadOne",
      headers: { token: getToken() },
      from: "shop-sku",
      currentPage: 1,
      isScoreArr: [
        { value: 1, label: "支持" },
        { value: 2, label: "不支持" }
      ],
      stockDB: 0,
      stockRedis: 0,
      stockNew: 0,
      weightUnit: []
    };
  },
  methods: {
    find() {
      let data1 = { id: this.cid };
      findGoodsBaseAttrForSku(data1).then(res => {
        if (res.data.status == "success") {
          res.data.data.forEach((item, index) => {
            this.data["attr" + item.id] = {};
          });
          this.baseAttrs = res.data.data;
        }
      });

      let skuData = { id: this.gid };
      findSkuByGid(skuData).then(res => {
        if (res.data.status == "success") {
          this.sku = res.data.data;
        }
      });
      findWeightUnit().then(res => {
        if (res.data.status == "success") {
          this.weightUnit = res.data.data;
        }
      });
    },
    changeBaseAttr(items) {
      let val = [];
      items.obj.forEach((obj, index) => {
        var index = items.value.findIndex(v => {
          if (v.id == obj) {
            return true;
          }
        });
        val.push({
          baseAttrValueId: items.value[index].id,
          baseAttrValueName: items.value[index].value
        });
      });
      let data = {
        skuId: this.skuId,
        baseAttrId: items.id,
        baseAttrName: items.name,
        value: val
      };
      let _index = this.data.baseAttrs.findIndex(v => {
        if (v.baseAttrId == data.baseAttrId) {
          return true;
        }
      });
      if (_index >= 0) {
        this.data.baseAttrs[_index] = data;
      } else {
        this.data.baseAttrs.push(data);
      }
    },
    create() {},
    cancel() {
      this.reset();
      //   this.isShow = {};
    },
    uploadOne() {
      this.isUploadShow = true;
    },
    mod0(skuId, i) {
      skuId = parseInt(skuId);
      // console.log(this.isShow)
      // console.log(this.isShow['a'+i])
      this.skuId = skuId;
      // console.log(444,skuId,i)
      // 点击弹出窗获取原值
      let data = { id: skuId };
      switch (i) {
        case 1:
          // 清空data
          let data1 = { id: skuId, cid: this.cid };
          getSkuBaseAttr(data1).then(res => {
            if (res.data.status == "success") {
              this.baseAttrs = res.data.data;
            }
          });
          break;
        case 2:
          getSkuGoods(data).then(res => {
            if (res.data.status == "success") {
              let rsp = res.data.data;
              this.data.price = rsp.price;
              this.data.desc = rsp.skuDesc;
              this.data.weight = rsp.weight;
              this.data.weightUnit = rsp.weightUnit;
              this.data.skuNo = rsp.skuNo;
              this.data.isScore = rsp.isScore;
              this.data.score = rsp.score;
            }
          });
          break;
        case 3:
          getSkuImages(data).then(res => {
            this.uploadList = res.data.data;
            if (res.data.status == "success" && res.data.data != null) {
              this.images = [];
              res.data.data.forEach((item, index) => {
                let skuImg = {
                  skuId: this.skuId,
                  fid: item.fid,
                  imgName: item.name
                };
                this.images.push(skuImg);
              });
            }
          });
          break;
        case 4:
          this.$refs.editor.setHtml("");
          getSkuDetail(data).then(res => {
            if (res.data.status == "success") {
              let h = escape2Html(res.data.data);
              this.$refs.editor.setHtml(escape2Html(h));
              this.data.detail = res.data.data;
            }
          });
          break;
        case 5:
          // 活动
          break;
        case 6:
          // 设置库存
          getGoodsSkuStock(data).then(res => {
            if (res.data.status == "success") {
              this.stockDB = res.data.data.db;
              this.stockRedis = res.data.data.redis;
            }
          });
          break;
      }
      this.isShow["a" + i] = true;
    },
    submit1() {
      addSkuBaseAttr(this.data.baseAttrs).then(res => {
        this.$Message.success(res.data.msg);
      });
    },
    submit2() {
      // {"id":1,"price":21.22,"weight":21.22,"stock":21,"desc":"特价销售，仅限5天"}
      let data = {
        id: this.skuId,
        price: this.data.price,
        salePrice: this.data.salePrice,
        weight: this.data.weight,
        weightUnit: this.data.weightUnit,
        stock: this.data.stock,
        desc: this.data.desc,
        isScore: this.data.isScore,
        score: this.data.score,
        skuNo: this.data.skuNo,
        defaultImg: this.data.defaultImg
      };
      addSkuGoods(data).then(res => {
        if (res.data.status == "success") {
          this.$Message.success(res.data.msg);
        }
      });
    },
    submit3() {
      addSkuImages(this.images).then(res => {
        this.$Message.success(res.data.msg);
      });
    },
    submit4() {
      // {"gid":1,"skuId":1,"content":"<h1>详情详情详情</h1>"}
      let data = {
        gid: this.gid,
        skuId: this.skuId,
        content: this.data.detail
      };
      addSkuDetail(data).then(res => {
        this.$Message.success(res.data.msg);
      });
    },
    submit5() {},
    submit6() {
      let data = { id: this.skuId, stock: this.stockNew };
      setGoodsSkuStock(data).then(res => {
        this.$Message.success(res.data.msg);
      });
    },
    handleView(name) {
      console.log(1111, name);
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      let id = 0;
      if (file.fid > 0) {
        id = file.fid;
        var index = this.uploadList.findIndex(item => {
          if (item.fid == file.fid) {
            return true;
          }
        });
        this.uploadList.splice(index, 1);
      } else {
        // const fileList = this.$refs.upload.fileList;
        // console.log(4444, this.uploadList);
        // this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        id = file.response.data.id;
      }

      this.delSkuImg(id);
    },
    saveImage(blob) {
      let formData = new FormData();
      formData.append("from", this.from);
      formData.append("file", blob);
      uploadOne(formData).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          console.log(vo);
          this.isUploadShow = false;
          if (this.uploadList == null) {
            this.uploadList = [];
          }
          let list = {
            fid: vo.data.id,
            name: vo.data.name,
            url: vo.data.url
          };
          console.log(list);
          this.uploadList.push(list);
          let skuImg = {
            skuId: this.skuId,
            fid: vo.data.id,
            imgName: vo.data.name
          };
          this.images.push(skuImg);
        } else if (vo.status == "tokenExpire" || vo.status == "tokenFail") {
          // token 过期 跳转登录页面 todo
          this.$route.push({ name: "login" });
          this.$Message.error("token 错误， 请重新登录");
        } else {
          this.$Message.error(vo.msg);
          return false;
        }
      });
    },
    changeRadio(para) {
      console.log(para);
    },
    handleSuccess(res, file) {
      file.fid = file.response.data.id;
      file.name = file.response.data.name;
      file.url = file.response.data.url;
      if (this.uploadList == null) {
        this.uploadList = [];
      }
      this.uploadList.push(file);
      let skuImg = {
        skuId: this.skuId,
        fid: file.response.data.id,
        imgName: file.response.data.name
      };
      this.images.push(skuImg);
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "The file format is incorrect",
        desc:
          "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleBeforeUpload() {
      // const check = this.uploadList.length < 5;
      // if (!check) {
      //     this.$Notice.warning({
      //         title: 'Up to five pictures can be uploaded.'
      //     });
      // }
      // return check;
    },
    delSkuImgUploadList(id) {
      var index = this.uploadList.findIndex(item => {
        if (item.fid == id) {
          return true;
        }
      });
      this.images.splice(index, 1);
    },
    delSkuImg(id) {
      var index = this.images.findIndex(item => {
        if (item.fid == id) {
          return true;
        }
      });
      this.images.splice(index, 1);
    },
    handleChange(html, text) {
      // console.log(555, this.$refs.editor.value)
    },
    reset() {
      this.data.baseAttrs = [];
      this.data.detail = "";
      this.baseAttrs = [];
      this.uploadList = [];
      this.stockNew = 0;
    },
    returnList() {
      this.$router.push({
        name: "goods_list",
        params: {
          page: this.currentPage
        }
      });
    }
  },
  created() {
    this.gid = this.$route.params.gid;
    this.cid = this.$route.params.cid;
    this.currentPage = this.$route.params.page;
    this.uploadList = [];
  },
  // watch: {
  //   //edit
  //   $route(to, from) {
  //     console.log(777,this.$route.params);
  //   }
  // },
  mounted() {
    this.find();
    // this.uploadList = this.$refs.upload.fileList;
  }
};
</script>

<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
