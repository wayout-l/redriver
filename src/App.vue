<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    data:function () {
      return {

      }
    },
    destroyed(){
      console.log('destroyed');
      // window.removeEventListener('beforeunload',ev => {
      //   this.test(ev)
      // })
    }
  }
</script>

<style>
#app {
  font-family: 'Arial', 'Microsoft YaHei UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
