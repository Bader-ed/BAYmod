// '/api/friends.js'
import { mongooseConnect } from "@/lib/mongoose";
import { Client } from "@/models/Client";
import { Notification } from "@/models/Notification"; // Import the Notification model
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
        if (!friendId) {
          return res.status(400).json({ error: "Friend ID is required." });
        }
        
        // Remove friend from both users' friend lists
        await Client.updateOne(
          { _id: currentUser._id },
          { $pull: { friends: friendId } }
        );
        await Client.updateOne(
          { _id: friendId },
          { $pull: { friends: currentUser._id } }
        );
        
        return res.json({ success: true, message: "Friend removed." });

      // Handles fetching incoming friend requests
      case 'getRequests':
        const userWithRequests = await Client.findById(currentUser._id).populate("friendRequests");
        return res.json({ incoming: userWithRequests.friendRequests || [] });

      // Handles responding to a friend request (accept or decline)
      case 'respondToRequest':
        if (req.method !== "POST") return res.status(405).end();
        const { requesterId, accept } = data;
        
        // Remove the request from the current user's friendRequests array
        await Client.updateOne(
          { _id: currentUser._id },
          { $pull: { friendRequests: requesterId } }
        );
        
        if (accept) {
          // If accepting, add each other to their friends list
          await Client.updateOne(
            { _id: currentUser._id },
            { $addToSet: { friends: requesterId } }
          );
          await Client.updateOne(
            { _id: requesterId },
            { $addToSet: { friends: currentUser._id } }
          );
        }
        
        return res.json({ success: true });

      // Handles searching for a user
      case 'searchUser':
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
        
        // Check if already friends or if a request is pending
        const isAlreadyFriend = currentUser.friends.includes(user._id);
        const isRequestPending = user.friendRequests.includes(currentUser._id);
        
        return res.json({ ...user.toObject(), isAlreadyFriend, isRequestPending });

      // Handles sending a friend request
      case 'sendRequest':
        if (req.method !== "POST") return res.status(405).end();
        const { targetEmail } = data;
        
        const targetUser = await Client.findOne({ email: targetEmail });
        if (!targetUser) {
          return res.status(404).json({ error: "No user found with this email." });
        }
        
        // Check if already friends
        if (currentUser.friends.includes(targetUser._id)) {
          return res.status(400).json({ error: "Already friends." });
        }
        
        // Check if a request has already been sent
        if (targetUser.friendRequests.includes(currentUser._id)) {
          return res.status(400).json({ error: "Request already sent." });
        }
        
        targetUser.friendRequests.push(currentUser._id);
        await targetUser.save();
        
        // --- NEW CODE: CREATE A NOTIFICATION DOCUMENT ---
        await Notification.create({
          recipient: targetUser._id,
          sender: currentUser._id,
          type: 'friendRequest',
          relatedId: currentUser._id,
        });
        
        return res.json({ success: true, message: "Friend request sent." });

      default:
        return res.status(404).end();
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
