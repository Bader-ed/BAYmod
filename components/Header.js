import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/Bars";
import { useSession, signIn } from "next-auth/react"

const StyledHeader = styled.header`
    background-color: #222;

`;
const Logo = styled(Link)`
    color: #fff;
    text-decoration:none;
    position: relative;
    z-index: 3;
`;

const SignINButton = styled.button`
    display: block;
    color: #aaa;
    text-decoration: none;
    padding: 10px 0;
    border: 0;
    background: none;
    cursor: pointer;
    font-family: "Poppins", sans-serif;
    font-size: 16px;
    
    @media screen and (min-width: 768px) {
        padding: 0;
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;

const StyledNav = styled.nav`
    ${props => props.$mobileNavActive ? `
        display: block;
    ` : `
        display: none;
    `}
    gap: 15px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #222;
    @media screen and (min-width: 768px) {
        display: flex;
        position: static;
        padding: 0;
    }
`;

const NavLink = styled(Link)`
    display: block;
    color: #aaa;
    text-decoration: none;
    padding: 10px 0;
    @media screen and (min-width: 768px) {
        padding: 0;
    }
`;

const NavButton= styled.button`
    background-color: transparent;
    width: 30px;
    height: 30px;
    border: 0;
    color: white;
    cursor: pointer;
    position: relative;
    z-index: 3;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

export default function Header () {
    const {cartProducts} = useContext(CartContext);
    const [mobileNavActive,setMobileNavActive] = useState(false);
    const { data: session } = useSession()
    return (
        < StyledHeader>
        <Center>
            <Wrapper>
                <Logo href={'/'}>BAYmod</Logo>
                <StyledNav $mobileNavActive={mobileNavActive}>
                    <NavLink href={'/'}>Home</NavLink>
                    <NavLink href={'/products'}>All products</NavLink>
                    <NavLink href={'/categories'}>Categories</NavLink>
                    {session && (
                        <NavLink href={'/account'}>Account</NavLink>
                    )}
                    <NavLink href={'/cart'}>Cart ({cartProducts.length})</NavLink>
                    {!session && (
                        <SignINButton onClick={() => signIn('google')}>Sign in</SignINButton>
                    )}
                </StyledNav>
                <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
                    <BarsIcon/>
                </NavButton>
            </Wrapper>
        </Center>
        </ StyledHeader>
    );
}
