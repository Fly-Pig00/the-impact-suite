<template>
  <div class="size">
    <span class="mr-1" v-for="(size, i) in sizes" :key="'star-' + i">
      <span
        class="circle"
        :style="{
          width: 10 + 2 * (i + 1) + 'px',
          height: 10 + 2 * (i + 1) + 'px'
        }"
        v-if="size === value.toLowerCase()"
      ></span>
      <span
        class="circle grey"
        :style="{
          width: 10 + 2 * (i + 1) + 'px',
          height: 10 + 2 * (i + 1) + 'px'
        }"
        v-else
      ></span>
    </span>
    <br />
    <label class="mt-1">{{ value }}</label>
  </div>
</template>

<script>
import { SIZES } from "@/utils/constants";

export default {
  name: "Size",
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      sizes: SIZES
    };
  }
};
</script>
