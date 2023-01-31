<template>
  <div>
    <a class="twitter-timeline" :href="feed" data-height="300px"
      >Tweets by {{ feed }}</a
    >
  </div>
</template>

<script>
export default {
  name: "TwitterTimeline",
  props: {
    feed: {
      type: String,
      required: true
    }
  },
  mounted() {
    if (this.feed) {
      twttr && twttr.widgets && twttr.widgets.load();
    }
  },
  watch: {
    feed() {
      if (this.feed) {
        twttr && twttr.widgets && twttr.widgets.load();
      }
    }
  }
};
</script>
