"use server";

import { prisma } from "@/prisma";
import { saltAndHashPassword } from "@/lib/password-utils";

type ParametersType = {
  email: string;
  password: string;
};

export const signUp = async ({ email, password }: ParametersType) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { message: "이미 존재하는 이메일 입니다." };
    }

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword: saltAndHashPassword(password),
      },
    });

    if (user) {
      return { status: "ok" };
    }
  } catch (error) {
    return { message: "회원가입에 실패했습니다." };
  }
};
