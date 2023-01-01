import React from 'react';
import logo from './../assets/logo.png'
import {Link, Navigate, useLocation, useNavigate} from "react-router-dom";

const Header = () => {

    const location = useLocation()
    const navigate = useNavigate()


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
                            <Link to={'/offers'}>Offers</Link>
                        </li>
                        <li className={`py-[10px]  text-gray-400 font-semibold
                        ${location.pathname === '/login' ? 'border-b-[3px] border-red-500 text-black' : ''}`}>
                            <Link to={'/login'}>Login</Link>
                        </li>
                    </ul>
                </div>
            </header>
        </div>
    );
};

export default Header;