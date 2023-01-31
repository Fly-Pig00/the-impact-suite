<template>
  <header class="header d-md-flex px-4 py-3">
    <Logo class="pr-4" />
    <div class="flex-grow-1 d-flex-vertical-center pl-md-4 mt-3 mt-md-0">
      <form class="w-100" @submit.prevent="search">
        <el-input
          placeholder="Charity name or keyword(s)"
          v-model="query.keyword"
          @change="setKeywordChanged"
        >
          <el-button slot="append" type="primary" @click="search"
            >Search</el-button
          >
        </el-input>
      </form>
    </div>
    <div class="clearfix"></div>
  </header>
</template>

<script>
import Logo from "@/views/components/Logo";
import { DEFAULT_FILTER } from "@/utils/constants";

export default {
  name: "Header",
  components: { Logo },
  data() {
    return {
      keywordChanged: false,
      query: DEFAULT_FILTER
    };
  },
  mounted() {
    this.query = { ...DEFAULT_FILTER, ...this.$route.query };
  },
  methods: {
    setKeywordChanged() {
      this.keywordChanged = true;
    },
    search() {
      if (this.keywordChanged || this.$route.path !== "/search") {
        this.$router.push({ path: "/search", query: this.query });
        this.keywordChanged = false;
      } else {
        this.$store.dispatch("loadCharities", this.query);
      }
    }
  },
  watch: {
    $route(to) {
      if (to.path === "/search") {
        this.query = { ...DEFAULT_FILTER, ...to.query };
      }
    }
  }
};
</script>
