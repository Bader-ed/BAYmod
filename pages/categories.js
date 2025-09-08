// '/page/categories.js'
import styled from 'styled-components';
import Link from 'next/link';
import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';



const CategoriesContainer = styled.div`
    max-width: 500px;
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
    margin: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
`;

const CategoryItem = styled.li`
    
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
    text-align: center;
    height: 40px;
    padding-bottom: 16px;

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


export default function CategoriesPage({ categories }) {
    if (!categories || categories.length === 0) {
        return <EmptyState>No categories found.</EmptyState>;
    }

    return (
        <CategoriesContainer>
            <HeaderTitle>Shop by Category</HeaderTitle>
            <CategoryList>
                {categories.map(category => (
                    <CategoryItem key={category._id}>
                        <CategoryLink href={`/category/${category._id}`}>
                            <CategoryName>{category.name}</CategoryName>
                        </CategoryLink>
                    </CategoryItem>
                ))}
            </CategoryList>
        </CategoriesContainer>
    );
}

export async function getServerSideProps() {
    await mongooseConnect();
    try {
        // Fetch all categories without building a nested structure
        const categories = await Category.find({}, null, { sort: { _id: 1 } }).lean();

        return {
            props: {
                categories: JSON.parse(JSON.stringify(categories)),
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