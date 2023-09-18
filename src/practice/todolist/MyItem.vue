<template>
	<li>
		<label>
			<input type="checkbox" :checked="todo.done" @change="handleCheck(todo.id)" />
			<!-- 如下代码也能实现功能，但是不太推荐，因为有点违反原则，因为修改了props -->
			<!-- <input type="checkbox" v-model="todo.done"/> -->
			<span v-show="!todo.isEdit">{{ todo.title }}</span>
			<input type="text" v-show="todo.isEdit" :value="todo.title" @blur="handleBlur(todo, $event)" ref="inputTitle">
		</label>
		<button class="btn btn-danger" @click="handleDelete(todo.id)">删除</button>
		<button v-show="!todo.isEdit" class="btn btn-edit" @click="handleEdit(todo)">编辑</button>
	</li>
</template>

<script>

// nextTick 将回调推迟到下一个 DOM 更新周期之后执行
import { ref, getCurrentInstance, nextTick, onMounted } from 'vue'

//引入pubsub-js库
import pubsub from 'pubsub-js'

export default {
	name: 'MyItem',

	// 接收参数与回调函数
	//声明接收todo、checkTodo、deleteTodo
	// props:['todo','checkTodo','deleteTodo'], // 接收参数与回调函数
	props: ['todo'], // 'checkTodo','deleteTodo' // 这两个回调方法通过全局事件总线方式实现

	setup() {
		const instance = getCurrentInstance()
		// proxy 是当前实例 this
		const { proxy } = instance
		const bus = instance.appContext.config.globalProperties.$bus

		// 控件的ref需要在return中返回才能使用
		const inputTitle = ref()

		onMounted(() => {
			console.log('当前数据：', proxy.todo)
		})

		//勾选or取消勾选
		function handleCheck(id) {
			//通知App组件将对应的todo对象的done值取反
			// props.checkTodo(id)
			// 事件总线方式-回调父组件方法
			bus.emit('checkTodo', id)
		}
		//删除
		function handleDelete(id) {
			if (confirm('确定删除吗？')) {
				//通知App组件将对应的todo对象删除
				// props.deleteTodo(id)
				// 事件总线方式-回调父组件方法
				// bus.emit('deleteTodo', id)
				pubsub.publish('deleteTodo', id)
			}
		}
		//编辑
		function handleEdit(todo) {
			// vue2 中的判断对象是否有对应属性
			// if(todo.hasOwnProperty('isEdit'))
			// vue3 中的判断对象是否有对应属性
			if (Object.prototype.hasOwnProperty.call(todo, 'isEdit')) {
				console.log('已经有isEdit属性，赋值为true')
				todo.isEdit = true
			} else {
				console.log('没有isEdit属性，添加该属性，并赋值为true')
				// Vue2 中给对象添加新属性
				// this.$set(todo, 'isEdit', true)
				// Vue3 中给对象添加新属性
				Reflect.set(todo, 'isEdit', true)
			}
			nextTick(function () {
				console.log('nextTick方法-下次页面更新时调用：', inputTitle.value)
				inputTitle.value.focus()
			})
		}
		//失去焦点回调（真正执行修改逻辑）
		function handleBlur(todo, e) {
			todo.isEdit = false
			if (!e.target.value.trim()) return alert('输入不能为空！')
			// bus发射数据，用对象的形式发送
			bus.emit('updateTodo', { id: todo.id, title: e.target.value })
		}

		return {
			handleCheck,
			handleDelete,
			handleEdit,
			handleBlur,
			inputTitle, // 控件的ref需要在return中返回才能使用
		}
	}
}
</script>

<style scoped>
/*item*/
li {
	list-style: none;
	height: 36px;
	line-height: 36px;
	padding: 0 5px;
	border-bottom: 1px solid #ddd;
}

li label {
	float: left;
	cursor: pointer;
}

li label li input {
	vertical-align: middle;
	margin-right: 6px;
	position: relative;
	top: -1px;
}

li button {
	float: right;
	display: none;
	margin-top: 3px;
}

li:before {
	content: initial;
}

li:last-child {
	border-bottom: none;
}

li:hover {
	background-color: #ddd;
}

li:hover button {
	display: block;
}
</style>