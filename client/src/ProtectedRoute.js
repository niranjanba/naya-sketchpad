import React from "react";
import { Navigate } from "react-router-dom";
import Loading from "./components/Loading";
import { useAuthContext } from "./context/authContext";
import { auth } from "./firebase";
function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuthContext();
    if (isLoading) return <Loading />;
    if (!user) return <Navigate to={"/login"} />;
    return children;
}

export default ProtectedRoute;
