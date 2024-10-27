import NextAuth from "next-auth";
import { authOptions } from "./auth";

const handler = NextAuth(authOptions);

// Export handlers for GET and POST requests
export { handler as GET, handler as POST };
