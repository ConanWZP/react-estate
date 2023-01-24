import React from 'react';
import {FcGoogle} from 'react-icons/fc'
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {auth, database} from "../firebaseConfig";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {doc, getDoc, setDoc, Timestamp, updateDoc} from 'firebase/firestore';

const GoogleAuth = () => {

    const navigate = useNavigate()

    const authByGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider)

            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken
            const user = result.user

            const docReference = doc(database, 'users', result.user.uid)
            const docSnap = await getDoc(docReference)

            if (!docSnap.exists()) {
                await setDoc(docReference, {
                    uid: result.user.uid,
                    name: user.displayName,
                    email: user.email,
                    createdAt: Timestamp.fromDate(new Date())
                })
            }


            toast.success('You signed up')
            navigate('/')


        } catch (e: any) {
            toast.error(e.message)
        }


    }

    // type='button' - for disabling auto submit because this button inside <form></>

    return (
        <button type={'button'} onClick={authByGoogle}
                className={'bg-red-600 p-[10px] rounded-[5px] w-full text-[26px] text-white max-[960px]:p-[6px] flex items-center justify-center gap-[5px] hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg active:shadow-lg transition duration-300 ease-in-out'}>
            <FcGoogle className={'bg-white rounded-[50%] d'}/>
            Continue with Google
        </button>
    );
};

export default GoogleAuth;