import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/prisma";

import { comparePassword } from "./lib/password-utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // 쿠키 이름을 보안에 유리하게 만들지 여부
  useSecureCookies: process.env.NODE_ENV === "production",

  // 작성하는 Next.js 호스트를 신뢰하는지 여부
  trustHost: true,

  secret: process.env.AUTH_SECRET,

  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // 이름
      name: "credentials",

      // 입력받을 데이터 설정
      credentials: {
        email: {
          label: "이메일",
          type: "email",
          placeholder: "이메일 입력",
        },
        password: {
          label: "비밀번호",
          type: "password",
        },
      },

      //credentials 입력을 받았을 때 인증처리 어떻게 할지
      async authorize(credentials) {
        // 확인사항
        // 1. 모든 값이 정상적으로 들어왔는지 체크
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        // 2. DB에서 유저를 찾기
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw new Error("존재하지 않는 이메일입니다.");
        }

        // 3. 비밀번호 일치 여부 확인
        const passwordMatch = comparePassword(
          credentials.password as string,
          user.hashedPassword
        );

        if (!passwordMatch) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        // 유저 정보 반환
        return user;
      },
    }),
  ],

  // 인증방식 설정
  session: {
    strategy: "jwt",
  },
});
