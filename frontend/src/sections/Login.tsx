import React, { useState } from "react";
import { useGetUserMutation } from "../../api/apiSlice";
import { useJwt } from "react-jwt";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [token, setToken] = useState<string>("");

    const { decodedToken, isExpired } = useJwt(token);

    const [logUser, result] = useGetUserMutation();

    const handleLogin = async () => {
        await logUser({ email, password });
        setToken(result.data.access);

        console.log(decodedToken);
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
