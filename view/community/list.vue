<template>
  <div>
    <Card>
      <div>
        <Button @click="create" style="padding: 6px 12px;margin-bottom: 10px;" type="primary">创建群</Button>
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
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </Card>
    <Modal
      v-model="isShow"
      title="创建群"
      width="800px"
      @on-cancel="cancel"
      ok-text="提交"
      @on-ok="submit"
      :footer-hide="true"
    >
      <Card style="width:auto">
        <div>
          群 名 称：
          <Input v-model="data.groupName" placeholder="请输入群名称..." style="width: 200px" />
        </div>
        <!-- <br />
        <div>
          群 分 类：
          <Select v-model="data.category" style="width:200px">
            <Option v-for="item in flags" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>-->
        <br />
        <div>
          请选择群图片
          <!-- <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            :on-success="handleSuccess"
            :before-upload="handleBeforeUpload"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>-->
          <Upload
            :action="uploadUrl"
            :max-size="2048"
            :format="['jpg','jpeg','png']"
            :headers="headers"
            :on-success="handleSuccess"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :data="{'from':'community-image'}"
          >
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>
          <img :src="imgUrl" alt style="width:100px;height:100px;" />
        </div>
        <br />
        <div>
          限制人数：
          <InputNumber v-model="data.limit" :min="1" :max="2147483647" :precision="0"></InputNumber>
        </div>
        <br />
        <div>
          群 公 告：
          <Input v-model="data.notice" placeholder="请输邀请码..." style="width: 200px" />
        </div>
        <br />
        <div>
          邀 请 码：
          <Input v-model="data.inviteCode" placeholder="请输邀请码..." style="width: 200px" />
        </div>
        <br />
        <div>
          东&nbsp;&nbsp;&nbsp;&nbsp; 经：
          <Input
            v-model="data.longitude"
            placeholder="请输入经度如：116.3400833900..."
            style="width: 200px"
          />
        </div>
        <br />
        <div>
          北&nbsp;&nbsp;&nbsp;&nbsp; 伟：
          <Input
            v-model="data.latitude"
            placeholder="请输入伟度如：39.9997921000..."
            style="width: 200px"
          />
        </div>
        <br />
      </Card>
      <div style="margin-top:20px;text-align:right;">
        <Button size="large" @click="cancel" type="primary">取消</Button>&nbsp;
        <Button size="large" @click="submit" type="primary">确定</Button>
      </div>
    </Modal>
    <!-- <Modal
      v-model="isShowMembers"
      title="群成员"
      width="800px"
      @on-cancel="cancel"
      ok-text="提交"
      @on-ok="submit2"
    >
      <tables
        ref="selection"
        @on-select="handleSelectRow"
        @on-select-cancel="handleCancelRow"
        @on-select-all="handleSelectAll"
        @on-select-all-cancel="handleSelectAll"
        v-model="tableDataMember"
        :columns="columnsMember"
      />
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total2" @on-change="changePage2"></Page>
        </div>
      </div>
    </Modal>-->
  </div>
</template>

<script>
import Tables from "_c/tables";

