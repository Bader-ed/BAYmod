// '/page/_app.js'
import { CartContextProvider, CartContext } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components";
import { SessionProvider } from "next-auth/react";
import { useContext } from "react";
import SignInModal from "@/components/SignInModal";
import Footer from '@/components/Footer';
import Header from "@/components/Header";
import { SpeedInsights } from '@vercel/speed-insights/next';
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
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header/>
            <main style={{ flexGrow: 1 }}>
              <Component {...pageProps} />
              <SpeedInsights />
            </main>
            <ModalWrapper />
            <Footer />
          </div>
        </CartContextProvider>
      </SessionProvider>
    </>
  );
}
