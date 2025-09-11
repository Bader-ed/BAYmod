// page/notifications.js
import { useEffect, useState } from "react";
import styled from "styled-components";
import Center from "@/components/Center";
import Title from "@/components/Title";
import { useSession } from "next-auth/react";

import Link from "next/link";
import { CircleCheck, Trash2 } from "lucide-react";
import api from "@/lib/axios";


const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
        }}>
            <div style={{
                backgroundColor: '#333',
                padding: '2rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '24rem',
                textAlign: 'center',
                color: '#eee',
                fontFamily: 'sans-serif'
            }}>
                <p style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '1rem'
                }}>
                    Are you sure you want to delete this notification?
                </p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem'
                }}>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Yes, delete
                    </button>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#4b5563',
                            color: '#fff',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


const NotificationsContainer = styled.div`
    padding: 20px 0;
    max-width: 800px;
    margin: 0 auto;
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
    align-items: center;
    gap: 15px;
    color: #eee;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
    &:hover {
        transform: translateY(-2px);
    }
    opacity: ${props => props.$isRead ? 0.6 : 1};
    // make it mobile responsive
    flex-wrap: wrap; 
`;

const NotificationMessage = styled.p`
    margin: 0;
    flex-grow: 1;
    font-size: 1rem;
    line-height: 1.5;
`;

const NotificationTime = styled.span`
    font-size: 0.8rem;
    color: #999;
    white-space: nowrap; 
    order: 2;
    @media (min-width: 768px) {
        order: initial;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    flex-shrink: 0;
    order: 3;
    @media (min-width: 768px) {
        order: initial;
    }
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    background-color: #555;
    cursor: pointer;
    color: #eee;
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
    border-radius: 4px;
    transition: background-color 0.2s ease-in-out;
    
    &:hover {
        background-color: #555;
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #aaa;
    }
`;

const TopActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
`;

export default function NotificationsPage() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // fetches all notifications for the logged-in user
    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications');
            setNotifications(res.data);
            const unread = res.data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // marks a single notification as read by sending a PUT request with the notification ID
    const markAsRead = async (notificationId) => {
        try {
            await api.put('/api/notifications', { id: notificationId });
            setNotifications(prevNotifications => {
                const updatedNotifications = prevNotifications.map(n => 
                    n._id === notificationId ? { ...n, isRead: true } : n
                );
                // decrement the unread count only if the notification was previously unread
                const wasUnread = prevNotifications.find(n => n._id === notificationId && !n.isRead);
                if (wasUnread) {
                    setUnreadCount(prevCount => prevCount - 1);
                }
                return updatedNotifications;
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    // marks all unread notifications as read
    const markAllAsRead = async () => {
        try {
            await api.put('/api/notifications', { markAll: true });
            setNotifications(prevNotifications => 
                prevNotifications.map(n => ({ ...n, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };
    
    // deletes a single notification
    const handleDeleteClick = (notificationId) => {
        setNotificationToDelete(notificationId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!notificationToDelete) return;
        try {
            await api.delete('/api/notifications', { data: { id: notificationToDelete } });
            setNotifications(prevNotifications => prevNotifications.filter(n => n._id !== notificationToDelete));
        } catch (error) {
            console.error('Error deleting notification:', error);
        } finally {
            setShowDeleteModal(false);
            setNotificationToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setNotificationToDelete(null);
    };

    // renders each notification card based on its type
    const renderNotification = (notification) => {
        const timeAgo = new Date(notification.createdAt).toLocaleString();
        
        switch (notification.type) {
            case 'friendRequest':
                const friendRequestLink = `/account`;
                return (
                    <NotificationCard key={notification._id} $isRead={notification.isRead}>
                        <NotificationMessage>
                            <b>{notification.sender.name}</b> sent you a friend request.
                        </NotificationMessage>
                        <NotificationTime>{timeAgo}</NotificationTime>
                        <ButtonGroup>
                            {!notification.isRead && (
                                <ActionButton onClick={() => markAsRead(notification._id)}>
                                    <CircleCheck size={20} />
                                </ActionButton>
                            )}
                            <ActionButton onClick={() => handleDeleteClick(notification._id)}>
                                <Trash2 size={20} />
                            </ActionButton>
                        </ButtonGroup>
                    </NotificationCard>
                );
            case 'mention':
                const productLink = `/product/${notification.product._id}`;
                return (
                    <NotificationCard key={notification._id} $isRead={notification.isRead}>
                        <NotificationMessage>
                            <b>{notification.sender.name}</b> mentioned you in the community for product <b>{notification.product.title}</b>.
                        </NotificationMessage>
                        <NotificationTime>{timeAgo}</NotificationTime>
                        <ButtonGroup>
                            <Link href={productLink} passHref>
                                <ActionButton style={{ whiteSpace: 'nowrap' }}>
                                    View Product
                                </ActionButton>
                            </Link>
                            {!notification.isRead && (
                                <ActionButton onClick={() => markAsRead(notification._id)}>
                                    <CircleCheck size={20} />
                                </ActionButton>
                            )}
                            <ActionButton onClick={() => handleDeleteClick(notification._id)}>
                                <Trash2 size={20} />
                            </ActionButton>
                        </ButtonGroup>
                    </NotificationCard>
                );
            default:
                return null;
        }
    };

    // fetch notifications on component mount or when the user session changes
    useEffect(() => {
        if (session) {
            fetchNotifications();
        }
    }, [session]);
    
    if (isLoading) {
        return (
            <Center>
                <p>Loading notifications...</p>
            </Center>
        );
    }

    if (!session) {
        return (
            <Center>
                <p>Please log in to view your notifications.</p>
            </Center>
        );
    }

    return (
        <Center>
            <NotificationsContainer>
                <Title>Notifications</Title>
                {notifications.length > 0 && unreadCount > 0 && (
                    <TopActions>
                        <ActionButton onClick={markAllAsRead}>
                            <CircleCheck size={20} /> Mark All as Read
                        </ActionButton>
                    </TopActions>
                )}
                <NotificationList>
                    {notifications.length > 0 ? (
                        notifications.map(renderNotification)
                    ) : (
                        <p style={{ color: '#aaa', textAlign: 'center' }}>You have no notifications.</p>
                    )}
                </NotificationList>
            </NotificationsContainer>
            <ConfirmationModal
                isOpen={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </Center>
    );
}