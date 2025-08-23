import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import notFound from "/404.svg";
import ErrorSVG from "/Error.svg";

function NotFound() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="bg-[#242424] h-screen w-screen flex items-center justify-center flex-col px-8">
            {isRouteErrorResponse(error) && error.status === 404 ? (
                <img
                    src={notFound}
                    alt="404 Not Found"
                    className="w-full mb-4 max-w-[40rem] xl:max-w-[45rem] 2xl:max-w-[50rem]"
                />
            ) : (
                <img
                    src={ErrorSVG}
                    alt="404 Not Found"
                    className="w-full mb-4 max-w-[40rem] xl:max-w-[45rem] 2xl:max-w-[50rem]"
                />
            )}

            <Link to="/" className="text-custom-accent mt-5">
                Go back to Home
            </Link>
        </div>
    );
}

export default NotFound;
