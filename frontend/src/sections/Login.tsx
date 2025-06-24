import React, { useState } from "react";
import { useGetUserMutation } from "../../api/apiSlice";
import { setUserInfo } from "../reducers/userReducers";

import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();

    const [logUser] = useGetUserMutation();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const tokens = await logUser({ email, password }).unwrap();
            dispatch(setUserInfo(tokens));
            navigate("/");
        } catch (error) {
            setError(error.data.error);
        }
    };

    return (
        <div className="bg-custom-bg flex w-screen h-screen px-5 relative">
            <div className="m-auto infoContainer1 w-full max-w-96">
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

                    <hr className="border-t-2"></hr>
                    {error && <p className="text-red-400">{error}</p>}
                    <button className="formBtn formBtnPrimary self-start" onClick={() => handleLogin()}>
                        <p>Log In</p>
                    </button>
                </form>
            </div>
            <span className="fixed bottom-0 mb-3">Design and Built By Max Garcia</span>
        </div>
    );
}
