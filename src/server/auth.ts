import { getServerSession, type NextAuthOptions } from "next-auth";
import { cookies } from 'next/headers';
import Credentials from "node_modules/next-auth/providers/credentials";
import { userService } from "./services/userService";
// import * as jose from "jose";
// import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt", //(1) the default is jwt when no adapter defined, we redefined here to make it obvious what strategy that we use
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET, // Required to fixed the JWEDecryptionFailed error, while session expired.
  jwt: {
    // encode: async ({ secret, token }: any) => {
    //   // console.log("encode secret : ====================== ", secret);
    //   // console.log("encode Token : ====================== ", token);
    //   return jwt.sign(token, secret);
    // },
    // decode: async ({ secret, token }: jwt.JwtPayload): Promise<any> => {
    //   return await jwt.verify(token, secret)
    // },
  },
  callbacks: {
    // (1) Use the signIn() callback to control if a user is allowed to sign in.
    async signIn({ user, account, profile, email, credentials }: any) {
      if (user.accessToken) {
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token, user, account, profile }) {
      //(2)
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token, user }) {
      //(3)
      session.user = { ...token } as any;
      // console.log("3 callback session ============== ", session);
      return session;
    },
  },
  events: {
    signIn({ user }: { user: any }) {
      cookies().set({
        name: 'authToken',
        value: user.accessToken,
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 1, // 1 day
      })
    },
    signOut({ token, session }) {
      cookies().set({
        name: 'authToken',
        value: '',
        httpOnly: true,
        path: '/',
        maxAge: 0
      })
    },
  },
  pages: {
    signIn: "/", // (4) custom signin page path
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req) {
        return userService.authenticate(credentials); //(5)
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions); //(6)
