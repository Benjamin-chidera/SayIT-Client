import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { createPool } from "mysql2/promise";

export const auth = betterAuth({
  //...your config
  database: createPool({
    host: process.env.DB_HOST as string,
    port: 3306,
    waitForConnections: true,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
