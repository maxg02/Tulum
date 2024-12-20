import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { decodeToken } from "react-jwt";
import { userInfo } from "../reducers/userReducers";
import { setUserInfo } from "./reducers/userReducers";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useUser = (tokens: { access: string; refresh: string } | null = null) => {
    const dispatch = useAppDispatch();

    if (tokens) {
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
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        dispatch(setUserInfo(userInfo));
    } else {
    }
};
