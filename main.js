import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//公共函数
import utils from './common/utils.js'
Vue.prototype.$utils = utils;

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
