import Vue from "vue";
import Nl2br from "vue-nl2br";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAnalytics from "vue-analytics";

import ElementUI from "element-ui";
import elementUILocale from "element-ui/lib/locale";
import elementUILocaleEn from "element-ui/lib/locale/lang/en";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

import "bootstrap/dist/css/bootstrap.css";
import "element-ui/lib/theme-chalk/index.css";

import "@/styles/global.scss";
import "@/styles/style.scss";

elementUILocale.use(elementUILocaleEn);
Vue.use(ElementUI);

Vue.component("nl2br", Nl2br);

Vue.use(Loading, {
  color: "#007fff",
  loader: "dots",
  width: 80
});

Vue.config.productionTip = false;

Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_GA_TRACKING_ID,
  router
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
