"use server";
import prisma from "@/db";
import { z } from "zod";

const ZSignupInput = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

type TSignupInput = z.infer<typeof ZSignupInput>;

export const createUser = async (data: TSignupInput) => {
  const validatedData = ZSignupInput.parse(data);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: validatedData.email,
    },
  });

  if (existingUser) {
    console.log(existingUser);
    throw new Error("User already exists");
  }

  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      name: validatedData.name,
      password: validatedData.password,
    },
  });

  return user;
};
