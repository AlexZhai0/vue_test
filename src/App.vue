<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App" />
  <router-view></router-view>
  <DeptView></DeptView>
  <EmpView></EmpView> -->
  <!-- <MyTest></MyTest> -->
  <TodoList></TodoList>
</template>

<!-- <template>
	<Demo/>
</template>

<script>
	import Demo from './components/Demo'
	export default {
		name: 'App',
		components:{Demo},
	}
</script> -->

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import DeptView from './views/DeptView.vue'
// import EmpView from './views/EmpView.vue'
// import MyTest from './practice/MyTest.vue'
import TodoList from './practice/TodoList.vue'


export default {
  name: 'App',
  components: {
    // HelloWorld,
    // DeptView,
    // EmpView,
    // MyTest,
    TodoList,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
