import React, {useEffect, useState} from 'react';
import {IAdvertisement} from "./Profile";
import {toast} from "react-toastify";
import {collection, getDocs, limit, orderBy, query, startAfter, where} from "firebase/firestore";
import {database} from "../firebaseConfig";
import Loader from "../Components/Loader";
import Advertisement from "../Components/Advertisement";
import {useParams} from "react-router-dom";

const CategoryPage = () => {

    const [advs, setAdvs] = useState<IAdvertisement[]>([])
    const [loading, setLoading] = useState(true)
    const [lastLoadedAdv, setLastLoadedAdv] = useState<any>()

    const params = useParams()

    useEffect(() => {
        const getAdvertisements = async () => {

            try {
                const advertisementsRef = collection(database, 'advertisements')

                const quer = query(advertisementsRef, where('type', '==', params.categoryType),
                    orderBy('createdAt', 'desc'),  limit(5) )

                const querSnap = await getDocs(quer)

                const lastCurrentAdv = querSnap.docs[querSnap.docs.length - 1]
                setLastLoadedAdv(lastCurrentAdv)


                let advertisements: IAdvertisement[] = []
                querSnap.forEach((doc) => {
                    advertisements.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setAdvs(advertisements)
                console.log(advertisements)

            } catch (e) {
                toast.error('Something is wrong')
            }
            finally {
                setLoading(false)
            }
        }

        getAdvertisements()
    }, [params.categoryType])

    const fetchMoreOffers = async () => {
        try {
            const advertisementsRef = collection(database, 'advertisements')

            const quer = query(advertisementsRef, where('type', '==', params.categoryType),
                orderBy('createdAt', 'desc'), startAfter(lastLoadedAdv), limit(5) )

            const querSnap = await getDocs(quer)

            const lastCurrentAdv = querSnap.docs[querSnap.docs.length - 1]
            setLastLoadedAdv(lastCurrentAdv)
            console.log(lastCurrentAdv)

            let advertisements: IAdvertisement[] = []
            querSnap.forEach((doc) => {
                advertisements.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setAdvs([...advs, ...advertisements])
            console.log(advertisements)

        } catch (e) {
            console.log(e)
            toast.error('Something is wrong')
        }
        finally {
            setLoading(false)
        }

    }


    return (
        <div className={'max-w-[1280px] mx-auto px-[10px]'}>
            <h2 className={'text-[32px] text-center font-[700] mt-[20px] mb-[15px]'}>
                {params.categoryType === 'rent' ? 'Rent Page' : 'Sell Page'}
            </h2>
            {
                loading ?
                    <Loader />
                    :
                    (advs.length > 0 ?
                            <>
                                <main>
                                    <div className={`grid grid-cols-5 gap-[10px] max-[1400px]:grid-cols-4 max-[1145px]:grid-cols-3 max-[868px]:grid-cols-2 
                        max-[868px]:gap-[6px] max-[565px]:grid-cols-1 mb-[10px]`}>
                                        {
                                            advs.map((adv) =>
                                                <Advertisement key={adv.id} advertisement={adv.data} id={adv.id} />
                                            )
                                        }
                                    </div>
                                </main>
                                {
                                    lastLoadedAdv ?
                                        <div className={'flex justify-center items-center mb-[8px]'}>
                                            <button onClick={fetchMoreOffers} className={`bg-white rounded-[6px] 
                                        px-[8px] py-[3px] text-[18px] 
                                        font-[600] shadow-lg hover:shadow-xl transition duration-300 ease-in-out
                                        border border-gray-300 hover:border-gray-600`}>Load more</button>
                                        </div>
                                        :
                                        null
                                }
                            </>

                            :
                            <p>No {params.categoryType === 'rent' ? 'rent' : 'sell'} at the moment</p>
                    )
            }
        </div>
    );
};

export default CategoryPage;