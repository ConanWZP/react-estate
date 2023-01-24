import React, {ChangeEvent, FC, FormEvent, useEffect, useState} from 'react';
import {doc, getDoc} from "firebase/firestore";
import {database} from "../firebaseConfig";
import Loader from "./Loader";
import {toast} from "react-toastify";

interface ContactProps {
    userId: string,
    name: string
}

const Contact: FC<ContactProps> = ({userId, name}) => {

    const [ownerData, setOwnerData] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')


       useEffect(() => {
           const getOwnerName = async () => {
               setLoading(true)
               let userRef = doc(database, 'users', userId)
               let getUser = await getDoc(userRef)
               if (getUser.exists()) {
                   setOwnerData(getUser.data())
               } else {
                   toast.error('Owner data was not uploaded')
               }
               setLoading(false)
           }

           getOwnerName()

       }, [userId])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)

    }

    if (loading) {
        return <Loader />
    }

    return (
        <div>
           <p className={'font-[500]'}>Contact with {ownerData?.name} for {name}</p>
            <textarea name={'message'} value={message} onChange={handleChange}
                      className={`text-[16px] mt-[8px] w-full  p-2 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 resize-none `}/>
            <a href={`mailto:${ownerData?.email}?Subject=${name}&body=${message}`}>
                <button className={`bg-blue-500 py-[8px] w-full rounded-[7px] text-white text-[18px] font-[600] hover:bg-blue-600 hover:shadow-lg
                 active:bg-blue-700 transition duration-300 ease-in-out`}>Send message</button>
            </a>
        </div>
    );
};

export default Contact;