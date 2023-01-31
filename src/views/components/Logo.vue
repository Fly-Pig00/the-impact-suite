<template>
  <div class="logo-wrapper">
    <router-link to="/" class="logo-link"
      ><img class="logo" src="../../assets/logo.png" alt="Logo"
    /></router-link>
    <div class="ml-2 pt-1">
      <router-link class="font-weight-bold text-uppercase" to="/"
        >The Impact Suite</router-link
      >
      <br />
      <a class="back text-uppercase" href="https://www.theimpactsuite.com/"
        >Back to Website</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Logo"
};
</script>
