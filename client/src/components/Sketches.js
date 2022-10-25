import React, { useState } from "react";
import styled from "styled-components";
import { FiPlus, FiChevronsDown } from "react-icons/fi";
import { useGlobalContext } from "../context/sketches";

function Sketches() {
    const [isExpand, setIsExpand] = useState(true);
    const { currentSketch, switchContainer, createNewSketch, sketchNames } =
        useGlobalContext();
    const handleExpand = () => {
        setIsExpand(!isExpand);
    };
    const handleAddnewSketch = () => {
        createNewSketch();
    };

    const handleSwitchSketch = (name) => {
        switchContainer(name);
    };
    return (
        <UsersWrapper>
            <div className="header" onClick={handleExpand}>
                <p>sketches</p>
                <FiChevronsDown
                    className={
                        isExpand ? "dropdown-icon rotate" : "dropdown-icon"
                    }
                />
            </div>
            {isExpand && (
                <ul>
                    {currentSketch &&
                        sketchNames &&
                        sketchNames.length &&
                        sketchNames.map((sketch, idx) => {
                            return (
                                <li
                                    key={idx}
                                    onClick={() =>
                                        handleSwitchSketch(sketch.name)
                                    }
                                >
                                    <p
                                        className={
                                            currentSketch.name === sketch.name
                                                ? "active"
                                                : ""
                                        }
                                    >
                                        {sketch.name.replace("-", " ")}
                                    </p>
                                </li>
                            );
                        })}
                    <div
                        className="add-new-sketch"
                        onClick={handleAddnewSketch}
                    >
                        <FiPlus />
                        <p>add new sketch</p>
                    </div>
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
            font-size: 0.9rem;
            .active {
                font-weight: 600;
                color: var(--primary-color-1);
            }
            &:hover {
                cursor: pointer;
                color: var(--primary-color-1);
            }
        }
        .add-new-sketch {
            display: flex;
            align-items: center;
            text-transform: capitalize;
            svg {
                margin-right: 0.5rem;
            }
            padding-bottom: 1rem;
            font-weight: 500;
            font-size: small;
            &:hover {
                cursor: pointer;
                color: var(--primary-color-1);
            }
        }
    }
`;
export default Sketches;
