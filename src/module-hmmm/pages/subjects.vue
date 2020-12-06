<template>
  <div class="container">
    <!-- 卡片区域 -->
    <el-card>
      <!-- 学科导航 start -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-col :span="6">
          <el-form-item label="学科名称">
            <el-input size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="btn">
          <el-button size="small">清除</el-button>
          <el-button type="primary" size="small">搜索</el-button>
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
      ></el-alert>
      <!-- 警告区域 end -->

      <!-- 表格区域 start -->
      <el-table :data="getList" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="学科名称" prop="subjectName"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建日期" prop="addDate"></el-table-column>
        <el-table-column
          label="前台是否显示"
          prop="isFrontDisplay"
        ></el-table-column>
        <el-table-column
          label="二级目录"
          prop="twoLevelDirectory"
        ></el-table-column>
        <el-table-column label="标签" prop="tags"></el-table-column>
        <el-table-column label="题目数量" prop="totals"></el-table-column>
        <el-table-column label="操作" width="260px">
          <el-button type="text">学科分类</el-button>
          <el-button type="text">学科标签</el-button>
          <el-button type="text">修改</el-button>
          <el-button type="text">删除</el-button>
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
        :before-close="handleClose"
      >
        <!-- 内容 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px"
        >
          <!-- 学科名称 prop：验证规则属性-->
          <el-form-item label="学科名称" prop="subjectName">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch
              v-model="switchbtn"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addSubjectsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSubjectsDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 新增学科的弹出层 end -->
    </el-card>
  </div>
</template>

<script>
import { list } from "@/api/hmmm/subjects";

export default {
  name: "SubjectsList",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: ""
      },
      getList: [],
      total: 0,
      alertText: "",
      addSubjectsDialogVisible: false, // 控制弹出层的显示与隐藏
      // 添加学科表单数据
      addForm: {
        subjectName: "",
        isFrontDisplay: 1
      },
      // 添加学科表单的验证规则
      addFormRules: {
        subjectName: [
          { required: true, message: "请输入学科名称", trigger: "blur" }
        ]
      },
      // 弹出层开关的默认状态
      switchbtn: true,
      // 获取学科列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前的页数
        page: 1,
        // 每页显示的条数
        pagesize: 10
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
        this.queryInfo.page =parseInt( data.page);
        this.queryInfo.pagesize = data.pagesize;
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

    // 弹出层确认关闭
    handleClose() {
      this.addSubjectsDialogVisible = false;
    },

    // 下拉框改变时触发的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getSubjectsList(); // 重新渲染页面列表数据
    },
    // 当前页 （1、2）变化时的 change 事件
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getSubjectsList();
    }
  }
};
</script>

<style scoped lang="less">
.container {
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
}
</style>
