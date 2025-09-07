// api/notifications.js
import { mongooseConnect } from "@/lib/mongoose";
import { Notification } from "@/models/Notification";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handle(req, res) {
    await mongooseConnect();
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = session.user.id;
    
    switch (req.method) {
        case 'GET':
            // Handle fetching all notifications or just the unread count
            if (req.query.count === 'true') {
                const count = await Notification.countDocuments({
                    recipient: userId,
                    isRead: false,
                });
                return res.status(200).json({ count });
            } else {
                const notifications = await Notification.find({ recipient: userId })
                    .populate("sender", "name")
                    .populate("product", "title")
                    .sort({ createdAt: -1 });
                return res.status(200).json(notifications);
            }

        case 'PUT':
            // Handle marking notifications as read, including "mark all"
            if (req.body.markAll) {
                await Notification.updateMany(
                    { recipient: userId, isRead: false },
                    { $set: { isRead: true } }
                );
                return res.status(200).json({ message: "All notifications marked as read." });
            } else {
                const { id } = req.body;
                await Notification.findByIdAndUpdate(id, { isRead: true });
                return res.status(200).json({ message: "Notification marked as read." });
            }

        case 'DELETE':
            // Handle deleting a notification
            const { id } = req.body;
            await Notification.deleteOne({ _id: id, recipient: userId });
            return res.status(200).json({ message: "Notification deleted." });
        
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}