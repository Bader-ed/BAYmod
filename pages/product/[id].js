// '/page/product/[id].js'
import Center from "@/components/Center";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import { useContext, useEffect } from "react";
import { CartContext } from "@/components/CartContext";
import ProductRatings from "@/components/ProductRatings";
import ProductCommunity from "@/components/ProductCommunity";


const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
        grid-template-columns: .8fr 1.2fr;
    }
    gap: 40px;
    margin: 40px 0;
`;
const PriceRow = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;
const Price = styled.span`
    font-size: 1.4rem;
`;
const RatingWrapper = styled.div`
    margin-bottom: 20px;
`;

export default function ProductPage({ product }) {
    const { addProduct } = useContext(CartContext);

    return (
        <>
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images} />
                    </WhiteBox>
                    <div>
                        <Title>{product.title}</Title>
                        <p>{product.description}</p>
                        <PriceRow>
                            <div>
                                <Price>
                                    ${product.price}
                                </Price>
                            </div>
                            <div>
                                <Button primary onClick={() => addProduct(product._id)}>
                                    <CartIcon />Add to cart
                                </Button>
                            </div>
                        </PriceRow>
                        <RatingWrapper>
                            <ProductRatings productId={product._id} />
                        </RatingWrapper>
                    </div>
                </ColWrapper>
                <ProductCommunity productId={product._id} />
            </Center>
        </>
    );
}

export async function getServerSideProps(context) {
    await mongooseConnect();
    const { id } = context.query;
    const product = await Product.findById(id);
    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
        }
    };
}
