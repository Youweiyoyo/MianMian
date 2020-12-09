<template>
  <div class="container">
    <!--卡片 -->
    <el-card class="box-card">
      <div class="title">试题录入</div>
      <!-- 表单 -->
      <el-form
        :model="addQuestionForm"
        ref="addQuestionFormRef"
        :rules="addQuestionRules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="学科:" prop="subjectID">
          <el-select
            v-model="addQuestionForm.subjectID"
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
        <el-form-item label="目录:" prop="catalogID">
          <el-select v-model="addQuestionForm.catalogID" placeholder="请选择">
            <el-option
              v-for="(item, index) in subjectSelectSecond"
              :key="index"
              :label="item.directoryName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业:" prop="enterpriseID">
          <el-select
            v-model="addQuestionForm.enterpriseID"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in companyList"
              :key="index"
              :label="item.shortName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市:" prop="province">
          <el-select
            class="ctry"
            v-model="addQuestionForm.province"
            placeholder="请选择"
            @change="cityChange"
          >
            <el-option
              v-for="(item, index) in provincesList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select
            class="ctry"
            v-model="addQuestionForm.city"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in citiesList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向:" prop="direction">
          <el-select v-model="addQuestionForm.direction" placeholder="请选择">
            <el-option
              v-for="(item, index) in directionList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型:" prop="questionType">
          <el-radio-group v-model="addQuestionForm.questionType">
            <!-- @change="questionTypeChange" -->
            <el-radio :label="'1'">单选</el-radio>
            <el-radio :label="'2'">多选</el-radio>
            <el-radio :label="'3'">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度:" prop="difficulty">
          <el-radio-group v-model="addQuestionForm.difficulty">
            <el-radio :label="'1'">简单</el-radio>
            <el-radio :label="'2'">一般</el-radio>
            <el-radio :label="'3'">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干:" prop="question">
          <quill-editor
            class="fuwenben"
            :options="custom"
            v-model="addQuestionForm.question"
          ></quill-editor>
        </el-form-item>
        <!-- 选项 根据条件进行渲染 -->
        <el-form-item label="选项：" prop="difficulty">
          <div v-for="(item, index) in addQuestionForm.options" :key="index">
            <div class="row_row" v-if="addQuestionForm.questionType == 2">
              <el-checkbox v-model="item.isRight" :label="true">{{
                item.code
              }}</el-checkbox>
              <el-input style="width: 240px" v-model="item.title"></el-input>
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div class="row_row" v-else-if="addQuestionForm.questionType == 1">
              <el-radio
                @change="isRightChange(item)"
                v-model="item.isRight"
                :label="true"
                >{{ item.code }}</el-radio
              >
              <el-input style="width: 240px " v-model="item.title"></el-input>
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </div>
          <!-- 添加按钮 -->
          <el-button
            type="danger"
            :disabled="btnAble"
            size="small"
            @click="addCheckbox"
            >+增加选项与答案</el-button
          >
        </el-form-item>
        <el-form-item label="解析视频:">
          <el-input v-model="addQuestionForm.videoURL"></el-input>
        </el-form-item>
        <el-form-item label="答案解析:" prop="answer">
          <quill-editor
            class="fuwenben"
            :options="custom"
            v-model="addQuestionForm.answer"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="题目备注:">
          <el-input
            v-model="addQuestionForm.remarks"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="试题标签:">
          <el-select v-model="addQuestionForm.tags" placeholder="请选择">
            <el-option
              v-for="item in tagSelectList"
              :key="item.id"
              :label="item.tagName"
              :value="item.tagName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { simple, detail } from '@/api/hmmm/subjects'
