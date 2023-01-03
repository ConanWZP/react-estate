import React, {FormEvent, useState} from 'react';
import ShowHidePassword from "../Components/ShowHidePassword/ShowHidePassword";
import {Link, useNavigate} from "react-router-dom";
import GoogleAuth from "../Components/GoogleAuth";
import {auth, database} from "../firebaseConfig";
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {doc, setDoc, Timestamp } from 'firebase/firestore';
import {toast} from "react-toastify";


const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        loading: false,
        error: ''
    })
    const {name, email, password, loading, error} = formData

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const [isShow, setIsShow] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            // create user on Authentication
            const result = await createUserWithEmailAndPassword(auth, email, password)

            // add displayName to user
            if (auth?.currentUser) {
                await updateProfile(auth?.currentUser, {
                    displayName: name
                })
            }

            //create user on firestore database
            await setDoc(doc(database, 'users', result.user.uid), {
                uid: result.user.uid,
                name,
                email,
                createdAt: Timestamp.fromDate(new Date())
            })
            toast.success('You signed up')
            navigate('/')

        } catch (e: any) {
            toast.error(e.message)
        }
    }

    return (
        <section className={'max-w-[1280px] mx-auto px-[20px] max-[960px]:px-[8px]'}>
            <h2 className={'text-center mt-[25px] text-[44px] font-bold mb-[30px] max-[480px]:text-[40px]'}>
                Sign Up
            </h2>
            <div className={'flex items-center justify-center max-[768px]:flex-col md:justify-between'}>
                <div className={'mb-[25px] max-w-[500px] max-[960px]:max-w-[48vw] max-[768px]:max-w-[70vw]'}>
                    <img className={'rounded-[20px]'}
                         src={'https://www.daddy-geek.com/wp-content/uploads/2017/02/new-home-house.jpg'}
                         alt={'image'}/>
                </div>
                <div
                    className={'w-[380px] flex-col flex gap-[10px] items-center mb-[25px] max-w-[500px] max-[960px]:gap-[6px]'}>
                    <form className={'flex-col flex gap-[10px] items-center max-[960px]:gap-[8px]'}
                          onSubmit={handleSubmit}>
                        <div>
                            <input value={name} name={'name'} placeholder={'Name'}
                                   onChange={(e: any) => handleChange(e)} type={'text'}
                                   className={'text-[20px] w-[380px] p-3 rounded-[10px] bg-white outline-none border-2 border-gray-300 focus:border-blue-500 '}/>
                        </div>
                        <div>
                            <input value={email} name={'email'} placeholder={'Email'}
                                   onChange={(e: any) => handleChange(e)} type={'email'}
                                   className={'text-[20px] w-[380px] p-3 rounded-[10px] bg-white outline-none border-2 border-gray-300 focus:border-blue-500 '}/>
                        </div>
                        <div className={'relative'}>
                            <input value={password} name={'password'} placeholder={'Password'}
                                   onChange={(e: any) => handleChange(e)} type={isShow ? 'text' : 'password'}
                                   className={'text-[20px]  w-[380px]  p-3 rounded-[10px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 '}/>

                            <ShowHidePassword isShow={isShow} changeShow={setIsShow}/>
                        </div>

                        <div className={'flex justify-between w-full max-[960px]:my-[6px]'}>
                            <div>
                                <span className={'mr-[5px]'}>Have an account?</span>
                                <Link className={'text-red-600 cursor-pointer'} to={'/login'}>Login</Link>
                            </div>
                            {/*<div>
                                <Link className={'text-blue-600 cursor-pointer'} to={'/restore-password'}>
                                    Forgot Password?
                                </Link>
                            </div>*/}
                        </div>
                        <button
                            className={'bg-green-600 p-[10px] rounded-[5px] w-full text-[26px] text-white max-[960px]:p-[6px] hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg active:shadow-lg transition duration-300 ease-in-out'}>
                            Sign Up
                        </button>
                        <div
                            className={' gap-[20px] w-full flex items-center before:border-b before:flex-1 before:border-gray-400 after:border-b after:flex-1 after:border-gray-400'}>
                            <p>OR</p>
                        </div>
                        <GoogleAuth/>


                    </form>


                </div>
            </div>
        </section>
    );
};

export default Register;