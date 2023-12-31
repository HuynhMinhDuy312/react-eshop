import React from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";

export const ShowOnLogin = ({ children }) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);

    if (isLoggedIn) {
        return children;
    }

    return null;
};

export const ShowOnLogout = ({ children }) => {
    const isLoggedin = useSelector(selectIsLoggedIn);
    if (!isLoggedin) {
        return children;
    }
    return null;
};

export default ShowOnLogin;
