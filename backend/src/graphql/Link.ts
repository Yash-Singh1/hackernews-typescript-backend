import type { Link as LinkType, Prisma } from "@prisma/client";
import {
  extendType,
  nonNull,
  objectType,
  stringArg,
  intArg,
  enumType,
  inputObjectType,
  arg,
  list,
} from "nexus";

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});

export const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition(t) {
    t.field("description", { type: Sort });
    t.field("url", { type: Sort });
    t.field("createdAt", { type: Sort });
  },
});

export const Link = objectType({
  name: "Link",
  definition(type) {
    type.nonNull.int("id");
    type.nonNull.string("description");
    type.nonNull.string("url");
    type.nonNull.dateTime("createdAt");
    type.field("postedBy", {
      type: "User",
      resolve(parent, args, context, info) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
    type.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, context, info) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters();
      },
    });
  },
});

// let links: NexusGenObjects['Link'][] = [
//   {
//     id: 1,
//     url: 'www.howtographql.com',
//     description: 'Fullstack tutorial for GraphQL',
//   },
//   {
//     id: 2,
//     url: 'graphql.org',
//     description: 'GraphQL official website',
//   },
// ];

export const LinkQuery = extendType({
  type: "Query",
  definition(type) {
    type.nonNull.field("feed", {
      type: "Feed",
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }),
      },
      async resolve(parent, args, context, info) {
        // return links;
        const where = args.filter
          ? {
              OR: [
                { description: { contains: args.filter } },
                { url: { contains: args.filter } },
              ],
            }
          : {};

        const links = await context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
            | undefined,
        });

        const count = await context.prisma.link.count({ where });
        const id = `main-feed:${JSON.stringify(args)}`;

        return {
          id,
          links,
          count,
        };
      },
    });

    type.nonNull.field("link", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      async resolve(parent, args, context, info) {
        // return links.find((link) => link.id === args.id)!;
        return (await context.prisma.link.findUnique({
          where: {
            id: args.id,
          },
        }))!;
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(type) {
    type.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        // const { description, url } = args;
        // let idCount = links.length + 1;
        // const link = {
        //   id: idCount,
        //   description,
        //   url,
        // };
        // links.push(link);
        // return link;

        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot post without logging in.");
        }

        const newLink = context.prisma.link.create({
          data: {
            description: args.description,
            url: args.url,
            postedBy: {
              connect: {
                id: userId,
              },
            },
          },
        });

        return newLink;
      },
    });

    type.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
        description: stringArg(),
        url: stringArg(),
      },
      resolve(parent, args, context) {
        // const { id } = args;
        // const link = links.find((link) => link.id === id)!;
        // if (args.description) {
        //   link.description = args.description;
        // }
        // if (args.url) {
        //   link.url = args.url;
        // }
        // links[args.id - 1] = link;
        // return link;

        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot update post without logging in.");
        }

        const newLinkData: Partial<LinkType> = {};
        if (args.description) {
          newLinkData.description = args.description;
        }
        if (args.url) {
          newLinkData.url = args.url;
        }
        const newLink = context.prisma.link.update({
          where: {
            id: args.id,
          },
          data: newLinkData,
        });
        return newLink;
      },
    });

    type.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context) {
        // const { id } = args;
        // const link = links.find((link) => link.id === id)!;
        // links = links.filter((link) => link.id !== id);
        // return link;

        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot delete post without logging in.");
        }

        const deletedLink = context.prisma.link.delete({
          where: {
            id: args.id,
          },
        });
        return deletedLink;
      },
    });
  },
});

export const Feed = objectType({
  name: "Feed",
  definition(t) {
    t.nonNull.list.nonNull.field("links", { type: Link });
    t.nonNull.int("count");
    t.id("id");
  },
});
