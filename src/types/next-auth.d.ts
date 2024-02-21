//src/types/next-auth.d.ts

import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      uuid: string;
      email: string;
      name: string;
      role: string;
      image: string;
      accessToken: string;
      refreshToken: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      uuid: string;
      email: string;
      name: string;
      role: string;
      image: string;
    };
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECERT_KEY?: string;
      JWT_SECERT_REFRESH_KEY?: string;
      NEXT_PUBLIC_IMBB_SECERET_KEY?: string;
    }
  }
}
