import { ActionContext } from "vuex";
import moment from "moment";

import { RootState } from "@/store/types";

import gqlClient from "@/utils/graphql";
import gqlOrganizations from "@/graphql/Organizations.gql";
import gqlStates from "@/graphql/States.gql";
import gqlSizes from "@/graphql/Sizes.gql";
import gqlBenefits from "@/graphql/Benefits.gql";

import gqlCharities from "@/graphql/Charities.gql";

import gqlCharity from "@/graphql/Charity.gql";
import gqlCharityDetail from "@/graphql/CharityDetail.gql";
import gqlCharityHistoricalData from "@/graphql/CharityHistoricalData.gql";

import gqlCharitiesByName from "@/graphql/CharitiesByName.gql";
import { DEFAULT_FILTER } from "@/utils/constants";

interface Charity {
  id: null | string;

  abn: null | string;
  type: null | string;
  size: null | string;

  name: null | string;
  logo: null | string;
  rating: null | object;
  summary: null | string;

  establishedYear: null | string;
  state: null | string;

  score: null | string;
  liquidityScore: null | string;
  avgScore: null | string;
  avgLiquidityScore: null | string;

  socialFeed: null | string;

  revenues: null | Array<{}>;
  expenses: null | Array<{}>;

  totalRevenue: null | string;
  avgRevenue: null | string;

  mainActivity: null | string;
  otherActivity: null | string;
  mainBeneficiaries: null | string;
  otherBeneficiaries: null | string;

  operatingStates: null | Array<string>;

  staffFullTime: null | string;
  staffPartTime: null | string;
  staffCasual: null | string;
  staffVolunteers: null | string;

  operatingCountries: null | string;

  totalGrossIncome: null | string;
  totalExpenses: null | string;
  totalAssets: null | string;
  totalLiabilities: null | string;

  govStatement: null | string;
  govFundingUse: null | string;
  govDiversityStatement: null | string;
  govImpactStatement: null | string;
  govDonateStatement: null | string;

  directors: null | string;

  selected: false | boolean;
}

interface ChartDataItem {
  category: string;
  value: number;
}

interface CharityHistoricalData {
  governmentRevenue: null | Array<ChartDataItem>;
  donationsAndBequests: null | Array<ChartDataItem>;
  totalGrossIncome: null | Array<ChartDataItem>;
  employeeExpenses: null | Array<ChartDataItem>;
  interestExpenses: null | Array<ChartDataItem>;
  totalExpenses: null | Array<ChartDataItem>;
  netAssetsAndLiabilities: null | Array<ChartDataItem>;
  totalFullTimeEquivalentStaff: null | Array<ChartDataItem>;
  totalVolunteers: null | Array<ChartDataItem>;
}

interface Filter {
  keyword: string;
  organization: null | string;
  size: null | string;
  postcode: null | string;
  workingInAuOrOverseas: null | string;
  country: null | Array<string>;
  state: null | string;
  deductibleGiftRecipient: null | string;
  benefit: null | Array<string>;
  sort: null | string;
}

interface CharitiesState {
  organizations: null | Array<string>;
  states: null | Array<string>;
  sizes: null | Array<string>;
  benefits: null | Array<string>;

  charitiesLoading: null | boolean;
  charities: null | Array<Charity>;

  charityLoading: null | boolean;
  charity: null | Charity;

  charityHistoricalDataLoading: null | boolean;
  charityHistoricalData: null | CharityHistoricalData;

  comparingCharitiesLoading: null | boolean;
  comparingCharities: null | Array<Charity>;

  charitiesByNameLoading: null | boolean;
  charitiesByName: null | Array<Charity>;
}

const state: CharitiesState = {
  organizations: [],
  states: [],
  sizes: [],
  benefits: [],

  charitiesLoading: false,
  charities: [],

  charityLoading: false,
  charity: null,

  charityHistoricalDataLoading: false,
  charityHistoricalData: {
    governmentRevenue: [],
    donationsAndBequests: [],
    totalGrossIncome: [],
    employeeExpenses: [],
    interestExpenses: [],
    totalExpenses: [],
    netAssetsAndLiabilities: [],
    totalFullTimeEquivalentStaff: [],
    totalVolunteers: []
  },

  comparingCharitiesLoading: false,
  comparingCharities: [],

  charitiesByNameLoading: false,
  charitiesByName: []
};

