// // Fill up mock data

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   const user = await prisma.user.create({
//     data: {
//       name: "Yash Singh",
//       email: "saiansh2525@gmail.com",
//       password: "123456",
//       links: [],
//     },
//   });
//   const newLink = await prisma.link.create({
//     data: {
//       description: "Prisma's landing page",
//       url: "https://www.prisma.io/",
//       postedBy: user,
//     },
//   });
//   const allLinks = await prisma.link.findMany();
//   console.log(allLinks);
// }

// main()
//   .catch((e) => {
//     throw e;
//   })
//   // 5
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
