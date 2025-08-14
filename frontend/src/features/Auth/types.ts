export type tokenDto = {
    accessToken: string;
    refreshToken: string;
};

export type tokenInfo = {
    aud: string;
    iss: string;
    exp: number;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": number;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    iat: number;
    nbf: number;
};

export type userInfo = {
    userInfo: {
        fullName: string;
        email: string;
    } | null;
    tokens: { accessToken: string; refreshToken: string } | null;
};
