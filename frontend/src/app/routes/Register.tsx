import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "@/features/Auth/assets/loginImage.jpg";
import ErrorMessage from "@/components/Misc/ErrorMessage";
import { useRegisterUserMutation } from "@/features/Auth/api";
import { validationError } from "@/types/types.ts";

export default function Register() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string[]>([]);

    const [registerUser] = useRegisterUserMutation();
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError(["Passwords do not match."]);
            return;
        }

        await registerUser({ email, password, name })
            .unwrap()
            .then(() => {
                navigate("/login");
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

    return (
        <div
            className="flex w-screen h-screen px-5 relative"
            style={{
                background: "linear-gradient(137deg,rgba(45, 57, 52, 1) 27%, rgba(51, 79, 71, 1) 100%)",
            }}
        >
            <div className="m-auto infoContainer1 w-full flex-row max-xl:max-w-96 xl:w-2/3 xl:p-6 xl:gap-x-6 2xl:max-w-5xl 2xl:max-h-[40rem]">
                <div className="flex flex-col h-full w-full xl:w-1/2">
                    <div className="flex-1 w-full flex flex-col items-center py-11">
                        <h1 className="text-3xl mb-8">Sign Up</h1>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex flex-col gap-y-3 w-full my-auto px-7"
                        >
                            <div className="flex flex-col gap-y-1">
                                <label htmlFor="name">
                                    <p>Name</p>
                                </label>
                                <input
                                    name="name"
                                    id="name"
                                    type="text"
                                    className="formInput"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
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
                            <div className="flex flex-col gap-y-1">
                                <label htmlFor="confirmPassword">
                                    <p>Confirm Password</p>
                                </label>
                                <input
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    type="password"
                                    className="formInput"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                className="formBtn formBtnPrimary w-full mt-6"
                                onClick={() => handleRegister()}
                            >
                                <p>Sign Up</p>
                            </button>
                        </form>
                    </div>
                    <p className="text-sm text-gray-400 text-center">
                        Already have an account?{" "}
                        <a className="text-custom-accent cursor-pointer" href="/login">
                            Log in
                        </a>
                    </p>
                </div>
                <div
                    className="max-xl:hidden w-1/2 min-h-0 flex items-center justify-center overflow-hidden self-stretch rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${loginImage})` }}
                ></div>
            </div>
            <span className="fixed bottom-0 mb-3">Design and Built By Max Garcia</span>
            <ErrorMessage error={error} />
        </div>
    );
}
