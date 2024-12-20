import React, { useState } from "react";
import { useGetUserMutation } from "../../api/apiSlice";
import { decodeToken } from "react-jwt";
import { setUserInfo } from "../reducers/userReducers";

import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string[] | null>(null);

    const [logUser] = useGetUserMutation();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const tokens = await logUser({ email, password }).unwrap();
            navigate("/");
        } catch (error) {
            setError(error.data.detail);
        }
    };

    return (
        <div className="m-auto infoContainer1 w-3/12">
            <p>Login</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-y-3 w-full">
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
                        required
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
                        required
                    />
                </div>

                <span className="formDivider"></span>
                {error && <p className="text-red-400">{error}</p>}
                <button className="formButton" onClick={() => handleLogin()}>
                    <p>Log In</p>
                </button>
            </form>
        </div>
    );
}
