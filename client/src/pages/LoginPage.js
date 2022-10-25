import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";

import googleIcon from "../images/search.png";
import { getAuth } from "firebase/auth";

function LoginPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const { signInWithGoogle, login, saveUserToDB, getUser } = useAuthContext();
    const [error, setError] = useState({});
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithGoogle();
            await saveUserToDB(result.user);
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (error[name]) {
            delete error[name];
            setError(error);
        }
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let error = {};
        const { email, password } = userData;
        if (!email) {
            error = { ...error, email: "Email is required" };
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            error = { ...error, email: "Please enter valid email" };
        }
        if (!password) {
            error = { ...error, password: "Password is required" };
        }
        if (password && password.trim().length < 6) {
            error = { ...error, password: "Password should be > 6" };
        }
        if (!Object.keys(error).length > 0) {
            try {
                await login(email, password);
                getUser(email);
            } catch (error) {
                console.log(error);
                setError({ ...error, firebase: error.message });
            }
        } else {
            setError(error);
        }
    };
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h2>Log in to continue</h2>

                <div className={error.email ? "input error" : "input"}>
                    <input
                        type="text"
                        placeholder="Email"
                        onChange={handleChange}
                        name="email"
                    />
                    {error.email && <p className="error">{error.email}</p>}
                </div>
                <div className={error.password ? "input error" : "input"}>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        name="password"
                    />
                    {error.password && (
                        <p className="error">{error.password}</p>
                    )}
                </div>
                {error.firebase && <p className="error">{error.firebase}</p>}
                <a href="#">Forgot password?</a>
                <button type="submit">Login</button>
                <p className="p">
                    Don't Have an account?
                    <a onClick={() => navigate("/register")}>register</a>
                </p>
                <p className="or">or</p>
                <button onClick={handleGoogleSignIn} className="google-signin">
                    <img src={googleIcon} alt="google icon" />
                    <span>log in with google</span>
                </button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    form {
        display: flex;
        flex-direction: column;
        width: 17rem;
        h2 {
            color: var(--primary-color-1);
            text-transform: capitalize;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        .input {
            width: 100%;
            height: 2.5rem;
            font-size: 1rem;
            margin-bottom: 1rem;
            input {
                padding-left: 10px;
                border: 1px solid #afafaf;
                border-radius: 3px;
                outline: none;
                width: 100%;
                height: 100%;
            }
        }
        .input.error {
            margin-bottom: 1.4rem;
        }
        a {
            color: var(--primary-color-1);
            text-align: center;
            text-transform: capitalize;
            font-weight: 500;
            margin-bottom: 1rem;
            cursor: pointer;
        }
        button {
            height: 2.5rem;
            color: white;
            background-color: var(--primary-color-1);
            border: none;
            border-radius: 3px;
            margin-bottom: 1rem;
            cursor: pointer;
            &:hover {
                background-color: #b797e6;
            }
        }
        .p {
            text-align: center;
            a {
                color: var(--primary-color-1);
                margin-left: 0.5rem;
            }
        }
        .or {
            margin-top: 1rem;
            text-align: center;
        }
        .google-signin {
            margin-top: 1rem;
            padding: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: black;
            font-weight: 500;
            background-color: transparent;
            border: 1px solid #afafaf;
            text-transform: capitalize;
            img {
                margin-right: 1rem;
                height: 100%;
            }
            &:hover {
                background-color: #d4d4d4;
            }
        }
        .error {
            color: red;
            font-size: 0.8rem;
            margin-bottom: 0.4rem;
        }
    }
`;

export default LoginPage;
