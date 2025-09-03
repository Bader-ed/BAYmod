import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { mongooseConnect } from "@/lib/mongoose";
import mongoose from 'mongoose';
import { Client } from "@/models/Client"; // Import your custom Client model
import { User } from '@/models/User'; // NextAuth's default User model

// Ensure the Google client ID and secret are available
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are not set.');
}

export default NextAuth({
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
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if a client with this email already exists in your custom collection
      const existingClient = await Client.findOne({ email: user.email });

      if (!existingClient) {
        // If not, create a new client document in your custom collection
        try {
          await Client.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
          console.log(`New client created for email: ${user.email}`);
        } catch (error) {
          console.error("Failed to create new client:", error);
          return false; // Prevent sign-in on error
        }
      }

      // Return true to allow the sign-in process to complete.
      return true;
    },
  },
});