async function getCharityDetail(id: string) {
  let response = await gqlClient.query({
    query: gqlCharity,
    variables: { id: id }
  });

  let charity = response.data.impact_organisation_by_pk;

  charity = {
    id: charity.org_id,
    abn: charity.abn,
    type: charity.type,
    size: charity.org_size,

    name: charity.name,
    logo: charity.logo_url,
    rating: {
      purpose: charity.tis_gov_purpose,
      people: charity.tis_gov_people,
      process: charity.tis_gov_process,
      impact: charity.tis_gov_impact,
      review: charity.tis_gov_review
    },

    lotusRating: {
      purpose: charity.tis_lotus_purpose,
      people: charity.tis_lotus_people,
      process: charity.tis_lotus_process,
      impact: charity.tis_lotus_impact,
      review: charity.tis_lotus_review
    },
    summary: charity.summary,
    purpose: charity.purpose,
    establishedYear: charity.estab_year,

    govStatement: charity.gov_statement,
    govFundingUse: charity.gov_funding_use,
    govDiversityStatement: charity.gov_diversity_statement,
    govImpactStatement: charity.gov_impact_statement,
    govDonateStatement: charity.gov_donate_statement,

    directors: charity.org_people
      .map((people: { person: { name: string } }) => people.person.name)
      .join("\n"),

    state: charity.state,
    score: charity.tis_rating,
    liquidityScore: charity.tis_liquidity_rating,

    socialFeed: {
      twitter: charity.twitter
    }
  };

  response = await gqlClient.query({
    query: gqlCharityDetail,
    variables: { abn: charity.abn, type: charity.type }
  });

  const detail = response.data;

  charity.avgScore = Math.round(
    detail.impact_organisation_aggregate.aggregate.avg.tis_rating
  );
  charity.avgLiquidityScore = Math.round(
    detail.impact_organisation_aggregate.aggregate.avg.tis_liquidity_rating
  );

  charity.avgRevenue = parseFloat(
    detail.impact_annual_statement_aggregate.aggregate.avg.total_revenue
  ).toFixed(2);

  const financialData = detail.impact_annual_statement.length
    ? detail.impact_annual_statement[0]
    : null;
  if (financialData) {
    charity.mainActivity = financialData.main_activity;
    charity.otherActivity = financialData.other_activity;
    charity.mainBeneficiaries = financialData.main_beneficiaries;
    charity.otherBeneficiaries = financialData.other_beneficiaries_description;

    charity.totalRevenue = financialData.total_revenue;

    charity.revenues = [
      {
        category: "Government Revenue",
        value: financialData.revenue_from_government
      },
      {
        category: "Donations and Bequests",
        value: financialData.donations_and_bequests
      },
      {
        category: "Revenue from Goods and Services",
        value: financialData.revenue_from_goods_and_services
      },
      {
        category: "All Other Revenue",
        value: financialData.all_other_revenue
      },
      {
        category: "Other Income",
        value: financialData.other_income
      }
    ];

    charity.expenses = [
      {
        category: "Employee Expenses",
        value: financialData.employee_expenses
      },
      {
        category: "Interest Expenses",
        value: financialData.interest_expenses
      },
      {
        category: "Grants and Donations made for use in Australia",
        value: financialData.grants_and_donations_made_for_use_in_australia
      },
      {
        category: "Grants and Donations made for use outside Australia",
        value: financialData.grants_and_donations_made_for_use_outside_australia
      },
      {
        category: "All other expenses",
        value: financialData.all_other_expenses
      }
    ];

    const states = ["act", "nsw", "nt", "qld", "sa", "tas", "vic", "wa"];
    charity.operatingStates = [];
    for (const state of states) {
      if (financialData["operates_in_" + state] === "y") {
        charity.operatingStates.push(state);
      }
    }

    charity.staffFullTime = financialData.staff_full_time;
    charity.staffPartTime = financialData.staff_part_time;
    charity.staffCasual = financialData.staff_casual;
    charity.staffVolunteers = financialData.staff_volunteers;

    charity.operatingCountries = financialData.operating_countries;

    charity.totalGrossIncome = financialData.total_gross_income;
    charity.totalExpenses = financialData.total_expenses;
    charity.totalAssets = financialData.total_assets;
    charity.totalLiabilities = financialData.total_liabilities;
  }

  return charity;
}

