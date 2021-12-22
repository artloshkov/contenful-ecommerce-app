import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";

// Contentful GraphQL server
// const httpLink = createHttpLink({ uri: "https://graphql.contentful.com/content/v1/spaces/ycfear1kzkii/environments/master" });

// Local Apollo Server
const httpLink = createHttpLink({ uri: "http://localhost:5005/graphql" });

// const authLink = setContext((_, { headers }) => {
//   return {
//     headers: {
//       ...headers,
//       'Content-Type': 'application/json',
//       authorization: `Bearer zicmgapEVf-4ys26dV6hvqiQo2NNEu4uheqggKCZ7ic`,
//     }
//   }
// });

const apolloClientConfig = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: httpLink,
  cache: new InMemoryCache()
});

export default apolloClientConfig;
