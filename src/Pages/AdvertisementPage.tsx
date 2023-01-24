import {doc, getDoc} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {auth, database} from "../firebaseConfig";
import Loader from "../Components/Loader";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {Navigation, Pagination, EffectFade, Autoplay} from 'swiper';
import 'swiper/swiper-bundle.css'
import {BsShareFill} from 'react-icons/bs'
import {HiMapPin} from "react-icons/hi2";
import {GiBed, GiSofa} from 'react-icons/gi';
import {FaBed, FaParking} from 'react-icons/fa'
import {MdBathtub} from 'react-icons/md';
import Contact from "../Components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';


const AdvertisementPage = () => {

    const params = useParams()
    const [advertisement, setAdvertisement] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [wasClicked, setWasClicked] = useState(false)
    const [showInput, setShowInput] = useState(false)

    const shareLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setWasClicked(true)
        setTimeout(() => {
            setWasClicked(false)
        }, 2500)
    }

    SwiperCore.use([Autoplay, Navigation, Pagination])


    useEffect(() => {
        const getAdvertisement = async () => {
            setLoading(true)
            const dataRef = doc(database, 'advertisements', params.id as string)
            const getData = await getDoc(dataRef)
            if (getData.exists()) {
                setAdvertisement(getData.data())
                setLoading(false)
                console.log(advertisement)
            }
        }
        getAdvertisement()

    }, [params.id])

    if (loading) {
        return <Loader/>
    }


    return (
        <main >
            <div className={'relative'}>
                <Swiper slidesPerView={1} navigation pagination={{type: 'progressbar'}}
                        effect={'fade'} modules={[EffectFade]} autoplay={{delay: 2500}}>
                    {
                        advertisement.imageUrls.map((imageUrl: any, index: number) => (
                            <SwiperSlide key={index}>
                                <div className={'w-full overflow-hidden object-cover h-[300px]'}
                                     style={{background: `url(${imageUrl}) center/cover no-repeat `}}>

                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
                <div
                    className={`absolute top-[13%] right-[5%] bg-white cursor-pointer rounded-[50%] p-[7px] z-10 border-[2px] border-gray-600`}
                    onClick={shareLink}>
                    <BsShareFill/>
                </div>
                {
                    wasClicked ?
                        <div
                            className={'font-[600] bg-white rounded-[10px] px-[10px] py-[3px] border-[2px] border-gray-600 absolute top-[25%] right-[7%] z-10'}>Link
                            copied</div>
                        :
                        null
                }
            </div>
            <div
                className={'flex max-w-[1280px] mx-auto my-[15px] p-[10px] bg-white rounded-[10px] shadow-lg gap-[10px] max-[768px]:flex-col'}>
                <div className={'w-full'}>
                    <p className={'text-[20px] font-[600] mb-[10px] text-blue-700'}>
                        {advertisement.name} - {advertisement.discount ? advertisement.discountedPrice
                            .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        :
                        advertisement.regularPrice
                            .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$
                        {advertisement.type === 'rent' ? ' / month' : null}
                    </p>
                    <div className={'flex gap-[5px] items-center mb-[10px]'}>
                        <HiMapPin className={'text-red-500 h-4 w-4 '}/>
                        <p className={'text-[18px] font-[500]'}>{advertisement.address}</p>
                    </div>
                    <div className={'flex gap-3 mb-[15px]'}>
                        <div
                            className={'w-[170px] h-[35px] rounded-[10px] bg-green-700 flex items-center justify-center text-white font-[500] cursor-pointer'}>
                            <div>{advertisement.type === 'rent' ? 'For Rent' : 'For sale'}</div>
                        </div>
                        {
                            advertisement.discount ?
                                <div
                                    className={'w-[170px] h-[35px] rounded-[10px] bg-blue-500 flex items-center justify-center text-white font-[500] cursor-pointer'}>
                                    <div>
                                        {
                                            ((+advertisement.regularPrice) - (+advertisement.discountedPrice))
                                                .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                        }$ discount
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                    <p className={'text-[18px] font-[600] mb-[15px]'}>
                        Description - <span className={'font-[400]'}>{advertisement.description}</span>
                    </p>
                    <div className={'flex font-[700] mt-[3px] mb-[20px] gap-[15px] text-[14px]'}>
                        <div className={'flex items-center gap-[5px]'}>
                            <FaBed/>
                            {
                                advertisement.bedrooms > 1 ? `${advertisement.bedrooms} Beds` : '1 Bed'
                            }
                        </div>
                        <div className={'flex items-center gap-[5px]'}>
                            <MdBathtub/>
                            {
                                advertisement.bathrooms > 1 ? `${advertisement.bathrooms} Baths` : '1 Bath'
                            }
                        </div>
                        <div className={'flex items-center gap-[5px]'}>
                            <FaParking/>
                            {
                                advertisement.parking ?
                                    'Parking Spot'
                                    : 'No parking'
                            }
                        </div>
                        <div className={'flex items-center gap-[5px]'}>
                            <GiSofa/>
                            {
                                advertisement.furniture ?
                                    'Furnished'
                                    : 'Not furnished'
                            }
                        </div>
                    </div>
                    {
                        (advertisement.userId !== auth.currentUser?.uid && !showInput ) ?
                            <div className={'flex justify-center items-center'}>
                                <button className={`bg-blue-500 text-white text-[18px] rounded-[6px] py-[5px] px-[120px] 
                                shadow-lg hover:bg-blue-600 transition duration-200 ease-in-out w-full
                                 uppercase font-[500]`} onClick={() => setShowInput(true)}>Contact the owner
                                </button>
                            </div>
                            :
                            null
                    }
                    {
                        showInput ?
                            <Contact userId={advertisement.userId} name={advertisement.name} />
                            :
                            null
                    }

                </div>
                <div className={'w-full h-[400px] max-[768px]:h-[200px]'}>
                     {/*@ts-ignore*/}
                    <MapContainer center={[advertisement.geolocation.lat, advertisement.geolocation.long]}
                                  zoom={13}
                                  scrollWheelZoom={false}
                                  style={{height: '100%', width: '100%'}}>
                        {/*@ts-ignore*/}
                        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[advertisement.geolocation.lat, advertisement.geolocation.long]}>
                            <Popup>
                                A pretty CSS3 popup. <br/> Easily customizable.
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </main>
    );
};

export default AdvertisementPage;