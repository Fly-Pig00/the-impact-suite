<template>
  <div class="page page-search">
    <div class="search-parameters d-md-flex px-4 py-3">
      <div class="flex-grow-1">
        <label class="mr-3">Organization:</label>
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          @command="selectOrganization"
        >
          <span class="el-dropdown-link">
            {{ query.organization ? query.organization : "All" }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="">All</el-dropdown-item>
            <el-dropdown-item
              v-for="item in organizations"
              :key="'organization-' + item"
              :command="item"
              >{{ item }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>

        <label class="mr-3 ml-3">Size:</label>
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          @command="selectSize"
        >
          <span class="el-dropdown-link">
            <span class="text-capitalize">{{
              query.size ? query.size : "All"
            }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="text-capitalize">
            <el-dropdown-item command="">All</el-dropdown-item>
            <el-dropdown-item
              v-for="item in sizes"
              :key="'size-' + item"
              :command="item"
              >{{ item }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>

        <label class="mr-3 ml-3">Location:</label>
        <el-popover placement="bottom-start" trigger="click">
          <div class="d-flex w-100">
            <el-input
              placeholder="Postcode"
              style="width: 100px"
              v-model="query.postcode"
              @change="changePostcode"
              maxlength="5"
            ></el-input>
            <span class="nowrap mx-3 mt-2"> or </span>
            <el-select
              placeholder="State"
              style="width: 100px"
              v-model="query.state"
              @change="selectState"
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
            {{ location }} <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </el-popover>
      </div>
      <div class="">
        <label class="mr-3">Sorting:</label>
        <el-dropdown
          trigger="click"
          placement="bottom-end"
          @command="selectSort"
        >
          <span class="el-dropdown-link">
            {{
              query.sort ? sorts.find(s => s.value === query.sort).label : ""
            }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="{ label, value } in sorts"
              :key="'sort-' + value"
              :command="value"
              >{{ label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="search-result p-4">
      <el-table
        class="table-charity-list"
        ref="multipleTable"
        :data="charities"
        style="width: 100%;"
        :row-class-name="charityRowClassName"
        @row-click="moveToDetailPage"
      >
        <el-table-column label="Charity Name" min-width="300">
          <template slot-scope="scope">
            <div class="d-flex">
              <img
                class="charity-logo"
                :alt="scope.row.name"
                :src="getLogo(scope.row)"
              />
              <div class="flex-grow-1 ml-3 d-flex-vertical-center">
                {{ scope.row.name }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="ABN" min-width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.abn }}
          </template>
        </el-table-column>
        <el-table-column label="Governance Rating" min-width="250">
          <template slot-scope="scope">
            <governance-rating :rating="scope.row.rating" />
          </template>
        </el-table-column>
        <el-table-column label="Summary" min-width="350">
          <template slot-scope="scope">
            <div v-line-clamp:20="3">{{ scope.row.summary }}</div>
            <el-button type="text">Read More</el-button>
          </template>
        </el-table-column>
        <el-table-column :width="actionColumnWidth" fixed="right">
          <template slot-scope="scope">
            <div class="text-center">
              <el-button type="primary" @click.stop="moveToOrderPage(scope.row)"
                ><span class="d-none d-md-inline">Order Charity Report</span
                ><span class="d-inline d-md-none">Order</span></el-button
              ><br />
              <el-checkbox
                class="mt-1"
                v-model="scope.row.selected"
                @change="toggleCharitySelection(scope.row, scope.row.selected)"
                @click.native.stop=""
                :disabled="!scope.row.selected && selectedCharities.length >= 3"
                ><span class="d-none d-md-inline">Compare Charity</span
                ><span class="d-inline d-md-none">Compare</span></el-checkbox
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <transition name="transition-pane-compare-confirm">
      <div class="pane-compare-confirm p-2" v-show="selectedCharities.length">
        <div class="container">
          <div class="d-flex d-flex-vertical-center">
            <div class="flex-grow-0 text-center px-5">
              <h4>Compare up to<br />3 charities</h4>
              <el-button type="text" @click="clearCharitySelection"
                >Clear Selection</el-button
              >
            </div>
            <div class="flex-grow-1">
              <ul class="d-flex d-flex-center selected-charity-list">
                <li
                  class="text-center"
                  v-for="(n, i) in 3"
                  :key="'selected-charity-' + i"
                >
                  <div v-if="i < selectedCharities.length">
                    <img
                      :src="getLogo(selectedCharities[i])"
                      :alt="selectedCharities[i].name"
                    /><br />
                    <label>{{ selectedCharities[i].name }}</label>
                  </div>
                  <div v-else>
                    <span class="logo-placeholder"></span><br />
                    <label></label>
                  </div>
                </li>
              </ul>
            </div>
            <div class="flex-grow-0 text-center px-5">
              <el-button
                type="success"
                :disabled="selectedCharities.length <= 1"
                @click="moveToComparisonPage"
                >Compare <i class="el-icon-arrow-right"></i
              ></el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import { DEFAULT_FILTER, STATES, SIZES } from "@/utils/constants";

import lineClamp from "vue-line-clamp";
import GovernanceRating from "@/views/components/GovernanceRating";
Vue.use(lineClamp, {
  // plugin options
});

export default {
  name: "Search",
  components: { GovernanceRating },
  data() {
    return {
      loader: null,

      query: { ...DEFAULT_FILTER },

      states: STATES,
      sizes: SIZES,

      sorts: [
        {
          label: "Highest Social Impact Rating",
          value: "desc"
        },
        {
          label: "Lowest Social Impact Rating",
          value: "asc"
        }
      ],

      actionColumnWidth: "200px",
      selectedCharities: []
    };
  },
  computed: {
    ...mapState({
      organizations: state => state.storeCharities.organizations,
      // states: state => state.storeCharities.states,
      // sizes: state => state.storeCharities.sizes,
      charitiesLoading: state => state.storeCharities.charitiesLoading,
      charities: state => state.storeCharities.charities
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
        return "All";
      }
    }
  },
  mounted() {
    this.$store.dispatch("loadOrganizations");
    // this.$store.dispatch("loadStates");
    // this.$store.dispatch("loadSizes");

    this.query = { ...DEFAULT_FILTER, ...this.$route.query };
    if (!this.sorts.find(s => s.value === this.query.sort)) {
      this.query.sort = this.sorts[0].value;
    }

    this.search();

    window.addEventListener("resize", this.updateActionColumnWidth);
    this.updateActionColumnWidth();
  },
  methods: {
    selectOrganization(organization) {
      if (this.query.organization !== organization) {
        this.query.organization = organization;
        this.$router.push({ path: "/search", query: this.query });
      }
    },
    changePostcode() {
      this.$router.push({ path: "/search", query: this.query });
    },
    selectState() {
      this.$router.push({ path: "/search", query: this.query });
    },
    selectSize(size) {
      if (this.query.size !== size) {
        this.query.size = size;
        this.$router.push({ path: "/search", query: this.query });
      }
    },
    selectSort(sort) {
      if (this.query.sort !== sort) {
        this.query.sort = sort;
        this.$router.push({ path: "/search", query: this.query });
      }
    },
    search() {
      this.$store.dispatch("loadCharities", this.query);
    },
    getLogo(charity) {
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
    toggleCharitySelection(charity, selected) {
      const index = this.selectedCharities.indexOf(charity);
      if (selected) {
        if (index < 0) {
          this.selectedCharities.push(charity);
        }
      } else {
        if (index > -1) {
          this.selectedCharities.splice(index, 1);
        }
      }
    },
    clearCharitySelection() {
      for (const charity of this.selectedCharities) {
        charity.selected = false;
      }

      this.selectedCharities = [];
    },
    charityRowClassName({ row }) {
      return row.selected ? "row-selected" : "";
    },
    moveToDetailPage(charity) {
      this.saveQuery();
      this.$router.push("/detail/" + charity.id);
    },
    moveToOrderPage(charity) {
      this.$router.push("/order/" + charity.id);
    },
    moveToComparisonPage() {
      this.saveQuery();
      this.$router.push("/compare/" + this.selectedCharities.map(c => c.id));
    },
    saveQuery() {
      localStorage.query = JSON.stringify(this.query);
    },
    updateActionColumnWidth() {
      if (window.matchMedia("(min-width: 768px)").matches) {
        this.actionColumnWidth = "200px";
      } else {
        this.actionColumnWidth = "100px";
      }
    }
  },
  watch: {
    $route(to) {
      this.query = { ...DEFAULT_FILTER, ...to.query };
      if (!this.sorts.find(s => s.value === this.query.sort)) {
        this.query.sort = this.sorts[0].value;
      }

      this.search();
    },
    charitiesLoading(loading) {
      if (loading) {
        this.loader = this.$loading.show();
      } else {
        this.loader && this.loader.hide();
      }
    },
    charities() {
      this.selectedCharities = [];
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateActionColumnWidth);
  }
};
</script>
