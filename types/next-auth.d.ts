import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    login: string;
    role: string;
    employeeId?: string;
  }

  interface Session {
    user: User;
  }
}