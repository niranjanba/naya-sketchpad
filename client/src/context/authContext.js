import { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "./sketches";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    /**
     * @desc Register user
     * @param {String} email
     * @param {String} password
     * @returns return Firebase method to create user
     */
    function register(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    /**
     * @desc Login user
     * @param {String} email
     * @param {String} password
     * @returns return Firebase method to login user
     */
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    /**
     * @desc Google signin
     * @returns return Firebase method to create user
     */
    function signInWithGoogle() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }

    /**
     * @desc Get all users
     */
    async function getAllUsers() {
        try {
            const {
                data: { users },
            } = await axios.get("user/all-users");
            setAllUsers(users);
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * @desc Save the user to database and assign a unique color
     * @param {Object} crntUser
     */
    async function saveUserToDB(crntUser) {
        delete crntUser.password;
        try {
            const { data } = await axios.post("user", {
                data: crntUser,
            });
            setUser({ ...crntUser, ...data.user });
            socket.emit("send-new-user", data.user);
            getAllUsers();
        } catch (error) {
            console.log(error);
        }
    }

    async function getUser(email) {
        if (email) {
            try {
                const { data } = await axios(`user?email=${email}`);
                setUser(data.user);
                getAllUsers();
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        socket.on("receive-new-user", (user) => {
            setAllUsers([...allUsers, user]);
        });
    }, [allUsers]);

    useEffect(() => {
        setIsLoading(true);
        const unsub = onAuthStateChanged(auth, (cuser) => {
            if (cuser) {
                navigate("/");
                getUser(cuser.email);
            } else {
                setIsLoading(false);
            }
        });

        return () => unsub();
    }, [navigate]);

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        }
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                register,
                login,
                user,
                setUser,
                isLoading,
                signInWithGoogle,
                saveUserToDB,
                allUsers,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
