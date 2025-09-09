import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Notification } from "@/models/Notification";
import { Product } from "@/models/Product"; 

export default async function handle(req, res) {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user?.id;
  if (!userId) {
    return res.status(400).json({ error: "No userId in session" });
  }

  try {
    switch (req.method) {
      case "GET": {
        if (req.query.count === "true") {
          const count = await Notification.countDocuments({
            recipient: userId,
            isRead: false,
          });
          return res.status(200).json({ count });
        }

        const notifications = await Notification.find({ recipient: userId })
          .populate("sender", "name")
          .populate("product", "title")
          .sort({ createdAt: -1 });

        return res.status(200).json(notifications);
      }

      case "PUT": {
        if (req.body.markAll) {
          await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true } }
          );
          return res.status(200).json({ message: "All marked as read" });
        }
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: "Missing notification id" });

        await Notification.findByIdAndUpdate(id, { isRead: true });
        return res.status(200).json({ message: "Notification marked as read" });
      }

      case "DELETE": {
        // Axios sends { data: { id } } for DELETE
        const { id } = req.body || {};
        if (!id) return res.status(400).json({ error: "Missing notification id" });

        await Notification.deleteOne({ _id: id, recipient: userId });
        return res.status(200).json({ message: "Notification deleted" });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (err) {
    console.error("Notifications API error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
