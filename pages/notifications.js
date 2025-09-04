import { useEffect, useState } from "react";
import styled from "styled-components";
import Center from "@/components/Center";
import Title from "@/components/Title";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import Header from "@/components/Header";

// Styled Components for a simple layout and card
const NotificationsContainer = styled.div`
    padding: 20px 0;
`;

const NotificationList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const NotificationCard = styled.div`
    background-color: #333;
    border: 1px solid #444;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #eee;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NotificationMessage = styled.p`
    margin: 0;
    flex-grow: 1;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
`;

const StyledButton = styled.button`
    background-color: transparent;
    color: white;
    border: 1px solid #fff;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s;
    &:hover {
        background-color: #555;
    }
`;

const AcceptButton = styled(StyledButton)`
    background-color: #4CAF50;
    border-color: #4CAF50;
    &:hover {
        background-color: #45a049;
    }
`;

const DeclineButton = styled(StyledButton)`
    background-color: #f44336;
    border-color: #f44336;
    &:hover {
        background-color: #d32f2f;
    }
`;

// Main Component
export default function NotificationsPage() {
    const { data: session } = useSession();
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchNotifications();
        } else {
            setLoading(false);
        }
    }, [session]);

    async function fetchNotifications() {
        setLoading(true);
        try {
            const res = await api.get("/api/friends?action=getRequests");
            if (res.data && res.data.incoming) {
                setFriendRequests(res.data.incoming);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAccept(id) {
        try {
            await api.post("/api/friends?action=acceptRequest", { requestId: id });
            await fetchNotifications();
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    }

    async function handleDecline(id) {
        try {
            await api.post("/api/friends?action=declineRequest", { requestId: id });
            await fetchNotifications();
        } catch (error) {
            console.error("Error declining friend request:", error);
        }
    }

    if (!session) {
        return (
            <>
                <Header/>
                    <Center>
                        <NotificationsContainer>
                            <Title>Notifications</Title>
                            <p style={{ color: '#aaa', textAlign: 'center' }}>Please sign in to view your notifications.</p>
                        </NotificationsContainer>
                    </Center>
                
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Header/>
                    <Center>
                        <NotificationsContainer>
                            <Title>Notifications</Title>
                            <p style={{ color: '#aaa', textAlign: 'center' }}>Fetching notifications...</p>
                        </NotificationsContainer>
                    </Center>
                
            </>
        );
    }

    return (
        <>
            <Header/>
                <Center>
                    <NotificationsContainer>
                        <Title>Notifications</Title>
                        <NotificationList>
                            {friendRequests.length > 0 ? (
                                friendRequests.map(request => (
                                    <NotificationCard key={request._id}>
                                        <NotificationMessage>
                                            You have a new friend request from **{request.requester.name}**.
                                        </NotificationMessage>
                                        <ActionButtons>
                                            <AcceptButton onClick={() => handleAccept(request._id)}>Accept</AcceptButton>
                                            <DeclineButton onClick={() => handleDecline(request._id)}>Decline</DeclineButton>
                                        </ActionButtons>
                                    </NotificationCard>
                                ))
                            ) : (
                                <p style={{ color: '#aaa', textAlign: 'center' }}>You have no new notifications.</p>
                            )}
                        </NotificationList>
                    </NotificationsContainer>
                </Center>
            
        </>
    );
}
