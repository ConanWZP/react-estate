import React, {useEffect, useState} from 'react';
import {IAdvertisement} from "../Pages/Profile";
import {collection, getDocs, limit, orderBy, query} from "firebase/firestore";
import {database} from "../firebaseConfig";
import Loader from "./Loader";
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Autoplay, EffectFade, Navigation, Pagination} from "swiper";
import {useNavigate} from "react-router-dom";

const HomeSlider = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [advs, setAdvs] = useState<IAdvertisement[]>([])


    SwiperCore.use([Autoplay, Navigation, Pagination])

    useEffect(() => {
        const getAdvertisements = async () => {
            //setLoading(true)

            const advertisementsRef = collection(database, 'advertisements')

            const quer = query(advertisementsRef, orderBy('createdAt', 'desc'), limit(5))

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
            console.log(advertisements)
        }

        getAdvertisements()

    }, [])

    if (loading) {
        return <Loader/>
    }

    if (advs.length === 0) {
        return <></>
    }


    return (
        <>
            {advs ?
                <Swiper slidesPerView={1} navigation pagination={{type: 'progressbar'}}
                        effect={'fade'} modules={[EffectFade]} autoplay={{delay: 2500}}>
                    {
                        advs.map((adv) => (
                            <SwiperSlide key={adv.id}
                                         onClick={() => navigate(`/category/${adv.data.type}/${adv.id}`)}>
                                    <div className={'relative h-[300px] w-full overflow-hidden object-cover cursor-pointer'}
                                         style={{background: `url(${adv.data.imageUrls[0]}) center/cover no-repeat`}}>
                                    </div>
                                <p className={`bg-[#619bd2] px-[9px] py-[4px] rounded-br-[7px] shadow-lg
                                absolute left-1 top-3 font-[500] text-white text-[18px]`}>
                                    {adv.data.name}
                                </p>
                                <p className={`bg-[#d75b5b] px-[9px] py-[4px] rounded-tr-[7px] shadow-lg
                                absolute left-1 bottom-3 font-[500] text-white text-[18px]`}>
                                    {adv.data.discount ?
                                        adv.data.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        :
                                        adv.data.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                    }
                                    {adv.data.type === 'sell' ? '$' : '$ / month'}
                                </p>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                : null
            }
        </>
    );
};

export default HomeSlider;