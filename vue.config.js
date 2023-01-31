// vue.config.js
module.exports = {
  pluginOptions: {
    apollo: {
      lintGQL: false
    }
  },
  devServer: {
    https: true,
    proxy: {
      "^/v1/graphql": {
        target: process.env.VUE_APP_GRAPHQL_ENDPOINT
      }
    }
  }
};
