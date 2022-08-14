import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { createServer } from 'node:http';
import { schema } from './schema';
import { context } from './context';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  path: '/',
  server: httpServer,
});

const serverCleanup = useServer(
  {
    schema,
    context: (ctx, msg, args) => {
      return context({ req: { headers: ctx.connectionParams || {} } });
    },
  },
  wsServer
);

export const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
  context,
});

async function start() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/' });

  const port = process.env.PORT || 3000;
  httpServer.listen({ port }, () => {
    console.log(`🚀  Server ready at localhost:${port}`);
  });
}

start();
