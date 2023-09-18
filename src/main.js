
// main.js 文件是整个项目的入口文件


// Vue2 中的配置
// //引入Vue
// import Vue from 'vue'
// //引入App组件，它是所有组件的父组件
// import App from './App.vue'
// //关闭vue的生产提示
// Vue.config.productionTip = false
// //创建Vue实例对象---vm
// new Vue({
// 	el:'#app',
// 	//render函数将App组件放入容器中
//   render: h => h(App),
// 	// render:q=> q('h1','你好啊')
// 	// template:`<h1>你好啊</h1>`,
// })


// Vue3 中的配置
//引入的不再是Vue构造函数了，引入的是一个名为createApp的工厂函数
import { createApp } from 'vue'
import App from './App.vue'

// element-ui
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// mitt 事件总线
import mitt from 'mitt'

//创建应用实例对象——app(类似于之前Vue2中的vm，但app比vm更“轻”)
const app = createApp(App)

// 使用element-ui
app.use(ElementPlus);

// 使用事件总线
// app.prototype.$bus = this // Vue2 的使用方法
const bus = mitt()
app.config.globalProperties.$bus = bus

//挂载
app.mount('#app')

