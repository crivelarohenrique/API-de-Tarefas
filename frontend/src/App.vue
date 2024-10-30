<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script lang="ts">
import {  defineComponent } from 'vue';
import Header from './components/UI/Header.vue';


export default defineComponent({
  name: 'App',
  components: { Header },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  overflow-x: hidden;
}

h1 {
  font-family: "Roboto", serif;

}

button {
  font-family: 'Open-sans', serif;
}

p {
  font-family: 'Open-sans', serif;
}

</style>
