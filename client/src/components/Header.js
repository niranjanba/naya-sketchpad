import React from "react";
import styled from "styled-components";
import { useAuthContext } from "../context/authContext";
import logo from "../images/logo.png";

function Header() {
    const { user } = useAuthContext();
    return (
        <HeaderWrapper>
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            {user && (
                <div className="user">
                    <p>{user.displayName || user.name}</p>
                    {user.photoURL ? (
                        <img
                            style={{ display: "block" }}
                            className="user-photo"
                            src={user.photoURL}
                            alt="user icon"
                        />
                    ) : (
                        <span className="user-icon">
                            {user.email.substring(0, 1)}
                        </span>
                    )}
                </div>
            )}
        </HeaderWrapper>
    );
}

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    .logo > img {
        height: 1.5rem;
        width: 2rem;
        color: violet;
    }
    .user {
        display: flex;
        align-items: center;
        .user-icon {
            display: grid;
            place-items: center;
            text-transform: uppercase;
            height: 1.7rem;
            width: 1.7rem;
            margin-left: 1rem;
            border-radius: 50%;
            color: white;
            background-color: var(--primary-color-1);
        }
        .user-photo {
            height: 1.7rem;
            width: 1.7rem;
            margin-left: 1rem;
            border-radius: 50%;
        }
    }
    border-bottom: 1px solid #e2e2e2;
`;

export default Header;
