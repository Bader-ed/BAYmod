// import { mongooseConnect } from "@/lib/mongoose";
// import { Client } from "@/models/Client";
// import { authOptions } from "../auth/[...nextauth]";
// import { getServerSession } from "next-auth";

// export default async function handle(req, res) {
//   await mongooseConnect();
//   const session = await getServerSession(req, res, authOptions);

//   if (!session) return res.status(401).json({ error: "Unauthorized" });

//   try {
//     const user = await Client.findOne({ email: session.user.email })
//       .populate("friendRequests", "name email image");

//     res.json({
//       incoming: user.friendRequests,
//     });
//   } catch (error) {
//     console.error("Get requests error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
