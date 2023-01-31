<template>
  <div class="score">
    <span class="mr-1" v-for="i in 5" :key="'star-' + i">
      <img
        width="18"
        height="18"
        src="../../assets/star.png"
        v-if="i <= value"
      />
      <img
        class="grey"
        width="18"
        height="18"
        src="../../assets/star-grey.png"
        v-else
      />
    </span>
  </div>
</template>

<script>
export default {
  name: "Score",
  props: {
    value: {
      type: [Number, String],
      required: true
    }
  }
};
</script>
