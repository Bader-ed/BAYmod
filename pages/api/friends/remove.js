// import { mongooseConnect } from "@/lib/mongoose";
// import { Client } from "@/models/Client";
// import { authOptions } from "../auth/[...nextauth]";
// import { getServerSession } from "next-auth";

// export default async function handle(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   await mongooseConnect();
//   const session = await getServerSession(req, res, authOptions);

//   if (!session) return res.status(401).json({ error: "Unauthorized" });

//   const { friendId } = req.body;

//   try {
//     const currentUser = await Client.findOne({ email: session.user.email });
//     const friend = await Client.findById(friendId);

//     currentUser.friends = currentUser.friends.filter((id) => id.toString() !== friendId);
//     friend.friends = friend.friends.filter((id) => id.toString() !== currentUser._id.toString());

//     await currentUser.save();
//     await friend.save();

//     res.json({ success: true, message: "Friend removed." });
//   } catch (error) {
//     console.error("Remove friend error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
