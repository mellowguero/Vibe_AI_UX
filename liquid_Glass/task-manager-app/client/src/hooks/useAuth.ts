import { IUser } from "./Types";
import { useUser } from "./useUser";
import { useLocalStorage } from "./useLocalStorage";
import { useEffect } from "react";

export const useAuth = () => {
    const { user, addUser, removeUser } = useUser();
    const { getItem } = useLocalStorage();

    useEffect(() => {
		// #region agent log
		fetch('http://127.0.0.1:7242/ingest/1e5aa359-db93-455b-8285-ac7b5edaefa5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useAuth.ts:10',message:'useEffect called',data:{hasGetItem:!!getItem,getItemType:typeof getItem},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
		// #endregion
        const user = getItem('user');
        if (user) {
            addUser(JSON.parse(user));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Login function that takes a user object and adds it to local storage
    const login = (user: IUser) => {
        addUser(user);
    }

    const logout = () => {
        removeUser();
    }

    return { user, login, logout };
}

export default useAuth;