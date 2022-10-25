import React from "react";
import styled from "styled-components";

function Loading() {
    return (
        <Wrapper>
            <div className="lds-dual-ring"></div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: grid;
    place-content: center;
    .lds-dual-ring {
        display: inline-block;
        width: 80px;
        height: 80px;
    }
    .lds-dual-ring:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #fff;
        border-color: var(--primary-color-1) transparent var(--primary-color-1)
            transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }
    @keyframes lds-dual-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

export default Loading;
