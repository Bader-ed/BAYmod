import { mongooseConnect } from "@/lib/mongoose";
import { ChatMessage } from "@/models/ChatMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Client } from "@/models/Client";
import { Notification } from "@/models/Notification";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    await mongooseConnect();
    const { method } = req;
    const session = await getServerSession(req, res, authOptions);

    if (method === "GET") {
        const { productId } = req.query;
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        try {
            const messages = await ChatMessage.find({ product: productId })
                .populate("user", "name image")
                .populate("mentionedUsers", "name")
                .sort({ createdAt: 1 });
            return res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            return res.status(500).json({ error: "Failed to fetch messages." });
        }
    }

    if (method === "POST") {
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { productId, message, userId } = req.body;
        if (!productId || !message || !userId) {
            return res.status(400).json({ error: "Product ID, message, and user ID are required." });
        }

        try {
            // find the current user and populate their friends
            const currentUser = await Client.findOne({ email: session.user.email }).populate('friends');
            if (!currentUser) {
                return res.status(404).json({ error: "User not found." });
            }

            const newChatMessage = new ChatMessage({
                product: productId,
                user: currentUser._id,
                message,
                mentionedUsers: [],
            });

            const lowerCaseMessage = message.toLowerCase();
            let mentionedIds = new Set();
            
            // iterate through the current user's friends to find mentions
            for (const friend of currentUser.friends) {
                const mentionString = `@${friend.name.toLowerCase()}`;
                if (lowerCaseMessage.includes(mentionString)) {
                    // friend is mentioned
                    if (friend._id.toString() !== userId) {
                        if (!mentionedIds.has(friend._id.toString())) {
                            await Notification.create({
                                recipient: friend._id,
                                sender: currentUser._id,
                                type: 'mention',
                                relatedId: newChatMessage._id,
                                product: productId,
                            });
                            newChatMessage.mentionedUsers.push(friend._id);
                            mentionedIds.add(friend._id.toString());
                        }
                    } else {
                        console.log(`Self-mention detected for user: ${friend.name}. Notification skipped.`);
                    }
                }
            }
            
            await newChatMessage.save();
            return res.status(201).json(newChatMessage);

        } catch (error) {
            console.error("Error creating chat message:", error);
            return res.status(500).json({ error: "Failed to create message." });
        }
    }
}
