import { useState } from "react";
import { useGetUserMutation, useSendPasswordRecoverEmailMutation } from "@/features/Auth/api";
import { validationError } from "@/types/types.ts";
import { setUserInfo } from "@/features/Auth/reducers";

import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/Hooks/stateHooks";

import loginImage from "@/features/Auth/assets/loginImage.jpg";
import ErrorMessage from "@/components/Misc/ErrorMessage";
import CustomButton from "@/components/Misc/CustomButton";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [recoverEmail, setRecoverEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string[]>([]);
    const [recoveryInput, setRecoveryInput] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const [logUser, { isLoading: isLoadingLogIn, isSuccess: isSuccessLogIn }] = useGetUserMutation();
    const [sendPasswordRecoverEmail, { isLoading: isLoadingRecover, isSuccess: isSuccessRecover }] =
        useSendPasswordRecoverEmailMutation();

    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await logUser({ email, password })
            .unwrap()
            .then((tokens) => {
                dispatch(setUserInfo(tokens));
                navigate("/");
            })
            .catch((error) => {
                const validationError = error.data as validationError;
                if (validationError?.errors) {
                    setError(Object.values(validationError.errors).flat());
                } else {
                    setError(["An unexpected error occurred. Please try again."]);
                }
            });
    };

    const handlePasswordRecoverEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await sendPasswordRecoverEmail({ email: recoverEmail })
            .unwrap()
            .catch((error) => {
                const validationError = error.data as validationError;
                if (validationError?.errors) {
                    setError(Object.values(validationError.errors).flat());
                } else {
                    setError(["An unexpected error occurred. Please try again."]);
                }
            });
    };

    return (
        <div
            className="flex w-screen h-screen px-5 relative"
            style={{
                background: "linear-gradient(137deg,rgba(45, 57, 52, 1) 27%, rgba(51, 79, 71, 1) 100%)",
            }}
        >
            <div className="m-auto infoContainer1 w-full h-2/4 flex-row max-xl:max-w-96 max-xl:max-h-[30rem] xl:h-2/3 xl:w-2/3 xl:p-6 xl:gap-x-6 2xl:max-w-5xl 2xl:max-h-[40rem]">
                <div className="flex flex-col h-full w-full xl:w-1/2">
                    <div className="flex-1 w-full flex flex-col items-center py-11">
                        <h1 className="text-3xl">Log In</h1>
                        {!recoveryInput ? (
                            <form
                                onSubmit={handleLogin}
                                className="flex flex-col gap-y-3 w-full my-auto px-7"
                                key="login"
                            >
                                <div className="flex flex-col gap-y-1">
                                    <label htmlFor="email">
                                        <p>Email</p>
                                    </label>
                                    <input
                                        name="email"
                                        id="email"
                                        type="text"
                                        className="formInput"
                                        value={email}
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        onClick={() => setRecoveryInput(true)}
                                        className="text-xs text-right text-custom-accent self-end"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <CustomButton
                                    isLoading={isLoadingLogIn}
                                    isSuccess={isSuccessLogIn}
                                    className="formBtn formBtnPrimary w-full mt-6"
                                    type="submit"
                                >
                                    Log In
                                </CustomButton>
                            </form>
                        ) : (
                            <form
                                onSubmit={handlePasswordRecoverEmail}
                                className="flex flex-col gap-y-3 w-full my-auto px-7"
                                key="recover"
                            >
                                <div className="flex flex-col gap-y-1">
                                    <label htmlFor="passwordRecoverEmail">
                                        <p>Email</p>
                                    </label>
                                    <input
                                        name="passwordRecoverEmail"
                                        id="passwordRecoverEmail"
                                        type="text"
                                        className="formInput"
                                        value={recoverEmail}
                                        onChange={(e) => setRecoverEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <CustomButton
                                    isLoading={isLoadingRecover}
                                    isSuccess={isSuccessRecover}
                                    className="formBtn formBtnPrimary w-full mt-6"
                                    type="submit"
                                >
                                    Send Recover Email
                                </CustomButton>
                            </form>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                        Don't have an account?{" "}
                        <Link className="text-custom-accent cursor-pointer" to="/register">
                            Sign Up
                        </Link>
                    </p>
                </div>
                <div className="max-xl:hidden w-1/2 h-full flex items-center justify-center overflow-hidden">
                    <img className="object-cover w-full h-full rounded-xl" src={loginImage} />
                </div>
            </div>
            <span className="fixed bottom-0 mb-3">Design and Built By Max Garcia</span>
            <ErrorMessage error={error} />
        </div>
    );
}
