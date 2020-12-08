<template>
  <div class="container">
    <!--卡片 -->
    <el-card class="box-card">
      <div class="title">试题录入</div>
      <!-- 表单 -->
      <el-form
        :model="addQuestionForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="学科:" prop="region">
          <el-select
            v-model="addQuestionForm.subjectValue"
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
        <el-form-item label="目录:" prop="region">
          <el-select
            v-model="addQuestionForm.catalogueValue"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in subjectSelectSecond"
              :key="index"
              :label="item.directoryName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业:" prop="region">
          <el-select
            v-model="addQuestionForm.companyValue"
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
        <el-form-item label="城市:" prop="region">
          <el-select
            class="ctry"
            v-model="addQuestionForm.provincesValue"
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
          <el-select
            class="ctry"
            v-model="addQuestionForm.cityValue"
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
        </el-form-item>
        <el-form-item label="方向:" prop="region">
          <el-select
            v-model="addQuestionForm.directionValue"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in directionList"
              :key="index"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型:" prop="resource">
          <el-radio-group v-model="questionRadio" @change="questionTypeChange">
            <el-radio :label="1">单选</el-radio>
            <el-radio :label="2">多选</el-radio>
            <el-radio :label="3">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度:" prop="resource">
          <el-radio-group v-model="difficultyRadio">
            <el-radio :label="1">简单</el-radio>
            <el-radio :label="2">一般</el-radio>
            <el-radio :label="3">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干:" prop="resource">
          <quill-editor class="fuwenben" :options="custom"></quill-editor>
        </el-form-item>
        <!-- 选项 根据条件进行渲染 -->
        <el-form-item label="选项：" prop="difficulty">
          <div v-for="(item, index) in options" :key="index">
            <div class="row_row" v-if="questionRadio === 2">
              <el-checkbox>{{ item.code }}</el-checkbox>
              <el-input style="width: 240px"></el-input>
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
            <div class="row_row" v-else>
              <el-radio :label="true">{{ item.code }}</el-radio>
              <el-input style="width: 240px"></el-input>

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
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="答案解析:">
          <quill-editor class="fuwenben" :options="custom"></quill-editor>
        </el-form-item>
        <el-form-item label="题目备注:">
          <el-input type="textarea" :rows="2" placeholder="请输入内容">
          </el-input>
        </el-form-item>
        <el-form-item label="试题标签:">
          <el-select v-model="addQuestionForm.tagValue" placeholder="请选择">
            <el-option
              v-for="item in tagSelectList"
              :key="item.id"
              :label="item.hadoop"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认提交</el-button>
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
import { difficulty, questionType, direction } from '@/api/hmmm/constants'

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
        subjectValue: '',
        catalogueValue: '',
        companyValue: '',
        provincesValue: '',
        cityValue: '',
        directionValue: '',
        tagValue: ''
      },
      value: '',
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
      // 题型
      questionRadio: 1,
      // 难度
      difficultyRadio: 1,
      options: [
        { code: 'A:', title: '', img: '', isRight: '' },
        { code: 'B:', title: '', img: '', isRight: '' },
        { code: 'C:', title: '', img: '', isRight: '' },
        { code: 'D:', title: '', img: '', isRight: '' }
      ],
      startCode: 68,
      imageUrl: ''
    }
  },
  computed: {
    btnAble() {
      if (this.questionRadio !== 2) {
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
      // console.log(index)
      // console.log(this.provincesList[index])
      this.citiesList = citys(this.provincesList[index])
      // console.log(this.citiesList)
    },
    // 题型
    questionTypeChange(value) {
      this.questionRadio = value
      console.log(value)
    },
    // 添加复选框
    addCheckbox() {
      this.subCode()
      console.log(this.startCode)
      this.options.push({
        code: `${String.fromCharCode(this.startCode)}:`,
        title: '',
        img: '',
        isRight: ''
      })
    },
    subCode() {
      this.startCode += 1
    },
    onSubmit() {},
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
  .row_row {
    height: 50px;
    margin-bottom: 20px;
    display: flex;
  }
  /deep/ .fuwenben {
    margin-right: 30px;
    .ql-container {
      height: 200px;
    }
  }
  .avatar-uploader {
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
    margin-top: 10px;
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
    // position: absolute;
    // top: 20px;
    // left: 320px;
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
