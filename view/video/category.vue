<template>
  <div>
    <Card>
      <div>
        <Button @click="create" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">上传视频</Button>
      </div>
      <div>
        <tables
          ref="tables"
          editable
          search-place="top"
          v-model="tableData"
          :columns="columns"
          @on-delete="handleDelete"
        />
      </div>
    </Card>
    <Modal v-model="isShow" title="添加商品认证" width="800px" @on-cancel="cancel" ok-text="提交">
      <Card style="width:auto">
        <div>
          视频名称：
          <Input v-model="data.title" placeholder="请输入名称..." style="width: 200px" />
        </div>
        <br />
        <div>
          视频分类：
          <Select v-model="data.category" style="width:260px">
            <Option v-for="it in categorys" :value="it.Id" :key="it.Id">{{ it.Name }}</Option>
          </Select>
        </div>
        <br />
        <div class="upload">
          上传视频：
          <div>
            <input type="file" id="fileUpload" @change="fileChange($event)" />
          </div>
          <br />
          <br />
          <div class="upload-type">
            <span class="progress">
              上传进度:
              <i id="auth-progress">{{authProgress}}</i> %
            </span>&nbsp;
            <label class="status">
              上传状态:
              <span>{{statusText}}</span>
            </label>&nbsp;
            <!-- <Button @click="authUpload" :disabled="uploadDisabled" type="primary">开始上传</Button>&nbsp;&nbsp;
            <Button @click="pauseUpload" :disabled="pauseDisabled" type="primary">暂停</Button>&nbsp;&nbsp;
            <Button :disabled="resumeDisabled" @click="resumeUpload" type="primary">恢复上传</Button>-->
          </div>
        </div>
      </Card>
      <div slot="footer">
        <Button @click="authUpload" :disabled="uploadDisabled" type="primary">开始上传</Button>&nbsp;&nbsp;
        <Button @click="pauseUpload" :disabled="pauseDisabled" type="primary">暂停</Button>&nbsp;&nbsp;
        <Button :disabled="resumeDisabled" @click="resumeUpload" type="primary">恢复上传</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { findGoodsFlag, delGoodsFlag, addGoodsFlag } from "@/api/shop/admin";
