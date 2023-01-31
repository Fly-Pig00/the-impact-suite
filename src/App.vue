<template>
  <div
    class="app"
    :class="{ 'app-with-fixed-header': $router.currentRoute.name !== 'Home' }"
  >
    <Header v-if="$router.currentRoute.name !== 'Home'" />
    <router-view />
  </div>
</template>

<script>
import Header from "@/views/components/Header";
export default {
  name: "App",
  components: { Header }
};
</script>