import { baseUrl, getToken } from "@/libs/util";
import { get_member } from "@/api/userRegister";
import {
  findGroups,
  delGroup,
  createGroup,
  getGroup,
  editGroup,
  findFlags
} from "@/api/community";
export default {
  name: "community_list",
  components: {
    Tables
  },
  data() {
    return {
      columnsMember: [
        {
          title: "选择",
          type: "selection"
        },
        { title: "电话", key: "mobile" },
        { title: "姓名", key: "name" }
      ],
      columns: [
        { title: "ID", key: "id", sortable: true },
        { title: "社群名称", key: "groupName", sortable: true },
        { title: "群人数", key: "counts" },
        { title: "最多允许人数", key: "limit" },
        { title: "创建者", key: "creator" },
        {
          title: "状态",
          key: "status",
          width: 100,
          render: (h, params) => {
            let text = { 1: "待审核", 2: "已通过" };
            return h("span", {}, text[params.row.status]);
          }
        },
        {
          title: "操作",
          key: "handle",
          width: 350,
          options: ["delete"],
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  style: {
                    cursor: "pointer",
                    marginRight: "8px"
                  },
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      let _this = this;
                      getGroup(params.row.id)
                        .then(res => {
                          if (res.data.status == "tokenFail") {
                            //token 过期 跳login
                          } else if (res.data.status == "success") {
                            let data = res.data.data;
                            _this.data.id = data.id;
                            _this.data.groupName = data.groupName;
                            // _this.data.category = data.cid;
                            _this.imgUrl = data.image;
                            _this.data.limit = data.limit;
                            _this.data.inviteCode = data.inviteCode;
                            _this.data.notice = data.notice;
                            _this.data.longitude = data.longitude;
                            _this.data.latitude = data.latitude;
                            this.isShow = true;
                            this.isEditing = true;
                            this.isEditingRow = params.index;
                          }
                        })
                        .catch(err => {});
                    }
                  }
                },
                "编辑"
              );
            }
            // (h, params, vm) => {
            //   return h(
            //     "Button",
            //     {
            //       style: {
            //         cursor: "pointer",
            //         marginRight: "8px"
            //       },
            //       props: {
            //         type: "primary",
            //         size: "small"
            //       },
            //       on: {
            //         click: () => {
            //           this.getList();
            //           this.isShowMembers = true;
            //         }
            //       }
            //     },
            //     "管理群成员"
            //   );
            // }
          ]
        }
      ],
      tableData: [],
      tableDataMember: [],
      groupname: "默认群名称",
      //   membersName: "",
      isShow: false,
      isShowMembers: false,
      data: {}, //创建、编辑 数据
      total: 0,
      total2: 0,
      current: 1,
      isEditing: false,
      isEditingRow: -1,
      currentPage: 1,
      currentPage2: 1,
      flags: [],
      isOping: false, //防止连续提交
      uploadUrl: baseUrl() + "/api/admin/uploadOne",
      headers: { token: getToken() },
      imgUrl: "",
      selectData: [], //已经选择的数据
      selectedIds: new Set() //选中的合并项的id
    };
  },
  methods: {
    find(data) {
      findGroups(data).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    changePage(page) {
      this.currentPage = page;
      this.find({ page: page });
    },
    changePage2(page) {
      this.currentPage2 = page;
      this.getList({ Page: page });
      this.$nextTick(() => {
        //确保dom加载完毕
        this.setChecked();
      });
    },
    submit() {
      if (!this.isEditing) {
        this.createFun();
      } else {
        this.editFun();
      }
    },
    createFun() {
      if (!this.data.groupName) {
        this.$Message.error("请添加群名称");
        return false;
      }
      if (!this.data.image) {
        this.$Message.error("请添加群图片");
        return false;
      }
      if (this.data.limit < 1) {
        this.$Message.error("限制人数必须大于1");
        return false;
      }
      let data = {
        groupName: this.data.groupName,
        image: this.data.image,
        // cid: this.data.category,
        limit: this.data.limit,
        inviteCode: this.data.inviteCode,
        notice: this.data.notice,
        longitude: this.data.longitude,
        latitude: this.data.latitude
      };
      createGroup(data) //上传接口
        .then(res => {
          if (res.data.status == "tokenFail") {
          } else if (res.data.status == "success") {
            this.dataReset();
            this.$Message.success("添加成功");
            this.isShow = false;
            this.find({ page: this.currentPage });
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch(err => {
          this.$Message.error("添加失败");
        });
    },
    editFun() {
      let data = {
        id: this.data.id,
        groupName: this.data.groupName,
        image: this.data.image,
        // cid: this.data.category,
        limit: this.data.limit,
        inviteCode: this.data.inviteCode,
        notice: this.data.notice,
        longitude: this.data.longitude,
        latitude: this.data.latitude
      };
      editGroup(data) //上传接口
        .then(res => {
          console.log(this.data);
          this.tableData[this.isEditingRow].groupName = this.data.groupName;
          this.tableData[this.isEditingRow].limit = this.data.limit;
          this.$Message.success(res.data.msg);
          this.dataReset();
          this.isShow = false;
        })
        .catch(err => {
          this.$Message.error("添加失败");
          this.data = {};
        });
      this.isEditing = false;
    },
    dataReset() {
      this.isEditing = false;
      this.data = {};
      this.imgUrl = "";
    },
    create() {
      this.isShow = true;
    },
    cancel() {
      this.data = {};
      this.isShow = false;
      this.imgUrl = "";
    },
    handleDelete(params) {
      let data = { id: params.row.id };
      delGroup(data)
        .then(res => {
          this.$Message.success(res.data.msg);
        })
        .catch(function(response) {
          console.log(response);
          return false;
        });
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc:
          "文件 " + file.name + " 格式不正确，请上传 jpg 或 png 格式的图片。"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "Exceeding file size limit",
        desc: "File  " + file.name + " is too large, no more than 2M."
      });
    },
    handleSuccess(res, file) {
      if (res.status == "success") {
        this.imgUrl = res.data.url;
        this.data.image = res.data.name;
      }
      console.log(11111, res, file);
      //   this.data.imageUrl = window.URL.createObjectURL(file)
      console.log(this);
    },
    handleBeforeUpload(file) {},
    findFlag() {
      findFlags().then(res => {
        this.flags = res.data.data;
      });
    }
    //     getList() {
    //       /**
    // {
    //     "Page":1,
    //     "limit":2,
    //     "item":"reward",
    //     "DESC":1,
    //     "admin":15910918033,
    //     "token":"3c7b03e7be68a0557c307a2fb4bd122047562f761ba0b0d5015bfb472166a32c"
    // }
    //        */
    //       let data = {
    //         Page: this.currentPage2 == 0 ? 1 : this.currentPage2,
    //         limit: 10,
    //         item: "reward",
    //         DESC: 1,
    //         admin: parseInt(this.$store.state.user.userName),
    //         token: this.$store.state.user.time_token
    //       };
    //       get_member(data).then(res => {
    //         if (res.data.status == "success") {
    //           console.log(res.data);

    //           this.total2 = res.data.data.info[0].Num;
    //           this.tableDataMember = res.data.data.member_info;
    //           this.tableDataMember[0]._isChecked = true;
    //           console.log(this.$refs.selection);
    //           this.$refs.selection.value[1]._isChecked = true;
    //         } else if (res.data.error == "error_token") {
    //           this.$Message.error("token 错误请重新登录");
    //           //跳转登录页面
    //         } else {
    //           this.$Message.error("管理员错误");
    //         }
    //       });
    //     },

    //     // 处理table翻页选中的回显回来
    //     // cy 全选和取消全选时触发
    //     handleSelectAll(selection) {
    //       // 取消全选 数组为空
    //       if (selection.length === 0) {
    //         // cy 若取消全选，删除保存在selectedIds里和当前table数据的id一致的数据，达到，当前页取消全选的效果
    //         // 当前页的table数据
    //         let data = this.$refs.selection.data;
    //         data.forEach(item => {
    //           if (this.selectedIds.has(item.mobile)) {
    //             this.selectedIds.delete(item.mobile);
    //           }
    //         });
    //       } else {
    //         selection.forEach(item => {
    //           this.selectedIds.add(item.mobile);
    //         });
    //       }
    //       //同步
    //       this.selectedSum = this.selectedIds.size;
    //     },

    //     //  选中某一行
    //     handleSelectRow(selection, row) {
    //       console.log(this.tableDataMember);
    //       this.selectedIds.add(row.mobile);
    //     },
    //     //  取消某一行
    //     handleCancelRow(selection, row) {
    //       this.selectedIds.delete(row.mobile);
    //     },
    //     //  这个函数就放在你点击翻页的函数里就行了（需要注意要在table将数据渲染完毕后执行，否则报错），
    //     //  达到每次翻页加载时将以前选中的row勾选上的效果
    //     // cy 给跨页丢失的选中行重新添加选中状态
    //     setChecked() {
    //       // 找到绑定的table的ref对应的dom，找到table的objData对象，objData保存的是当前页的数据
    //       let objData = this.$refs.selection.objData;
    //       for (let index in objData) {
    //         if (this.selectedIds.has(objData[index].mobile)) {
    //           // cy 弊端 每次切换select都会触发table的on-select事件
    //           // this.$refs.purchaseTable.toggleSelect(index) // 在保存选中的ids的set合集里找与当前页数据id一样的行，使用toggleSelect（index），将这一行选中
    //           // cy 改进
    //           objData[index]._isChecked = true;
    //         }
    //       }
    //     },
    //     submit2() {
    //       console.log(8888888888);
    //     }
  },
  mounted() {
    this.find({ page: 1 });
    // this.findFlag();
  }
};
</script>

<style>
</style>
