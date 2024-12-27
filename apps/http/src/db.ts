import prisma from "@repo/db";
if (!prisma) {
  console.error("Prisma not connected");
  process.exit(1);
}
export default prisma;
