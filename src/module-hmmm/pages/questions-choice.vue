<template>
  <div class="container">
    <el-card>
      <div class="head_btn">
        <el-alert
          title="说明：目前支持学科和关键字条件筛选"
          type="error"
          :closable="false"
        >
        </el-alert>
        <el-button
          type="success"
          icon="el-icon-edit"
          @click="$router.push('/questions/new')"
          >新增试题</el-button
        >
      </div>
      <el-row>
        <el-col :span="24">
          <div>
            <!-- form表单 -->
            <el-form
              ref="ResForm"
              :model="formList"
              label-width="80px"
              :rules="rules"
            >
              <el-col :span="6">
                <el-form-item label="学科" prop="subjectValue">
                  <el-select
                    v-model="formList.subjectValue"
                    placeholder="请选择"
                    @change="handelChange"
                  >
                    <el-option
                      v-for="(item, index) in formList.subjectSelect"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="二级目录" prop="catalogueValue">
                  <el-select
                    v-model="formList.catalogueValue"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in formList.subjectSelectSecond"
                      :key="index"
                      :label="item.directoryName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="标签" prop="tagValue">
                  <el-select v-model="formList.tagValue" placeholder="请选择">
                    <el-option
                      v-for="item in formList.tagSelectList"
                      :key="item.id"
                      :label="item.hadoop"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="关键字" prop="keyword">
                  <el-input v-model="formList.keyword"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="试题类型" prop="questionTypeValue">
                  <el-select
                    v-model="formList.questionTypeValue"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in formList.questionTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="难度" prop="difficultyValue">
                  <el-select
                    v-model="formList.difficultyValue"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in formList.difficultyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="方向" prop="directionValue">
                  <el-select
                    v-model="formList.directionValue"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in formList.directionList"
                      :key="index"
                      :label="item"
                      :value="index"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="录入人" prop="addUserValue">
                  <el-select
                    v-model="formList.addUserValue"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in formList.addUserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="题目备注" prop="titleNotes">
                  <el-input v-model="formList.titleNotes"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="企业简称" prop="abbreviation">
                  <el-input v-model="formList.abbreviation"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="城市" prop="provincesValue">
                  <el-col :span="12">
                    <el-select
                      v-model="formList.provincesValue"
                      placeholder="请选择"
                      @change="cityChange"
                    >
                      <el-option
                        v-for="(item, index) in provincesList"
                        :key="index"
                        :label="item"
                        :value="index"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <el-select
                      v-model="formList.cityValue"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(item, index) in citiesList"
                        :key="index"
                        :label="item"
                        :value="index"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col class="btn-right" :span="6">
                <el-button @click="clearForm">清除</el-button>
                <el-button type="primary">搜索</el-button>
              </el-col>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div>
            <el-tabs
              v-model="activeName"
              type="card"
              @tab-click="tableHandleClick"
            >
              <!-- 全部状态 -->
              <el-tab-pane label="全部" name="first">
                <template>
                  <el-table fit :data="allTableData" stripe style="width: 100%">
                    <el-table-column prop="number" label="试题编号" width="120">
                    </el-table-column>
                    <el-table-column prop="subject" label="学科" width="120">
                    </el-table-column>
                    <el-table-column prop="catalog" label="目录" width="120">
                    </el-table-column>
                    <el-table-column label="题型">
                      <template slot-scope="scope">
                        <span v-if="scope.row.questionType === '1'">单选</span>
                        <span v-else-if="scope.row.questionType === '2'"
                          >多选</span
                        >
                        <span v-else>简答</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="题干" width="280">
                      <template slot-scope="scope">
                        <span v-html="scope.row.question"></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="录入时间" width="160">
                      <template slot-scope="scope">
                        {{ scope.row.addDate | parseTime }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="difficulty" label="难度" width="120">
                      <template slot-scope="scope">
                        <span v-if="scope.row.difficulty === '1'">简单</span>
                        <span v-else-if="scope.row.difficulty === '2'"
                          >一般</span
                        >
                        <span v-else>困难</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="录入人" width="120">
                    </el-table-column>
                    <el-table-column
                      prop="chkState"
                      label="审核状态"
                      width="120"
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.chkState === 0">待审核</span>
                        <span v-else-if="scope.row.chkState === 1">通过</span>
                        <span v-else>拒绝</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="chkRemarks"
                      label="审核意见"
                      width="120"
                    >
                    </el-table-column>
                    <el-table-column prop="chkUser" label="审核人" width="120">
                    </el-table-column>
                    <el-table-column label="发布状态" width="120">
                      <template slot-scope="scope">
                        {{ scope.row.publishState === 0 ? '下架' : '上架' }}
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="small"
                          @click="OpenTheopover(scope.row.id)"
                          >预览</el-button
                        >
                        <el-button
                          v-if="
                            scope.row.chkState === 1 || scope.row.chkState === 2
                          "
                          disabled
                          type="text"
                          size="small"
                          >审核</el-button
                        >
                        <el-button
                          v-else
                          type="text"
                          size="small"
                          @click="auditData(scope.row)"
                          >审核</el-button
                        >
                        <el-button
                          type="text"
                          size="small"
                          @click="modification(scope.row)"
                          >修改</el-button
                        >
                        <!-- 上下架按钮 -->
                        <el-button
                          v-if="scope.row.publishState === 0"
                          type="text"
                          size="small"
                          @click="soldOut(scope.row)"
                          >上架</el-button
                        >
                        <el-button
                          v-else
                          type="text"
                          size="small"
                          @click="soldOut(scope.row)"
                          >下架</el-button
                        >
                        <el-button
                          type="text"
                          size="small"
                          @click="deleteData(scope.row.id)"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.page"
                    :page-sizes="[2, 4, 5, 6]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  >
                  </el-pagination>
                </template>
              </el-tab-pane>
              <!-- 待审核状态 -->
              <el-tab-pane label="待审核" name="second">
                <template>
                  <el-table fit :data="allTableData" stripe style="width: 100%">
                    <el-table-column prop="number" label="试题编号" width="120">
                    </el-table-column>
                    <el-table-column prop="subject" label="学科" width="120">
                    </el-table-column>
                    <el-table-column prop="catalog" label="目录" width="120">
                    </el-table-column>
                    <el-table-column label="题型">
                      <template slot-scope="scope">
                        <span v-if="scope.row.questionType === '1'">单选</span>
                        <span v-else-if="scope.row.questionType === '2'"
                          >多选</span
                        >
                        <span v-else>简答</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="题干" width="280">
                      <template slot-scope="scope">
                        <span v-html="scope.row.question"></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="录入时间" width="160">
                      <template slot-scope="scope">
                        {{ scope.row.addDate | parseTime }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="difficulty" label="难度" width="120">
                      <template slot-scope="scope">
                        <span v-if="scope.row.difficulty === '1'">简单</span>
                        <span v-else-if="scope.row.difficulty === '2'"
                          >一般</span
                        >
                        <span v-else>困难</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="录入人" width="120">
                    </el-table-column>
                    <el-table-column
                      prop="chkState"
                      label="审核状态"
                      width="120"
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.chkState === 0">待审核</span>
                        <span v-else-if="scope.row.chkState === 1">通过</span>
                        <span v-else>拒绝</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="chkRemarks"
                      label="审核意见"
                      width="120"
                    >
                    </el-table-column>
                    <el-table-column prop="chkUser" label="审核人" width="120">
                    </el-table-column>
                    <el-table-column label="发布状态" width="120">
                      <template slot-scope="scope">
                        {{ scope.row.publishState === 0 ? '下架' : '上架' }}
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="small"
                          @click="OpenTheopover(scope.row.id)"
                          >预览</el-button
                        >
                        <el-button type="text" size="small">审核</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="modification(scope.row)"
                          >修改</el-button
                        >
                        <el-button type="text" size="small">下架</el-button>
                        <el-button type="text" size="small">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.page"
                    :page-sizes="[2, 4, 5, 6]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  >
                  </el-pagination>
                </template>
              </el-tab-pane>
              <!-- 已审核状态 -->
              <el-tab-pane label="已审核" name="third">
                <template>
                  <el-table fit :data="allTableData" stripe style="width: 100%">
                    <el-table-column prop="number" label="试题编号" width="120">
                    </el-table-column>
                    <el-table-column prop="subject" label="学科" width="120">
                    </el-table-column>
                    <el-table-column prop="catalog" label="目录" width="120">
                    </el-table-column>
                    <el-table-column label="题型">
                      <template slot-scope="scope">
                        <span v-if="scope.row.questionType === '1'">单选</span>
                        <span v-else-if="scope.row.questionType === '2'"
                          >多选</span
                        >
                        <span v-else>简答</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="题干" width="280">
                      <template slot-scope="scope">
                        <span v-html="scope.row.question"></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="录入时间" width="160">
                      <template slot-scope="scope">
                        {{ scope.row.addDate | parseTime }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="difficulty" label="难度" width="120">
                      <template slot-scope="scope">
                        <span v-if="scope.row.difficulty === '1'">简单</span>
                        <span v-else-if="scope.row.difficulty === '2'"
                          >一般</span
                        >
                        <span v-else>困难</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="录入人" width="120">
                    </el-table-column>
                    <el-table-column
                      prop="chkState"
                      label="审核状态"
                      width="120"
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.chkState === 0">待审核</span>
                        <span v-else-if="scope.row.chkState === 1">通过</span>
                        <span v-else>拒接</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="chkRemarks"
                      label="审核意见"
                      width="120"
                    >
                    </el-table-column>
                    <el-table-column prop="chkUser" label="审核人" width="120">
                    </el-table-column>
                    <el-table-column label="发布状态" width="120">
                      <template slot-scope="scope">
                        {{ scope.row.publishState === 0 ? '下架' : '上架' }}
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="small"
                          @click="OpenTheopover(scope.row.id)"
                          >预览</el-button
                        >
                        <el-button type="text" size="small">审核</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="modification(scope.row)"
                          >修改</el-button
                        >
                        <el-button type="text" size="small">下架</el-button>
                        <el-button type="text" size="small">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.page"
                    :page-sizes="[2, 4, 5, 6]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  >
                  </el-pagination>
                </template>
              </el-tab-pane>
              <!-- 已拒绝状态 -->
              <el-tab-pane label="已拒绝" name="fourth">
                <template>
                  <el-table fit :data="allTableData" stripe style="width: 100%">
                    <el-table-column prop="number" label="试题编号" width="120">
                    </el-table-column>
                    <el-table-column prop="subject" label="学科" width="120">
                    </el-table-column>
                    <el-table-column prop="catalog" label="目录" width="120">
                    </el-table-column>
                    <el-table-column label="题型">
                      <template slot-scope="scope">
                        <span v-if="scope.row.questionType === '1'">单选</span>
                        <span v-else-if="scope.row.questionType === '2'"
                          >多选</span
                        >
                        <span v-else>简答</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="题干" width="280">
                      <template slot-scope="scope">
                        <span v-html="scope.row.question"></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="录入时间" width="160">
                      <template slot-scope="scope">
                        {{ scope.row.addDate | parseTime }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="difficulty" label="难度" width="120">
                      <template slot-scope="scope">
                        <span v-if="scope.row.difficulty === '1'">简单</span>
                        <span v-else-if="scope.row.difficulty === '2'"
                          >一般</span
                        >
                        <span v-else>困难</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="creator" label="录入人" width="120">
                    </el-table-column>
                    <el-table-column
                      prop="chkState"
                      label="审核状态"
                      width="120"
                    >
                      <template slot-scope="scope">
                        <span v-if="scope.row.chkState === 0">待审核</span>
                        <span v-else-if="scope.row.chkState === 1">通过</span>
                        <span v-else>拒接</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="chkRemarks"
                      label="审核意见"
                      width="120"
                    >
                    </el-table-column>
                    <el-table-column prop="chkUser" label="审核人" width="120">
                    </el-table-column>
                    <el-table-column label="发布状态" width="120">
                      <template slot-scope="scope">
                        {{ scope.row.publishState === 0 ? '下架' : '上架' }}
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button
                          type="text"
                          size="small"
                          @click="OpenTheopover(scope.row.id)"
                          >预览</el-button
                        >
                        <el-button type="text" size="small">审核</el-button>
                        <el-button
                          type="text"
                          size="small"
                          @click="modification(scope.row)"
                          >修改</el-button
                        >
                        <el-button type="text" size="small">下架</el-button>
                        <el-button type="text" size="small">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.page"
                    :page-sizes="[2, 4, 5, 6]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  >
                  </el-pagination>
                </template>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 预览弹出框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <questions-preview
        :dataId="this.dataId"
        v-if="dialogVisible"
        @close="dialogVisible = false"
      />
    </el-dialog>
    <!-- 审核弹出框 -->
    <el-dialog title="提示" :visible.sync="auditDialogVisible" width="20%">
      <el-form :model="checkForm">
        <el-radio-group v-model="checkForm.chkState">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">拒绝</el-radio>
        </el-radio-group>
        <el-input
          class="textarea"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="checkForm.chkRemarks"
        >
        </el-input>
        <div class="flexRight">
          <el-button @click="auditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkBox">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { difficulty, questionType, direction } from '@/api/hmmm/constants'
import { simple, detail } from '@/api/hmmm/subjects'
import { list as tagList } from '@/api/hmmm/tags'
import { list as catalogueList } from '@/api/hmmm/directorys'
import { list as companyList } from '@/api/hmmm/companys'
import { choice as questChoice, choiceCheck } from '@/api/hmmm/questions'
import { provinces, citys } from '@/api/hmmm/citys'
import { parseTime } from '@/filters/index'
import { choicePublish, remove } from '@/api/hmmm/questions' // 上下架题库接口
// 引入预览组件
import QuestionsPreview from '../../module-hmmm/components/questions-preview'

export default {
  name: 'QuestionsChoice',
  components: {
    QuestionsPreview // 注册预览组件
  },
  props: {},
  data() {
    return {
      auditDialogVisible: false, // 审核弹出框
      dataId: '', // 传入当前的id
      dialogVisible: false, // 预览弹出框显示
      // form表单v-model数据
      formList: {
        // 题型
        questionTypeList: questionType,
        // 难度
        difficultyList: difficulty,
        // 方向
        directionList: direction,
        // 录入人
        addUserList: [
          {
            value: '0',
            label: '超级管理员'
          },
          {
            value: '1',
            label: '录入管理员'
          }
        ],
        // 学科
        subjectSelect: [],
        // 二级目录
        subjectSelectSecond: [],
        // 标签
        tagSelectList: [],

        subjectValue: '',
        tagValue: '',
        catalogueValue: '',
        questionTypeValue: '',
        difficultyValue: '',
        provincesValue: '',
        cityValue: '',
        addUserValue: '',
        directionValue: '',
        keyword: '', // 关键字
        titleNotes: '', // 题目备注
        abbreviation: '' // 企业简称
      },
      // 省份
      provincesList: [],
      // 城市
      citiesList: [],
      // 表格数据
      allTableData: [],
      activeName: 'first',
      queryInfo: {
        page: 1,
        pagesize: 2,
        chkState: null
      },
      total: 0,
      // 校验规则
      rules: {},
      // 审核题目
      checkForm: {
        id: '',
        chkState: 1,
        chkRemarks: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getSubjectSelect()
    this.getQuestionList()
    this.provincesList = provinces()
    // console.log(this.provincesList)
  },
  mounted() {},
  methods: {
    // tab切换渲染表格
    tableHandleClick() {
      if (this.activeName === 'first') {
        this.queryInfo.chkState = null
        this.getQuestionList()
      } else if (this.activeName === 'second') {
        this.queryInfo.chkState = 0
        this.getQuestionList()
      } else if (this.activeName === 'third') {
        this.queryInfo.chkState = 1
        this.getQuestionList()
      } else {
        this.queryInfo.chkState = 2
        this.getQuestionList()
      }
    },
    // 一级目录
    async getSubjectSelect() {
      try {
        const { data } = await simple()
        this.formList.subjectSelect = data
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    async handelChange(value) {
      console.log(value)
      try {
        // 二级目录 this.subjectSelect.value
        const { data } = await catalogueList({ subjectID: value })
        //标签
        const { data: res } = await tagList({ subjectID: value })
        this.formList.tagSelectList = res.items
        console.log(res.items)
        this.formList.subjectSelectSecond = data.items
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    cityChange(index) {
      // console.log(index)
      // console.log(this.provincesList[index])
      this.citiesList = citys(this.provincesList[index])
      // console.log(this.citiesList)
    },
    // 全部试题列表
    async getQuestionList() {
      try {
        const { data } = await questChoice(this.queryInfo)
        console.log(data)
        this.allTableData = data.items
        this.queryInfo.page = parseInt(data.page)
        this.queryInfo.pagesize = parseInt(data.pagesize)
        this.total = data.counts
      } catch (err) {
        console.log(err)
      }
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getQuestionList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getQuestionList()
    },
    // 弹出框事件
    OpenTheopover(id) {
      console.log(id)
      this.dialogVisible = true
      this.dataId = id
    },
    // 清除表单事件
    clearForm() {
      this.$refs.ResForm.resetFields()
      this.citiesList = []
      this.formList.cityValue = ''
    },
    // 修改按钮
    modification(item) {
      console.log(item)
      this.$router.push({
        path: 'new',
        query: { id: item.id }
      })
      // this.$router.push('/questions/new')
    },
    // 题目下架
    async soldOut(item) {
      console.log(item)
      if (item.publishState === 1) {
        var publishState = 0
        var text = `您确定下架这道题目吗`
      } else {
        publishState = 1
        text = `您确定上架这道题目吗`
      }
      console.log(item.id)
      console.log(publishState)
      // 先弹框询问
      const configDel = await this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (configDel !== 'confirm') {
        return this.$message('取消了本次操作')
      }
      if (this.allTableData.publishState == 0) {
        this.allTableData.publishState = 1
      } else {
        this.allTableData.publishState = 0
      }
      await choicePublish({ id: item.id, publishState: publishState })
      this.$message.success('操作成功')
      this.getQuestionList()
    },
    // 题目删除
    async deleteData(id) {
      // 先弹框询问
      const configDel = await this.$confirm('您确认删除这道题目嘛？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (configDel !== 'confirm') {
        return this.$message('取消了本次删除操作')
      }
      await remove({ id: id })
      this.$message.success('删除成功')
    },
    // 题目审核
    auditData(item) {
      // choiceCheck
      // auditDialogVisible = false
      this.checkForm.id = item.id
      console.log(item)
      this.auditDialogVisible = true
    },
    async checkBox() {
      try {
        const { data } = await choiceCheck(this.checkForm)
        this.getQuestionList()
        console.log(data)
      } catch (err) {
        console.log(err)
      }
      this.auditDialogVisible = false
    }
  }
}
</script>
<style scoped lang="less">
.container {
  padding: 10px;
  .head_btn {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }
  /deep/.el-card__body {
    padding: 10px;
  }
  /deep/ .el-alert--error.is-light {
    background-color: #fff;
  }
  /deep/ .btn-right {
    display: flex;
    justify-content: flex-end;
  }
  .flexRight {
    display: flex;
    justify-content: flex-end;
  }
  .textarea {
    margin: 20px 0;
  }
}
</style>
