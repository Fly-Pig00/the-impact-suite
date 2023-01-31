<template>
  <div class="page page-home">
    <div class="page-background"></div>

    <div class="page-content">
      <div class="header d-md-flex px-4 py-3 text-center text-md-left">
        <Logo />
        <div class="flex-grow-1 d-flex-vertical-center mt-3 mt-md-0">
          <div class="flex-grow-1 text-md-right">
            <el-button type="primary" @click="moveToOrderPage"
              >Order Charity Report
            </el-button>
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="main">
        <h1>Find my charity.</h1>
        <div class="mx-3">
          As a donor, you want to know that the charity or not-for-profit
          <br />
          you are working with is ethical, sustainable and effective.
        </div>
        <div class="container mt-7">
          <el-row :gutter="30">
            <el-col class="mb-3" :md="8">
              <el-card>
                <h2>Charity Matcher</h2>
                <div class="mt-3">
                  Take the quiz and we'll match the right charity for you
                </div>
                <div class="text-right bottom">
                  <el-button type="primary" @click="moveToMatcherPage"
                    >Match me up
                  </el-button>
                </div>
              </el-card>
            </el-col>
            <el-col class="mb-3" :md="8">
              <el-card>
                <h2>Search Charities</h2>
                <form class="mt-4" @submit.prevent="search">
                  <el-input
                    placeholder="Charity name or keyword(s)"
                    v-model="query.keyword"
                  >
                    <el-button slot="append" type="primary" @click="search"
                      >Search
                    </el-button>
                  </el-input>
                </form>
                <div class="mt-2">
                  <el-dropdown
                    trigger="click"
                    placement="bottom-start"
                    class="ml-1"
                    @command="query.organization = arguments[0]"
                  >
                    <span class="el-dropdown-link">
                      {{
                        query.organization ? query.organization : "Organization"
                      }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="">All</el-dropdown-item>
                      <el-dropdown-item
                        v-for="item in organizations"
                        :key="'organization-' + item"
                        :command="item"
                        >{{ item }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                  <el-dropdown
                    trigger="click"
                    placement="bottom-start"
                    class="ml-3"
                    @command="query.size = arguments[0]"
                  >
                    <span class="el-dropdown-link">
                      <span class="text-capitalize">{{
                        query.size ? query.size : "Size"
                      }}</span>
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="text-capitalize">
                      <el-dropdown-item command="">All</el-dropdown-item>
                      <el-dropdown-item
                        v-for="item in sizes"
                        :key="'size-' + item"
                        :command="item"
                        >{{ item }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                  <el-popover
                    placement="bottom-end"
                    trigger="click"
                    class="ml-3"
                  >
                    <div class="d-flex w-100">
                      <el-input
                        placeholder="Postcode"
                        style="width: 100px"
                        v-model="query.postcode"
                        maxlength="5"
                      ></el-input>
                      <span class="nowrap mx-3 mt-2"> or </span>
                      <el-select
                        placeholder="State"
                        style="width: 100px"
                        v-model="query.state"
                      >
                        <el-option label="All" value=""></el-option>
                        <el-option
                          v-for="{ code } in states"
                          :key="'state-' + code"
                          :label="code"
                          :value="code"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <span class="el-dropdown-link" slot="reference">
                      {{ location }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                  </el-popover>
                </div>
              </el-card>
            </el-col>
            <el-col class="mb-3" :md="8">
              <el-card>
                <h2>Charity Analytics</h2>
                <div class="mt-3">
                  Determine how effective & sustainable
                  <br />
                  Australia's leading charities and not-for-profits are in each
                  sector.
                </div>
                <div class="text-right bottom">
                  <el-button
                    type="primary"
                    @click="analyticsDialogVisible = true"
                    >View
                  </el-button>

                  <el-dialog
                    title="Charity Analytics"
                    append-to-body
                    :visible.sync="analyticsDialogVisible"
                    width="1040px"
                    top="15vh"
                  >
                    <iframe
                      src="https://charity.square1research.com/"
                      width="1000"
                      height="580"
                    ></iframe>
                  </el-dialog>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="footer">
        <div class="float-md-left text-center text-md-left p-4">
          <span class="copyright">&copy; The Impact Suite</span>
        </div>
        <div class="float-md-right p-4">
          <a
            class="d-block d-md-inline-block text-center text-md-left"
            href="https://www.theimpactsuite.com/privacy-policy"
            >Privacy Policy</a
          >
          <a
            class="d-block d-md-inline-block text-center text-md-left ml-md-4"
            href="https://www.theimpactsuite.com/terms-conditions"
            >Terms & Conditions</a
          >
          <a
            class="d-block d-md-inline-block text-center text-md-left ml-md-4"
            href="https://www.theimpactsuite.com/faq"
            >FAQ</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { DEFAULT_FILTER, STATES, SIZES } from "@/utils/constants";

import Logo from "@/views/components/Logo";

export default {
  components: { Logo },
  data() {
    return {
      query: { ...DEFAULT_FILTER },

      states: STATES,
      sizes: SIZES,

      analyticsDialogVisible: false
    };
  },
  computed: {
    ...mapState({
      organizations: state => state.storeCharities.organizations
      // states: state => state.storeCharities.states,
      // sizes: state => state.storeCharities.sizes
    }),
    location() {
      if (this.query.postcode) {
        return (
          this.query.postcode +
          (this.query.state ? ", " + this.query.state : "")
        );
      } else if (this.query.state) {
        return this.query.state;
      } else {
        return "Location";
      }
    }
  },
  mounted() {
    this.$store.dispatch("loadOrganizations");
    // this.$store.dispatch("loadStates");
    // this.$store.dispatch("loadSizes");
  },
  methods: {
    search() {
      this.$router.push({
        path: "/search",
        query: this.query
      });
    },
    moveToOrderPage() {
      this.$router.push("/order");
    },
    moveToMatcherPage() {
      this.$router.push("/matcher");
    }
  }
};
</script>
