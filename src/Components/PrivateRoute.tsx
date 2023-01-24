import React, {useState} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {useAuthState} from "../hooks/useAuthState";
import {useAppSelector} from "../hooks/reduxHooks";
import Loader from "./Loader";

const PrivateRoute = () => {

   // const {isAuth, loading} = useAuthState()

    const {loading, isAuth} = useAppSelector(state => state.auth)


    if (loading) {
        return <Loader/>
    }

    return (
        <>
            {
                isAuth ?
                    <Outlet/>
                    :
                    <Navigate to={'/login'}/>
            }
        </>
    );
};

export default PrivateRoute;