import { CartContextProvider, CartContext } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components";
import { SessionProvider } from "next-auth/react";
import { useContext } from "react";
import SignInModal from "@/components/SignInModal";

const GlobalStyles = createGlobalStyle`
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
