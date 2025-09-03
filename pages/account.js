import styled from "styled-components";
import Center from "@/components/Center";
import { useSession, signOut } from "next-auth/react";
import Header from "@/components/Header";
import { useState } from "react";

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
  background-color: ${props => props.$isActive ? '#222' : '#eee'};
  color: ${props => props.$isActive ? 'white' : '#333'};
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

export default function AccountPage() {
    const { data: session } = useSession();
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('English');

    if (!session) {
        return (
            <>
                <Header/>
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
            <Header/>
            <Center>
                <AccountContainer>
                    <UserInfoCard>
                        <UserName>Hello, {session.user.name}</UserName>
                        <UserInfoHeader>
                            <UserEmail>{session.user.email}</UserEmail>
                            <SignOutButton onClick={() => signOut()}>Sign Out</SignOutButton>
                        </UserInfoHeader>
                    </UserInfoCard>

                    <SettingsCard>
                        <SettingsTitle>Settings</SettingsTitle>

                        <SettingSection>
                            <SettingLabel>Theme</SettingLabel>
                            <div>
                                <SettingButton 
                                    $isActive={theme === 'light'} 
                                    onClick={() => setTheme('light')}
                                >
                                    Light mode
                                </SettingButton>
                                <SettingButton 
                                    $isActive={theme === 'dark'} 
                                    onClick={() => setTheme('dark')}
                                >
                                    Dark mode
                                </SettingButton>
                            </div>
                        </SettingSection>

                        <SettingSection>
                            <SettingLabel>Language</SettingLabel>
                            <div>
                                <SettingButton 
                                    $isActive={language === 'English'} 
                                    onClick={() => setLanguage('English')}
                                >
                                    English
                                </SettingButton>
                                <SettingButton 
                                    $isActive={language === 'Arabic'} 
                                    onClick={() => setLanguage('Arabic')}
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
