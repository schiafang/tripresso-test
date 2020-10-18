<template>
  <div id="app">
    <Navtab />
    <router-view />
  </div>
</template>

<script>
import Navtab from '@/components/Navtab.vue'
export default {
  name: 'App',
  components: { Navtab }
}
</script>

<style>
body {
  margin: 0;
  color: #373a3c;
  background-color: #eee;
  font-family: Roboto, Helvetica, 'PingFang TC', 微軟正黑體, 'Heiti TC',
    'LiHei Pro', Arial, sans-serif;
}

a {
  text-decoration: none;
  color: #373a3c;
}

button {
  border: none;
  outline: none;
}
</style>
