import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/Bars";
import XmarkIcon from "./icons/XmarkIcon";
import { useSession, signIn } from "next-auth/react";
import Input from "./Input";
import Button from "./Button";
import { useRouter } from "next/router";

const StyledHeader = styled.header`
    background-color: #222;
`;

const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
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
    align-items: center;
`;

const StyledNav = styled.nav`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #222;
    transition: transform .3s ease-in-out, opacity .3s ease-in-out;
    ${props => props.$mobileNavActive ? `
        transform: translateX(0);
        opacity: 1;
    ` : `
        transform: translateX(-100%);
        opacity: 0;
    `}
    z-index: 2;
    display: flex;
    flex-direction: column;
    
    @media screen and (min-width: 768px) {
        display: flex;
        flex-direction: row;
        position: static;
        padding: 0;
        transform: translateX(0);
        opacity: 1;
        gap: 15px;
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

const NavButton = styled.button`
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

const SearchContainer = styled.form`
    display: flex;
    background-color: #333;
    border-radius: 25px;
    overflow: hidden;
    gap: 0;
    align-items: center;
    @media screen and (max-width: 767px) {
        display: none;
    }
`;

const MobileSearchContainer = styled.form`
    display: flex;
    gap: 0;
    align-items: center;
    padding: 10px 0;
    background-color: #333;
    border-radius: 25px;
    overflow: hidden;
    @media screen and (min-width: 768px) {
        display: none;
    }
`;

const SearchInput = styled(Input)`
    width: 150px;
    border: none;
    background: transparent;
    color: #fff;
    padding: 10px 15px;
    outline: none;
    &::placeholder {
        color: #888; }
    @media screen and (min-width: 768px) {
        width: 200px;
    }
`;

const SearchButton = styled(Button)`
    padding: 10px 15px;
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
`;

export default function Header() {
    const { cartProducts } = useContext(CartContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <StyledHeader>
            <Center>
                <Wrapper>
                    <Logo href={'/'}>BAYmod Home</Logo>
                    
                    {/* Desktop Navigation and Search */}
                    <StyledNav $mobileNavActive={mobileNavActive}>
                        <NavLink href={'/products'}>All products</NavLink>
                        <NavLink href={'/categories'}>Categories</NavLink>
                        {session && (
                            <NavLink href={'/account'}>Account</NavLink>
                        )}
                        <NavLink href={'/cart'}>Cart ({cartProducts.length})</NavLink>
                        {!session && (
                            <SignINButton onClick={() => signIn('google')}>Sign in</SignINButton>
                        )}
                        <MobileSearchContainer onSubmit={handleSearch}>
                            <SearchInput 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                            />
                            <SearchButton type="submit">Search</SearchButton>
                        </MobileSearchContainer>
                    </StyledNav>

                    {/* Desktop Search */}
                    <SearchContainer onSubmit={handleSearch}>
                        <SearchInput 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                        />
                        <SearchButton type="submit">Search</SearchButton>
                    </SearchContainer>
                    
                    {/* Mobile Navigation Button */}
                    <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
                        {mobileNavActive ? <XmarkIcon /> : <BarsIcon />}
                    </NavButton>
                </Wrapper>
            </Center>
        </StyledHeader>
    );
}
