import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
  body{
    padding:0;
    margin:0;
    font-family: "Roboto", sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
    
  );
}
