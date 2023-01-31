import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = createHttpLink({
  uri: "/v1/graphql",
  // uri: process.env.VUE_APP_GRAPHQL_ENDPOINT,
  fetch: (input: RequestInfo, init: RequestInit) => {
    // if (process.env.NODE_ENV !== "production") {
    //   const body = JSON.parse(init.body + "");
    //   console.debug(
    //     `📡${body.operationName || ""}\n${body.query}`,
    //     body.variables
    //   );
    // }
    return fetch(input, init);
  }
});

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers
    }
  };
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