const actions = {
  async loadOrganizations({
    commit
  }: ActionContext<CharitiesState, RootState>) {
    const response = await gqlClient.query({
      query: gqlOrganizations
    });

    const organisations = response.data.impact_organisation;

    commit(
      "SET_ORGANIZATIONS",
      organisations
        .map(({ type }: { type: string }) => type)
        .filter((o: string) => o)
    );
  },
  async loadStates({ commit }: ActionContext<CharitiesState, RootState>) {
    const response = await gqlClient.query({
      query: gqlStates
    });

    const states = response.data.impact_organisation;

    commit(
      "SET_STATES",
      states
        .map(({ state }: { state: string }) => state)
        .filter((s: string) => s)
    );
  },
  async loadSizes({ commit }: ActionContext<CharitiesState, RootState>) {
    const response = await gqlClient.query({
      query: gqlSizes
    });

    const sizes = response.data.impact_organisation;

    commit(
      "SET_SIZES",
      sizes
        .map((size: { org_size: string }) => size.org_size)
        .filter((s: string) => s)
    );
  },
  async loadBenefits({ commit }: ActionContext<CharitiesState, RootState>) {
    const response = await gqlClient.query({
      query: gqlBenefits
    });

    const benefits = response.data.impact_organisation;

    commit(
      "SET_BENEFITS",
      benefits
        .map(({ benefits }: { benefits: string }) => benefits)
        .filter((o: string) => o)
    );
  },

  async loadCharities(
    { commit }: ActionContext<CharitiesState, RootState>,
    filter: Filter
  ) {
    commit("SET_CHARITIES_LOADING", true);

    filter = { ...DEFAULT_FILTER, ...filter };

    if (filter.country && !Array.isArray(filter.country)) {
      filter.country = [filter.country];
    }
    if (filter.benefit && !Array.isArray(filter.benefit)) {
      filter.benefit = [filter.benefit];
    }

    const abn = parseInt(filter.keyword);
    const response = await gqlClient.query({
      query: gqlCharities,
      variables: {
        keyword: "%" + (filter.keyword ? filter.keyword.trim() : "") + "%",
        abn: isNaN(abn) ? 0 : abn,
        organization:
          "%" +
          (!filter.organization || filter.organization == "All"
            ? ""
            : filter.organization.trim()) +
          "%",
        size:
          "%" +
          (!filter.size || filter.size == "All" ? "" : filter.size.trim()) +
          "%",
        postcode: "%" + (!filter.postcode ? "" : filter.postcode.trim()) + "%",
        country:
          filter.workingInAuOrOverseas === "os" ||
          (!filter.workingInAuOrOverseas &&
            ((filter.country && filter.country.length) || !filter.state))
            ? filter.country && filter.country.length
              ? filter.country
                  .filter(b => b && b.trim())
                  .map(b => "%" + b.trim() + "%")
                  .join("|")
              : "%%"
            : "SKIP",
        state:
          filter.workingInAuOrOverseas === "au" ||
          (!filter.workingInAuOrOverseas &&
            (filter.state || !(filter.country && filter.country.length)))
            ? "%" +
              (!filter.state || filter.state == "All"
                ? ""
                : filter.state.trim()) +
              "%"
            : "SKIP",
        deductibleGiftRecipient:
          "%" +
          (!filter.deductibleGiftRecipient
            ? ""
            : filter.deductibleGiftRecipient.trim()) +
          "%",
        benefit:
          filter.benefit && filter.benefit.length
            ? filter.benefit
                .filter(b => b && b.trim())
                .map(b => "%" + b.trim() + "%")
                .join("|")
            : "%%",
        sort:
          filter.sort && filter.sort == "asc"
            ? "asc_nulls_first"
            : "desc_nulls_last"
      }
    });

    const charities = response.data.impact_organisation;

    commit(
      "SET_CHARITIES",
      charities.map(
        (c: {
          org_id: string;
          abn: string;
          name: string;
          tis_gov_purpose: bigint;
          tis_gov_people: bigint;
          tis_gov_process: bigint;
          tis_gov_impact: bigint;
          tis_gov_review: bigint;
          summary: string;
          logo_url: string;
        }) => {
          return {
            id: c.org_id,
            abn: c.abn,
            name: c.name,
            logo: c.logo_url,
            rating: {
              purpose: c.tis_gov_purpose,
              people: c.tis_gov_people,
              process: c.tis_gov_process,
              impact: c.tis_gov_impact,
              review: c.tis_gov_review
            },
            summary: c.summary,
            selected: false
          };
        }
      )
    );

    commit("SET_CHARITIES_LOADING", false);
  },

  async loadCharity(
    { commit }: ActionContext<CharitiesState, RootState>,
    id: string
  ) {
    commit("SET_CHARITY_LOADING", true);

    const charity = await getCharityDetail(id);

    commit("SET_CHARITY", charity);

    commit("SET_CHARITY_LOADING", false);
  },

  async loadComparingCharities(
    { commit }: ActionContext<CharitiesState, RootState>,
    ids: Array<string>
  ) {
    commit("SET_COMPARING_CHARITIES_LOADING", true);

    const charities = [];

    for (const id of ids) {
      charities.push(await getCharityDetail(id));
    }

    commit("SET_COMPARING_CHARITIES", charities);

    commit("SET_COMPARING_CHARITIES_LOADING", false);
  },

  async loadCharitiesByName(
    { commit, state }: ActionContext<CharitiesState, RootState>,
    { keyword, isId }: { keyword: string; isId: boolean }
  ) {
    commit("SET_CHARITIES_BY_NAME_LOADING", true);

    if (isId) {
      let charity = null;
      if (state.charity && state.charity.id === keyword) {
        charity = state.charity;
      } else if (state.charities && state.charities.length) {
        charity = state.charities.find((c: Charity) => c.id === keyword);
      }

      if (charity) {
        commit("SET_CHARITIES_BY_NAME", [
          { id: charity.id, name: charity.name }
        ]);
      } else {
        const response = await gqlClient.query({
          query: gqlCharity,
          variables: { id: keyword }
        });

        charity = response.data.impact_organisation_by_pk;

        if (charity) {
          commit("SET_CHARITIES_BY_NAME", [
            { id: charity.org_id, name: charity.name }
          ]);
        } else {
          commit("SET_CHARITIES_BY_NAME", []);
        }
      }
    } else {
      const response = await gqlClient.query({
        query: gqlCharitiesByName,
        variables: { keyword: keyword.replace(/\s/, "%") + "%" }
      });

      const charities = response.data.impact_organisation;

      commit(
        "SET_CHARITIES_BY_NAME",
        charities.map((c: { org_id: string; name: string }) => {
          return {
            id: c.org_id,
            name: c.name
          };
        })
      );
    }

    commit("SET_CHARITIES_BY_NAME_LOADING", false);
  },
  clearCharitiesByName({ commit }: ActionContext<CharitiesState, RootState>) {
    commit("SET_CHARITIES_BY_NAME", []);
  },

  async loadCharityHistoricalData(
    { commit }: ActionContext<CharitiesState, RootState>,
    abn: string
  ) {
    commit("SET_CHARITY_HISTORICAL_DATA_LOADING", true);

    const response = await gqlClient.query({
      query: gqlCharityHistoricalData,
      variables: { abn: abn }
    });

    const data = response.data.impact_annual_statement;

    const governmentRevenue: Array<ChartDataItem> = [];
    const donationsAndBequests: Array<ChartDataItem> = [];
    const totalGrossIncome: Array<ChartDataItem> = [];
    const employeeExpenses: Array<ChartDataItem> = [];
    const interestExpenses: Array<ChartDataItem> = [];
    const totalExpenses: Array<ChartDataItem> = [];
    const netAssetsAndLiabilities: Array<ChartDataItem> = [];
    const totalFullTimeEquivalentStaff: Array<ChartDataItem> = [];
    const totalVolunteers: Array<ChartDataItem> = [];

    for (const item of data) {
      const year = moment(
        item.financial_report_date_received,
        "YYYY-MM-DD"
      ).format("YYYY");
      governmentRevenue.unshift({
        category: year,
        value: item.revenue_from_government
      });
      donationsAndBequests.unshift({
        category: year,
        value: item.donations_and_bequests
      });
      totalGrossIncome.unshift({
        category: year,
        value: item.total_gross_income
      });

      employeeExpenses.unshift({
        category: year,
        value: item.employee_expenses
      });
      interestExpenses.unshift({
        category: year,
        value: item.interest_expenses
      });
      totalExpenses.unshift({
        category: year,
        value: item.total_expenses
      });
      netAssetsAndLiabilities.unshift({
        category: year,
        value:
          parseFloat(item.total_assets) + parseFloat(item.total_liabilities)
      });
      totalFullTimeEquivalentStaff.unshift({
        category: year,
        value: item.total_full_time_equivalent_staff
      });
      totalVolunteers.unshift({
        category: year,
        value: item.staff_volunteers
      });
    }
    commit("SET_CHARITY_HISTORICAL_DATA", {
      governmentRevenue: governmentRevenue,
      donationsAndBequests: donationsAndBequests,
      totalGrossIncome: totalGrossIncome,
      employeeExpenses: employeeExpenses,
      interestExpenses: interestExpenses,
      totalExpenses: totalExpenses,
      netAssetsAndLiabilities: netAssetsAndLiabilities,
      totalFullTimeEquivalentStaff: totalFullTimeEquivalentStaff,
      totalVolunteers: totalVolunteers
    });

    commit("SET_CHARITY_HISTORICAL_DATA_LOADING", false);
  }
};

