// '/page/categories.js'
import styled from 'styled-components';
import Link from 'next/link';
import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';


// --- PLACEHOLDER STYLED COMPONENTS ---
const CategoriesContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: inherit;
`;

const HeaderTitle = styled.h1`
    text-align: center;
    font-size: 3rem;
    color: #212529;
    margin-bottom: 2rem;
    margin-top: .5rem;
`;

const CategoryList = styled.ul`
    list-style: none;
    padding: 0;
    margin-top: 15px;
`;

const CategoryItem = styled.li`
    margin-bottom: 1rem;
`;

const CategoryLink = styled(Link)`
    display: block;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    text-decoration: none;
    color: #343a40;
    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        background-color: #e9ecef;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const CategoryName = styled.h2`
    font-size: 1.5rem;
    margin: 0;
    text-transform: capitalize;
`;

const EmptyState = styled.p`
    font-size: 1.2rem;
    color: #6c757d;
    text-align: center;
    padding: 2rem;
`;
// ------------------------------------

// Recursive component to display nested categories
function CategoryNode({ category }) {
    const hasChildren = category.children && category.children.length > 0;
    return (
    <>
        <CategoryItem>
            <CategoryLink href={`/category/${category._id}`}>
                <CategoryName>{category.name}</CategoryName>
            </CategoryLink>
            {hasChildren && (
            <CategoryList>
                {category.children.map(child => (
                    <CategoryNode key={child._id} category={child} />
                ))}
            </CategoryList>
            )}
        </CategoryItem>
    </>
    );
}

export default function CategoriesPage({ categories }) {
    if (!categories || categories.length === 0) {
        return <EmptyState>No categories found.</EmptyState>;
    }

    return (
        <>
            
                <CategoriesContainer>
                    <HeaderTitle>Shop by Category</HeaderTitle>
                    <CategoryList>
                        {categories.map(category => (
                            <CategoryNode key={category._id} category={category} />
                        ))}
                    </CategoryList>
                </CategoriesContainer>
        </>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    try {
    const categories = await Category.find().lean();

    // Build a nested structure from the flat list
    const categoryMap = {};
    categories.forEach(cat => {
        categoryMap[cat._id] = { ...cat, children: [] };
    });

    const nestedCategories = [];
    categories.forEach(cat => {
        if (cat.parent) {
            if (categoryMap[cat.parent]) {
                categoryMap[cat.parent].children.push(categoryMap[cat._id]);
            }
        } else {
            nestedCategories.push(categoryMap[cat._id]);
        }
    });

    return {
        props: {
            categories: JSON.parse(JSON.stringify(nestedCategories)),
        },
    };
    } catch (error) {
        console.error('Error fetching categories:', error);
    return {
        props: {
            categories: [],
        },
    };
    }
}
