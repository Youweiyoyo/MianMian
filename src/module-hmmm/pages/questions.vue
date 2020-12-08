<template>
  <div class="container">
    <!-- 卡片主体 -->
    <el-card class="box-card">
      <!-- 第一行 -->
      <div class="row">
        <span class="span">
          说明:目前支持学科和关键字条件筛选
        </span>
        <el-button
          type="success"
          icon="el-icon-edit"
          size="small"
          @click="$router.push('/questions/new')"
          >新增试题</el-button
        >
      </div>
      <!-- from表单 -->
      <el-form
        ref="formRef"
        :model="formList"
        :rules="rules"
        label-width="80px"
      >
        <!-- 第一行 -->
        <el-col :span="6">
          <el-form-item label="学科" size="small" prop="Subject">
            <el-select
              v-model="formList.Subject"
              placeholder="请选择"
              @change="alterchange"
            >
              <el-option
                v-for="item in List"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="二级目录" size="small" prop="directory">
            <el-select v-model="formList.directory" placeholder="请选择">
              <el-option
                v-for="item in catalogue"
                :key="item.id"
                :label="item.directoryName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" size="small" prop="tages">
            <el-select v-model="formList.tages" placeholder="请选择">
              <el-option
                v-for="item in tageList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键字" size="small" prop="keyword">
            <el-input
              placeholder="根据题干搜索"
              v-model="formList.keyword"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 第二行 -->
        <el-col :span="6">
          <el-form-item label="试题类型" size="small" prop="questionTypes">
            <el-select v-model="formList.questionTypes" placeholder="请选择">
              <el-option
                v-for="item in questionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="难度" size="small" prop="difficultyTypes">
            <el-select v-model="formList.difficultyTypes" placeholder="请选择">
              <el-option
                v-for="item in difficulty"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="方向" size="small" prop="directionTypes">
            <el-select v-model="formList.directionTypes" placeholder="请选择">
              <el-option
                v-for="(item, index) in direction"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="录入人" size="small" prop="dataentryclerk">
            <el-select v-model="formList.dataentryclerk" placeholder="请选择">
              <!-- <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 第三行 -->
        <el-col :span="6">
          <el-form-item label="题目备注" size="small" prop="Titlenotes">
            <el-input v-model="formList.Titlenotes"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="企业简称" size="small" prop="shortened">
            <el-input v-model="formList.shortened"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="城市" size="small" prop="city,cityTwo">
            <el-select
              placeholder="请选择"
              class="select"
              v-model="formList.city"
            >
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
            <el-select
              placeholder="请选择"
              class="select list"
              v-model="formList.cityTwo"
            >
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="behind">
          <el-button size="small" @click="RefstForm">清除</el-button>
          <el-button type="primary" size="small" @click="getTableList()"
            >搜索</el-button
          >
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
            {{ scope.row.questionType === '1' ? '单选' : '多选' }}
          </template>
        </el-table-column>
        <el-table-column label="题干">
          <template slot-scope="scope">
            <span v-html="scope.row.question"></span>
          </template>
        </el-table-column>
        <el-table-column prop="addDate" label="录入时间">
          <template slot-scope="scope">
            {{ scope.row.addDate | parseTime }}
          </template>
        </el-table-column>
        <el-table-column label="难度">
          <template slot-scope="scope">
            {{ scope.row.difficulty === '1' ? '简单' : '一般' }}
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="录入人"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
              @click="$router.push('/questions/new')"
            ></el-button>
            <el-button
              title="删除"
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              size="small"
              @click="deleteData(scope.row.id)"
            ></el-button>
            <el-button
              title="加入精选"
              type="warning"
              icon="el-icon-check"
              circle
              plain
              size="small"
              @click="Addtheselected(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="  prev, pager, next, sizes,jumper"
        :current-page="counts.page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="counts.pagesize"
        :background="true"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { list } from '@/api/hmmm/questions'
import { parseTime } from '@/filters/index' // 导入时间过滤器
import { simple } from '@/api/hmmm/subjects' // 学科输入框
import { list as directList } from '@/api/hmmm/directorys' // 二级目录输入框
import { simple as dierctsimple } from '@/api/hmmm/tags' // 获取标签列表
import { difficulty, questionType, direction } from '@/api/hmmm/constants' // 方向，题型，难度
import { remove } from '@/api/hmmm/questions'
export default {
  data() {
    return {
      questionType: questionType, // 题型
      direction: direction, // 方向
      difficulty: difficulty, // 难度
      tableData: [], // 表格数据
      // 获取用户列表的参数对象
      counts: {
        page: 1, // 当前的页数
        pagesize: 2 // 当前每页显示多少条数据
      },
      // 校验规则
      rules: {},
      // 表单数据
      formList: {
        tages: '', // 标签
        Subject: '', // 学科表单
        directory: '', // 二级目录
        questionTypes: '', // 题型
        difficultyTypes: '', // 难度
        directionTypes: '', // 方向
        dataentryclerk: '', // 录入人
        Titlenotes: '', // 题目备注
        shortened: '', // 企业简称
        city: '', // 城市
        cityTwo: '', // 城市二
        keyword: '' // 关键字
      },
      total: 0, // 共有多少条数据
      List: [], // 获取所有学科数据
      catalogue: [], // 二级目录所有数据
      tageList: [] // 获取所有的标签数据
    }
  },
  created() {
    // 发起Ajax请求
    this.getTableList() // 获取表格数据
    this.getSubject() // 获取学科简单列表
    this.getGtages() // 获取标签列表
  },
  computed: {},
  methods: {
    // 发起渲染表格的请求
    async getTableList() {
      try {
        const { data } = await list(this.counts)
        this.tableData = data.items // 表格数据
        this.counts.page = parseInt(data.page) //  当前页数
        this.counts.pagesize = parseInt(data.pagesize) // 当前每页显示多少条数据
        this.total = data.counts // 共多少条数据
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    //  获取学科简单列表
    async getSubject() {
      try {
        const { data } = await simple()
        // console.log(data);
        this.List = data
      } catch (err) {
        console.log(err)
      }
    },
    // 学科的change事件
    async alterchange(id) {
      console.log(id)
      try {
        const { data } = await directList({ id: id })
        console.log(data)
        this.catalogue = data.items
      } catch (err) {
        console.log(err)
      }
    },
    // 获取标签列表
    async getGtages() {
      try {
        const { data } = await dierctsimple()
        console.log(data)
        this.tageList = data
      } catch (err) {
        console.log(err)
      }
    },
    // 删除数据
    async deleteData(id) {
      // 先弹框询问
      const configDel = await this.$confirm(
        '此操作将永久删除该题目, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (configDel !== 'confirm') {
        return this.$message('取消了本次删除操作')
      }
      await remove({ id: id }) // 调接口删除
      return this.$message.success('删除成功')
      this.getTableList() // 刷新列表
    },
    // 添加精选
    async Addtheselected(value) {
      // 先弹框询问
      const configDel = await this.$confirm(
        '是否将题目添加到精选题库, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (configDel !== 'confirm') {
        return this.$message('取消了本次操作')
      }
      this.$router.push('/questions/choice')
    },
    // 清空表单数据
    RefstForm() {
      console.log(this)
      this.$refs.formRef.resetFields()
    },
    // 监听pageSize事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.counts.pagesize = newSize
      this.getTableList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.counts.page = newPage
      this.getTableList()
    }
  }
}
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
    .el-table-column {
      width: 120px;
    }
  }
}
</style>
