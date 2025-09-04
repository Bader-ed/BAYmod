import { mongooseConnect } from "@/lib/mongoose";
import { Client } from "@/models/Client";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

/**
 * Middleware-like function to handle database connection and session validation.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<object | null>} The session object or null if unauthorized.
 */
async function requireAuth(req, res) {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return session;
}

export default async function handle(req, res) {
  // Determine the action from the request body or query parameters
  const { action, ...data } = req.method === "POST" ? req.body : req.query;

  const session = await requireAuth(req, res);
  if (!session) return; // Authentication failed, response already sent

  try {
    const currentUser = await Client.findOne({ email: session.user.email });
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found." });
    }

    switch (action) {
      // Handles fetching the current user's friends
      case 'fetchFriends':
        const userWithFriends = await Client.findById(currentUser._id).populate("friends");
        return res.json(userWithFriends.friends || []);

      // Handles removing a friend
      case 'removeFriend':
        if (req.method !== "POST") return res.status(405).end();
        const { friendId } = data;
        const friend = await Client.findById(friendId);

        currentUser.friends = currentUser.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== currentUser._id.toString());

        await currentUser.save();
        await friend.save();
        return res.json({ success: true, message: "Friend removed." });

      // Handles fetching incoming friend requests
      case 'getRequests':
        const userWithRequests = await Client.findById(currentUser._id).populate("friendRequests", "name email image");
        return res.json({ incoming: userWithRequests.friendRequests });

      // Handles responding to a friend request (accept or decline)
      case 'respondToRequest':
        if (req.method !== "POST") return res.status(405).end();
        const { requesterId, accept } = data;

        if (!currentUser.friendRequests.includes(requesterId)) {
          return res.status(400).json({ error: "No such request." });
        }

        currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== requesterId);

        if (accept) {
          currentUser.friends.push(requesterId);
          const requester = await Client.findById(requesterId);
          requester.friends.push(currentUser._id);
          await requester.save();
        }

        await currentUser.save();
        return res.json({ success: true, message: accept ? "Friend added." : "Request declined." });

      // Handles searching for a user by email
      case 'searchUser':
        if (req.method !== "GET") return res.status(405).end();
        const { email } = data;
        if (!email) {
          return res.status(400).json({ error: 'Email is required' });
        }

        const user = await Client.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: "No user found with this email." });
        }
        if (user.email === session.user.email) {
          return res.status(400).json({ error: "You cannot add yourself." });
        }
        return res.json(user);

      // Handles sending a friend request
      case 'sendRequest':
        if (req.method !== "POST") return res.status(405).end();
        const { targetEmail } = data;

        const targetUser = await Client.findOne({ email: targetEmail });
        if (!targetUser) {
          return res.status(404).json({ error: "No user found with this email." });
        }
        if (currentUser.friends.includes(targetUser._id)) {
          return res.status(400).json({ error: "Already friends." });
        }
        if (targetUser.friendRequests.includes(currentUser._id)) {
          return res.status(400).json({ error: "Request already sent." });
        }

        targetUser.friendRequests.push(currentUser._id);
        await targetUser.save();
        return res.json({ success: true, message: "Friend request sent." });

      default:
        return res.status(404).end();
    }
  } catch (error) {
    console.error(`API action "${action}" error:`, error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
