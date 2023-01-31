<template>
  <div class="page page-detail">
    <div class="back-to-search p-3">
      <a href="#" @click.stop.prevent="goBackToSearch"
        ><i class="el-icon-back font-weight-bold"></i> Back to results</a
      >
    </div>
    <div class="container my-4">
      <el-row :gutter="50" v-if="charity">
        <el-col :md="18">
          <div class="d-flex">
            <img
              class="charity-logo"
              :src="getLogo(charity)"
              :alt="charity.name"
            />
            <h3 class="d-flex-vertical-center">{{ charity.name }}</h3>
          </div>

          <div class="summary mt-3">
            <p>{{ charity.summary }}</p>
          </div>

          <el-row class="mt-6" :gutter="20">
            <el-col :md="12">
              <h4>Social Impact Rating</h4>
              <img
                class="mt-3"
                width="30%"
                :src="getRatingImage(charity.lotusRating)"
              />
            </el-col>
            <el-col :md="12">
              <h4>Governance Rating</h4>
              <governance-rating class="mt-3 pt-2" :rating="charity.rating" />
            </el-col>
          </el-row>

          <div class="key-stats mt-6">
            <h4>Key Stats</h4>

            <el-row class="mt-4" :gutter="30">
              <el-col :md="8">
                <h5 class="text-center">Current year revenue mix</h5>
                <pie-chart
                  class="mt-3"
                  height="360px"
                  :data="charity.revenues"
                  money-value
                />
              </el-col>
              <el-col :md="8">
                <h5 class="text-center">Current year expense mix</h5>
                <pie-chart
                  class="mt-3"
                  height="360px"
                  :data="charity.expenses"
                  money-value
                />
              </el-col>
              <el-col :md="8">
                <h5 class="text-center">How we compare</h5>
                <bar-chart
                  class="mt-3"
                  height="360px"
                  :data="[
                    { category: 'Total Revenue', value: charity.totalRevenue },
                    { category: 'Average Revenue', value: charity.avgRevenue }
                  ]"
                  money-value
                />
              </el-col>
            </el-row>

            <div
              v-show="!historicalChartsVisible"
              class="view-more mt-3 text-center"
            >
              <el-button
                type="text"
                @click="loadCharityHistoricalData"
                :disabled="!charity.abn || charityHistoricalDataLoading"
                :loading="charityHistoricalDataLoading"
                >View more
                <i class="el-icon-arrow-down"></i>
              </el-button>
            </div>
            <div v-if="historicalChartsVisible">
              <el-row class="mt-5" :gutter="30">
                <el-col :md="8">
                  <h5 class="text-center">Government Revenue</h5>
                  <bar-chart
                    class="mt-3"
                    height="240px"
                    :data="charityHistoricalData.governmentRevenue"
                    money-value
                    color="#99FF99"
                  />
                </el-col>
                <el-col :md="8">
                  <h5 class="text-center">Donations and Bequests</h5>
                  <bar-chart
                    class="mt-3"
                    height="240px"
                    :data="charityHistoricalData.donationsAndBequests"
                    money-value
                    color="#ff99cc"
                  />
                </el-col>
                <el-col :md="8">
                  <h5 class="text-center">Total Income (Gross)</h5>
                  <bar-chart
                    class="mt-3"
                    height="240px"
                    :data="charityHistoricalData.totalGrossIncome"
                    money-value
                    color="#ffcc66"
                  />
                </el-col>
              </el-row>
              <el-row class="mt-5" :gutter="30">
                <el-col :md="8">
                  <h5 class="text-center">Employee Expenses</h5>
                  <bar-chart
                    class="mt-3"
                    height="240px"
                    :data="charityHistoricalData.employeeExpenses"
                    money-value
                    color="#cc99ff"
                  />
                </el-col>
                <el-col :md="8">
                  <h5 class="text-center">Interest Expenses</h5>
                  <bar-chart
                    class="mt-3"
                    height="240px"
                    :data="charityHistoricalData.interestExpenses"
                    money-value
                    color="#9999FF"
                  />
                </el-col>
                <el-col :md="8">
                  <h5 class="text-center">Total Expenses</h5>
                  <bar-chart
                    class="mt-3"
                    height="240px"
                    :data="charityHistoricalData.totalExpenses"
                    money-value
                    color="#FF9999"
                  />
                </el-col>
              </el-row>
              <el-row class="mt-5" :gutter="30">
                <el-col :md="8">
                  <h5 class="text-center">Net Assets and Liabilities</h5>
                  <bar-chart
                    class="mt-3"
                    height="240px"
                    :data="charityHistoricalData.netAssetsAndLiabilities"
                    money-value
                    color="#FFDE99"
                  />
                </el-col>
                <el-col :md="8">
                  <h5 class="text-center">Current Year Employment Mix</h5>
                  <pie-chart
                    class="mt-3"
                    height="240px"
                    :data="[
                      {
                        category: 'Staff full time',
                        value: charity.staffFullTime
                      },
                      {
                        category: 'Staff part time',
                        value: charity.staffPartTime
                      },
                      {
                        category: 'Staff casual',
                        value: charity.staffCasual
                      },
                      {
                        category: 'Staff volunteers',
                        value: charity.staffVolunteers
                      }
                    ]"
                  />
                </el-col>
                <el-col :md="8">
                  <h5 class="text-center">Total Full Time (EQUIV) Staff</h5>
                  <bar-chart
                    class="mt-3"
                    height="240px"
                    :data="charityHistoricalData.totalFullTimeEquivalentStaff"
                    color="#99aacc"
                  />
                </el-col>
              </el-row>
              <el-row class="mt-5" :gutter="30">
                <el-col :md="8">
                  <h5 class="text-center">Total Volunteers</h5>
                  <bar-chart
                    class="mt-3"
                    height="240px"
                    :data="charityHistoricalData.totalVolunteers"
                    color="#999999"
                  />
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="governance mt-6">
            <h4>Governance</h4>
            <nl2br
              tag="div"
              :text="charity.govStatement"
              :class-name="
                'mt-3 gov-statement' + (!governanceMore ? ' minimized' : '')
              "
            />

            <div class="view-more mt-3 text-center">
              <el-button type="text" @click="governanceMore = !governanceMore"
                >View more
                <i
                  :class="{
                    'el-icon-arrow-down': !governanceMore,
                    'el-icon-arrow-up': governanceMore
                  }"
                ></i
              ></el-button>
            </div>

            <div v-show="governanceMore">
              <h5 class="mt-3">GOVERNMENT FUNDING USE</h5>

              <nl2br
                tag="div"
                :text="charity.govFundingUse"
                class-name="mt-2"
              />
              <h5 class="mt-3">DIVERSITY STATEMENT</h5>
              <nl2br
                tag="div"
                :text="charity.govDiversityStatement"
                class-name="mt-2"
              />
              <h5 class="mt-3">IMPACT STATEMENT</h5>
              <nl2br
                tag="div"
                :text="charity.govImpactStatement"
                class-name="mt-2"
              />
              <h5 class="mt-3">DONATION IMPACT STATEMENT</h5>
              <nl2br
                tag="div"
                :text="charity.govDonateStatement"
                class-name="mt-2"
              />
              <h5 class="mt-3">OUR RESPONSIBLE PERSONS AND DIRECTORS</h5>
              <nl2br
                tag="div"
                :text="charity.directors ? charity.directors : ''"
                class-name="mt-2"
              />
            </div>
          </div>
        </el-col>
        <el-col :md="6">
          <el-button type="primary" @click="moveToOrderPage"
            >Order Charity Report</el-button
          >

          <div class="mt-4">
            <label class="font-weight-bold">ABN</label>
            <div>{{ charity.abn }}</div>
          </div>

          <div class="mt-4">
            <label class="font-weight-bold">Established</label>
            <div>{{ charity.establishedYear }}</div>
          </div>

          <div class="mt-4">
            <label class="font-weight-bold">Main activity</label>
            <div>{{ charity.mainActivity }}</div>
          </div>

          <div class="mt-4">
            <label class="font-weight-bold">Other beneficiaries</label>
            <div>{{ charity.otherBeneficiaries }}</div>
          </div>

          <div class="mt-4">
            <label class="font-weight-bold">Sector</label>
            <div>{{ charity.type }}</div>
          </div>

          <div class="mt-4">
            <label class="font-weight-bold">Size</label>
            <size class="mt-2" :value="charity.size" />
          </div>

          <div class="mt-4">
            <label class="font-weight-bold">Sector average size</label>
            <size class="mt-2" :value="charity.size" />
          </div>

          <div class="mt-4">
            <label class="font-weight-bold">Liquidity score</label>
            <score class="mt-2" :value="charity.liquidityScore || 0" />
          </div>

          <div class="mt-4">
            <label class="font-weight-bold"
              >Sector average liquidity score</label
            >
            <score class="mt-2" :value="charity.avgLiquidityScore || 0" />
          </div>

          <div class="mt-4">
            <label class="font-weight-bold">Operates in</label>
            <map-chart
              class="mt-2"
              height="200px"
              :states="charity.operatingStates"
            />
          </div>

          <div class="mt-4">
            <label class="font-weight-bold">Social Feed</label>
            <twitter-timeline
              class="mt-2"
              :feed="socialFeed ? socialFeed.twitter : ''"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import GovernanceRating from "@/views/components/GovernanceRating";
