// '/api/auth/[...nextauth].js'
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { mongooseConnect } from "@/lib/mongoose";
import mongoose from 'mongoose';
import { Client } from "@/models/Client";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  adapter: MongoDBAdapter(
    (async () => {
      await mongooseConnect();
      return mongoose.connection.getClient();
    })()
  ),
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.client-session-token`,   // 👈 unique cookie name for client
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async signIn({ user }) {
      const existingClient = await Client.findOne({ email: user.email });
      if (!existingClient) {
        await Client.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }
      return true;
    },
    async session({ session, token, user }) {
      const client = await Client.findOne({ email: session.user.email });
      if (client) {
        session.user.id = client._id.toString();
      }
      return session;
  }
},
};

export default NextAuth(authOptions);
