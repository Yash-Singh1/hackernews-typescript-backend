import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { schema } from "./schema";
import { context } from "./context";

export const server = new ApolloServer({
  schema,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  context,
});

const port = process.env.PORT || 3000;
server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
