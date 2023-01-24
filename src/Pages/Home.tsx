import React, {useEffect, useState} from 'react';
import HomeSlider from "../Components/HomeSlider";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {database} from "../firebaseConfig";
import { Link } from 'react-router-dom';
import Advertisement from "../Components/Advertisement";
import {IAdvertisement} from "./Profile";



const Home = () => {

    // last discounts
    const [lastDiscounts, setLastDiscounts] = useState<IAdvertisement[]>([])

    useEffect(() => {
        const getLastDiscounts = async () => {
            const collectionRef = collection(database, 'advertisements')

            const quer = query(collectionRef, where('discount', '==', true),
            orderBy('createdAt', 'desc'), limit(4));

            const querSnap = await getDocs(quer)
            const advertisements: any = []
            querSnap.forEach((doc) => {
                advertisements.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setLastDiscounts(advertisements)
            console.log(advertisements)
        }
        getLastDiscounts()
    }, [])


    // last rents
    const [lastRents, setLastRents] = useState<IAdvertisement[]>([])

    useEffect(() => {
        const getLastRents = async () => {
            const collectionRef = collection(database, 'advertisements')

            const quer = query(collectionRef, where('type', '==', 'rent'),
                orderBy('createdAt', 'desc'), limit(4));

            const querSnap = await getDocs(quer)
            const advertisements: any = []
            querSnap.forEach((doc) => {
                advertisements.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setLastRents(advertisements)
            console.log(advertisements)
        }
        getLastRents()
    }, [])


    // last sale
    const [lastSales, setLastSales] = useState<IAdvertisement[]>([])

    useEffect(() => {
        const getLastSales = async () => {
            const collectionRef = collection(database, 'advertisements')

            const quer = query(collectionRef, where('type', '==', 'sell'),
                orderBy('createdAt', 'desc'), limit(4));

            const querSnap = await getDocs(quer)
            const advertisements: any = []
            querSnap.forEach((doc) => {
                advertisements.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setLastSales(advertisements)
            console.log(advertisements)
        }
        getLastSales()
    }, [])



    return (
        <div>
            <HomeSlider />
            <div className={'max-w-[1280px] mx-auto mt-[10px] flex flex-col gap-[20px]'}>
                {
                    lastDiscounts.length > 0 ?
                            <div className={'pl-[10px]'}>
                                <h2 className={'text-[22px] font-[600] '}>Latest discount offers</h2>
                                <Link to={'/offers'} className={`text-[18px] text-blue-500 
                                hover:text-blue-800 transition duration-300 ease-in-out `}>Show more offers</Link>
                                <div className={`grid grid-cols-4 gap-[10px]  
                                max-[1145px]:grid-cols-3 max-[768px]:grid-cols-2 max-[768px]:gap-[6px] 
                                max-[480px]:grid-cols-1`}>
                                    {
                                        lastDiscounts.map((advertisement) => (
                                            <Advertisement key={advertisement.id}
                                                           advertisement={advertisement.data}
                                                           id={advertisement.id}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        :
                        <div>Nothing found</div>
                }
                {
                    lastSales.length > 0 ?
                        <div className={'pl-[10px]'}>
                            <h2 className={'text-[22px] font-[600] '}>Latest rent offers</h2>
                            <Link to={'/category/rent'} className={`text-[18px] text-blue-500 
                                hover:text-blue-800 transition duration-300 ease-in-out `}>Show more rent offers</Link>
                            <div className={`grid grid-cols-4 gap-[10px]  
                                max-[1145px]:grid-cols-3 max-[768px]:grid-cols-2 max-[768px]:gap-[6px] 
                                max-[480px]:grid-cols-1`}>
                                {
                                    lastRents.map((advertisement) => (
                                        <Advertisement key={advertisement.id}
                                                       advertisement={advertisement.data}
                                                       id={advertisement.id}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                        :
                        <div>Nothing found</div>
                }
                {
                    lastSales.length > 0 ?
                        <div className={'pl-[10px]'}>
                            <h2 className={'text-[22px] font-[600] '}>Latest sale offers</h2>
                            <Link to={'/category/sell'} className={`text-[18px] text-blue-500 
                                hover:text-blue-800 transition duration-300 ease-in-out `}>Show more sale offers</Link>
                            <div className={`grid grid-cols-4 gap-[10px]  
                                max-[1145px]:grid-cols-3 max-[768px]:grid-cols-2 max-[768px]:gap-[6px] 
                                max-[480px]:grid-cols-1`}>
                                {
                                    lastSales.map((advertisement) => (
                                        <Advertisement key={advertisement.id}
                                                       advertisement={advertisement.data}
                                                       id={advertisement.id}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                        :
                        <div>Nothing found</div>
                }
            </div>
        </div>
    );
};

export default Home;