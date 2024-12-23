import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setUserInfo } from "../reducers/userReducers";

export default function RootLayout() {
    const dispatch = useAppDispatch();
    //check if there's user on local storage
    const userStorage = localStorage.getItem("userInfo");
    //check if there's user on state
    const userToken = useAppSelector((state) => state.user.tokens);

    if (!userStorage) {
        return <Navigate to="/login" replace />;
    }

    if (!userToken) {
        const userJson = JSON.parse(userStorage);
        dispatch(setUserInfo(userJson.tokens));
    }

    return (
        <div className="bg-custom-bg flex w-screen h-screen px-8">
            <Outlet />
        </div>
    );
}
