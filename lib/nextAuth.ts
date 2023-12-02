import { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { randomBytes, randomUUID } from "crypto";

type UserType = {
  id: string;
  email: string;
  name: string;
  authentication: string;
};

type SignInType = {
  id: string;
  email: string;
  name: string;
  authentication: string;
};

type TokenType = {
  name: string;
  email: string;
  sub: string;
  authentication: string;
  iat: number;
  exp: number;
  jti: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "GOOGLE_ID",
      clientSecret: process.env.GOOGLE_SECRET ?? "GOOGLE_SECRET",
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const formData = new FormData();
        formData.set("email", credentials?.username ?? "");
        formData.set("password", credentials?.password ?? "");
        const res = await fetch("http://localhost:3000/api/login", {
          credentials: "include",
          method: "POST",
          body: formData,
        });
        const user = await res.json();
        const sessionToken = user.authentication.sessionToken;
        user.authentication = sessionToken ?? "";
        if (res.ok) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Validate user

      // cookies().set({
      //   name: "CONNECTED2U_AUTH_TOKEN",
      //   value: (user as UserType).authentication,
      //   maxAge: 24 * 60 * 60,
      // });
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Return to Server Session
      return baseUrl;
    },
    async session({ session, user, token }) {
      // Return to Server Session
      const insertedSession = {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          sessionToken: (token as TokenType).authentication ?? "",
        },
      };
      return insertedSession;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // Return to Server Session
      // console.log(user);
      if (user && (user as UserType).authentication) {
        token.authentication = (user as UserType).authentication;
      }
      console.log(token, 123);
      return token;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/logout",
    error: "/", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};
