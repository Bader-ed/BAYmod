// components/Footer.js
import styled from "styled-components";

const StyledFooter = styled.footer`
    background-color: #222;
    color: #aaa;
    text-align: center;
    padding: 20px 0;
    width: 100%;
    margin-top: 50px;
    border-top: 1px solid #444;
`;

const Footer = () => {
    return (
        <StyledFooter>
            <p>&copy; {new Date().getFullYear()} BAYmod. All Rights Reserved.</p>
        </StyledFooter>
    );
};

export default Footer;