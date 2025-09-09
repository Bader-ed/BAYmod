// components/ProductRatings.js
import styled from "styled-components";
import { useState, useEffect } from "react";
import StarIcon from "./icons/StarIcon";
import api from "@/lib/axios";

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
`;

const AverageRating = styled.span`
    margin-top: 7px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
`;

const TotalRatings = styled.span`
    margin-top: 7px;
    font-size: 0.9rem;
    color: #555;
`;

const StarsWrapper = styled.div`
    margin-top: 7px;
    display: flex;
    color: #ff9900;
    svg {
    width: 20px;
    height: 20px;
    }
`;

export default function ProductRatings({ productId }) {
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        fetchRatings();
    }, []);

    async function fetchRatings() {
        try {
            const { data } = await api.get(`/api/ratings?productId=${productId}`);
            setRatings(data);
        } catch (error) {
            console.error("Failed to fetch ratings:", error);
        }
    }

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 ? (ratings.reduce((sum, r) => sum + r.stars, 0) / totalRatings).toFixed(1) : 0;

    const renderStars = (rating) => {
        const starArray = [];
        for (let i = 1; i <= 5; i++) {
            starArray.push(
                <StarIcon key={i} filled={i <= Math.round(rating)} />
            );
        }
        return starArray;
    };

    return (
        <RatingContainer>
            <StarsWrapper>
                {renderStars(averageRating)}
            </StarsWrapper>
            <AverageRating>
                {averageRating}
            </AverageRating>
            <TotalRatings>
                ({totalRatings} reviews)
            </TotalRatings>
        </RatingContainer>
    );
}
