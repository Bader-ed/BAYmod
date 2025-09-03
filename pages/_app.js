import { CartContextProvider, CartContext } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components";
import { SessionProvider } from "next-auth/react";
import { useContext } from "react";
import SignInModal from "@/components/SignInModal";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;0,900&display=swap');
  body{
    background-color: #eee;
    padding:0;
    margin:0;
    font-family: "Poppins", sans-serif;
  }
`;

function ModalWrapper() {
  const { showSignInModal, setShowSignInModal } = useContext(CartContext);
  if (!showSignInModal) {
    return null;
  }
  return <SignInModal onClose={() => setShowSignInModal(false)} />;
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
          <ModalWrapper />
        </CartContextProvider>
      </SessionProvider>
    </>
  );
}
