import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      jwtToken: string; // Add jwtToken to the user object
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    jwtToken: string; // Add jwtToken to the User object
  }
}
