// '/page/account.js'
import styled from "styled-components";
import Center from "@/components/Center";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

const AccountContainer = styled.div`
  padding: 20px 0;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const UserInfoCard = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  &:hover{
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const UserInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 20px;
  
`;

const UserName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const UserEmail = styled.p`
  font-size: 1rem;
  color: #777;
  margin: 0;
`;

const SignOutButton = styled.button`
  background-color: #f44336;
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #da190b;
  }
`;

const SettingsCard = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  &:hover{
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SettingsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const SettingSection = styled.div`
  margin-bottom: 20px;
`;

const SettingLabel = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 10px;
`;

const SettingButton = styled.button`
  background-color: ${(props) => (props.$isActive ? "#222" : "#eee")};
  color: ${(props) => (props.$isActive ? "white" : "#333")};
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  &:not(:last-child) {
    margin-right: 10px;
  }
  &:hover {
    background-color: #ddd;
  }
`;

const FriendsCard = styled(UserInfoCard)``;

const FriendsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  ${props => props.$hasError && `
    border-color: red;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
  `}
`;

const SearchResult = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ScrollableList = styled.div`
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 10px;
`;

const FriendList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FriendItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
`;

const FriendImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const RemoveButton = styled.button`
  background-color: #f44336;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #d32f2f;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const AcceptButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #45a049;
  }
`;

const DeclineButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #d32f2f;
  }
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchHasError, setSearchHasError] = useState(false);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  async function fetchData() {
    await fetchFriends();
    await fetchFriendRequests();
  }

  async function fetchFriends() {
    try {
      const res = await api.get("/api/friends?action=fetchFriends");
      setFriends(res.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }

  async function fetchFriendRequests() {
    try {
      const res = await api.get("/api/friends?action=getRequests");
      setFriendRequests(res.data.incoming);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  }

  async function searchForUser() {
    if (!searchEmail) return;

    if (session && searchEmail === session.user.email) {
      setMessage("You cannot add yourself.");
      setSearchHasError(true);
      return;
    }
    
    setIsLoading(true);
    setSearchHasError(false);
    setSearchResult(null);
    setMessage(null);
    try {
      const res = await api.get(
        `/api/friends?action=searchUser&email=${searchEmail}`
      );
      setSearchResult(res.data);
    } catch (error) {
      console.error("Error searching for user:", error);
      setMessage(error.response?.data?.error || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  async function sendFriendRequest() {
    if (!searchResult) return;
    try {
      const res = await api.post("/api/friends", {
        action: "sendRequest",
        targetEmail: searchResult.email,
      });
      setMessage(res.data.message);
      // refetch friends and requests to update the UI
      fetchData();
      setSearchEmail("");
      setSearchResult(null);
    } catch (error) {
      console.error("Error sending friend request:", error);
      setMessage(error.response?.data?.error || "An error occurred.");
    }
  }

  async function handleRemoveFriend(friendId) {
    try {
      await api.post("/api/friends", {
        action: "removeFriend",
        friendId,
      });
      setMessage("Friend removed successfully.");
      fetchFriends();
    } catch (error) {
      console.error("Error removing friend:", error);
      setMessage(error.response?.data?.error || "An error occurred.");
    }
  }

  async function respondToRequest(requesterId, accept) {
    try {
      await api.post("/api/friends", {
        action: "respondToRequest",
        requesterId,
        accept,
      });
      setMessage(accept ? "Friend added." : "Request declined.");
      fetchData();
    } catch (error) {
      console.error("Error responding to request:", error);
      setMessage(error.response?.data?.error || "An error occurred.");
    }
  }

  if (!session) {
    return (
      <>
        <Center>
          <AccountContainer>
            <p>Please log in to view your account.</p>
          </AccountContainer>
        </Center>
      </>
    );
  }

  return (
    <>
      <Center>
        <AccountContainer>
          <UserInfoCard>
            <UserName>Hello, {session.user.name}</UserName>
            <UserInfoHeader>
              <UserEmail>{session.user.email}</UserEmail>
              <SignOutButton onClick={() => signOut()}>Sign Out</SignOutButton>
            </UserInfoHeader>
          </UserInfoCard>

          <FriendsCard>
            <FriendsTitle>Friend Requests ({friendRequests.length})</FriendsTitle>
            <ScrollableList>
              <FriendList>
                {friendRequests.length > 0 ? (
                  friendRequests.map((request) => (
                    <FriendItem key={request._id}>
                      <FriendImage src={request.image} alt={request.name} />
                      <span>
                        {request.name} ({request.email})
                      </span>
                      <ActionButtons>
                        <AcceptButton onClick={() => respondToRequest(request._id, true)}>
                          Accept
                        </AcceptButton>
                        <DeclineButton onClick={() => respondToRequest(request._id, false)}>
                          Decline
                        </DeclineButton>
                      </ActionButtons>
                    </FriendItem>
                  ))
                ) : (
                  <p>You have no pending friend requests.</p>
                )}
              </FriendList>
            </ScrollableList>
          </FriendsCard>

          <FriendsCard>
            <FriendsTitle>Friends</FriendsTitle>
            <SearchContainer>
              <SearchInput
                type="email"
                placeholder="Search by email"
                value={searchEmail}
                onChange={(e) => {
                  setSearchEmail(e.target.value);
                  setSearchHasError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') searchForUser();
                }}
                $hasError={searchHasError}
              />
              <SettingButton onClick={searchForUser} disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </SettingButton>
            </SearchContainer>
            
            {message && <p>{message}</p>}
            
            {searchResult && (
              <SearchResult>
                <span>
                  {searchResult.name} ({searchResult.email})
                </span>
                {searchResult.isAlreadyFriend ? (
                  <span>You are already friends.</span>
                ) : searchResult.isRequestPending ? (
                  <span>Request already sent.</span>
                ) : (
                  <SettingButton onClick={sendFriendRequest}>
                    Send Request
                  </SettingButton>
                )}
              </SearchResult>
            )}
            
            <ScrollableList>
              <FriendList>
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <FriendItem key={friend._id}>
                      <FriendImage src={friend.image} alt={friend.name} />
                      <span>
                        {friend.name} ({friend.email})
                      </span>
                      <RemoveButton onClick={() => handleRemoveFriend(friend._id)}>
                        Remove
                      </RemoveButton>
                    </FriendItem>
                  ))
                ) : (
                  <p>You have no friends yet.</p>
                )}
              </FriendList>
            </ScrollableList>
          </FriendsCard>

          <SettingsCard>
            <SettingsTitle>Settings</SettingsTitle>

            <SettingSection>
              <SettingLabel>Theme</SettingLabel>
              <div>
                <SettingButton
                  $isActive={theme === "light"}
                  onClick={() => setTheme("light")}
                >
                  Light mode
                </SettingButton>
                <SettingButton
                  $isActive={theme === "dark"}
                  onClick={() => setTheme("dark")}
                >
                  Dark mode
                </SettingButton>
              </div>
            </SettingSection>

            <SettingSection>
              <SettingLabel>Language</SettingLabel>
              <div>
                <SettingButton
                  $isActive={language === "English"}
                  onClick={() => setLanguage("English")}
                >
                  English
                </SettingButton>
                <SettingButton
                  $isActive={language === "Arabic"}
                  onClick={() => setLanguage("Arabic")}
                >
                  Arabic
                </SettingButton>
              </div>
            </SettingSection>
          </SettingsCard>
        </AccountContainer>
      </Center>
    </>
  );
}
