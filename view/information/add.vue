<template>
  <div>
    <Form :ref="ModelForm" :model="ModelForm" :label-width="100" :rules="rulesValidate">
      <FormItem label="标题：" prop="title">
        <Input v-model="ModelForm.title" :maxlength=30 placeholder="请输入标题" clearable style="width:30%" />
      </FormItem>
      <FormItem label="分类：" prop="category">
        <Select v-model="ModelForm.categoryId" style="width:200px" placeholder="请选择">
          <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="列表页显示图：" prop="image">
        <!-- <Upload :before-upload="handleUpload" :max-size="50" :format="['jpg','jpeg','png']" action>
          <Button icon="ios-cloud-upload-outline">点击上传</Button>
        </Upload>-->
        <!-- <Upload
            :action="uploadUrl"
            :max-size="2048"
            :format="['jpg','jpeg','png']"
            :headers="headers"
            :on-success="handleSuccess"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :data='{"from":"information-image"}'
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
        </Upload>-->
        <Button icon="ios-cloud-upload-outline" @click="uploadFile">上传图片</Button>&nbsp;
        <!-- 上传图片 --><br/><br/>
        <div v-if="imgShow" style="width: 200px">
          <img :src="src" style="width: 214px;height:162px" />
        </div>
      </FormItem>
      <FormItem label="摘要：">
        <Input
          v-model="ModelForm.abstract"
          type="textarea"
          placeholder="请输入摘要"
          clearable
          style="width:30%"
        />
      </FormItem>
      <FormItem label="内容：">
        <editor id="editor" :from="from" ref="editor" v-model="ModelForm.content" @on-change="handleChange" />
      </FormItem>
      <FormItem label>
        <Button @click="handleSubmit('ModelForm',0)" icon="md-create" type="primary">保存到草稿</Button>&nbsp&nbsp
        <Button @click="handleSubmit('ModelForm',1)" icon="md-checkmark" type="primary">提交审核</Button>
      </FormItem>
    </Form>

    <Modal v-model="isUploadShow" title="上传图片" width="760px" footer-hide>
      <div>
        <!-- 图片剪裁 -->
        <Cropper @on-crop="saveImage"></Cropper>
      </div>
    </Modal>
  </div>
</template>

<script>
import Editor from "_c/editor";
import Cropper from "_c/cropper";
import { upload214_162 } from "@/api/file";
import {
  infomationAdd,
  infomationCategoryList,
  infomationGet,
  infomationEdit
} from "@/api/information";
import { escape2Html } from "@/libs/com";
import { baseUrl, getToken } from "@/libs/util";
export default {
  name: "infomation_add",
  components: {
    Editor,
    Cropper
  },
  data() {
    return {
      from: "information-content",
      // uploadUrl: baseUrl() + "/api/admin/uploadOneThumb",
      // headers: { token: getToken() },
      isEditing: false,
      ModelForm: {
        title: "",
        categoryId: 0,
        image: null,
        abstract: "",
        content: "",
        sort: 0,
        status: 0
      },
      isUploadShow: false,
      imgShow: false,
      src: "",
      editId: 0,
      categoryList: [],
      rulesValidate: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    saveImage(blob) {
      console.log(5555555)
      let formData = new FormData();
      formData.append("from", "information-image");
      formData.append("file", blob);
      upload214_162(formData).then(res => {
        var vo = res.data;
        if (vo.status == "success") {
          this.isUploadShow = false;
          this.imgShow = true;
          this.src = vo.data.url;
          this.ModelForm.image = vo.data.name;
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
    // 上传图片
    handleUpload(file) {
      let _this = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function() {
        _this.src = this.result;
      };
      this.imgShow = true;
      this.ModelForm.image = file;
      return false;
    },
    handleChange(html, text) {
      // console.log(555, this.$refs.editor.value)
    },
    handleSubmit(form, op) {
      this.ModelForm.status = 0;
      if (op == 1) {
        this.ModelForm.status = 1;
      }
      let data = {
        title: this.ModelForm.title,
        categoryId: this.ModelForm.categoryId,
        image: this.ModelForm.image,
        abstract: this.ModelForm.abstract,
        content: this.ModelForm.content,
        sort: this.ModelForm.sort,
        status: this.ModelForm.status
      };
      infomationAdd(data).then(res => {
        if (res.status == 200) {
          var vo = res.data;
          if (vo.status == "success") {
            this.$Message.success(vo.msg);
            this.reset()
            this.$router.push({ name: "infomation_list" });
          } else if (vo.status == "tokenExpire" || vo.status == "tokenFail") {
            // token 过期 跳转登录页面 todo
            this.$route.push({ name: "login" });
            this.$Message.error("token 错误， 请重新登录");
          } else {
            this.$Message.error(vo.msg);
            return false;
          }
        } else {
          this.$Message.error("请求超时");
        }
      });
    },
    handleData(data) {
      // 编辑页面赋值
      this.ModelForm.title = data.title;
      this.ModelForm.categoryId = data.categoryId;
      this.ModelForm.abstract = data.abstract;
      this.ModelForm.content = data.content;
      this.ModelForm.sort = data.sort;
      this.ModelForm.status = data.status;
      this.src = data.image;
      this.imgShow = true;

      let h = escape2Html(data.content);
      this.$refs.editor.setHtml(escape2Html(h));
    },
    handleSuccess(res, file) {
      if (res.status == "success") {
        console.log(this.src, res.data);
        this.imgShow = true;
        this.src = res.data.url;
        this.ModelForm.image = res.data.name;
      }
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
    uploadFile() {
      this.isUploadShow = true;
    },
    reset(){
      this.$refs.editor.setHtml("");
      this.ModelForm = {};
      this.src = "";
      this.imgShow = false
    }
  },
  mounted() {
    this.$refs.editor.setHtml("");
    infomationCategoryList().then(res => {
      if (res.status == 200) {
        var vo = res.data;
        if (res.data.status == "success") {
          this.ModelForm.categoryList = res.data.data;
          this.categoryList = res.data.data;
        } else if (vo.status == "tokenExpire" || vo.status == "tokenFail") {
          // token 过期 跳转登录页面 todo
          this.$route.push({ name: "login" });
          this.$Message.error("token 错误， 请重新登录");
        } else {
          this.$Message.error(vo.msg);
          return false;
        }
      } else {
        this.$Message.error("请求超时");
      }
    });
  },
};
</script>

<style>
</style>
