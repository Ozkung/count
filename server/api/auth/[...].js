import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";
import { baseURL } from "node:process";

const runtimeConfig = useRuntimeConfig();

// Refer to Auth.js docs for more details
// Removed incorrect destructuring; CredentialsProvider is already the function

export const authOptions = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    CredentialsProvider.default({
      credentials: {
        email: { label: "Username", type: "text", placeholder: "admin" },
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, username } = credentials;
        const find = {
          id: 1,
          email: "admin",
          username: "admin",
          password: "admin",
          salt: "salt",
          role: "admin",
        };
        if (!find) throw new Error("User not found");

        // const login = await authen.login(find, credentials);
        // const user = find;
        if (find) {
          return find;
        } else {
          return null;
        }
      },
    }),
  ],
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    async jwt({ token, user, session }) {
      // console.log('token', token)

      if (user) {
        token.user = JSON.parse(JSON.stringify(user));
        delete token.user.password;
        delete token.user.salt;
      }
      // eslint-disable-next-line no-console
      // console.log("jwt callback", { token, user, account, profile, trigger, isNewUser, session });
      return token;
    },
    async session({ session, token }) {
      // eslint-disable-next-line no-console
      // console.log("session callback", { session, token });
      session.user = token; // Cast to any to avoid type issues
      return { ...session, ...token };
    },
  },
};

export default NuxtAuthHandler(authOptions);
