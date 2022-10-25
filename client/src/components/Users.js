import React, { useState } from "react";
import styled from "styled-components";
import { FiChevronsDown } from "react-icons/fi";
import { useAuthContext } from "../context/authContext";

function User() {
    const [isExpand, setIsExpand] = useState(true);
    const { allUsers } = useAuthContext();
    const handleExpand = () => {
        setIsExpand(!isExpand);
    };
    return (
        <UsersWrapper>
            <div className="header" onClick={handleExpand}>
                <p>users</p>
                <FiChevronsDown
                    className={
                        isExpand ? "dropdown-icon rotate" : "dropdown-icon"
                    }
                />
            </div>
            {isExpand && (
                <ul>
                    {allUsers.length &&
                        allUsers.map((user, idx) => {
                            const { color, name } = user;
                            return (
                                <li key={idx}>
                                    <div
                                        style={{
                                            backgroundColor: color,
                                        }}
                                        className="user-color"
                                    ></div>
                                    <p>{name}</p>
                                </li>
                            );
                        })}
                </ul>
            )}
        </UsersWrapper>
    );
}
const UsersWrapper = styled.div`
    margin: 1rem;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    max-width: 20rem;
    background-color: #fafafa;
    padding: 0 0.7rem;
    .header {
        text-transform: uppercase;
        font-weight: 500;
        padding: 0.7rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
        p {
            font-size: 0.9rem;
        }
        &:hover {
            cursor: pointer;
        }
        .dropdown-icon {
        }
        .rotate {
            transform: rotate(180deg);
        }
    }
    ul {
        border-top: 1px solid #e2e2e2;
        padding-top: 1rem;
        li {
            padding-bottom: 1rem;
            display: flex;
            align-items: center;
            text-transform: capitalize;
            .user-color {
                align-items: center;
                height: 0.6rem;
                width: 0.6rem;
                border-radius: 50%;
                margin-right: 1rem;
            }
            .active {
                font-weight: 600;
            }
        }
    }
`;
export default User;
