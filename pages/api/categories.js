// '/api/categories.js'
import { mongooseConnect } from '@/lib/mongoose';
import Category from '@/models/Category';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await mongooseConnect();

  try {
    const categories = await Category.find().lean();
    
    // Fetch products for each category
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category: category._id }).lean();
        return { ...category, products };
      })
    );
    
    res.status(200).json(categoriesWithProducts);

  } catch (error) {
    console.error('Error fetching categories and products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