import { list as tagList } from '@/api/hmmm/tags'
import { list as companyList } from '@/api/hmmm/companys'
import { list as catalogueList } from '@/api/hmmm/directorys'
import { provinces, citys } from '@/api/hmmm/citys'
import { direction } from '@/api/hmmm/constants'
import {
  add as addQuestion,
  detail as questionDetail,
  update as baseQuestionUpdata
} from '@/api/hmmm/questions'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      custom: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'], //引用
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ align: [] }]
          ]
        }
      },
      addQuestionForm: {
        subjectID: '',
        catalogID: '',
        enterpriseID: '',
        province: '',
        city: '',
        direction: '',
        tags: '',
        // 题型
        questionType: '1',
        // 难度
        difficulty: '1',
        videoURL: '',
        answer: '',
        remarks: '',
        options: [
          { code: 'A:', title: '', img: '', isRight: false },
          { code: 'B:', title: '', img: '', isRight: false },
          { code: 'C:', title: '', img: '', isRight: false },
          { code: 'D:', title: '', img: '', isRight: false }
        ]
      },
      subjectSelect: [],
      subjectSelectSecond: [],
      // 标签
      tagSelectList: [],
      companyList: [],
      // 省份
      provincesList: [],
      // 城市
      citiesList: [],
      // 方向
      directionList: direction,

      difficultyRadio: 1,

      startCode: 68,
      imageUrl: '',
      // 检验规则
      addQuestionRules: {
        subjectID: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        catalogID: [
          { required: true, message: '请选择目录', trigger: 'change' }
        ],
        enterpriseID: [
          { required: true, message: '请选择企业', trigger: 'change' }
        ],
        province: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        direction: [
          { required: true, message: '请选择方向', trigger: 'change' }
        ],
        questionType: [{ required: true, trigger: 'change' }],
        difficulty: [{ required: true, trigger: 'change' }],
        question: [{ required: true, message: '请输入题干', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
      }
    }
  },
  computed: {
    btnAble() {
      if (this.addQuestionForm.questionType !== 2) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {},
  created() {
    this.getSubjectSelect()
    this.getCompanyList()
    if (this.$route.query.id) {
      this.getQuestionList()
      this.handelChange()
    }
    this.provincesList = provinces()
  },
  mounted() {},
  methods: {
    // 学科目录
    async getSubjectSelect() {
      try {
        const { data } = await simple()
        this.subjectSelect = data
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    // 二级目录
    async handelChange(value) {
      try {
        //标签
        const { data: res } = await tagList({ subjectID: value })
        console.log(res)
        this.tagSelectList = res.items
        // 二级目录 this.subjectSelect.value
        const { data } = await catalogueList({ subjectID: value })
        this.subjectSelectSecond = data.items
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    // 企业目录
    async getCompanyList() {
      try {
        const { data } = await companyList()
        this.companyList = data.items
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    // 城市目录
    cityChange(index) {
      console.log(index)
      // console.log(this.provincesList[index])
      this.citiesList = citys(index)
      // console.log(this.citiesList)
    },

    // 添加复选框
    addCheckbox() {
      this.subCode()
      console.log(this.startCode)
      this.addQuestionForm.options.push({
        code: `${String.fromCharCode(this.startCode)}:`,
        title: '',
        img: '',
        isRight: ''
      })
    },
    subCode() {
      this.startCode += 1
    },
    // 上传或者修改题目 判断
    onSubmit() {
      // addQuestionFormRef
      this.$refs.addQuestionFormRef.validate(async valid => {
        if (valid) {
          try {
            if (!this.$route.query.id) {
              await addQuestion(this.addQuestionForm)
              this.$router.push('/questions/list')
            } else {
              this.addQuestionForm.options.forEach(item => {
                if (item.isRight) {
                  item.isRight = 1
                } else {
                  item.isRight = 0
                }
              })
              const { data } = baseQuestionUpdata(this.addQuestionForm)
              this.$router.push('/questions/list')

              console.log(data)
            }
          } catch (err) {
            console.log(err)
          }
        } else {
          return false
        }
      })
    },
    // 上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 单选
    isRightChange(item) {
      this.addQuestionForm.options.forEach(element => {
        element.isRight = false
      })
      item.isRight = true
    },
    // 修改基础题库 获取数据
    async getQuestionList() {
      // console.log(this.$route.query.id)
      const { data } = await questionDetail({ id: this.$route.query.id })
      data.options.forEach(item => {
        if (item.isRight === 1) {
          item.isRight = true
        } else {
          item.isRight = false
        }
      })
      // console.log(data)
      this.addQuestionForm = data
    }
  }
}
</script>
<style scoped lang="less">
.container {
  padding: 20px;
  /deep/ .el-card__body {
    padding: 0;
  }
  .title {
    padding: 20px;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 20px;
  }
  .el-select {
    width: 400px;
  }
  .ctry {
    width: 195px;
    margin-right: 10px;
  }

  /deep/ .fuwenben {
    margin-right: 30px;
    .ql-container {
      height: 200px;
    }
  }
  .row_row {
    height: 50px;
    margin-bottom: 20px;
    display: flex;
  }
  .avatar-uploader {
    margin-top: 10px;
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
  }
  /deep/ .avatar-uploader .el-upload {
    position: relative;
    width: 80px;
    height: 50px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    line-height: 60px;
  }
  /deep/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  /deep/.avatar-uploader {
    transform: translate(50%, -50%);
    background: #fff;
    font-size: 18px;
    color: #999;
  }
  .avatar {
    display: block;
    overflow: hidden;
    width: 100px;
  }
  /deep/.el-icon-circle-close {
    top: -28px;
    left: 10px;
  }
}
</style>
