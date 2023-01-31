<template>
  <div class="page page-comparison">
    <div class="back-to-search p-3">
      <a href="#" @click.stop.prevent="goBackToSearch"
        ><i class="el-icon-back font-weight-bold"></i> Back to results</a
      >
    </div>
    <div class="container my-4">
      <div class="p-2 text-center">
        <h3>Charity Comparison</h3>
      </div>

      <div class="p-4">
        <table class="table table-comparing-charity-list">
          <colgroup>
            <col style="width: 15%; min-width: 150px;" />
            <col style="width: 30%; min-width: 300px;" />
            <col style="width: 30%; min-width: 300px;" />
            <col style="width: 30%; min-width: 300px;" />
          </colgroup>
          <tbody>
            <tr class="no-border">
              <td></td>
              <td v-for="(n, i) in 3" :key="'charity-name-' + i">
                <div v-if="i < charities.length">
                  <img
                    class="charity-logo"
                    :src="getLogo(charities[i])"
                    alt="Charity Logo"
                  /><br />
                  <label class="charity-name">{{ charities[i].name }}</label>
                </div>
              </td>
            </tr>
            <tr class="section-header">
              <td colspan="4">
                <h5>Key Information</h5>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Purpose</td>
              <td v-for="(n, i) in 3" :key="'charity-purpose-' + i">
                <div v-if="i < charities.length">
                  {{ charities[i].purpose }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Main activity</td>
              <td v-for="(n, i) in 3" :key="'charity-activity-' + i">
                <div v-if="i < charities.length">
                  {{ charities[i].mainActivity }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Beneficiaries</td>
              <td v-for="(n, i) in 3" :key="'charity-beneficiaries-' + i">
                <div v-if="i < charities.length">
                  {{ charities[i].mainBeneficiaries }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Sector</td>
              <td v-for="(n, i) in 3" :key="'charity-sector-' + i">
                <div v-if="i < charities.length">
                  {{ charities[i].type }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Our size</td>
              <td v-for="(n, i) in 3" :key="'charity-size-' + i">
                <div v-if="i < charities.length">
                  <size :value="charities[i].size" />
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Liquidity score</td>
              <td v-for="(n, i) in 3" :key="'charity-score-' + i">
                <div v-if="i < charities.length">
                  <score :value="charities[i].liquidityScore || 0" />
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Date established</td>
              <td v-for="(n, i) in 3" :key="'charity-established-year-' + i">
                <div v-if="i < charities.length">
                  {{ charities[i].establishedYear }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Full time staff</td>
              <td v-for="(n, i) in 3" :key="'charity-staff-' + i">
                <div v-if="i < charities.length">
                  {{ charities[i].staffFullTime }}
                  <i class="el-icon-user-solid"></i>
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Social impact rating</td>
              <td
                v-for="(n, i) in 3"
                :key="'charity-social-impact-rating-' + i"
              >
                <div v-if="i < charities.length">
                  <img
                    class="mt-3"
                    src="../../assets/social-impact-rating.png"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Governance rating</td>
              <td v-for="(n, i) in 3" :key="'charity-governance-rating-' + i">
                <div class="d-inline-block" v-if="i < charities.length">
                  <governance-rating :rating="charities[i].rating" />
                </div>
              </td>
            </tr>

            <tr class="section-header">
              <td colspan="4">
                <h5>Operations</h5>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">States of operation</td>
              <td v-for="(n, i) in 3" :key="'charity-operation-states-' + i">
                <div v-if="i < charities.length">
                  {{
                    charities[i].operatingStates
                      .map(s => s.toUpperCase())
                      .join(", ")
                  }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Other countries of operation</td>
              <td
                v-for="(n, i) in 3"
                :key="'charity-operation-other-countries-' + i"
              >
                <div v-if="i < charities.length">
                  <span
                    v-if="
                      charities[i].operatingCountries &&
                        charities[i].operatingCountries.length
                    "
                    >{{
                      charities[i].operatingCountries &&
                        charities[i].operatingCountries.replace(/,/, ", ")
                    }}</span
                  >
                  <span class="not-provided" v-else>Not provided</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Volunteers</td>
              <td v-for="(n, i) in 3" :key="'charity-volunteers-' + i">
                <div v-if="i < charities.length">
                  {{ charities[i].staffVolunteers }}
                  <i class="el-icon-user-solid"></i>
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Grants for use in Australia</td>
              <td v-for="(n, i) in 3" :key="'charity-grants-in-' + i">
                <div v-if="i < charities.length">
                  <span
                    v-if="charities[i].expenses && charities[i].expenses.length"
                    >{{ charities[i].expenses[2].value }}</span
                  >
                  <span class="not-provided" v-else>Not provided</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Grants for use outside Australia</td>
              <td v-for="(n, i) in 3" :key="'charity-grants-outside-' + i">
                <div v-if="i < charities.length">
                  <span
                    v-if="charities[i].expenses && charities[i].expenses.length"
                    >{{ charities[i].expenses[3].value }}</span
                  >
                  <span class="not-provided" v-else>Not provided</span>
                </div>
              </td>
            </tr>

            <tr class="section-header">
              <td colspan="4">
                <h5>Financials</h5>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Total gross income</td>
              <td v-for="(n, i) in 3" :key="'charity-total-gross-income-' + i">
                <div v-if="i < charities.length">
                  $ {{ charities[i].totalGrossIncome }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Total expenses</td>
              <td v-for="(n, i) in 3" :key="'charity-total-expenses-' + i">
                <div v-if="i < charities.length">
                  $ {{ charities[i].totalExpenses }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Total assets</td>
              <td v-for="(n, i) in 3" :key="'charity-total-assets-' + i">
                <div v-if="i < charities.length">
                  $ {{ charities[i].totalAssets }}
                </div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-bold">Total liabilities</td>
              <td v-for="(n, i) in 3" :key="'charity-total-liabilities-' + i">
                <div v-if="i < charities.length">
                  $ {{ charities[i].totalLiabilities }}
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td v-for="(n, i) in 3" :key="'order-' + i">
                <div class="mt-3" v-if="i < charities.length">
                  <el-button
                    type="primary"
                    @click.stop="moveToOrderPage(charities[i])"
                    >Order Charity Report</el-button
                  ><br />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Size from "@/views/components/Size";
import Score from "@/views/components/Score";
import GovernanceRating from "@/views/components/GovernanceRating";

export default {
  name: "Compare",
  components: { GovernanceRating, Score, Size },
  data() {
    return {
      loader: null
    };
  },
  computed: {
    ...mapState({
      charitiesLoading: state => state.storeCharities.comparingCharitiesLoading,
      charities: state => state.storeCharities.comparingCharities
    })
  },
  mounted() {
    const ids = this.$route.params.ids.split(",");
    if (!ids || !ids.length) {
      this.goBackToSearch();
    }
    this.$store.dispatch("loadComparingCharities", ids);
  },
  methods: {
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
    goBackToSearch() {
      const query = localStorage.query ? JSON.parse(localStorage.query) : null;
      this.$router.push({
        path: "/search",
        query: query
      });
    },
    moveToOrderPage(charity) {
      this.$router.push("/order/" + charity.id);
    }
  },
  watch: {
    charitiesLoading(loading) {
      if (loading) {
        this.loader = this.$loading.show();
      } else {
        this.loader && this.loader.hide();
      }
    }
  }
};
</script>
