import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Button from "./Button";
import Input from "./Input";
import axios from "axios";
import { useRouter } from "next/router";
import UserRating from "./UserRating";

const CommunityContainer = styled.div`
    margin-top: 30px;
    border-top: 1px solid #ccc;
    padding-top: 15px;
    display: flex;
    border-radius: 30px;
    background-image: linear-gradient(to bottom, #dcdcdc, #a9a9a9);
    justify-content: space-between;
    gap: 20px;
    @media (max-width: 768px) {
        flex-direction: column;
        padding-top: 0;
    }
`;

const ChatWrapper = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
`;

const CommunityHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    align-items: center; 
    gap: 1rem;
    
`;

const UserRatingPosition = styled.div`
    margin-right: 15px;
`;

const ChatBox = styled.div`
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-direction: column;
`;

const Message = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    padding: 10px 15px;
    border-radius: 8px;
`;

const MessageHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    gap: 10px;
`;

const UserImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
`;

const UserName = styled.span`
    font-weight: bold;
    color: #555;
`;

const MessageContent = styled.p`
    margin: 0;
    line-height: 1.5;
    color: #333;
`;

const MentionHighlight = styled.span`
    background-color: #e6f7ff;
    color: #1890ff;
    padding: 2px 4px;
    border-radius: 4px;
    font-weight: bold;
`;

const ChatForm = styled.form`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 15px;
`;

const StyledMessageTime = styled.span`
    font-size: 0.75rem;
    color: #999;
`;
const ProductCommunityH3 = styled.h3`
    display: flex;
    padding-left: 10px;
`;
const StyledInput = styled(Input)`
    height: 35px;
    flex-grow: 1;
`;

export default function ProductCommunity({ productId }) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const chatBoxRef = useRef(null);
    const router = useRouter();

    const fetchMessages = async () => {
        try {
            const res = await axios.get('/api/messages', {
                params: { productId }
            });
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const intervalId = setInterval(fetchMessages, 5000);
        return () => clearInterval(intervalId);
    }, [productId]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (ev) => {
        ev.preventDefault();
        if (!newMessage.trim() || !session?.user?.id) return;

        setIsSubmitting(true);
        try {
            await axios.post('/api/messages', {
                productId,
                message: newMessage,
                userId: session.user.id
            });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderMessage = (message) => {
        const timeAgo = new Date(message.createdAt).toLocaleString();
        
        let parts = [message.message];
        if (message.mentionedUsers && message.mentionedUsers.length > 0) {
            for (const user of message.mentionedUsers) {
                const mentionString = `@${user.name}`;
                const newParts = [];
                // Split the existing parts by the mention string
                parts.forEach(part => {
                    const splitByMention = part.split(mentionString);
                    for (let i = 0; i < splitByMention.length; i++) {
                        newParts.push(splitByMention[i]);
                        if (i < splitByMention.length - 1) {
                            newParts.push(
                                <MentionHighlight key={`${message._id}-${user._id}-${i}`}>
                                    {user.name}
                                </MentionHighlight>
                            );
                        }
                    }
                });
                parts = newParts;
            }
        }
        
        return (
            <Message key={message._id}>
                <MessageHeader>
                    <UserImage src={message.user?.image} alt={message.user?.name} />
                    <UserName>{message.user?.name || "Anonymous"}</UserName>
                    <StyledMessageTime>{timeAgo}</StyledMessageTime>
                </MessageHeader>
                <MessageContent>
                    {parts}
                </MessageContent>
            </Message>
        );
    };

    return (
        <CommunityContainer>
            <ChatWrapper>
                <CommunityHeader>
                    <ProductCommunityH3>
                        Product Community
                    </ProductCommunityH3>
                    <UserRatingPosition>
                        <UserRating/>
                    </UserRatingPosition>
                </CommunityHeader>
                
                <ChatBox ref={chatBoxRef}>
                    {messages.length > 0 ? (
                        messages.map(renderMessage)
                    ) : (
                        <p>No messages yet. Be the first to start the conversation!</p>
                    )}
                </ChatBox>
                {session ? (
                    <ChatForm onSubmit={sendMessage}>
                        <StyledInput
                            placeholder="Join the conversation..."
                            value={newMessage}
                            onChange={ev => setNewMessage(ev.target.value)}
                            
                        />
                        <Button
                            height="35px"
                            primary
                            type="submit"
                            disabled={!newMessage.trim() || !session?.user?.id || isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send'}
                        </Button>
                    </ChatForm>
                ) : (
                    <p>Please log in to join the conversation.</p>
                )}
            </ChatWrapper>
        </CommunityContainer>
    );
}
