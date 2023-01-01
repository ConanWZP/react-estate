import React, {FormEventHandler, FormHTMLAttributes, useState} from 'react';
import {Link} from "react-router-dom";
import ShowHidePassword from "../Components/ShowHidePassword/ShowHidePassword";

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        loading: false,
        error: ''
    })
    const {email, password, loading, error} = formData

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const [isShow, setIsShow] = useState(false)
    console.log(formData)

    return (
        <section className={'max-w-[1280px] mx-auto px-[20px]'}>
            <h2 className={'text-center mt-[25px] text-[44px] font-bold mb-[30px]'}>
                Login Page (sign in)
            </h2>
            <div className={'flex items-center justify-center flex-wrap md:flex-nowrap md:justify-between'}>
                <div className={'lg:max-w-[500px] md:max-w-[350px] max-w-[400px] mb-[25px]'}>
                    <img className={'rounded-[20px]'}
                         src={'https://www.daddy-geek.com/wp-content/uploads/2017/02/new-home-house.jpg'}
                         alt={'image'}/>
                </div>
                <div className={'flex-col flex gap-[10px] items-center mb-[25px]'}>

                    <form className={'flex-col flex gap-[10px] items-center'}>
                        <div>
                            <input value={email} name={'email'} placeholder={'Email'}
                                   onChange={(e: any) => handleChange(e)} type={'email'}
                                   className={'text-[20px] w-[300px] p-3 rounded-[10px] bg-white outline-none border-2 border-gray-300 focus:border-blue-500'}/>
                        </div>
                        <div className={'relative'}>
                            <input value={password} name={'password'} placeholder={'Password'}
                                   onChange={(e: any) => handleChange(e)} type={isShow ? 'text' : 'password'}
                                   className={'text-[20px] w-[300px] p-3 rounded-[10px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500'}/>

                            <ShowHidePassword isShow={isShow} changeShow={setIsShow} />
                        </div>

                    </form>

                    <div className={'flex gap-[10px]'}>
                        <div>
                            Don't have account
                        </div>
                        <div>
                            <Link to={'/restore-password'}>Forgot Password?</Link>
                        </div>
                    </div>
                    <button className={'bg-green-500 p-[10px] rounded-[5px] w-[350px] text-[26px]'}>Login</button>
                    ----- OR ------
                    <button className={'bg-red-500 p-[10px] rounded-[5px] w-[350px] text-[26px]'}>Continue with
                        Google</button>


                </div>
            </div>
        </section>
    );
};

export default Login;