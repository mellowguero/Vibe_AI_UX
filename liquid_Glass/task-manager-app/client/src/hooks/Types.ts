export interface IUser {
    id: string,
    username: string,
    authToken: string,
}

export interface IAuthContext {
    user: IUser | null,
    setUser: (user: IUser | null) => void,
}

