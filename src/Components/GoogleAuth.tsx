import React from 'react';
import {FcGoogle} from 'react-icons/fc'

const GoogleAuth = () => {
    return (

        <button
            className={'bg-red-600 p-[10px] rounded-[5px] w-full text-[26px] text-white max-[960px]:p-[6px] flex items-center justify-center gap-[5px] hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg active:shadow-lg transition duration-300 ease-in-out'}>
            <FcGoogle className={'bg-white rounded-[50%] d'}/>
            Continue with Google
        </button>
    );
};

export default GoogleAuth;