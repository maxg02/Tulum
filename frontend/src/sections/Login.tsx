import React, { useState } from "react";
import { useGetUserMutation } from "../../api/apiSlice";
import { decodeToken } from "react-jwt";
import { setUserInfo } from "../reducers/userReducers";
import { useAppDispatch } from "../hooks";
import { userInfo } from "../reducers/userReducers";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [logUser] = useGetUserMutation();
    const dispatch = useAppDispatch();

    const handleLogin = async () => {
        const tokens = await logUser({ email, password }).unwrap();
        const tokenInfo = decodeToken(tokens.access);
        const userInfo: userInfo = {
            userInfo: {
                fullName: tokenInfo.full_name,
            },
            tokens: {
                access: tokens.access,
                refresh: tokens.refresh,
            },
        };
        dispatch(setUserInfo(userInfo));
    };

    return (
        <div className="m-auto infoContainer1">
            <p>Login</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="email">
                        <p>Email</p>
                    </label>
                    <input
                        name="email"
                        id="email"
                        type="text"
                        className="formInput"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="password">
                        <p>Password</p>
                    </label>
                    <input
                        name="password"
                        id="password"
                        type="password"
                        className="formInput"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <span className="formDivider"></span>
                <button className="formButton" onClick={() => handleLogin()}>
                    <p>Log In</p>
                </button>
            </form>
        </div>
    );
}
