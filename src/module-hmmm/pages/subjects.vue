<template>
  <div class="container">
    <!-- 卡片区域 -->
    <el-card>
      <!-- 学科导航 start  ref="subjectFormRef" -->
      <!-- <el-form ref="form" :model="subjectForm" label-width="80px"> -->
      <el-form ref="form" label-width="80px">
        <el-col :span="6">
          <el-form-item label="学科名称">
            <el-input size="small" v-model="queryInfo.subjectName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="btn">
          <el-button size="small" @click="queryInfo.subjectName = ''"
            >清除</el-button
          >
          <el-button type="primary" size="small" @click="getSubjectsList"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            @click="addSubjectsDialogVisible = true"
            >新增学科</el-button
          >
        </el-col>
      </el-form>
      <!-- 学科导航 end -->

      <!-- 警告区域 start -->
      <el-alert
        class="alert"
        :title="alertText"
        type="info"
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 警告区域 end -->

      <!-- 表格区域 start -->
      <el-table :data="getList" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column
          label="学科名称"
          prop="subjectName"
          width="113px"
        ></el-table-column>
        <el-table-column
          label="创建者"
          prop="username"
          width="113px"
        ></el-table-column>
        <el-table-column label="创建日期" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.addDate | dataFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="前台是否显示" width="105px">
          <template slot-scope="scope">
            <span>{{ scope.row.isFrontDisplay === 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="二级目录"
          prop="twoLevelDirectory"
          width="110px"
        ></el-table-column>
        <el-table-column
          label="标签"
          prop="tags"
          width="105px"
        ></el-table-column>
        <el-table-column
          label="题目数量"
          prop="totals"
          width="105px"
        ></el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button type="text" @click="goDirPage(scope.row)"
              >学科分类</el-button
            >
            <el-button type="text" @click="goTagPage(scope.row)"
              >学科标签</el-button
            >
            <el-button type="text" @click="updateShow(scope.row)"
              >修改</el-button
            >
            <el-button type="text" @click="removeSubById(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格区域 end -->

      <!-- 分页区域 start -->
      <el-pagination
        style="text-align: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
      <!-- 分页区域 end -->

      <!-- 新增学科的弹出层 start -->
      <el-dialog
        title="新增学科"
        :visible.sync="addSubjectsDialogVisible"
        width="30%"
        @close="closeDia"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <!-- 学科名称 prop：验证规则属性-->
          <el-form-item label="学科名称" prop="subjectName">
            <el-input
              v-model="addForm.subjectName"
              placeholder="请输入学科名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <!-- v-model="addForm.isFrontDisplay" -->
            <el-switch
              v-model="switchbtn"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="submitbtn">
          <span slot="footer" class="dialog-footer">
            <el-button @click="addSubjectsDialogVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="addSubjects">确 定</el-button>
          </span>
        </div>
      </el-dialog>
      <!-- 新增学科的弹出层 end -->

      <!-- 修改按钮的弹出层 start :before-close="editClose" -->
      <el-dialog
        title="修改学科"
        :visible.sync="editSubjectsDialogVisible"
        width="30%"
        @close="closeDia"
      >
        <el-form
          :model="editForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <!-- 学科名称 prop：验证规则属性-->
          <el-form-item label="学科名称" prop="subjectName">
            <el-input v-model="editForm.subjectName"></el-input>
          </el-form-item>
          <el-form-item label="是否显示" prop="isFrontDisplay">
            <!-- v-model="addForm.isFrontDisplay" -->
            <el-switch
              v-model="editForm.isFrontDisplay"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="submitbtn">
          <span slot="footer" class="dialog-footer">
            <el-button @click="editSubjectsDialogVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="updateSubjects">确 定</el-button>
          </span>
        </div>
      </el-dialog>
      <!-- 修改按钮的弹出层 end -->
    </el-card>
  </div>
</template>

<script>
// 学科详情 detail 就是学科分类按钮跳转的地方
import { list, remove, add, update } from "@/api/hmmm/subjects.js";

export default {
  name: "SubjectsList",
  components: {},
  props: {},
  data() {
    return {
      getList: [], // 获取到的列表数据存储的数组
      total: 0, // 总条数
      alertText: "", // 警告区域文本
      addSubjectsDialogVisible: false, // 控制弹出层的显示与隐藏
      // 获取学科列表的参数对象
      queryInfo: {
        // 搜索关键字
        subjectName: "",
        // 当前的页数
        page: 1,
        // 每页显示的条数
        pagesize: 5
      },
      // 添加学科表单数据
      addForm: {
        subjectName: "",
        isFrontDisplay: 0
      },
      // 添加学科表单的验证规则
      addFormRules: {
        subjectName: [
          { required: true, message: "请输入学科名称", trigger: "blur" }
        ]
      },
      editSubjectsDialogVisible: false, // 修改弹出层的显示与隐藏
      // 弹出层开关的默认状态
      switchbtn: true,
      editForm: {
        subjectName: "",
        id: "",
        isFrontDisplay: 1 // 1 是 0 否
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getSubjectsList();
  },
  mounted() {},
  methods: {
    // 初始数据
    initialDate() {
      // 读取数据
      this.getSubjectsList();
    },
    // 获取列表数据
    async getSubjectsList() {
      console.log(11);
      try {
        const { data } = await list(this.queryInfo);
        console.log(data);
        // 获取数据给 getList()
        const res = data.items;

        this.getList = res;
        this.queryInfo.page = parseInt(data.page);
        this.queryInfo.pagesize = parseInt(data.pagesize);
        // console.log(data.items);
        // console.log(res);
        // 获取总条数
        this.total = data.counts;
        // console.log(data.counts)
        this.alertText = `数据一共是 ${this.total} 条`;
      } catch (err) {
        console.log(err);
      }
    },
    // 下拉框改变时触发的函数 pagesize
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getSubjectsList(); // 重新渲染页面列表数据
    },
    // 当前页 （1、2）变化时的 change 事件  页码值改变时触发
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getSubjectsList();
    },
    // 根据ID删除学科列表
    removeSubById(subjects) {
      // console.log(id)
      this.$confirm("此操作将永久删除学科 " + ", 是否继续?", "提示", {
        type: "warning"
      })
        .then(async () => {
          await remove({ id: subjects })
            .then(response => {
              this.$message.success("成功删除了用户" + "!");
              this.getList.splice(subjects, 1);
              this.getSubjectsList();
            })
            .catch(response => {
              this.$message.error("删除失败!");
            });
        })
        .catch(() => {
          this.$message.info("已取消操作!");
        });
    },
    // 添加学科按钮添加数据
    addSubjects() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          try {
            await add(this.addForm);
            this.addSubjectsDialogVisible = false;
            this.getSubjectsList();
            // 还要清空表单数据
            this.$message.success("添加学科信息成功！");
          } catch (err) {
            console.log(err);
            this.$message.error("添加学科信息失败！");
          }
        } else {
          return false;
        }
      });
    },
    // 点击修改按钮，出现弹层
    updateShow(item) {
      console.log(item);
      // 弹出弹出层
      this.editSubjectsDialogVisible = true;
      // 展示数据
      this.editForm.subjectName = item.subjectName;
      this.editForm.id = item.id;
      // this.editForm.isFrontDisplay = item.isFrontDisplay;
      // console.log(this.editForm.isFrontDisplay);
    },
    // 点击确定，修改数据
    updateSubjects() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          try {
            const { data } = await update(this.editForm);
            console.log(data);
            this.editSubjectsDialogVisible = false;
            this.getSubjectsList();
            // 还要清空表单数据
            // 提示信息
            this.$message.success("修改学科信息成功！");
          } catch (err) {
            this.editSubjectsDialogVisible = false;

            // this.$message.error("修改学科信息失败！");
            console.log(err);
          }
        } else {
          return false;
        }
      });
    },
    // 点击学科分类，跳转到目录页面
    goDirPage(row) {
      this.$router.push({
        path: "directorys",
        query: { id: row.id, name: row.subjectName }
      });
    },
    // 点击学科标签，跳转到标签页面
    goTagPage(row) {
      this.$router.push({
        path: "tags",
        query: { id: row.id, name: row.subjectName }
      });
    },

    // 弹出层的关闭事件，并且清空表单
    closeDia() {
      this.$refs.editFormRef.resetFields();
    }
  }
};
</script>

<style scoped lang="less">
.container {
  padding: 10px;
  .btn {
    padding-left: 12px;
    padding-top: 4px;
  }
  .addbtn {
    padding-right: 12px;
    padding-top: 4px;
  }
  .alert {
    margin-bottom: 15px;
  }
  .el-pagination {
    padding-top: 15px;
  }
  .dialog-footer {
    text-align: right !important;
  }
  .submitbtn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
