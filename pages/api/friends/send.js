// import { mongooseConnect } from "@/lib/mongoose";
// import { Client } from "@/models/Client";
// import { authOptions } from "../auth/[...nextauth]";
// import { getServerSession } from "next-auth";

// export default async function handle(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   await mongooseConnect();
//   const session = await getServerSession(req, res, authOptions);

//   if (!session) return res.status(401).json({ error: "Unauthorized" });

//   const { email } = req.body;

//   try {
//     const currentUser = await Client.findOne({ email: session.user.email });
//     const targetUser = await Client.findOne({ email });

//     if (!targetUser) {
//       return res.status(404).json({ error: "No user found with this email." });
//     }

//     if (currentUser.friends.includes(targetUser._id)) {
//       return res.status(400).json({ error: "Already friends." });
//     }

//     if (targetUser.friendRequests.includes(currentUser._id)) {
//       return res.status(400).json({ error: "Request already sent." });
//     }

//     targetUser.friendRequests.push(currentUser._id);
//     await targetUser.save();

//     res.json({ success: true, message: "Friend request sent." });
//   } catch (error) {
//     console.error("Send request error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
