<template>
  <div class="page page-order">
    <div class="container my-5 text-center">
      <h1>Order Charity Report</h1>
    </div>
    <div class="container my-4">
      <el-row>
        <el-col :sm="{ offset: 4, span: 16 }">
          <el-form
            ref="formOrder"
            class="form-order p-5"
            :model="orderForm"
            :rules="orderFormRules"
            @submit.native.prevent="submitOrder"
          >
            <el-row class="mt-3">
              <el-col :sm="{ offset: 4, span: 16 }">
                <el-form-item prop="charity">
                  <el-select
                    class="d-block"
                    v-model="orderForm.charity"
                    value-key="id"
                    filterable
                    remote
                    placeholder="Enter charity name"
                    :remote-method="searchCharities"
                    :loading="charitiesLoading"
                    clearable
                    autocomplete="false"
                  >
                    <el-option
                      v-for="charity in charities"
                      :key="'charity-' + charity.id"
                      :label="charity.name"
                      :value="charity"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <h3 class="mt-5 mb-4 text-center">Your Details</h3>

                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item prop="firstName">
                      <el-input
                        v-model="orderForm.firstName"
                        placeholder="First name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="lastName">
                      <el-input
                        v-model="orderForm.lastName"
                        placeholder="Last name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item prop="email">
                  <el-input
                    v-model="orderForm.email"
                    placeholder="Email"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="recaptchaVerified" class="text-center mt-5">
                  <vue-recaptcha
                    ref="recaptcha"
                    class="recaptcha"
                    @verify="onRecaptchaVerified"
                    :sitekey="recaptchaSiteKey"
                    :load-recaptcha-script="true"
                  ></vue-recaptcha>
                </el-form-item>

                <el-form-item class="text-center mt-5">
                  <el-button
                    native-type="submit"
                    type="primary"
                    :loading="emailSending"
                    >Order Report</el-button
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VueRecaptcha from "vue-recaptcha";
import emailjs from "emailjs-com";

emailjs.init(process.env.VUE_APP_EMAILJS_USER_ID);

export default {
  name: "Order",
  components: {
    VueRecaptcha
  },
  data() {
    return {
      orderForm: {
        charity: null,
        firstName: null,
        lastName: null,
        email: null,
        recaptchaVerified: null
      },
      orderFormRules: {
        charity: [
          {
            required: true,
            message: "Please enter charity name",
            trigger: "change"
          }
        ],
        firstName: [
          {
            required: true,
            message: "Please enter first name",
            trigger: "change"
          },
          {
            min: 3,
            message: "First name should be more than 3 letters",
            trigger: "change"
          }
        ],
        lastName: [
          {
            required: true,
            message: "Please enter last name",
            trigger: "change"
          },
          {
            min: 3,
            message: "Last name should be more than 3 letters",
            trigger: "change"
          }
        ],
        email: [
          {
            required: true,
            message: "Please enter email address",
            trigger: "change"
          },
          {
            type: "email",
            message: "email address should be more than 3 letters",
            trigger: "change"
          }
        ],
        recaptchaVerified: {
          required: true,
          message: "Verify the captcha."
        }
      },

      recaptchaSiteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY,
      emailSending: false
    };
  },
  computed: {
    ...mapState({
      charitiesLoading: state => state.storeCharities.charitiesByNameLoading,
      charities: state => state.storeCharities.charitiesByName
    })
  },
  mounted() {
    if (this.$route.params.id) {
      this.$store
        .dispatch("loadCharitiesByName", {
          keyword: this.$route.params.id,
          isId: true
        })
        .then(() => {
          if (this.charities && this.charities.length) {
            this.orderForm.charity = this.charities[0];
          }
        });
    } else {
      this.$store.dispatch("clearCharitiesByName");
    }
  },
  methods: {
    searchCharities(query) {
      if (query !== "") {
        this.$store.dispatch("loadCharitiesByName", { keyword: query });
      } else {
        this.$store.dispatch("clearCharitiesByName");
      }
    },
    submitOrder() {
      this.$refs.formOrder.validate(valid => {
        if (valid) {
          this.emailSending = true;

          emailjs
            .send(
              process.env.VUE_APP_EMAILJS_SERVICE_ID,
              process.env.VUE_APP_EMAILJS_TEMPLATE_ID,
              {
                from:
                  this.orderForm.firstName +
                  " " +
                  this.orderForm.lastName +
                  "(" +
                  this.orderForm.email +
                  ")",
                charity:
                  this.orderForm.charity.name +
                  "(" +
                  this.orderForm.charity.id +
                  ")"
              }
            )
            .then(
              () => {
                this.$message({
                  message:
                    "Your order request for the charity report has been emailed to the administrator successfully.",
                  type: "success",
                  duration: 4500,
                  center: true,
                  showClose: true,
                  offset: 100
                });

                const charity = this.orderForm.charity;
                this.$refs.formOrder.resetFields();
                this.orderForm.charity = charity;

                this.$refs.recaptcha.reset();

                this.emailSending = false;
              },
              error => {
                this.$message({
                  message:
                    "Failed to send emails." +
                    (error && error.text ? " (" + error.text + ")" : ""),
                  type: "error",
                  duration: 6000,
                  center: true,
                  showClose: true,
                  offset: 100
                });

                this.emailSending = false;
              }
            );
        }
      });
    },
    onRecaptchaVerified() {
      this.orderForm.recaptchaVerified = true;
      this.$refs.formOrder.clearValidate("recaptchaVerified");
    }
  }
};
</script>
