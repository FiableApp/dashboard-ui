import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    user?: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
  }
}
