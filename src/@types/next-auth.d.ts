import NextAuth from "next-auth";

declare module "next-auth" {
  export interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
    folder_id: string;
    sheet_id: string;
  }

  interface Session {
    user: User;
  }

  interface Session {
    error?: "RefreshAccessTokenError";
  }
}
