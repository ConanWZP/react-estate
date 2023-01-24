import React, {useEffect, useState} from 'react';
import logo from './../assets/logo.png'
import {Link, useLocation, useNavigate} from "react-router-dom";
import {auth} from "../firebaseConfig";
import {useAuthState} from "../hooks/useAuthState";
import {onAuthStateChanged} from "firebase/auth";
import {useAppSelector} from "../hooks/reduxHooks";

const Header = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const {isAuth} = useAppSelector(state => state.auth)



    /*const [loginState, setLoginState] = useState('Login')*/

    /*useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoginState('Profile')
            } else {
                setLoginState('Login')
            }
        })
    }, [auth])*/



    return (
        <div className={'bg-white border-b shadow-sm sticky top-0 z-20'}>
            <header className={'flex justify-between items-center px-3 max-w-[1280px] mx-auto'}>
                <div onClick={() => navigate('/home')}>
                    <img src={logo} alt={'logo'} className={'h-16 cursor-pointer'}/>
                </div>
                <div>
                    <ul className={'flex gap-[40px] '}>
                        <li className={`py-[10px]  text-gray-400 font-semibold
                        ${location.pathname === '/' || location.pathname === '/home' ? 'border-b-[3px] border-red-500 text-black' : ''}`}>
                            <Link to={'/home'}>Home</Link>
                        </li>
                        <li className={`py-[10px]  text-gray-400 font-semibold
                        ${location.pathname === '/offers' ? 'border-b-[3px] border-red-500 text-black' : ''}`}>
                            <Link to={'/offers'}>Discounts</Link>
                        </li>
                        {/* {
                            loginState === 'Profile' &&
                            <li className={`py-[10px]  text-gray-400 font-semibold
                        ${location.pathname === '/profile' ? 'border-b-[3px] border-red-500 text-black' : ''}`}>
                                <Link to={'/profile'}>Profile</Link>
                            </li>
                        }
                        {
                            loginState === 'Login' &&
                                <li className={`py-[10px]  text-gray-400 font-semibold
                        ${location.pathname === '/login' || location.pathname === '/register' ? 'border-b-[3px] border-red-500 text-black' : ''}`}>
                                    <Link to={'/login'}>Login</Link>
                                </li>
                        }*/}
                        {
                            isAuth ?
                                <li className={`py-[10px]  text-gray-400 font-semibold
                        ${location.pathname === '/profile' ? 'border-b-[3px] border-red-500 text-black' : ''}`}>
                                    <Link to={'/profile'}>Profile</Link>
                                </li>
                                :
                                <li className={`py-[10px]  text-gray-400 font-semibold
                        ${location.pathname === '/login' || location.pathname === '/register' ? 'border-b-[3px] border-red-500 text-black' : ''}`}>
                                    <Link to={'/login'}>Login</Link>
                                </li>
                        }
                    </ul>
                </div>
            </header>
        </div>
    );
};

export default Header;