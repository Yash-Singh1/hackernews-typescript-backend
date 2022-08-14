import { PrismaClient } from '@prisma/client';
import { decodeAuthHeader, AuthTokenPayload } from './utils/auth';
import { Request } from 'express';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: number;
  pubsub: PubSub;
}

export const context = ({
  req,
}: {
  req?: { headers: { authorization?: string } };
}): Context => {
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null;

  return {
    prisma,
    userId: token?.userId,
    pubsub,
  };
};
