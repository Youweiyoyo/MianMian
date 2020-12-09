<template>
  <div class="container">
    <el-card>
      <!-- 顶部区域 -->
      <el-form label-width="80px" class="el-form">
        <el-row :gutter="24">
          <el-col :span="5">
            <el-form-item label="关键字">
              <el-input
                style="width: 200px"
                size="small"
                v-model="queryInfo.keyword"
                placeholder="根据文章标题搜索"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item label="状态">
              <el-select
                v-model="queryInfo.state"
                placeholder="请选择"
                size="small"
              >
                <el-option label="启用" value="shanghai"></el-option>
                <el-option label="禁用" value="beijing"></el-option>
              </el-select>

              <el-button size="small" @click="clear" class="clearBtn"
                >清除</el-button
              >
              <el-button type="primary" size="small" @click="getArticleList"
                >搜索</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button
              size="small"
              icon="el-icon-edit"
              type="success"
              @click="dialogFormVisible = true"
              >新增技巧</el-button
            >
          </el-col>
        </el-row>
      </el-form>

      <!-- 警告框 -->
      <el-alert
        :title="`数据一共${counts}条`"
        type="info"
        show-icon
        class="el-alert"
      >
      </el-alert>

      <!-- 表格区域 -->
      <el-table :data="articleList" style="width: 100%">
        <el-table-column label="序号" type="index" width="100">
        </el-table-column>
        <el-table-column prop="title" label="文章标题" width="500px">
        </el-table-column>
        <el-table-column prop="visits" label="阅读数"> </el-table-column>
        <el-table-column prop="username" label="录入人"> </el-table-column>
        <el-table-column prop="createTime" label="录入时间" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTimeByString }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.state == 1 ? '已启用' : '已禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="previewData(scope.row.id)"
              >预览</el-button
            >
            <el-button type="text" @click="goUse(scope.row)">{{
              scope.row.state == 0 ? '启用' : '禁用'
            }}</el-button>
            <el-button
              type="text"
              :disabled="scope.row.state == 0"
              @click="editDialogShow(scope.row)"
              >修改</el-button
            >
            <el-button
              type="text"
              :disabled="scope.row.state == 0"
              @click="removeUser(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totals"
        background
        style="text-align: right"
      >
      </el-pagination>
    </el-card>

    <!-- 添加弹出框 -->
    <el-dialog title="新增文章" :visible.sync="dialogFormVisible">
      <articles-add
        v-if="dialogFormVisible"
        @close="dialogFormVisible = false"
        @upload="getArticleList"
      >
      </articles-add>
    </el-dialog>

    <!-- 修改弹出框 -->
    <el-dialog title="修改文章" :visible.sync="editVisible">
      <articles-add
        v-if="editVisible"
        @close="editVisible = false"
        @editUpload="getArticleList"
        :editArticles="editArticles"
      >
      </articles-add>
    </el-dialog>
    <!-- 预览弹出框 -->
    <el-dialog title="提示" :visible.sync="previewDataVisible" width="30%">
      <h1></h1>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="previewDataVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, remove } from '@/api/hmmm/articles'
import { parseTimeByString } from '@/filters/index'
import ArticlesAdd from '../components/articles-add'

export default {
  name: 'Articles',
  components: { ArticlesAdd },
  data() {
    return {
      articleList: [],
      counts: 0,
      queryInfo: {
        keyword: '',
        page: 1,
        pagesize: 20,
        state: null
      },
      totals: 0,
      dialogFormVisible: false,
      editVisible: false,
      editArticles: null,
      previewDataVisible: false
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    async getArticleList() {
      try {
        const { data } = await list(this.queryInfo)
        this.articleList = data.items
        this.counts = data.counts
        this.queryInfo.page = parseInt(data.page)
        this.queryInfo.pagesize = parseInt(data.pagesize)
        this.totals = data.counts
        console.log(data)
      } catch (err) {
        console.log('获取数据失败')
      }
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getArticleList()
    },

    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getArticleList()
    },

    clear() {
      this.queryInfo.keyword = ''
      this.queryInfo.state = null
    },

    goUse(row) {
      row.state === 0 ? (row.state = 1) : (row.state = 0)
    },

    handleClose() {
      this.dialogVisible = false
    },

    removeUser(user) {
      this.$confirm('此操作将永久删除用户 ' + ', 是否继续?', '提示', {
        type: 'warning'
      })
        .then(async () => {
          await remove(user)
            .then(response => {
              this.$message.success('成功删除了改用户' + '!')
              this.articleList.splice(user, 1)
              this.getArticleList()
            })
            .catch(response => {
              this.$message.error('删除失败!')
            })
        })
        .catch(() => {
          this.$message.info('已取消操作!')
        })
    },

    editDialogShow(item) {
      this.editVisible = true
      this.editArticles = item
    },

    closeEdit() {
      this.editVisible = false
    },
    // 预览
    previewData(id) {
      this.previewDataVisible = true
    }
  }
}
</script>

<style scoped lang="less">
.el-card {
  margin: 20px 15px;
  .clearBtn {
    margin-left: 15px;
  }
  .el-alert {
    margin-bottom: 20px;
  }
}
</style>
