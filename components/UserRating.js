// components/UserRating.js
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "./Button";
import axios from "axios";
import StarIcon from "./icons/StarIcon";

const RatingsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    @media (max-width: 768px) {
        margin-top: 0;
    }
`;

const RatingStars = styled.div`
    display: flex;
    justify-content: center;
    span {
        cursor: pointer;
        color: #ffc107;
        width: 24px;
        height: 24px;
        transition: transform 0.2s ease-in-out;
        &:hover {
            transform: scale(1.1);
        }
    }
`;

const RatingMessage = styled.p`
    font-size: 1.1rem;
    font-weight: 600;
    /* padding-top: 5px; */
    color: #555;
    @media (max-width: 768px) {
        max-height: 5px;
    }
    
`;

const RatingForm = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    gap: 10px;
    margin-bottom: 5px;
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 5px;
    }
`;



export default function UserRating({ productId }) {
    const { data: session } = useSession();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (session && productId) {
            fetchUserRating();
        }
    }, [productId, session]);

    async function fetchUserRating() {
        try {
            const { data: allRatings } = await axios.get(`/api/ratings?productId=${productId}`);
            const currentUserRating = allRatings.find(r => r.user === session.user.id);
            
            if (currentUserRating) {
                setUserRating(currentUserRating);
                setRating(currentUserRating.stars);
            }
        } catch (error) {
            console.error("Failed to fetch user rating:", error);
        }
    }

    async function handleRatingSubmit() {
        if (!rating || !session?.user?.id) {
            console.error("Rating or session data is missing.");
            return;
        }

        try {
            if (userRating) {
                // Update existing rating with PUT
                await axios.put('/api/ratings', { productId, stars: rating });
            } else {
                // Create new rating with POST
                await axios.post('/api/ratings', { productId, stars: rating });
            }
            await fetchUserRating(); // Fetch updated rating
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to submit rating:", error);
        }
    }

    const renderStars = (currentRating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span 
                    key={i}
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                >
                    <StarIcon filled={(hoverRating >= i || currentRating >= i)}/>
                </span>
            );
        }
        return stars;
    };

    return (
        <RatingsWrapper>
            {session ? (
                <>
                    {userRating && !isEditing ? (
                        <RatingForm>
                            <RatingMessage>You rated this product</RatingMessage>
                            <RatingStars>
                                {renderStars(userRating.stars)}
                            </RatingStars>
                            <Button primary onClick={() => setIsEditing(true)}>
                                Edit Review
                            </Button>
                        </RatingForm>
                    ) : (
                        <RatingForm>
                            <RatingMessage>Rate this product</RatingMessage>
                            <RatingStars>
                                {renderStars(rating)}
                            </RatingStars>
                            <Button
                                primary
                                disabled={!rating}
                                onClick={handleRatingSubmit}
                            >
                                Submit
                            </Button>
                        </RatingForm>
                    )}
                </>
            ) : (
                <RatingMessage>Please log in to rate this product.</RatingMessage>
            )}
        </RatingsWrapper>
    );
}
