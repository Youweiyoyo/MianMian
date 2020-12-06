<template>
  <div class="container">
    <!-- 卡片区域 -->
    <el-card>
      <!-- 学科导航 start -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-col :span="6">
          <el-form-item label="目录名称">
            <el-input size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-input size="small"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="btn">
          <el-button size="small">清除</el-button>
          <el-button type="primary" size="small">搜索</el-button>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button type="success" icon="el-icon-edit" size="small">新增目录</el-button>
        </el-col>
      </el-form>
      <!-- 学科导航 end -->

      <!-- 警告区域 start -->
      <el-alert
        class="alert"
        title="数据一共 12 条"
        type="info"
        show-icon>
      </el-alert>
      <!-- 警告区域 end -->

      <!-- 表格区域 start -->
      <el-table style="width: 100%">
          <el-table-column align="center" label="序号">
          </el-table-column>
          <el-table-column align="center" label="所属学科">
          </el-table-column>
          <el-table-column align="center" label="目录名称">
          </el-table-column>
          <el-table-column align="center" label="创建者">
          </el-table-column>
          <el-table-column align="center" label="创建日期">
          </el-table-column>
          <el-table-column align="center" label="面试题数量">
          </el-table-column>
          <el-table-column align="center" label="状态">
          </el-table-column>
          <el-table-column align="center" label="操作">
          </el-table-column>
      </el-table>
      <!-- 表格区域 end -->

      <!-- 分页区域 start -->
      <el-pagination
        style="text-align: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="20"
      >
      </el-pagination>
      <!-- 分页区域 end -->
      </el-card>
  </div>
</template>

<script>
import { list } from "@/api/hmmm/directorys";

export default {
  name: "DirectorysList",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: ""
      },
      currentPage4: 4,
      getList: []
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getDirectorysList()
  },
  mounted() {},
  methods: {
    async getDirectorysList() {
      try {
        const { data } = await list()
        console.log(data)
      }catch(err) {
        console.log(err)
      }
    },
     handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
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
}
</style>
