<template>
  <div class="page page-matcher">
    <div class="container my-5 text-center">
      <h1>Charity Matcher</h1>
      <p class="mt-2">
        Take the quiz and we'll match the right charity for you.
      </p>
    </div>
    <div class="container my-4">
      <el-row>
        <el-col :sm="{ offset: 4, span: 16 }">
          <el-form
            ref="formMatcher"
            class="form-matcher p-3"
            :model="matcherForm"
            @submit.native.prevent="next"
          >
            <el-steps class="step-container" :active="step" simple>
              <el-step title="Step 1">
                <template slot="icon">
                  <div class="el-step__icon-inner">1</div>
                </template>
              </el-step>
              <el-step title="Step 2">
                <template slot="icon">
                  <div class="el-step__icon-inner">2</div>
                </template>
              </el-step>
              <el-step title="Step 3">
                <template slot="icon">
                  <div class="el-step__icon-inner">3</div>
                </template>
              </el-step>
            </el-steps>

            <div class="step-content-container text-center p-2">
              <div class="step" data-step="0" v-show="step === 0">
                <h5 class="mt-7">
                  The charity I want is likely to deal with...
                </h5>
                <el-row class="mt-3">
                  <el-col :sm="{ offset: 8, span: 8 }">
                    <el-form-item>
                      <el-input
                        v-model="matcherForm.keyword"
                        placeholder="Enter keywords e,g. kids cancer"
                        @change="updateQuery"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div class="step" data-step="1" v-show="step === 1">
                <h5 class="mt-5">
                  Does this charity need to have a tax deductible fund?
                </h5>
                <el-form-item class="mt-3" prop="deductibleGiftRecipient">
                  <el-select
                    v-model="matcherForm.deductibleGiftRecipient"
                    placeholder="Please Select"
                    @change="updateQuery"
                  >
                    <el-option
                      v-for="{ label, value } in deductibleGiftRecipient"
                      :key="'tax-deductible-fund-' + value"
                      :label="label"
                      :value="value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <h5 class="mt-5">
                  Are you looking for a charity working in Australia or
                  Overseas?
                </h5>
                <el-form-item class="mt-3" prop="workingInAuOrOverseas">
                  <el-select
                    v-model="matcherForm.workingInAuOrOverseas"
                    placeholder="Please Select"
                    @change="onChangeWorkingInAuOrOverseas"
                  >
                    <el-option
                      v-for="{ label, value } in workingInAuOrOverseas"
                      :key="'working-' + value"
                      :label="label"
                      :value="value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <h5 class="mt-5">
                  I would like the charity to operate in...
                </h5>
                <el-form-item class="mt-3" prop="location">
                  <el-select
                    v-model="matcherForm.country"
                    placeholder="Select countries"
                    multiple
                    collapse-tags
                    :disabled="!isCountrySelectable"
                    @change="updateQuery"
                  >
                    <el-option
                      v-for="{ name, code } in countries"
                      :key="'country-' + code"
                      :label="name"
                      :value="code"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    class="ml-2"
                    v-model="matcherForm.state"
                    placeholder="Select a state"
                    :disabled="!isStateSelectable"
                    @change="updateQuery"
                  >
                    <el-option label="Any" value=""></el-option>
                    <el-option
                      v-for="{ code } in states"
                      :key="'state-' + code"
                      :label="code"
                      :value="code"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    class="ml-2 width-auto"
                    v-model="matcherForm.postcode"
                    placeholder="Enter postcode"
                    @change="updateQuery"
                  >
                  </el-input>
                </el-form-item>
              </div>
              <div class="step" data-step="2" v-show="step === 2">
                <h5 class="mt-5">
                  I only want to see charities of this size
                </h5>
                <el-form-item class="mt-3" prop="size">
                  <el-select
                    class="text-capitalize"
                    v-model="matcherForm.size"
                    placeholder="Please Select"
                    @change="updateQuery"
                  >
                    <el-option label="Any" value=""></el-option>
                    <el-option
                      class="text-capitalize"
                      v-for="(size, index) in sizes"
                      :key="'size-' + index"
                      :label="size"
                      :value="size"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <h5 class="mt-5">
                  This charity needs to help
                </h5>
                <el-form-item class="mt-3" prop="benefits">
                  <el-select
                    class="text-capitalize"
                    v-model="matcherForm.benefit"
                    placeholder="Please Select"
                    multiple
                    collapse-tags
                    @change="updateQuery"
                  >
                    <el-option
                      class="text-capitalize"
                      v-for="(option, index) in benefits"
                      :key="'benefit-' + index"
                      :label="option"
                      :value="option"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <h5 class="mt-5">
                  Out of interest, which of these is most important to you?
                </h5>
                <el-form-item class="mt-3" prop="mostImportant">
                  <el-select
                    v-model="matcherForm.mostImportant"
                    placeholder="Please Select"
                    @change="updateQuery"
                  >
                    <el-option
                      v-for="(option, index) in mostImportant"
                      :key="'mi-' + index"
                      :label="option"
                      :value="option"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <div class="step-action-container text-right mt-3">
              <el-button @click="prev" v-show="step > 0">Previous</el-button>
              <el-button native-type="submit" type="primary" v-if="step < 2"
                >Next</el-button
              >
              <el-button native-type="submit" type="primary" v-if="step === 2"
                >See Results</el-button
              >
            </div>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { SIZES, COUNTRIES, STATES } from "@/utils/constants";

