<template>
  <div class="container">
    <!-- 卡片区域 -->
    <el-card>
      <!-- 目录导航 start -->
      <el-form label-width="80px">
        <el-col :span="6">
          <el-form-item label="目录名称">
            <el-input size="small" v-model="queryInfo.directoryName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item size="small" label="状态" prop="state" class="stabtn">
            <!-- <el-input size="small" v-model="queryInfo.state"></el-input> -->
            <el-select v-model="queryInfo.state">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="btn">
          <el-button size="small" @click="clearK">清除</el-button>
          <el-button type="primary" size="small" @click="getDirectorysList"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button
            v-show="queryInfo.subjectID"
            class="backbtn"
            type="text"
            icon="el-icon-back"
            size="small"
            @click="$router.back()"
            >返回学科</el-button
          >
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            @click="addDirectorysDialogVisible = true"
            >新增目录</el-button
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
      <el-table style="width: 100%" :data="getList">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="所属学科"
          prop="subjectName"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="目录名称"
          prop="directoryName"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="创建者"
          prop="username"
          width="120px"
        ></el-table-column>
        <el-table-column label="创建日期" width="160px">
          <template slot-scope="scope">
            <span>{{ scope.row.addDate | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="面试题数量"
          prop="totals"
          width="140px"
        ></el-table-column>
        <!-- 状态 1 启用 0 屏蔽-->
        <el-table-column label="状态" width="110px">
          <template slot-scope="scope">
            <span>{{ scope.row.state === 1 ? "已启用" : "已禁用" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleStatus(scope.row)">
              <span v-if="scope.row.state == 0">启用</span>
              <span v-else>禁用</span>
            </el-button>
            <el-button
              v-if="scope.row.status != 'deleted'"
              type="text"
              size="mini"
              :disabled="scope.row.state == 1"
              @click="updateDirShow(scope.row)"
              >修改</el-button
            >
            <el-button
              v-if="scope.row.status != 'deleted'"
              type="text"
              :disabled="scope.row.state === 1"
              @click="removeDirById(scope.row.id)"
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

      <!-- 新增目录的弹出层 start -->
      <el-dialog
        title="新增目录"
        :visible.sync="addDirectorysDialogVisible"
        width="30%"
        @close="closeDia"
      >
        <!-- 内容 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <!--所属学科、目录名称  prop：验证规则属性-->
          <el-form-item label="所属学科">
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
            <!-- value对应的是id，所以根据v-model就可以获取到value中绑定的值，就是学科的id -->
            <el-select v-model="addForm.subjectID" placeholder="请选择" style="width: 100%">
              <el-option
                style="width: 289px"
                v-for="item in getSubList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录名称" prop="directoryName">
            <el-input v-model="addForm.directoryName"></el-input>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <div class="submitbtn">
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDirectorysDialogVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="addDirectoryShow"
              >确 定</el-button
            >
          </span>
        </div>
      </el-dialog>
      <!-- 新增目录的弹出层 end -->

      <!-- 修改按钮的弹出层 start -->
      <el-dialog
        title="修改目录"
        :visible.sync="editDirDialogVisible"
        width="30%"
        @close="closeDia"
      >
        <el-form
          label-width="80px"
          :model="addForm"
          :rules="addFormRules"
          ref="editFormRef"
        >
          <!-- 所属学科 -->
          <el-form-item label="所属学科">
            <!-- v-model 绑定的是 -->
            <el-select v-model="addForm.subjectID" placeholder="请选择" style="width: 100%">
              <el-option
                style="width: 289px"
                v-for="item in getSubList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 目录名称 prop：验证规则属性-->
          <el-form-item label="目录名称" prop="directoryName">
            <el-input v-model="addForm.directoryName"></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <div class="submitbtn">
            <span slot="footer" class="dialog-footer">
              <el-button @click="editDirDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="updateDirData">确 定</el-button>
            </span>
          </div>
        </el-form>
      </el-dialog>
      <!-- 修改按钮的弹出层 end -->
    </el-card>
  </div>
</template>

<script>
// parseTime 时间过滤器 sublist 学科列表的
import { list, add, remove, update, changeState } from "@/api/hmmm/directorys";
import parseTime from "@/filters/index.js";
import { simple as sublist } from "@/api/hmmm/subjects.js";
import { status } from "@/api/hmmm/constants";

export default {
  name: "DirectorysList",
  components: {},
  props: {},
  data() {
    return {
      alertText: "",
      getList: [], // 目录列表数据
      total: 0, // 总条数
      // 获取目录列表的参数对象
      queryInfo: {
        directoryName: "",
        // 搜索关键字
        // stste: "",
        // state: '',
        // 当前的页数
        page: 1,
        // 每页显示的条数
        pagesize: 10,
        subjectID: parseInt(this.$route.query.id)
      },
      addDirectorysDialogVisible: false,
      // 添加目录表单数据
      addForm: {
        subjectName: "",
        directoryName: "",
        subjectID: null // 如果是字符串则报 422错误
      },
      // 添加目录表单的验证规则
      addFormRules: {
        // 下拉框的表单验证
        subjectName: [
          { required: true, message: "请输入所属学科", trigger: "blur" }
        ],
        directoryName: [
          { required: true, message: "请输入目录名称", trigger: "blur" }
        ]
      },
      // 弹出层开关的默认状态
      switchbtn: true,
      // 获取学科列表数据
      getSubList: [],
      editDirDialogVisible: false // 修改的弹出层
    };
  },
  computed: {
    // 计算属性
    status() {
      return status;
    }
  },
  watch: {},
  created() {
    this.getDirectorysList();
    this.getSubjectsList();
  },
  mounted() {},
  methods: {
    // 初始数据
    initialDate() {
      // 读取数据
      this.getDirectorysList();
    },
    // 获取目录列表数据
    async getDirectorysList() {
      // 获取到的学科分类的某一行的 id
      console.log(parseInt(this.$route.query.id));
      // 如果id不存在就是目录整个页面
      if (!this.$route.query.id) {
        this.queryInfo.subjectID = null;
        // URL地址截止于 directorys的话，返回学科隐藏
      }
      try {
        const { data } = await list(this.queryInfo);
        console.log(data);
        this.getList = data.items;
        console.log(this.getList);

        // 关于分页
        this.queryInfo.page = parseInt(data.page);
        this.queryInfo.pagesize = parseInt(data.pagesize);

        // 获取总条数
        this.total = data.counts;
        // 警告区域
        this.alertText = `数据一共是 ${this.total} 条`;
      } catch (err) {
        console.log(err);
      }
    },

    // 获取学科列表数据
    async getSubjectsList() {
      // console.log(11);
      try {
        const { data } = await sublist();
        // console.log(data);
        // 获取数据给 getList()
        // const res = data.items;
        // console.log(data.items.id);
        this.getSubList = data;
        // console.log(this.getSubList);
      } catch (err) {
        console.log(err);
      }
    },

    // 下拉框改变时触发的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getDirectorysList(); // 重新渲染页面列表数据
    },
    // 当前页 （1、2）变化时的 change 事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getDirectorysList();
    },
    // 启用与禁用的状态切换
    // 点击禁用按钮，状态栏的状态切换，且操作栏中禁用变为启用，且操作与删除变为可用
    // 启用、禁用
    async handleStatus(val) {
      // console.log(val);
      try {
        await changeState({
          id: val.id,
          state: val.state == 1 ? 0 : 1
        });
        this.getDirectorysList();
        this.$message.success("操作成功");
      } catch (err) {
        this.$message.error("操作失败");
      }
    },
    // 添加
    // 点击确定按钮，添加目录数据 subjectID
    addDirectoryShow() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          console.log(this.addForm);
          try {
            await add(this.addForm);
            console.log(this.addForm);
            this.addDirectorysDialogVisible = false;
            this.getDirectorysList();
            // 还要清空表单数据
            this.$message.success("添加目录信息成功！");
          } catch (err) {
            console.log(err);
            this.$message.error("添加目录信息失败！");
          }
        } else {
          return false;
        }
      });
    },
    // 删除
    // 根据ID删除目录列表
    removeDirById(directorys) {
      // console.log(id)
      this.$confirm("此操作将永久删除学科 " + ", 是否继续?", "提示", {
        type: "warning"
      })
        .then(async () => {
          await remove({ id: directorys })
            .then(response => {
              this.$message.success("成功删除了目录数据" + "!");
              this.getList.splice(directorys, 1);
              this.getDirectorysList();
            })
            .catch(response => {
              this.$message.error("删除失败!");
            });
        })
        .catch(() => {
          this.$message.info("已取消操作!");
        });
    },
    // 清空按钮清空数据
    clearK() {
      // console.log(11);
      this.queryInfo.state = "";
      this.queryInfo.directoryName = "";
    },
    // 点击修改按钮，出现弹层
    updateDirShow(item) {
      console.log(item);
      this.editDirDialogVisible = true;
      // 展示数据
      // 所属学科 目录名称 id
      this.addForm.directoryName = item.directoryName;
      this.addForm.id = item.id;
      this.addForm.subjectID = item.subjectID;
      this.addForm.subjectName = item.subjectName;
    },
    // 点击确定按钮，提交修改后的表单数据
    updateDirData() {
      console.log(11);
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          console.log(this.addForm);
          try {
            const { data } = await update(this.addForm);
            console.log(data);
            this.editDirDialogVisible = false;
            this.getDirectorysList();
            // 还要清空表单数据
            // 提示信息
            this.$message.success("修改学科信息成功！");
          } catch (err) {
            this.$message.error("修改学科信息失败！");
            console.log(err);
          }
        } else {
          return false;
        }
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
  .backbtn {
    font-size: 14px;
    padding-top: 4px;
  }
  .submitbtn {
    display: flex;
    justify-content: flex-end;
  }
  .stabtn {
    padding-top: 3px;
  }
}
</style>
