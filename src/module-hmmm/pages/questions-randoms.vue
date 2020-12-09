<template>
  <div class="container">
    <!-- 第一行 -->
    <el-card class="box-card">
      <el-form>
        <span class="spn">关键字</span>
        <el-input
          v-model="queryInfo.keyword"
          class="input"
          size="small"
          placeholder="根据编号搜索"
        ></el-input>
        <span class="right">
          <el-button size="small" @click="clear">清除</el-button>
          <el-button type="primary" size="small" @click="getTableList"
            >搜索</el-button
          >
        </span>
      </el-form>
      <div class="error">
        <el-alert
          :title="`数据一共${this.total}条`"
          type="info"
          show-icon
          :closable="false"
        >
        </el-alert>
      </div>
      <!-- 表格 -->
      <el-table :data="tableList" style="width: 100%">
        <el-table-column prop="id" label="编号" width="180"> </el-table-column>
        <el-table-column label="题型" width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.questionType === '1'">单选</div>
            <div v-else-if="scope.row.questionType === '2'">多选</div>
            <div v-else>简答</div>
          </template>
        </el-table-column>
        <el-table-column label="题目编号">
          <template slot-scope="scope">
            <div v-for="item in scope.row.questionIDs" :key="item.number">
              <a href="javascript:;" class="link" @click="openlinks(item.id)">{{
                item.number
              }}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="录入时间"> </el-table-column>
        <el-table-column prop="totalSeconds" label="答题时间(s)">
        </el-table-column>
        <el-table-column prop="accuracyRate" label="正确率(%)">
        </el-table-column>
        <el-table-column prop="userName" label="录入人"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="delTable(scope.row.questionIDs[0].id)"
              type="danger"
              icon="el-icon-delete"
              circle
              plain
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="queryInfo.pagesize"
        layout="  prev, pager, next, sizes , jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="题目预览" :visible.sync="dialogVisible" width="50%">
      <questions-preview
        @close="dialogVisible = false"
        :dataId="this.dataId"
        v-if="dialogVisible"
      />
    </el-dialog>
  </div>
</template>

<script>
import { randoms, removeRandoms } from "@/api/hmmm/questions"; // 组题列表数据 & 删除
import QuestionsPreview from "../components/questions-preview"; // 对话框组件
export default {
  name: "",
  components: { QuestionsPreview }, // 注册组件
  props: {},
  data() {
    return {
      keyword: '',
      queryInfo: {
        page: 1, // 当前页码
        pagesize: 20 // 当前每页显示多少条数据
      },
      tableList: [], // 表格所有数据
      total: 0, // 总数据
      saerch: "", // input绑定数据
      dialogVisible: false, // 控制弹出框
      dataId: "" // 定义题目id
    };
  },
  computed: {},
  filters: {},
  watch: {},
  created() {
    this.getTableList();
  },
  methods: {
    // 清空搜索框
    clear() {
      this.queryInfo.keyword = "";
    },
    // 渲染表格的事件
    async getTableList() {
      try {
        const { data } = await randoms(this.queryInfo);
        console.log(data);
        this.tableList = data.items; // 获取表格数据
        this.total = data.counts; // 总数据条数
        this.queryInfo.pagesize = parseInt(data.pagesize); // 每页显示多少条数据
        this.queryInfo.page = parseInt(data.page); // 当前页数
      } catch (err) {
        console.log(err);
      }
    },
    // 删除表格数据
    async delTable(id) {
      const configDel = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (configDel !== "confirm") {
        return this.$message("已取消本次操作");
      }
      await removeRandoms({ id: id });
      return this.$message.success("删除数据成功");
      this.getTableList();
    },
    // 监听pageSize事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getTableList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getTableList();
    },
    // 打开链接
    openlinks(id) {
      this.dialogVisible = true;
      this.dataId = id;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
  .spn {
    font-size: 14px;
    margin-right: 10px;
    margin-left: 20px;
  }
  .input {
    width: 300px;
  }
  .right {
    float: right;
  }
  .error {
    margin: 20px 0 10px 0;
  }
  .el-pagination {
    float: right;
    margin: 20px 0 10px 0;
  }
  .link {
    color: #0099ff;
  }
  .span {
    margin-left: 10px;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .top {
    margin-top: 20px;
  }
  /deep/.el-dialog__body {
    padding: 15px 20px;
  }
}
</style>