import { findVideoCategory } from "@/api/video";
import {
  getUploadAuthAndAddress,
  refreshUploadAuthAndAddress
} from "@/api/file";
import axios from "axios";
export default {
  name: "admin_list",
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        { title: "ID", key: "id", sortable: true },
        { title: "名称", key: "name" },
        {
          title: "操作",
          key: "handle",
          options: ["delete"]
        }
      ],
      tableData: [],
      isShow: false,
      total: 0,
      currentPage: 1,
      data: { title: "", category: 0 },
      categorys: [],
      isEditing: false,
      rowId: 0,
      statusText: "",
      file: null,
      authProgress: 0,
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      uploader: null,
      timeout: "",
      partSize: "",
      parallel: "",
      retryCount: "",
      retryDuration: "",
      region: "cn-shanghai",
      userId: "1303984639806000"
    };
  },
  methods: {
    find() {
      findGoodsFlag().then(res => {
        this.tableData = res.data.data;
      });
      findVideoCategory().then(res => {
        console.log(res.data);
        this.categorys = res.data.data;
        this.data.category = res.data.data[0].Id;
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
          this.cancel();
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
      console.log(data);
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
    /***************ali  api************** */
    fileChange(e) {
      this.file = e.target.files[0];
      if (!this.file) {
        alert("请先选择需要上传的文件!");
        return;
      }
      var Title = this.file.name;
      var userData = '{"Vod":{}}';
      if (this.uploader) {
        this.uploader.stopUpload();
        this.authProgress = 0;
        this.statusText = "";
      }
      this.uploader = this.createUploader();
      console.log(userData);
      this.uploader.addFile(this.file, null, null, null, userData);
      this.uploadDisabled = false;
      this.pauseDisabled = true;
      this.resumeDisabled = true;
    },
    authUpload() {
      // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        this.uploader.startUpload();
        this.uploadDisabled = true;
        this.pauseDisabled = false;
      }
    },
    // 暂停上传
    pauseUpload() {
      if (this.uploader !== null) {
        this.uploader.stopUpload();
        this.resumeDisabled = false;
        this.pauseDisabled = true;
      }
    },
    // 恢复上传
    resumeUpload() {
      if (this.uploader !== null) {
        this.uploader.startUpload();
        this.resumeDisabled = true;
        this.pauseDisabled = false;
      }
    },
    createUploader(type) {
      let self = this;
      let uploader = new AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: self.partSize || 1048576,
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: self.region,
        userId: self.userId,
        // 添加文件成功
        addFileSuccess: function(uploadInfo) {
          self.uploadDisabled = false;
          self.resumeDisabled = false;
          self.statusText = "添加文件成功, 等待上传...";
          console.log("addFileSuccess: " + uploadInfo.file.name);
        },
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          console.log("5555555", uploadInfo);
          if (!uploadInfo.videoId) {
            let reqData = {
              Title: self.data.title,
              FileName: uploadInfo.file.name,
              CateId: self.data.category,
              Size: uploadInfo.file.size
            };
            getUploadAuthAndAddress(reqData).then(({ data }) => {
              data = data.data;
              let uploadAuth = data.UploadAuth;
              let uploadAddress = data.UploadAddress;
              let videoId = data.VideoId;
              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                videoId
              );
            });
            self.statusText = "文件开始上传...";
            console.log(
              "onUploadStarted:" +
                uploadInfo.file.name +
                ", endpoint:" +
                uploadInfo.endpoint +
                ", bucket:" +
                uploadInfo.bucket +
                ", object:" +
                uploadInfo.object
            );
          } else {
            // 如果videoId有值，根据videoId刷新上传凭证
            // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
            let reqData = {
              VideoId: uploadInfo.videoId
            };
            refreshUploadAuthAndAddress(reqData).then(({ data }) => {
              data = data.data;
              let uploadAuth = data.UploadAuth;
              let uploadAddress = data.UploadAddress;
              let videoId = data.VideoId;
              uploader.setUploadAuthAndAddress(
                uploadInfo,
                uploadAuth,
                uploadAddress,
                videoId
              );
            });
          }
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          console.log(
            "onUploadSucceed: " +
              uploadInfo.file.name +
              ", endpoint:" +
              uploadInfo.endpoint +
              ", bucket:" +
              uploadInfo.bucket +
              ", object:" +
              uploadInfo.object
          );
          self.statusText = "文件上传成功!";
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          console.log(
            "onUploadFailed: file:" +
              uploadInfo.file.name +
              ",code:" +
              code +
              ", message:" +
              message
          );
          self.statusText = "文件上传失败!";
        },
        // 取消文件上传
        onUploadCanceled: function(uploadInfo, code, message) {
          console.log(
            "Canceled file: " +
              uploadInfo.file.name +
              ", code: " +
              code +
              ", message:" +
              message
          );
          self.statusText = "文件已暂停上传";
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function(uploadInfo, totalSize, progress) {
          console.log(
            "onUploadProgress:file:" +
              uploadInfo.file.name +
              ", fileSize:" +
              totalSize +
              ", percent:" +
              Math.ceil(progress * 100) +
              "%"
          );
          let progressPercent = Math.ceil(progress * 100);
          self.authProgress = progressPercent;
          self.statusText = "文件上传中...";
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          let reqData = {
            VideoId: uploadInfo.videoId
          };
          refreshUploadAuthAndAddress(reqData).then(({ data }) => {
            data = data.data;
            let uploadAuth = data.UploadAuth;
            uploader.resumeUploadWithAuth(uploadAuth);
            console.log(
              "upload expired and resume upload with uploadauth " + uploadAuth
            );
          });
          self.statusText = "文件超时...";
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          console.log("onUploadEnd: uploaded all the files");
          this.data.title = "";
          this.pauseDisabled = true;
          self.statusText = "文件上传完毕";
        }
      });
      return uploader;
    }
  },
  mounted() {
    this.find(1);
  }
};
</script>

<style>
</style>
