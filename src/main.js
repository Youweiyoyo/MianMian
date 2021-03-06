import Vue from "vue";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import App from "./App";
import router from "./router";
import store from "./store";
import i18n from "./lang"; // Internationalization
import "./icons"; // icon
import "./errorLog"; // error log
import * as filters from "./filters"; // global filters
import "./mock"; // simulation data
// font-awesome
import "font-awesome/css/font-awesome.css";
/*
 * 注册 - 业务模块
 */
import dashboard from "@/module-dashboard/"; // 面板
import base from "@/module-manage/"; // 用户管理
import hmmm from "@/module-hmmm/"; // 黑马面面
// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// require styles 导入富文本编辑器对应的样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor);
Vue.use(dashboard, store);
Vue.use(base, store);
// Vue.use(list, store)
// Vue.use(form, store)
// Vue.use(details, store)
Vue.use(hmmm, store);

/*
 * 注册 - 组件
 */

// 饿了么
Vue.use(Element, {
  size: "medium", // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});
// 过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

// 时间过滤器
Vue.filter('dataFormat', function(originVal) {
  // originVal —— 就是我们要处理的那个数
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


Vue.config.productionTip = false

/* eslint-disable */
new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App)
});
