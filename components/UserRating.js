// components/UserRating.js
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "./Button";
import StarIcon from "./icons/StarIcon";
import api from "@/lib/axios";

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
    const [userRating, setUserRating] = useState(null);
    const [rating, setRating] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // this useEffect hook is important to fetch the user's existing rating
    // when the component loads or the user session changes.
    useEffect(() => {
        if (!session || !productId) {
            return;
        }
        
        // fetch the user's existing rating
        fetchUserRating();
    }, [session, productId]);

    // function to fetch the existing rating for the current user and product
    async function fetchUserRating() {
        try {
            const res = await api.get(`/api/ratings?productId=${productId}`);
            const myRating = res.data.find(r => r.user === session.user.id);
            if (myRating) {
                setUserRating(myRating);
                setRating(myRating.stars);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error fetching user rating:", error);
        }
    }

    // this function handles the submission of the rating.
    async function handleRatingSubmit() {
        if (!rating) {
            setMessage('Please select a star rating.');
            return;
        }
        if (!productId) {
            setMessage('Product ID is missing.');
            return;
        }
        
        // the endpoint URL remains the same
        const url = '/api/ratings';
        const data = { productId, stars: rating };

        setIsLoading(true);
        setMessage('');

        try {
            // check if the user has already rated the product
            if (userRating) {
                // if a rating exists, use a PUT request to update it
                await api.put(url, data);
                setMessage('Rating updated successfully!');
            } else {
                // otherwise, use a POST request to create a new rating
                await api.post(url, data);
                setMessage('Rating submitted successfully!');
            }
            // after successful submission, refetch the rating to update the UI
            await fetchUserRating();
        } catch (error) {
            console.error("Error submitting rating:", error.response?.data?.error || error.message);
            // display the specific error message from the backend, or a generic one if not available.
            setMessage('Error: ' + (error.response?.data?.error || 'Failed to submit rating.'));
        } finally {
            setIsLoading(false);
        }
    }

    // this function handles the click event on a star.
    const handleStarClick = (starIndex) => {
        setRating(starIndex);
        setMessage('');
    };

    // helper function to render the star icons based on the current rating value
    const renderStars = (starCount) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} onClick={() => handleStarClick(i)}>
                    <StarIcon filled={i <= starCount} />
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
