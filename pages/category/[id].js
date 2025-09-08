// '/page/category/[id].js'
import styled from 'styled-components';
import Link from 'next/link';
import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';




const CategoriesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: inherit;
`;

const CategoryTitle = styled.h1`
  text-align: center;
  font-size: 3rem;
  color: #212529;
  margin-bottom: 2rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled(Link)`
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit; 

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
    
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    max-width: 100%;
    max-height: 150px;
    
`;

const ProductName = styled.h3`
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  font-size: 1.25rem;
  color: #495057;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const EmptyState = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  text-align: center;
  padding: 2rem;
`;


export default function CategoryProductsPage({ category, products }) {

  if (!category) {
    return <EmptyState>Category not found.</EmptyState>;
  }

  return (
    
    <>
    
        <CategoriesContainer>
            <CategoryTitle>{category.name}</CategoryTitle>
            {products.length > 0 ? (
                <ProductGrid>
                    {products.map(product => (
                        <ProductCard key={product._id} href={`/product/${product._id}`}>
                            <ProductImage src={product.images?.[0] || 'https://placehold.co/600x400/CCCCCC/333333?text=No+Image'} alt={product.title} />
                            <ProductName>{product.title}</ProductName>
                            <ProductPrice>${product.price}</ProductPrice>
                            
                        </ProductCard>
                ))}
                </ProductGrid>
            ) : (
            <EmptyState>No products found in this category.</EmptyState>
            )}
        </CategoriesContainer>
    </>
    );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;

  try {
    const mainCategory = await Category.findById(id).lean();

    if (!mainCategory) {
      return {
        props: {
          category: null,
          products: [],
        },
      };
    }

    const findChildCategories = async (parentId) => {
      const children = await Category.find({ parent: parentId }).lean();
      if (children.length === 0) {
        return [];
      }
      const grandChildren = await Promise.all(
        children.map(child => findChildCategories(child._id))
      );
      return children.concat(...grandChildren);
    };

    const allDescendantCategories = await findChildCategories(id);
    const categoryIds = [mainCategory._id, ...allDescendantCategories.map(cat => cat._id)];

    const products = await Product.find({ category: { $in: categoryIds } }).lean();

    return {
      props: {
        category: JSON.parse(JSON.stringify(mainCategory)),
        products: JSON.parse(JSON.stringify(products)),
      },
    };
  } catch (error) {
    console.error('getServerSideProps error:', error);
    return {
      props: {
        category: null,
        products: [],
      },
    };
  }
}
