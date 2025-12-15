import { useResetPasswordMutation } from "@/features/Auth/api";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle02Icon, ShieldKeyIcon } from "@hugeicons/core-free-icons";
import Loader from "@/components/Misc/Loader";
import { useState } from "react";
import ErrorMessage from "@/components/Misc/ErrorMessage";
import { validationError } from "@/types/types.ts";

type verificationToken = {
    token: string;
};

export default function ResetPass() {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string[]>([]);
    const [tokenError, setTokenError] = useState<boolean>(false);

    const navigate = useNavigate();

    const { token: verificationToken } = useLoaderData() as verificationToken;

    const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

    const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(["Passwords do not match."]);
            return;
        }

        await resetPassword({ newPassword, verificationToken })
            .unwrap()
            .then(() => setTimeout(() => navigate("/login"), 100))
            .catch((error) => {
                const validationError = error.data as validationError;
                if (validationError?.errors) {
                    setError(Object.values(validationError.errors).flat());
                    if (validationError.errors.Token) {
                        setTokenError(true);
                    }
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
            <div className="m-auto infoContainer1 gap-y-0 py-14 px-10 w-full flex-col items-center max-w-96 xl:w-2/3 xl:gap-x-6">
                {!tokenError ? (
                    <>
                        <HugeiconsIcon size={100} icon={ShieldKeyIcon} className="text-custom-accent" />
                        <h3 className="text-3xl text-custom-accent mb-5">Reset Your Password</h3>
                        <form
                            onSubmit={handlePasswordReset}
                            className="flex flex-col gap-y-3 w-full my-auto px-7"
                            key="recover"
                        >
                            <div className="flex flex-col gap-y-1">
                                <label htmlFor="password">
                                    <p>New Password</p>
                                </label>
                                <input
                                    name="password"
                                    id="password"
                                    type="password"
                                    className="formInput"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-y-1">
                                <label htmlFor="confirmPassword">
                                    <p>Confirm New Password</p>
                                </label>
                                <input
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    type="password"
                                    className="formInput"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="formBtn formBtnPrimary w-full mt-6" type="submit">
                                {isLoading ? (
                                    <Loader />
                                ) : isSuccess ? (
                                    <HugeiconsIcon
                                        size={23}
                                        icon={CheckmarkCircle02Icon}
                                        className="mx-auto"
                                    />
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <HugeiconsIcon size={120} icon={CancelCircleIcon} className="text-red-300" />
                        <h3 className="text-4xl text-red-300 mb-5">Failure</h3>
                        <p className="text-base text-center mb-5">
                            The password recovering has failed due to this link being already used or
                            expired.
                        </p>
                        <Link
                            to={"/login"}
                            className="formBtn formBtnPrimary w-full text-white text-center"
                        >
                            Go to Login
                        </Link>
                    </>
                )}
            </div>
            <span className="fixed bottom-0 mb-3">Design and Built By Max Garcia</span>
            <ErrorMessage error={error} />
        </div>
    );
}
