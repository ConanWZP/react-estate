import {signOut, updateProfile} from 'firebase/auth';
import React, {useEffect, useState} from 'react';
import {auth, database} from "../firebaseConfig";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where} from "firebase/firestore";
import {useAppDispatch} from "../hooks/reduxHooks";
import {setIsAuth} from "../store/reducers/authSlice";
import {FcHome} from 'react-icons/fc';
import Advertisement from '../Components/Advertisement';

export interface IAdvertisement {
    id: string,
    data: any
}

const Profile = () => {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()


    const [editMode, setEditMode] = useState(false)

    const [advs, setAdvs] = useState<IAdvertisement[]>([])
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email
    } as any)

    const {name, email} = formData

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const logout = async () => {
        await signOut(auth)
        dispatch(setIsAuth(false))
        toast.success('You signed out')
        navigate('/')
    }

    const editName = () => {
        setEditMode(true)
    }

    const saveName = async () => {
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
                await updateDoc(doc(database, 'users', auth.currentUser?.uid), {
                    name: name
                })
            }
            toast.success('The name was changed')
        } catch (e) {
            toast.error('The name was not changed')
        }
        setEditMode(false)
    }


    useEffect(() => {
        const getAdvertisements = async () => {

            setLoading(true)
            const advertisementRef = collection(database, 'advertisements')

            // используем коллекцию, а потом query, в котором есть условие, вместо просто использования
            // doc, т.к. в doc'e мы юзаем просто путь, но для advertisements путь сложнее (он состоит из id,
            // времени и uuidv4), поэтому используем query с условием. userId - поле в самом документе. А также
            // таким способом получаем сразу несколько документов, которые соответствуют условию
            const quer = query(advertisementRef, where('userId', '==', auth.currentUser?.uid),
                orderBy('createdAt', "desc"))

            const querSnap = await getDocs(quer)

            let advertisements: any = [];
            querSnap.forEach((doc) => {
                advertisements.push({
                    id: doc.id,
                    data: doc.data()
                } as IAdvertisement)
            })
            setAdvs(advertisements)
            setLoading(false)

        }

        getAdvertisements()

    }, [])

    const editAdv = (id: string) => {
        navigate(`/edit-advertisement/${id}`)
    }

    const deleteAdv = async (id: string) => {
        if (window.confirm('Are you sure you want to delete it?')) {
            await deleteDoc(doc(database, 'advertisements', id))

            const updateLocalAdvertisements = advs.filter((adv) => adv.id !== id)
            setAdvs(updateLocalAdvertisements)
            toast.success('Advertisement was deleted')
        }

    }


    return (
        <>
            <section className={'max-w-[1280px] mx-auto px-[20px] max-[960px]:px-[8px]'}>
                <h2 className={'text-center mt-[15px] text-[40px] font-bold mb-[30px] max-[480px]:text-[34px]'}>Profile</h2>
                <div className={'mx-auto flex flex-col items-center'}>
                    <form className={'flex flex-col items-center gap-[15px] mb-[15px]'}>
                        <input disabled={!editMode} type={'text'} name={'name'} value={name} onChange={handleChange}
                               className={`text-[18px]  w-[350px]  p-3 rounded-[8px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 ${editMode ? 'bg-green-200' : ''}`}/>
                        <input disabled type={'email'} name={'email'} value={email} onChange={handleChange}
                               className={`text-[18px]  w-[350px]  p-3 rounded-[8px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 `}/>

                        <div className={'flex items-center justify-between w-[350px] text-[18px]'}>
                            {
                                editMode ?
                                    <div onClick={saveName}
                                         className={`cursor-pointer font-semibold text-red-500 hover:text-red-700 transition duration-300 ease-in-out`}>Save</div>
                                    :
                                    <div onClick={editName}
                                         className={'cursor-pointer font-semibold text-red-500 hover:text-red-700 transition duration-300 ease-in-out'}>Edit
                                        your name</div>
                            }
                            <div onClick={logout}
                                 className={'cursor-pointer font-semibold text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out'}>Logout
                            </div>
                        </div>
                    </form>
                    <button type={'submit'} className={'bg-green-500 py-[7px] px-[12px] rounded-[10px] w-[350px]'}>
                        <Link to={'/create-advertisement'}
                              className={'flex items-center gap-[10px] text-[22px] font-semibold justify-center'}>
                            <div className={'relative'}>
                                <FcHome
                                    className={'bg-black p-[4px] rounded-[50%] text-[34px] border-[2px] border-white'}/>
                                <div
                                    className={'w-[6px] h-[6px] bg-amber-200 rounded-full absolute top-[5px] left-[8px]'}></div>
                            </div>
                            Rent out or sell your house
                        </Link>
                    </button>
                </div>
            </section>
            {
                advs.length > 0 && !loading ?
                    <div
                        className={'max-w-[1280px] mx-auto mt-[25px] px-[15px] max-[868px]:px-[10px] max-[580px]:px-[6px]'}>
                        <h2 className={'text-[36px] mb-[15px] text-center font-[600]'}>
                            My advertisements
                        </h2>
                        <div className={`grid grid-cols-5 gap-[10px] max-[1400px]:grid-cols-4 max-[1145px]:grid-cols-3 max-[868px]:grid-cols-2 
                        max-[868px]:gap-[6px] max-[565px]:grid-cols-1`}>
                            {advs.map((adv: IAdvertisement) => (
                                <Advertisement key={adv.id} advertisement={adv.data} id={adv.id} editAdv={editAdv}
                                               deleteAdv={deleteAdv}/>
                            ))}
                        </div>
                    </div>
                    : null
            }
        </>

    );
};

export default Profile;