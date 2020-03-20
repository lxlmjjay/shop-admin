<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from "wangeditor";
import "wangeditor/release/wangEditor.min.css";
import { oneOf } from "@/libs/tools";
import { getToken, baseUrl } from "@/libs/util";
export default {
  name: "Editor",
  props: {
    from:{
      type: String,
      default: "",
      required: true
    },
    value: {
      type: String,
      default: ""
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: "html",
      validator: val => {
        return oneOf(val, ["html", "text"]);
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    editorId() {
      return `editor${this._uid}`;
    }
  },
  methods: {
    setHtml(val) {
      this.editor.txt.html(val);
    }
  },
  mounted() {
    this.editor = new Editor(`#${this.editorId}`);
    this.editor.customConfig.onchange = html => {
      let text = this.editor.txt.text();
      if (this.cache) localStorage.editorCache = html;
      this.$emit("input", this.valueType === "html" ? html : text);
      this.$emit("on-change", html, text);
    };
    this.editor.customConfig.onchangeTimeout = this.changeInterval;
    // 自定义本地上传图片
    this.editor.customConfig.uploadImgServer =
      baseUrl() + "/api/admin/uploadOne";
    // 将图片大小限制为 3M
    this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
    // 限制一次最多上传 5 张图片
    this.editor.customConfig.uploadImgMaxLength = 5;
    // this.editor.customConfig.uploadImgShowBase64 = true;
    this.editor.customConfig.uploadImgHeaders = {
      token: getToken()
    };
    this.editor.customConfig.uploadImgParams = {
      // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
      // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
      // 来自哪个模块  如果公用则设置一个全局变量

      // from: "information-content"
      from: this.from
    };
    //图片上传
    this.editor.customConfig.uploadFileName = "file";
    // 跨域上传中如果需要传递 cookie 需设置 withCredentials
    // this.editor.customConfig.withCredentials = true;
    this.editor.customConfig.uploadImgHooks = {
      before: function(xhr, editor, files) {},
      success: function(xhr, editor, result) {},

      customInsert: function(insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        if (result.status == "success"){
          let url = result.data.url;
          insertImg(url);
        }


        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    };
    // create这个方法一定要在所有配置项之后调用
    this.editor.create();
    // 如果本地有存储加载本地存储内容
    let html = this.value || localStorage.editorCache;
    if (html) this.editor.txt.html(html);
  }
};
</script>

<style lang="less">
.editor-wrapper * {
  z-index: 100 !important;
}
.w-e-text-container {
  z-index: 99 !important;
}
</style>
