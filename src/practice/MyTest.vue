<template>
	<h1>响应式：ref、reactive</h1>
	<h2>ref: {{ name }}</h2>
	<h2>姓名：{{person.name}}</h2>
	<h2>年龄：{{person.age}}</h2>
	<h3>工作种类：{{person.job.type}}</h3>
	<h3>工作薪水：{{person.job.salary}}</h3>
	<h3>爱好：{{person.hobby}}</h3>
	<h3>测试的数据c：{{person.job.a.b.c}}</h3>
	<button @click="sayHello">sayHello</button>
	<button @click="changeInfo">修改人的信息</button>
	<br><br><br>

	<div class="demo">
		<h1>一个人的信息</h1>
		姓：<input type="text" v-model="person.name">
		<br>
		名：<input type="text" v-model="person.age">
		<br>
		<span class="neibu">全名：{{person.fullName}}</span>
		<br>
		全名：<input type="text" v-model="person.fullName">
	</div>
	<br><br><br>

	<h2>当前点击时鼠标的坐标为：x：{{point.x}}，y：{{point.y}}</h2>
</template>

<script>

	import {ref, reactive, computed, watch, watchEffect,onBeforeMount,onMounted,onBeforeUpdate,onUpdated,onBeforeUnmount,onUnmounted} from 'vue'
	import usePoint from '../hooks/usePoint'

    export default {
        name: 'MyTest',

		// Vue2 用的是 data(){ return { ... }}方法中、平级methods对象
		// Vue3 的数据写在了 setup() 方法中，最后要返回一个对象return {}
        setup(){
			// 单个数据绑定方式：ref，使用时用 name.value
            let name = ref("mingzi")
            // let msg = ref("123")
			// 对象数据绑定方式：reactive，使用时不用.value
			let person = reactive({
				name:'张三',
				age:18,
				job:{
					type:'前端工程师',
					salary:'30K',
					a:{
						b:{
							c:666
						}
					}
				},
				hobby:['抽烟','喝酒','烫头']
			})


			//方法
			function sayHello(){
				alert(`你好 ${name.value}`)
			}
			function changeInfo(){
				person.name = '李四'
				person.age = 48
				person.job.type = 'UI设计师'
				person.job.salary = '60K'
				person.job.a.b.c = 999
				person.hobby[0] = '学习'
			}


			//计算属性——简写（没有考虑计算属性被修改的情况）
			/* person.fullName = computed(()=>{
				return person.firstName + '-' + person.lastName
			}) */
			//计算属性——完整写法（考虑读和写）
			person.fullName = computed({
				get(){
					return person.name + '-' + person.age
				},
				set(value){
					const nameArr = value.split('-')
					person.name = nameArr[0]
					person.age = nameArr[1]
				}
			})


			//情况一：监视ref所定义的一个响应式数据
			/* watch(sum,(newValue,oldValue)=>{
				console.log('sum变了',newValue,oldValue)
			},{immediate:true}) */
			//情况二：监视ref所定义的多个响应式数据
			/* watch([sum,msg],(newValue,oldValue)=>{
				console.log('sum或msg变了',newValue,oldValue)
			},{immediate:true}) */
			/* 
				情况三：监视reactive所定义的一个响应式数据的全部属性
						1.注意：此处无法正确的获取oldValue
						2.注意：强制开启了深度监视（deep配置无效）
			*/
			/* watch(person,(newValue,oldValue)=>{
				console.log('person变化了',newValue,oldValue)
			},{deep:false}) //此处的deep配置无效 */
			// 这里如果person是ref修饰的，不常用
			/* watch(person,(newValue,oldValue)=>{
				console.log('person的值变化了',newValue,oldValue)
			},{deep:true}) */
			//情况四：监视reactive所定义的一个响应式数据中的某个属性
			watch(()=>person.name,(newValue,oldValue)=>{
				console.log('person的name变化了',newValue,oldValue)
			}) 
			//情况五：监视reactive所定义的一个响应式数据中的某些属性
			/* watch([()=>person.name,()=>person.age],(newValue,oldValue)=>{
				console.log('person的name或age变化了',newValue,oldValue)
			})  */
			//特殊情况
			/* watch(()=>person.job,(newValue,oldValue)=>{
				console.log('person的job变化了',newValue,oldValue)
			},{deep:true}) //此处由于监视的是reactive素定义的对象中的某个属性，所以deep配置有效 */

			watchEffect(()=>{
				// name.value
				// const x2 = person.job.salary
				console.log('watchEffect所指定的回调执行了')
			})


			//通过组合式API的形式去使用生命周期钩子
			onBeforeMount(()=>{
				console.log('---onBeforeMount---')
			})
			onMounted(()=>{
				console.log('---onMounted---')
			})
			onBeforeUpdate(()=>{
				console.log('---onBeforeUpdate---')
			})
			onUpdated(()=>{
				console.log('---onUpdated---')
			})
			onBeforeUnmount(()=>{
				console.log('---onBeforeUnmount---')
			})
			onUnmounted(()=>{
				console.log('---onUnmounted---')
			})


			// hook方法，相当于工具方法，各个vue文件都能用
			let point = usePoint()


			// 属性、方法 返回之后才能使用
            return {
                name,
				person,
				sayHello,
				changeInfo,
				point
            }
			//返回一个函数（渲染函数）
			// return ()=> h('h1','尚硅谷')
        },
		/* //通过配置项的形式使用生命周期钩子
		//#region 
		beforeCreate() {
			console.log('---beforeCreate---')
		},
		created() {
			console.log('---created---')
		},
		beforeMount() {
			console.log('---beforeMount---')
		},
		mounted() {
			console.log('---mounted---')
		},
		beforeUpdate(){
			console.log('---beforeUpdate---')
		},
		updated() {
			console.log('---updated---')
		},
		beforeUnmount() {
			console.log('---beforeUnmount---')
		},
		unmounted() {
			console.log('---unmounted---')
		},
		//#endregion */
    }
</script>

<style scoped>
	.demo{
		background-color: skyblue;
		.neibu{
			font-size: 40px;
		}
	}
</style>
