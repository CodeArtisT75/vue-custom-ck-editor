<template>
  <div id="app">
    <ck-editor v-model="data" />
    <article class="article" v-html="data"></article>
  </div>
</template>

<script>
  import hljs from 'highlight.js';

  export default {
    name: 'App',
    data() {
      return {
        data: '',
      };
    },
    methods: {
      highlightAll() {
        document.querySelectorAll('.article pre code').forEach(block => {
          hljs.highlightBlock(block);
        });
      },
    },
    watch: {
      data() {
        this.$nextTick(() => {
          this.highlightAll();
        });
      },
    },
  };
</script>

<style>
  #app {
    padding: 50px;
  }
</style>
