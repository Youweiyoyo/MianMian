<template>
  <div class="container">
    <!-- 卡片主体 -->
    <el-card class="box-card">
      <!-- 第一行 -->
      <div class="row">
        <span class="span">
          说明:目前支持学科和关键字条件筛选
        </span>
        <el-button type="success" icon="el-icon-edit" size="small"
          >新增试题</el-button
        >
      </div>
      <!-- from表单 -->
      <el-form ref="form" label-width="80px">
        <!-- 第一行 -->
        <el-col :span="6">
          <el-form-item label="学科" size="small">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="二级目录" size="small">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" size="small">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键字" size="small">
            <el-input placeholder="根据题干搜索"></el-input>
          </el-form-item>
        </el-col>
        <!-- 第二行 -->
        <el-col :span="6">
          <el-form-item label="试题类型" size="small">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="难度" size="small">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="方向" size="small">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="录入人" size="small">
            <el-select placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 第三行 -->
        <el-col :span="6">
          <el-form-item label="题目备注" size="small">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="企业简称" size="small">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="城市" size="small">
            <el-select placeholder="请选择" class="select">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-select placeholder="请选择" class="select list">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="behind">
          <el-button size="small">清除</el-button>
          <el-button type="primary" size="small">搜索</el-button>
        </el-col>
      </el-form>
      <el-alert title="数据一共7条" type="info" show-icon :closable="false">
      </el-alert>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="number" label="试题编号" width="180">
        </el-table-column>
        <el-table-column prop="subject" label="学科" width="180">
        </el-table-column>
        <el-table-column prop="catalog" label="目录"> </el-table-column>
        <el-table-column label="题型">
          <template slot-scope="scope">
            {{ scope.row.questionType === "1" ? "单选" : "多选" }}
          </template>
        </el-table-column>
        <el-table-column label="题干">
          <template slot-scope="scope">
            <span v-html="scope.row.question"></span>
          </template>
        </el-table-column>
        <el-table-column prop="addDate" label="录入时间"></el-table-column>
        <el-table-column prop="difficulty" label="难度"> </el-table-column>
        <el-table-column prop="creatorID" label="录入人"> </el-table-column>
        <el-table-column label="操作">
          <el-button
            title="预览"
            type="primary"
            icon="el-icon-view"
            circle
            plain
            size="small"
          ></el-button>
          <el-button
            title="修改"
            type="success"
            icon="el-icon-edit"
            circle
            plain
            size="small"
          ></el-button>
          <el-button
            title="删除"
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            size="small"
          ></el-button>
          <el-button
            title="加入精选"
            type="warning"
            icon="el-icon-check"
            circle
            plain
            size="small"
          ></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        :background="true"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { list } from "@/api/hmmm/questions";
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    // 发起Ajax请求
    this.getTableList();
  },
  computed: {},
  methods: {
    // 发起渲染表格的请求
    async getTableList() {
      try {
        const { data } = await list();
        this.tableData = data.items;
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style scoped lang="less">
.container {
  padding: 10px;
  /deep/ .el-card__body {
    padding: 20px;
  }
  .box-card {
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
    }
    .span {
      font-size: 12px;
      color: pink;
    }
    .el-select {
      width: 100%;
    }
    .select {
      width: 50%;
      padding-right: 10px;
    }
    .list {
      padding-right: 0;
    }
    .behind {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .el-alert {
      margin-bottom: 20px;
    }
    .el-pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
