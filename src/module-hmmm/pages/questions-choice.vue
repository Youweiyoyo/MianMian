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
        <el-button type="success" icon="el-icon-edit">新增试题</el-button>
      </div>
      <el-row>
        <el-col :span="24">
          <div>
            <el-form ref="form" label-width="80px">
              <el-col :span="6">
                <el-form-item label="学科">
                  <el-select
                    v-model="subjectValue"
                    placeholder="请选择"
                    @change="handelChange"
                  >
                    <el-option
                      v-for="(item, index) in subjectSelect"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="二级目录">
                  <el-select v-model="catalogueValue" placeholder="请选择">
                    <el-option
                      v-for="(item, index) in subjectSelectSecond"
                      :key="index"
                      :label="item.directoryName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="标签">
                  <el-select v-model="tagValue" placeholder="请选择">
                    <el-option
                      v-for="item in tagSelectList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="关键字">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="试题类型">
                  <el-select v-model="questionTypeValue" placeholder="请选择">
                    <el-option
                      v-for="item in questionTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="难度">
                  <el-select v-model="difficultyValue" placeholder="请选择">
                    <el-option
                      v-for="item in difficultyList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="方向">
                  <el-select v-model="directionValue" placeholder="请选择">
                    <el-option
                      v-for="(item, index) in directionList"
                      :key="index"
                      :label="item"
                      :value="index"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="录入人">
                  <el-select v-model="addUserValue" placeholder="请选择">
                    <el-option
                      v-for="item in addUserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="题目备注">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="企业简称">
                  <el-input></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="城市">
                  <el-col :span="12">
                    <el-select
                      v-model="provincesValue"
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
                    <el-select v-model="cityValue" placeholder="请选择">
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
                <el-button>清除</el-button>
                <el-button type="primary">搜索</el-button>
              </el-col>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
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
                        {{ scope.row.questionType === '1' ? '单选' : '多选' }}
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
                      <template>
                        <el-button type="text" size="small">预览</el-button>
                        <el-button type="text" size="small">审核</el-button>
                        <el-button type="text" size="small">修改</el-button>
                        <el-button type="text" size="small">下架</el-button>
                        <el-button type="text" size="small">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>
              <el-tab-pane label="待审核" name="second">配置管理</el-tab-pane>
              <el-tab-pane label="已审核" name="third">角色管理</el-tab-pane>
              <el-tab-pane label="已拒绝" name="fourth">
                定时任务补偿
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { difficulty, questionType, direction } from '@/api/hmmm/constants'
import { simple, detail } from '@/api/hmmm/subjects'
import { simple as tagSimple } from '@/api/hmmm/tags'
import { list as catalogueList } from '@/api/hmmm/directorys'
import { list as companyList } from '@/api/hmmm/companys'
import { choice as questChoice } from '@/api/hmmm/questions'
import { provinces, citys } from '@/api/hmmm/citys'
import { parseTime } from '@/filters/index'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      questionTypeList: questionType,
      difficultyList: difficulty,
      directionList: direction,
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
      subjectSelect: [],
      subjectSelectSecond: [],
      selectSubiectId: '',
      tagSelectList: [],
      allTableData: [],
      provincesList: [],
      citiesList: [],
      subjectValue: '',
      tagValue: '',
      catalogueValue: '',
      questionTypeValue: '',
      difficultyValue: '',
      provincesValue: '',
      cityValue: '',
      addUserValue: '',
      directionValue: '',
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getSubjectSelect()
    this.getTagList()
    this.getQuestionList()
    this.provincesList = provinces()
    // console.log(this.provincesList)
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 一级目录
    async getSubjectSelect() {
      try {
        const { data } = await simple()
        this.subjectSelect = data
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    async handelChange(value) {
      console.log(value)
      // 二级目录 this.subjectSelect.value
      try {
        const { data } = await catalogueList({ id: value })
        this.subjectSelectSecond = data.items
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    // 标签列表
    async getTagList() {
      try {
        const { data } = await tagSimple()
        console.log(data)
        this.tagSelectList = data
      } catch (err) {
        console.log(err)
      }
    },
    // 城市
    cityChange(index) {
      console.log(index)
      console.log(this.provincesList[index])
      this.citiesList = citys(this.provincesList[index])
      console.log(this.citiesList)
    },
    // 试题列表
    async getQuestionList() {
      try {
        const { data } = await questChoice()
        console.log(data)
        this.allTableData = data.items
      } catch (err) {
        console.log(err)
      }
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
}
</style>
