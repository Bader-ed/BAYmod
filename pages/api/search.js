// '/api/search.js'
import { Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handle(req, res) {
  // Ensure the database connection is established
  await mongooseConnect();

  const { q } = req.query;

  if (!q) {
    return res.json([]);
  }

  try {
    const products = await Product.find({
      $or: [
        { title: { $regex: new RegExp(q, "i") } },
        { description: { $regex: new RegExp(q, "i") } },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
