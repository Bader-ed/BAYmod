// import { mongooseConnect } from "@/lib/mongoose";
// import { Client } from "@/models/Client";
// import { authOptions } from "../auth/[...nextauth]";
// import { getServerSession } from "next-auth";

// export default async function handle(req, res) {
//   await mongooseConnect();
//   const session = await getServerSession(req, res, authOptions);

//   if (!session) {
//     res.status(401).json({ error: 'Unauthorized' });
//     return;
//   }

//   const { email } = req.query;

//   if (!email) {
//     res.status(400).json({ error: 'Email is required' });
//     return;
//   }

//   try {
//     const user = await Client.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "No user found with this email." });
//     }

//     if (user.email === session.user.email) {
//       return res.status(400).json({ error: "You cannot add yourself." });
//     }

//     // FIX: Send a successful response if a user is found
//     return res.json(user);

//   } catch (error) {
//     console.error('Search user error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
