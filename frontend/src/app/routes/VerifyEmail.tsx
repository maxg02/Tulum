import { useResendVerificationEmailMutation, useVerifyEmailMutation } from "@/features/Auth/api";
import { Link, useLoaderData } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import Loader from "@/components/Misc/Loader";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/Misc/ErrorMessage";
import { validationError } from "@/types/types.ts";

type verificationToken = {
    token: string;
};

export default function VerifyEmail() {
    const [emailInput, setEmailInput] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string[]>([]);

    const { token } = useLoaderData() as verificationToken;

    const [verifyEmail, { isLoading, isSuccess, isUninitialized }] = useVerifyEmailMutation();
    const [resendVerificationEmail, { isLoading: isLoadingResend, isSuccess: isSuccessResend }] =
        useResendVerificationEmailMutation();

    useEffect(() => {
        verifyEmail({ verificationToken: token });
    }, [token, verifyEmail]);

    const handleEmailVerificationResend = () => {
        resendVerificationEmail({ email: email })
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
            <div className="m-auto infoContainer1 gap-y-0 py-14 px-10 w-full flex-col items-center max-w-96 xl:w-2/3 xl:gap-x-6">
                {isLoading || isUninitialized ? (
                    <Loader />
                ) : isSuccess ? (
                    <>
                        <HugeiconsIcon
                            size={120}
                            icon={CheckmarkCircle02Icon}
                            className="text-custom-accent"
                        />
                        <h3 className="text-4xl text-custom-accent mb-5">Success</h3>
                        <p className="text-base text-center mb-7">
                            Congrats!, your account is now activated, you can now log in and start using
                            the app.
                        </p>
                        <Link
                            to={"/login"}
                            className="formBtn formBtnPrimary w-full text-white text-center"
                        >
                            Go to Login
                        </Link>
                    </>
                ) : (
                    <>
                        <HugeiconsIcon size={120} icon={CancelCircleIcon} className="text-red-300" />
                        <h3 className="text-4xl text-red-300 mb-5">Failure</h3>
                        <p className="text-base text-center mb-5">
                            The email verification has failed due to this link being already used or
                            expired.
                        </p>
                        <div
                            className={`transition-all duration-1000 flex flex-col w-full gap-y-1 overflow-hidden ${
                                emailInput ? "max-h-96 mb-5" : "max-h-0 mb-0"
                            }`}
                        >
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="formInput"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {emailInput ? (
                            <button
                                onClick={() => handleEmailVerificationResend()}
                                className="formBtn formBtnPrimary w-full text-white text-center"
                            >
                                {isLoadingResend ? (
                                    <Loader />
                                ) : isSuccessResend ? (
                                    <HugeiconsIcon
                                        size={23}
                                        icon={CheckmarkCircle02Icon}
                                        className="mx-auto"
                                    />
                                ) : (
                                    "Send"
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={() => setEmailInput(true)}
                                className="formBtn formBtnPrimary w-full text-white text-center"
                            >
                                Resend Verification Email
                            </button>
                        )}
                    </>
                )}
            </div>
            <span className="fixed bottom-0 mb-3">Design and Built By Max Garcia</span>
            <ErrorMessage error={error} />
        </div>
    );
}
