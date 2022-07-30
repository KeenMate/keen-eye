<template>
  <div class="main_app">
    <h1>Settings</h1>
    <button @click="clear">CLEAR STORAGE</button>
  </div>
</template>

<script>
import { clearStorage } from '@/providers/storageProvider';

export default {
  name: "optionsView",
  data() {
    return {
      msg: "options",
    };
  },
  methods: {
    clear() {
      clearStorage();
    },
  },
};
</script>

<style>
.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
