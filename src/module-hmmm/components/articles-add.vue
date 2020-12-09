<template>
  <div class="container">
    <el-form :model="addArticleForm" ref="addArticleFormRef" :rules="rules">
      <el-form-item
        label="文章标题:"
        :label-width="formLabelWidth"
        prop="title"
      >
        <el-input
          v-model="addArticleForm.title"
          autocomplete="off"
          class="title"
          placeholder="请输入文章标题"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="文章内容:"
        :label-width="formLabelWidth"
        prop="articleBody"
      >
        <!-- 题干 -->
        <quill-editor
          v-model="addArticleForm.articleBody"
          :options="editorOption"
        ></quill-editor>
      </el-form-item>
      <el-form-item label="视频地址:" :label-width="formLabelWidth">
        <el-input
          v-model="addArticleForm.videoURL"
          autocomplete="off"
          class="video"
          placeholder="请输入视频地址"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="addArticle">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { add, update } from "@/api/hmmm/articles";
export default {
  name: "articleAdd",
  props: {
    editArticles: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      // 富文本编辑器配置
      editorOption: {
        placeholder: "请输入...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], //分别对应的是： 粗体，斜体，下划线，删除线
            [{ list: "ordered" }, { list: "bullet" }], //显示有序和无序列表
            ["blockquote", "code-block"], //
            ["image"], //显示图片
            ["link"] //显示超链接
          ]
        }
      },
      rules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        articleBody: [
          { required: true, message: "请输入文章内容", trigger: "blur" }
        ]
      },
      addArticleForm: {
        title: "",
        articleBody: "",
        videoURL: "",
        id: ""
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    if (this.editArticles) {
      this.addArticleForm.id = this.editArticles.id;
      this.addArticleForm.title = this.editArticles.title;
      this.addArticleForm.articleBody = this.editArticles.articleBody;
      this.addArticleForm.videoURL = this.editArticles.videoURL;
    }
  },
  methods: {
    addArticle() {
      this.$refs.addArticleFormRef.validate(async valid => {
        // console.log(valid)
        if (valid) {
          try {
            if (this.editArticles) {
              await update(this.addArticleForm);
              this.$emit("editUpload");
              this.$message.success("修改数据成功");
            } else {
              await add(this.addArticleForm);
              // console.log(data)
              this.$emit("upload");
              this.$message.success("数据添加成功");
            }
          } catch (error) {
            this.$message.error("数据添加失败");
          }
          this.$emit("close");
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .ql-editor {
  height: 200px;
}
.dialog-footer {
  text-align: right;
}
</style>
