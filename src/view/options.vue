<template>
  <div class="main_app">
    <h1>Settings</h1>
    <button @click="clearStorage">CLEAR STORAGE</button>
  </div>
</template>

<script>
import storageProvider from "@/providers/storageProvider";

export default {
  name: "optionsView",
  data() {
    return {
      msg: "options",
    };
  },
  methods: {
    async clearStorage() {
      await storageProvider.clear();
      console.log("storage deleted");
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