const mutations = {
  SET_ORGANIZATIONS(state: CharitiesState, organizations: Array<string>) {
    state.organizations = organizations;
  },
  SET_STATES(state: CharitiesState, states: Array<string>) {
    state.states = states;
  },
  SET_SIZES(state: CharitiesState, sizes: Array<string>) {
    state.sizes = sizes;
  },
  SET_BENEFITS(state: CharitiesState, benefits: Array<string>) {
    state.benefits = benefits;
  },
  SET_CHARITIES_LOADING(state: CharitiesState, loading: boolean) {
    state.charitiesLoading = loading;
  },
  SET_CHARITIES(state: CharitiesState, charities: Array<Charity>) {
    state.charities = charities;
  },
  SET_CHARITY_LOADING(state: CharitiesState, loading: boolean) {
    state.charityLoading = loading;
  },
  SET_CHARITY(state: CharitiesState, charity: Charity) {
    state.charity = charity;
  },
  SET_COMPARING_CHARITIES_LOADING(state: CharitiesState, loading: boolean) {
    state.comparingCharitiesLoading = loading;
  },
  SET_COMPARING_CHARITIES(state: CharitiesState, charities: Array<Charity>) {
    state.comparingCharities = charities;
  },
  SET_CHARITIES_BY_NAME_LOADING(state: CharitiesState, loading: boolean) {
    state.charitiesByNameLoading = loading;
  },
  SET_CHARITIES_BY_NAME(state: CharitiesState, charities: Array<Charity>) {
    state.charitiesByName = charities;
  },
  SET_CHARITY_HISTORICAL_DATA_LOADING(state: CharitiesState, loading: boolean) {
    state.charityHistoricalDataLoading = loading;
  },
  SET_CHARITY_HISTORICAL_DATA(
    state: CharitiesState,
    data: CharityHistoricalData
  ) {
    state.charityHistoricalData = data;
  }
};

export default {
  name: "storeCharities",
  state,
  actions,
  mutations
};
