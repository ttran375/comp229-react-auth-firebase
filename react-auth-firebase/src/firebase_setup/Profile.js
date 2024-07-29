import { useContext } from "react";
import AuthContext from "../AuthContext";
import { Navigate } from "react-router-dom";
import { signOut } from "./firebase";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = async () => {
        await signOut();
    };
    if (!user) {
        return <Navigate replace to="/login" />;
    }
    return (
        <>
            <h1>Profile</h1>
            <button onClick={handleLogout}>Logout</button>
        </>
    );
};
export default Profile;
