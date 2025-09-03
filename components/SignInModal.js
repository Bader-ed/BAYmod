import styled from "styled-components";
import { signIn } from "next-auth/react";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
`;

const ModalText = styled.p`
  color: #555;
  margin-bottom: 25px;
`;

const ModalButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #005bb5;
  }
`;

export default function SignInModal({ onClose }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalTitle>Please Sign In</ModalTitle>
        <ModalText>You must be signed in to add items to your cart.</ModalText>
        <ModalButton onClick={() => signIn('google')}>
          Sign in with Google
        </ModalButton>
      </ModalContent>
    </ModalOverlay>
  );
}