import Size from "@/views/components/Size";
import Score from "@/views/components/Score";
import PieChart from "@/views/components/PieChart";
import BarChart from "@/views/components/BarChart";
import MapChart from "@/views/components/MapChart";
import TwitterTimeline from "@/views/components/TwitterTimeline";
import { DEFAULT_TITLE } from "@/utils/constants";

export default {
  name: "Detail",
  components: {
    TwitterTimeline,
    MapChart,
    BarChart,
    PieChart,
    Score,
    Size,
    GovernanceRating
  },
  data() {
    return {
      loader: null,

      charityId: null,

      historicalChartsVisible: false,
      governanceMore: false,

      socialFeed: null
    };
  },
  computed: {
    ...mapState({
      charityLoading: state => state.storeCharities.charityLoading,
      charity: state => state.storeCharities.charity,
      charityHistoricalDataLoading: state =>
        state.storeCharities.charityHistoricalDataLoading,
      charityHistoricalData: state => state.storeCharities.charityHistoricalData
    })
  },
  mounted() {
    this.charityId = this.$route.params.id;
    if (!this.charityId) {
      this.goBackToSearch();
    }

    this.load();
  },
  methods: {
    load() {
      this.socialFeed = null;
      this.$store.dispatch("loadCharity", this.charityId);
    },
    loadCharityHistoricalData() {
      this.$store
        .dispatch("loadCharityHistoricalData", this.charity.abn)
        .then(() => {
          this.historicalChartsVisible = true;
        });
    },
    getLogo(charity) {
      if (!charity) {
        return null;
      }
      return charity.logo
        ? "https://s3-ap-southeast-2.amazonaws.com/images.impact.com/" +
            charity.logo
        : "https://eu.ui-avatars.com/api/?background=fff&color=3366cc&name=" +
            charity.name
              .split(" ")
              .slice(0, 2)
              .join(" ") +
            "&size=100";
    },
    getRatingImage(rating) {
      let coloredRating = "";
      const types = ["purpose", "people", "process", "impact", "review"];
      const colors = ["y", "g", "b", "p", "pi"];

      for (const i in types) {
        coloredRating += rating[types[i]] ? colors[i] : "";
      }
      if (coloredRating === "") {
        coloredRating = "none";
      }

      return `/img/rating/${coloredRating}.png`;
    },
    goBackToSearch() {
      const query = localStorage.query ? JSON.parse(localStorage.query) : null;
      this.$router.push({
        path: "/search",
        query: query
      });
    },
    moveToOrderPage() {
      this.$router.push("/order/" + this.charityId);
    }
  },
  watch: {
    $route(to) {
      this.charityId = to.params.id;
      if (!this.charityId) {
        this.goBackToSearch();
      }

      this.load();
    },
    charityLoading(loading) {
      if (loading) {
        this.loader = this.$loading.show();
      } else {
        this.loader && this.loader.hide();
      }
    },
    charity() {
      document.title = this.charity.name + " | " + DEFAULT_TITLE;
      this.socialFeed = this.charity.socialFeed;
    }
  }
};
</script>
