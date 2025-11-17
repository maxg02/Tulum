import { useVerifyEmailMutation } from "@/features/Auth/api";
import { Link, useLoaderData } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import Loader from "@/components/Misc/Loader";
import { useEffect } from "react";

type verificationToken = {
    token: string;
};

export default function VerifyEmail() {
    const { token } = useLoaderData() as verificationToken;

    const [verifyEmail, { isLoading, isSuccess, isUninitialized }] = useVerifyEmailMutation();

    useEffect(() => {
        verifyEmail({ verificationToken: token });
    }, [token, verifyEmail]);

    return (
        <div
            className="flex w-screen h-screen px-5 relative"
            style={{
                background: "linear-gradient(137deg,rgba(45, 57, 52, 1) 27%, rgba(51, 79, 71, 1) 100%)",
            }}
        >
            <div className="m-auto infoContainer1 py-14 px-10 w-full flex-col items-center max-w-96 xl:w-2/3 xl:gap-x-6">
                {isLoading || isUninitialized ? (
                    <Loader />
                ) : isSuccess ? (
                    <>
                        <HugeiconsIcon
                            size={120}
                            icon={CheckmarkCircle02Icon}
                            className="text-custom-accent"
                        />
                        <h3 className="text-4xl text-custom-accent">Success</h3>
                        <p className="text-base text-center mb-5">
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
                        <h3 className="text-4xl text-red-300">Failure</h3>
                        <p className="text-base text-center mb-5">
                            The email verification has failed due to this token being already used or
                            expired.
                        </p>
                        <Link
                            to={"/login"}
                            className="formBtn formBtnPrimary w-full text-white text-center"
                        >
                            Generate new token
                        </Link>
                    </>
                )}
            </div>
            <span className="fixed bottom-0 mb-3">Design and Built By Max Garcia</span>
        </div>
    );
}
