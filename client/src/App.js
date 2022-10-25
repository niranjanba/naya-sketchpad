import "./App.css";
import SketchPage from "./pages/SketchPage";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import RegisterPaeg from "./pages/RegisterPaeg";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

axios.defaults.baseURL = "http://localhost:4000/api/v1";

function App() {
    return (
        // <Router>
        <Routes>
            <Route path="/register" element={<RegisterPaeg />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <SketchPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
        // </Router>
    );
}

export default App;
