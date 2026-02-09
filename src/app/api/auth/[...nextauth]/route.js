import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

// ✅ Export authOptions ONLY ONCE
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        // 1️⃣ Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // 2️⃣ Find user
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        // 🚫 3️⃣ Block disabled users
        if (user.isActive === false) {
          throw new Error("User account is disabled");
        }

        // 4️⃣ Validate password
        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!validPassword) {
          throw new Error("Invalid password");
        }

        // 5️⃣ Return safe user object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

// ✅ Create NextAuth handler
const handler = NextAuth(authOptions);

// ✅ App Router named exports
export { handler as GET, handler as POST };
