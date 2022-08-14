import { extendType, objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(type) {
    type.nonNull.int('id');
    type.nonNull.string('name');
    type.nonNull.string('email');
    type.nonNull.list.nonNull.field('links', {
      type: 'Link',
      resolve(parent, args, context, info) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .links();
      },
    });
    type.nonNull.list.nonNull.field('votes', {
      type: 'Link',
      resolve(parent, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .votes();
      },
    });
  },
});

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: 'User',
      args: {},
      async resolve(parent, args, context) {
        const { userId } = context;

        if (!userId) {
          throw new Error(
            'Cannot retrieve user information without logging in.'
          );
        }

        const currentUser = await context.prisma.user.findUnique({
          where: { id: userId },
        });

        return currentUser;
      },
    });
  },
});
