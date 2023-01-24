import { onAuthStateChanged } from 'firebase/auth';
import React, {useEffect, useState} from 'react';
import {auth} from "../firebaseConfig";

export const useAuthState = () => {

    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuth(true)
            }
            setLoading(false)
        })
    }, [])

    return {isAuth, loading, setIsAuth}
};

