// import { mongooseConnect } from "@/lib/mongoose";
// import { Client } from "@/models/Client";
// import { authOptions } from "../auth/[...nextauth]";
// import { getServerSession } from "next-auth";

// export default async function handle(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   await mongooseConnect();
//   const session = await getServerSession(req, res, authOptions);

//   if (!session) return res.status(401).json({ error: "Unauthorized" });

//   const { requesterId, accept } = req.body;

//   try {
//     const currentUser = await Client.findOne({ email: session.user.email });

//     if (!currentUser.friendRequests.includes(requesterId)) {
//       return res.status(400).json({ error: "No such request." });
//     }

//     currentUser.friendRequests = currentUser.friendRequests.filter(
//       (id) => id.toString() !== requesterId
//     );

//     if (accept) {
//       currentUser.friends.push(requesterId);
//       const requester = await Client.findById(requesterId);
//       requester.friends.push(currentUser._id);
//       await requester.save();
//     }

//     await currentUser.save();

//     res.json({ success: true, message: accept ? "Friend added." : "Request declined." });
//   } catch (error) {
//     console.error("Respond request error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
