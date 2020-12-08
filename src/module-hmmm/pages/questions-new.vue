<template>
  <div class="container">
    <!--卡片 -->
    <el-card class="box-card">
      <div class="title">试题录入</div>
      <!-- 表单 -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="学科:" prop="region">
          <el-select placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录:" prop="region">
          <el-select placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业:" prop="region">
          <el-select placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市:" prop="region">
          <el-select placeholder="请选择活动区域" class="ctry">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-select placeholder="请选择活动区域" class="ctry">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方向:" prop="region">
          <el-select placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型:" prop="resource">
          <el-radio-group>
            <el-radio label="单选"></el-radio>
            <el-radio label="多选"></el-radio>
            <el-radio label="简答"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度:" prop="resource">
          <el-radio-group>
            <el-radio label="简单"></el-radio>
            <el-radio label="一般"></el-radio>
            <el-radio label="困难"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干:" prop="resource">
          <quill-editor class="fuwenben"></quill-editor>
        </el-form-item>
        <!-- 选项 根据条件进行渲染 -->
        <el-form-item label="选项：" prop="difficulty">
          <div>
            <el-radio :label="true">A：</el-radio>
            <el-checkbox :label="true">A：</el-checkbox>
            <el-input style="width: 240px"></el-input>
            <el-upload
              class="avatar-uploader"
              style="margin-left: 4px"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
            >
              <img class="avatar" />
              <span>上传图片</span>
              <i class="el-icon-circle-close"></i>
            </el-upload>
          </div>
          <!-- 添加按钮 -->
          <el-button type="danger" :disabled="false" size="small"
            >+增加选项与答案</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: "0"
    };
  }
};
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
  .avatar-uploader {
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
  }
  /deep/ .avatar-uploader .el-upload {
    position: relative;
    width: 100px;
    height: 60px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    line-height: 60px;
  }
  /deep/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  /deep/.avatar-uploader {
    position: absolute;
    top: 20px;
    left: 320px;
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
