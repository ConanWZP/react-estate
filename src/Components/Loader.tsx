import React from 'react';
import loaderInfinity from './../assets/svg/loaderInfinity.svg'

const Loader = () => {
    return (
        <div className={'flex justify-center items-center h-[100vh] bg-black bg-opacity-30 fixed left-0 top-0 right-0 bottom-0 z-50'}>
            <div>
                <img src={loaderInfinity} alt={'Loading...'} className={'h-[128px]'} />
            </div>
        </div>
    );
};

export default Loader;