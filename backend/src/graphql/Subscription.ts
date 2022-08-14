import { extendType } from 'nexus';
import { NexusGenFieldTypes } from '../../nexus-typegen';

type Event<T> = {
  data: T;
};

export const LinkSubscription = extendType({
  type: 'Subscription',
  definition(t) {
    t.field('newLink', {
      type: 'Link',
      subscribe(root, args, ctx, info) {
        return ctx.pubsub.asyncIterator('NEW_LINK');
      },
      async resolve(eventPromise: Promise<Event<NexusGenFieldTypes['Link']>>) {
        const event = await eventPromise;
        return event.data;
      },
    });

    t.field('newVote', {
      type: 'Vote',
      subscribe(root, args, ctx, info) {
        return ctx.pubsub.asyncIterator('NEW_VOTE');
      },
      async resolve(eventPromise: Promise<Event<NexusGenFieldTypes['Vote']>>) {
        const event = await eventPromise;
        return event.data;
      },
    });

    t.field('unvote', {
      type: 'Vote',
      subscribe(root, args, ctx, info) {
        return ctx.pubsub.asyncIterator('UNVOTE');
      },
      async resolve(eventPromise: Promise<Event<NexusGenFieldTypes['Vote']>>) {
        const event = await eventPromise;
        return event.data;
      },
    });
  },
});
