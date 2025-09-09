import styled from "styled-components";
import Center from "@/components/Center";
import Title from "@/components/Title";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { getSession, signIn } from "next-auth/react";

// Styled components for the sign-in page layout
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 100px);
    padding: 20px;
`;

const Content = styled.div`
    text-align: center;
    align-content: center;
    width: 100%;
    height: 400px;
    max-width: 400px;
    background-color: #fff;

`;
const SignInContext = styled.p`
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
`;


export default function SignInPage() {
    return (
        <Center>
            <Wrapper>
                <Content>
                    <Title>Bay mod</Title>
                    <SignInContext>
                        Log in to your account
                    </SignInContext>
                    <GoogleSignInButton onClick={() => signIn('google', { callbackUrl: '/' })}/>
                </Content>
            </Wrapper>
        </Center>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}
