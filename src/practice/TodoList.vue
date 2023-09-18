<template>
	<div id="root">
		<div class="todo-container">
			<div class="todo-wrap">
				<!-- 自定义事件方式传递回调函数，事件名和方法名一样时可以省去注册方法 -->
				<MyHeader @addTodo="addTodo" />
				<MyList :todos="todos.arr" />
				<MyFooter :todos="todos.arr" :checkAllTodo="checkAllTodo" :clearAllTodo="clearAllTodo" />
			</div>
		</div>
	</div>
</template>

<!--

	TodoList 组件
	目的：练习组件间传递参

	1、通过 props 传递参数和回调函数，子组件调用回调函数后，在父组件中接收并处理数据；-- 子组件需要通过props接收
	2、数据缓存到 localStorage 中，使用的时候直接读取；
	3、自定义事件方式（@或v-on）传递回调函数，子组件使用 $emit 发送数据；-- 子组件需要通过props接收
	4、全局事件总线的方式传递参数，main.js 中定义bus，父组件中注册bus，子组件中发送bus；
	5、使用消息订阅与发布方式传递数据，类似事件总线；

-->

<script>

import MyHeader from './todolist/MyHeader'
import MyList from './todolist/MyList'
import MyFooter from './todolist/MyFooter.vue'

//引入pubsub-js库
import PubSub from 'pubsub-js'

// 常用方法
// import {ref, reactive, computed, watch, watchEffect} from 'vue'
// 生命周期方法
// import {onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onBeforeUnmount,onUnmounted} from 'vue'
// 获取vc（this）、实例等
// import { getCurrentInstance } from 'vue'

import { reactive, onMounted, watch, onBeforeUnmount, getCurrentInstance } from "vue";

export default {
	name: 'TodoList',
	components: { MyHeader, MyList, MyFooter },
	setup() {
		// 在setup函数中获取实例对象并定义bus
		const instance = getCurrentInstance()
		// proxy 是当前实例 this
		const { proxy } = instance
		// 事件总线
		const bus = instance.appContext.config.globalProperties.$bus

		//由于todos是MyHeader组件和MyFooter组件都在使用，所以放在它们的父组件中（状态提升）
		let todos = reactive({
			/* arr: [
				{ id: '001', title: '抽烟', done: true },
				{ id: '002', title: '喝酒', done: false },
				{ id: '003', title: '开车', done: true }] */
			// 使用本地存储缓存本地数据
			arr: JSON.parse(localStorage.getItem('todos')) || []
		})

		// 自定义事件的方式传递方法
		//添加一个todo
		function addTodo(todoObj) {
			todos.arr.unshift(todoObj)
		}

		// 传递回调方法的方式回调事件
		//全选or取消全选
		function checkAllTodo(done) {
			todos.arr.forEach((todo) => {
				todo.done = done
			})
		}
		// 传递回调方法的方式回调事件
		//清除所有已经完成的todo
		function clearAllTodo() {
			todos.arr = todos.arr.filter((todo) => {
				return !todo.done
			})
		}

		// 发布订阅，接收数据变化
		const deleteTodoSubToken = (msgName, id) => {
			// 删除一个todo
			console.log('发布订阅，this：', proxy, '，订阅名：', msgName, '，变化的id：', id)
			todos.arr = todos.arr.filter(todo => todo.id !== id)
		}

		// 事件总线，接收数据变化
		const checkTodoBus = function (id) {
			// 勾选or取消勾选一个todo
			console.log('事件总线的方式，this：', proxy, '，变化的id：', id)
			todos.arr.forEach((todo) => {
				if (todo.id === id) todo.done = !todo.done
			})
		}
		// 事件总线，更新一个条目标题
		const updateTodoBus = (data) => {
			console.log('=====', todos.arr, data.id, data.title)
			todos.arr.forEach((todo) => {
				if (todo.id === data.id) todo.title = data.title
			})
		}

		// 组合API-生命周期
		onMounted(() => {
			console.log('onMounted', proxy);
			// 发布订阅的方式，接收数据变化
			PubSub.subscribe('deleteTodo', deleteTodoSubToken)

			// 事件总线的方式，接收数据变化
			//勾选or取消勾选一个todo
			bus.on('checkTodo', checkTodoBus)
			bus.on('updateTodo', updateTodoBus)
		})
		onBeforeUnmount(() => {
			console.log('onBeforeUnmount', deleteTodoSubToken)
			PubSub.unsubscribe(deleteTodoSubToken)
			// bus.off('checkTodo')
			bus.off('checkTodo', checkTodoBus)
			bus.off('updateTodo', updateTodoBus)
		})


		// 监听数据是否变化
		// todos 也可以替换成 ()=>todos.arr，直接监听内部数据变化，使用的时候直接用newValue
		// 如果使用监听内部属性变化，则需要开启 {deep:true} 属性
		watch(todos, (newValue, oldValue) => {
			console.log('todos.arr 重新存入本地', newValue, oldValue)
			// 使用本地存储缓存本地数据
			localStorage.setItem('todos', JSON.stringify(newValue.arr))
		})

		return {
			todos,
			addTodo,
			checkAllTodo,
			clearAllTodo,
		}
	},
	mounted() {
		console.log('---mounted---', this)
	},
}
</script>

<style>
/*base*/
body {
	background: #fff;
}

.btn {
	display: inline-block;
	padding: 4px 12px;
	margin-bottom: 0;
	font-size: 14px;
	line-height: 20px;
	text-align: center;
	vertical-align: middle;
	cursor: pointer;
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
	border-radius: 4px;
}

.btn-danger {
	color: #fff;
	background-color: #da4f49;
	border: 1px solid #bd362f;
}

.btn-danger:hover {
	color: #fff;
	background-color: #bd362f;
}

.btn:focus {
	outline: none;
}

.todo-container {
	width: 600px;
	margin: 0 auto;
}

.todo-container .todo-wrap {
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
}
</style>
