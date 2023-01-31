import Vue from "vue";
import Vuex from "vuex";

import { RootState } from "./types";

import storeCharities from "./modules/charities";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    storeCharities
  }
});
