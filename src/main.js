import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";

global.jQuery = require('jquery');
const $ = global.jQuery;
window.$ = $;

Vue.config.productionTip = false

Vue.prototype.$http = axios;
Vue.prototype.$api_url = process.env.VUE_APP_API_URL
Vue.prototype.$app_url = process.env.VUE_APP_URL

require('bootstrap')
require('@fortawesome/fontawesome-free/css/all.css')
require('@/assets/css/main.css')

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
