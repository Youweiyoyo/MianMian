<template>
  <div class="questions-preview">
    <el-row :gutter="20">
      <el-col :span="6"
        >【题型】:
        <span class="span" v-if="Itemlist.questionType === '1'">单选</span>
        <span class="span" v-else-if="Itemlist.questionType === '2'">多选</span>
        <span class="span" v-else>简答</span>
      </el-col>
      <el-col :span="6"
        >【编号】:<span class="span">{{ Itemlist.id }}</span></el-col
      >
      <el-col :span="6"
        >【难度】:
        <span class="span" v-if="Itemlist.difficulty === '1'">简答</span>
        <span class="span" v-else-if="Itemlist.difficulty === '2'">一般</span>
        <span class="span" v-else>困难</span>
      </el-col>
      <el-col :span="6"
        >【标签】:<span class="span">{{ Itemlist.tags }}</span></el-col
      >
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6"
        >【学科】:<span class="span">{{ Itemlist.subjectName }}</span></el-col
      >
      <el-col :span="6"
        >【目录】:<span class="span">{{ Itemlist.directoryName }}</span></el-col
      >
      <el-col :span="6"
        >【方向】:<span class="span">{{ Itemlist.direction }}</span></el-col
      >
    </el-row>
    <hr />
    【题干】:
    <div
      class="title top"
      v-html="Itemlist.question"
      style="color:#409eff"
    ></div>
    <div class="topic top" v-if="Itemlist.questionType === '1'">
      单选题选项：(以下选中的选项为正确答案)
      <el-radio
        v-for="(item, index) in options"
        :key="index"
        class="top"
        style="display:block"
        :radio="item.isRight === 1"
        :disabled="item.isRight === 0"
      >
        {{ item.title }}
      </el-radio>
    </div>
    <div class="topic top" v-if="Itemlist.questionType === '2'">
      多选题选项：(以下选中的选项为正确答案)
      <el-checkbox
        style="display:block"
        class="top"
        v-for="(item, index) in options"
        :key="index"
        :checked="item.isRight === 1"
        :disabled="item.isRight === 0"
      >
        {{ item.title }}
      </el-checkbox>
    </div>
    <div class="topic top" v-else></div>
    <hr />
    <div>
      【参考答案】:
      <span class="btn-button"
        ><el-button type="danger" @click="videoisShow = true"
          >视频答案预览</el-button
        ></span
      >
      <video
        width="320"
        height="240"
        controls
        v-if="videoisShow"
        style="display: block;"
      >
        <source :src="Itemlist.videoURL" type="video/mp4" />
      </video>
    </div>
    <hr />
    <div class="border">
      <span> 【答案解析】:</span>
      <span v-html="Itemlist.answer" class="in-block"></span>
    </div>
    <hr />
    <div class="border">
      <span>【题目备注】:</span>
      <span class="in-block">{{ Itemlist.remarks }}</span>
    </div>
    <div class="right">
      <el-button type="primary" @click="$emit('close', 'questionsClose')"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<script>
import { detail } from "@/api/hmmm/questions"; // 基础题库接口
export default {
  name: "QuestionsPreview",
  components: {},
  props: {
    dataId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false, // 控制弹出框
      checked: 1, // 复选框选中video
      Itemlist: [], // 试题列表所有数据
      videoisShow: false, // 控制视频的显示与隐藏
      checked: "", // 多选框备选中
      radio: "", // 单选框选中
      disabled: "", // 控制按钮的禁止选中
      options: [] // 答案选项数据
    };
  },
  computed: {},
  filters: {},
  watch: {},
  created() {
    this.getQuestionBankdate();
  },
  methods: {
    async getQuestionBankdate() {
      const { data: res } = await detail({ id: this.dataId });
      console.log(res);
      this.Itemlist = res;
      this.options = res.options;
      console.log(this.options);
      console.log(this.Itemlist);
    }
  }
};
</script>

<style lang="less" scoped>
.questions-preview {
  .span {
    margin-left: 10px;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .top {
    margin-top: 20px;
  }
  .right {
    display: flex;
    justify-content: flex-end;
  }
  .border {
    margin: 20px 0;
  }
  .btn-button {
    margin-bottom: 10px;
  }
  .in-block {
    display: inline-block;
  }
}
</style>
