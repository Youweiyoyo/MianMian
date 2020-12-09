<template>
  <div class="container">
    <div class="container">
      <el-card class="el-card_body">
        <el-form
          ref="form"
          label-width="80px"
          :model="rulesForm"
          :rules="rulesd"
        >
          <el-col :span="6">
            <el-form-item label="标签名称" prop="name">
              <el-input class="haihai" v-model="queryInfo.tagName"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-form-item>
                <el-select v-model="queryInfo.state">
                  <el-option label="启用" value="shanghai"></el-option>
                  <el-option label="禁用" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button @click="deleteList">清除</el-button>
            <el-button type="primary" @click="getList">搜索</el-button>
          </el-col>
          <el-button
            style="float:right"
            type="success"
            icon="el-icon-edit"
            @click="dialogVisible = true"
            >新增标签</el-button
          >
        </el-form>
        <el-alert :closable="false" title="数据一共12条" type="info" show-icon>
        </el-alert>
        <template>
          <el-table style="width: 100%" :data="subjectList">
            <el-table-column type="index" prop="date" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="subjectName" label="所属学科" width="180">
            </el-table-column>
            <el-table-column prop="tagName" label="标签名称"> </el-table-column>
            <el-table-column prop="username" label="创建者"> </el-table-column>
            <el-table-column prop="addDate" label="创建日期">
              <template slot-scope="scope">{{
                scope.row.addDate | parseTime
              }}</template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                {{ scope.row.state === 0 ? "已启用" : "已禁用" }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handle(scope.row)">
                  {{ scope.row.state === 1 ? "启动" : "禁用" }}
                </el-button>
                <el-button
                  type="text"
                  :disabled="scope.row.state === 0"
                  @click="showEditDialog(scope.row)"
                  >修改</el-button
                >
                <el-button
                  @click="removeUser(scope.row.id)"
                  type="text"
                  :disabled="scope.row.state === 0"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="nannan"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 15, 20]"
            :current-page="queryInfo.page"
            :page-size="queryInfo.pagesize"
            layout="prev, pager, next,sizes,jumper"
            :total="this.total"
          >
          </el-pagination>
        </template>
      </el-card>
      <el-dialog
        height="80%"
        title="新增标签"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <el-form
          :model="addForm"
          :rules="ruleForm"
          ref="addFormRef"
          label-width="80px"
          width="80px"
        >
          <el-form-item label="所属学科">
            <el-form-item>
              <el-select v-model="addForm.subjectID" placeholder="请选择">
                <el-option
                  v-for="item in subjectLists"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item class="heihei" label="目录名称" prop="tagName">
            <el-input class="el-input" v-model="addForm.tagName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTage">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="editdialogVisible" width="50%">
        <el-form ref="form" label-width="80px">
          <el-form-item label="所属学科">
            <el-select v-model="addForm.subjectID" placeholder="请选择">
              <el-option
                v-for="item in subjectLists"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="目录名称"
            :rules="[
              { required: true, message: '年龄不能为空' },
              { type: 'number', message: '年龄必须为数字值' }
            ]"
          >
            <el-input v-model="addForm.tagName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editValue">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {list as  tagList, remove, add, update } from "@/api/hmmm/tags";
import { parseTime } from "@/filters/index";
import { simple } from "@/api/hmmm/subjects";
export default {
  data() {
    return {
      //这个是点击修改确定后的id
      id: 0,
      subjectID: 0,
      msg: "aaa",
      yang: false,
      value: "",
      dialogVisible: false,
      rulesForm: {
        name: "",
        status: ""
      },
      rulesd: {
        name: [],
        status: []
      },
      queryInfo: {
        tagName: "",
        state: null,
        //   当前的页数
        page: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      total: 0,
      addForm: {
        subjectID: "",
        tagName: ""
      },
      subjectLists: [],
      editdialogVisible: false,
      value: "",
      ruleForm: {
        tagName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      subjectList: [],
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    async getList() {
      try {
        const { data } = await tagList(this.queryInfo);
        this.subjectList = data.items;
        // console.log(data);
        this.queryInfo.pagesize = parseInt(data.pagesize);
        this.queryInfo.page = parseInt(data.page);
        this.total = data.counts;
      } catch (err) {}
    },
    async getTagList() {
      try {
        const { data } = await tagList(this.queryInfo);
        this.subjectList = data.items;
        // console.log(data);
      } catch (err) {}
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;

      this.getList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getList();
    },
    handle(row) {
      //  启用，禁止
      row.state === 0 ? (row.state = 1) : (row.state = 0);
      this.$message({
        showClose: true,
        message: "操作成功",
        type: "success"
      });
    },
    // 删除
    removeUser(tags) {
      this.$confirm("此操作将永久删除用户 " + ", 是否继续?", "提示", {
        type: "warning"
      })
        .then(async () => {
          await remove({ id: tags })
            .then(response => {
              this.$message.success("成功删除了用户" + "!");
              this.subjectList.splice(tags, 1);
              this.getTagList();
            })
            .catch(response => {
              this.$message.error("删除失败!");
            });
        })
        .catch(() => {
          this.$message.info("已取消操作!");
        });
    },
    // 获取表单
    async getSubjectList() {
      try {
        const { data } = await simple();
        this.subjectLists = data;
      } catch (err) {}
    },
    // 新增标签
    addTage() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          try {
            await add(this.addForm);
            this.dialogVisible = false;
          } catch (err) {}
        } else {
          console.log("error submit!!");
          return false;
        }
        this.$message({
          showClose: true,
          message: "操作成功",
          type: "success"
        });
      });
    },
    async showEditDialog(item) {
      // console.log(item)
      this.addForm.subjectID = item.subjectName;
      this.addForm.tagName = item.tagName;
      this.editdialogVisible = true;
      this.id = item.id;
      this.subjectID = item.subjectID;
    },
    async editValue() {
      const datas = {
        id: this.id,
        tagName: this.addForm.tagName,
        subjectID: this.subjectID
      };
      await update(datas);
      this.editdialogVisible = false;
      this.getTagList();
      this.$message({
        message: "修改成功",
        type: "success"
      });
    },
    deleteList(form) {
      // console.log(this.$refs.form);
      this.queryInfo.tagName = "";
      this.queryInfo.state = null;
    }
  },
  created() {
    this.getTagList();
    this.getSubjectList();
  }
};
</script>

<style scoped lang="less">
// /deep/.el-input__inner {
//   width: 50%;
// }
.el-input {
  width: 35%;
}
.nannan {
  float: right;
  margin: 15px;
}
.haihai {
  width: 222px;
}
</style>
