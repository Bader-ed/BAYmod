// '/api/ratings.js'
import { mongooseConnect } from "@/lib/mongoose";
import { Rating } from "@/models/Rating";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Product } from "@/models/Product";



export default async function handler(req, res) {
    await mongooseConnect();
    const { method } = req;
    //the user's ID is in the session,
    // and the Rating model is what holds the reference.
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const userId = session.user.id;

    // GET request to fetch all ratings for a product
    if (method === 'GET') {
        const { productId } = req.query;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        try {
            const ratings = await Rating.find({ product: productId }).sort({ createdAt: -1 });
            return res.status(200).json(ratings);
        } catch (error) {
            console.error("Error fetching ratings:", error);
            return res.status(500).json({ error: 'Failed to fetch ratings.' });
        }
    }

    // POST request to add a new rating
    if (method === 'POST') {
        const { productId, stars } = req.body;
        
        try {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found.' });
            }

            // Check if the user has already rated this product
            const existingRating = await Rating.findOne({ product: productId, user: userId });
            if (existingRating) {
                return res.status(409).json({ error: 'You have already rated this product.' });
            }

            const newRating = await Rating.create({
                product: productId,
                user: userId,
                stars,
            });
            return res.status(201).json(newRating);
        } catch (error) {
            console.error("Error creating rating:", error);
            return res.status(500).json({ error: 'Failed to create rating.' });
        }
    }

    // PUT request to update an existing rating
    if (method === 'PUT') {
        const { productId, stars } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        try {
            const updatedRating = await Rating.findOneAndUpdate(
                { product: productId, user: userId },
                { stars },
                { new: true }
            );

            if (!updatedRating) {
                return res.status(404).json({ error: 'Rating not found for this user and product.' });
            }

            return res.status(200).json(updatedRating);
        } catch (error) {
            console.error("Error updating rating:", error);
            return res.status(500).json({ error: 'Failed to update rating.' });
        }
    }
}