export default {
  name: "Matcher",
  data() {
    return {
      step: 0,

      matcherForm: {
        keyword: null,
        deductibleGiftRecipient: null,
        workingInAuOrOverseas: null,
        country: [],
        state: [],
        postcode: null,
        size: null,
        benefit: [],
        mostImportant: null
      },

      deductibleGiftRecipient: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "This is not important", value: "" }
      ],
      workingInAuOrOverseas: [
        { label: "Australia", value: "au" },
        { label: "Overseas", value: "os" },
        { label: "Either", value: "" }
      ],
      countries: COUNTRIES,
      states: STATES,
      sizes: SIZES,

      mostImportant: [
        "Donate money or gifts",
        "Volunteer my time",
        "Use a charity service",
        "Work for a charity",
        "Do business with a charity"
      ]
    };
  },
  computed: {
    ...mapState({ benefits: state => state.storeCharities.benefits }),
    isCountrySelectable() {
      return (
        !this.matcherForm.workingInAuOrOverseas ||
        this.matcherForm.workingInAuOrOverseas === "os"
      );
    },
    isStateSelectable() {
      return (
        !this.matcherForm.workingInAuOrOverseas ||
        this.matcherForm.workingInAuOrOverseas === "au"
      );
    }
  },
  mounted() {
    this.loadQuery(this.$route.query);
    this.$store.dispatch("loadBenefits");
  },
  methods: {
    loadQuery(query) {
      this.step = query.step >= 0 && query.step <= 2 ? parseInt(query.step) : 0;

      this.matcherForm = { ...query };
      if (
        this.matcherForm.country &&
        !Array.isArray(this.matcherForm.country)
      ) {
        this.matcherForm.country = [this.matcherForm.country];
      }
      if (
        this.matcherForm.benefit &&
        !Array.isArray(this.matcherForm.benefit)
      ) {
        this.matcherForm.benefit = [this.matcherForm.benefit];
      }
      delete this.matcherForm.step;
    },
    next() {
      if (this.step < 2) {
        // this.step++;
        this.$router.push({
          path: "/matcher",
          query: { step: ++this.step, ...this.matcherForm }
        });
      } else {
        this.$router.push({ path: "/search", query: this.matcherForm });
      }
    },
    prev() {
      if (this.step > 0) {
        // this.step--;
        this.$router.push({
          path: "/matcher",
          query: { step: --this.step, ...this.matcherForm }
        });
      }
    },
    updateQuery() {
      this.$router.push({
        path: "/matcher",
        query: { step: this.step, ...this.matcherForm }
      });
    },
    onChangeWorkingInAuOrOverseas(val) {
      if (val === "au") {
        this.matcherForm.country = [];
      } else if (val === "os") {
        this.matcherForm.state = null;
      }
    }
  },
  watch: {
    $route(to) {
      this.loadQuery(to.query);
    }
  }
};
</script>
