import React, {FormEvent, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/reduxHooks";
import {setLoading} from "../store/reducers/authSlice";
import Loader from "../Components/Loader";
import {toast} from "react-toastify";
import axios from "axios";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {auth, database} from "../firebaseConfig";
import {v4 as uuidv4} from 'uuid'
import {addDoc, collection, Timestamp} from "firebase/firestore";
import {useNavigate} from "react-router-dom";

interface IFormData {
    type: string,
    name: string,
    bedrooms: number,
    bathrooms: number,
    parking: false,
    furniture: false,
    address: string,
    description: string,
    discount: boolean,
    regularPrice: number,
    discountedPrice?: number,
    images?: any,
    latitude?: number,
    longitude?: number
}


const CreateAdvertisement = () => {


    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [geolocationIsWorking, setGeolocationIsWorking] = useState(true)
    const [formData, setFormData] = useState<IFormData>({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furniture: false,
        address: '',
        description: '',
        discount: true,
        regularPrice: 0,
        discountedPrice: 0,
        images: [],
        latitude: 0,
        longitude: 0
    })

    const {
        type, name, bedrooms, bathrooms, parking, furniture, address,
        description, discount, regularPrice, discountedPrice, images, latitude, longitude
    } = formData

    const handleChange = (e: any) => {
        let booleanValue = null;
        if (e.target.value === 'true') {
            booleanValue = true
        }
        if (e.target.value === 'false') {
            booleanValue = false
        }
        // Images
        if (e.target.files) {
            setFormData({
                ...formData,
                images: e.target.files
            })
        }
        // Text/Boolean/Number
        if (!e.target.files) {
            setFormData({
                ...formData,
                [e.target.name]: booleanValue ?? e.target.value // two value, if booleanValue !== null, in other case two value
            })
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (discount) {
            if (discountedPrice && (+discountedPrice >= +regularPrice)) {
                setIsLoading(false)
                toast.error(`Discounted price can't be more than regular`)
                return
            }
        }


        if (images.length > 6) {
            setIsLoading(false)
            toast.error(`Maximum 6 images`)
            return;
        }
        let geolocation = {
            lat: 0,
            long: 0

        };
        let location: any;
        // const adder = '193 wickham tce'
        if (geolocationIsWorking) {
            const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.REACT_APP_GEOCODE_API_KEY}`)
            const data = await response.data
            console.log(data)
            console.log('longitude' + data.features[0]?.center[0])
            console.log('latitude' + data.features[0]?.center[1])

            geolocation.lat = data.features[0]?.center[1] ?? 0
            geolocation.long = data.features[0]?.center[0] ?? 0
            console.log(geolocation)

            location = data.features.length === 0 && undefined
            console.log(data.features.length)
            console.log(location)

            if (location === undefined) {
                setIsLoading(false)
                toast.error('Enter a correct address')
            }
        } else {
            if (longitude && latitude) {
                geolocation.lat = latitude
                geolocation.long = longitude
            }

        }

        const collectImage = async (image: any) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const imageName = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, imageName)
                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );

            })
        }


        const imageUrls = await Promise.all(
            [...images].map(image => collectImage(image))
        ).catch((e) => {
            setIsLoading(false)
            toast.error(`Files weren't uploaded`)
            return
        })

        // imageUrls also using in rules of firebase, it's really should be careful, names have to be same

        const copyFormData = {
            ...formData,
            geolocation,
            imageUrls,
            createdAt: Timestamp.fromDate(new Date()),
            userId: auth.currentUser?.uid,
        }

        delete copyFormData.images;
        delete copyFormData.longitude;
        delete copyFormData.latitude;
        !copyFormData.discount && delete copyFormData.discountedPrice;

        const addedDocRed = await addDoc(collection(database, 'advertisements'), copyFormData)
        console.log(addedDocRed)
        setIsLoading(false)
        toast.success('The advertisement was add')
        navigate(`/category/${copyFormData.type}/${addedDocRed.id}`)
    }

    if (isLoading) {
        return <Loader/>
    }

    return (
        <main className={'max-w-[768px] mx-auto'}>
            <h2 className={'text-[44px] font-bold text-center mt-[10px]'}>
                Create an advertisement
            </h2>
            <form className={'px-[15px]'} onSubmit={handleSubmit}>
                <p className={'text-[20px] mt-[12px] mb-[5px] font-semibold'}>Sell / Rent</p>
                <div className={'flex w-full gap-[2%]'}>
                    <button type={'button'} className={`text-[18px] w-full shadow-md rounded py-[8px] px-[8px] bg-white hover:shadow-lg focus:shadow-lg active:shadow-lg
                    font-medium transition duration-300 ease-in-out ${type === 'sell' ? 'bg-green-500 text-white' : 'bg-white'}`}
                            name={'type'} value={'sell'} onClick={handleChange}>SELL
                    </button>
                    <button type={'button'} className={`text-[18px] w-full shadow-md rounded py-[8px] px-[8px] bg-white hover:shadow-lg focus:shadow-lg active:shadow-lg
                    font-medium transition duration-300 ease-in-out ${type === 'rent' ? 'bg-green-500 text-white' : 'bg-white'}`}
                            name={'type'} value={'rent'} onClick={handleChange}>RENT
                    </button>
                </div>
                <p className={'text-[20px] mt-[10px] mb-[5px] font-semibold'}>Name</p>
                <input value={name} onChange={handleChange} maxLength={34} minLength={4} required name={'name'}
                       className={`text-[16px]  w-full  p-2 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 `}/>
                <div className={'flex gap-[20px]'}>
                    <div className={''}>
                        <p className={'text-[20px] mt-[10px] mb-[5px] font-semibold'}>Bedrooms</p>
                        <input type={'number'} value={bedrooms} min={'1'} max={'20'} required onChange={handleChange}
                               name={'bedrooms'}
                               className={`text-[16px] w-full text-center p-3 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 `}/>
                    </div>
                    <div className={''}>
                        <p className={'text-[20px] mt-[10px] mb-[5px] font-semibold'}>Bathrooms</p>
                        <input type={'number'} value={bathrooms} min={'1'} max={'20'} required onChange={handleChange}
                               name={'bathrooms'}
                               className={`text-[16px] w-full text-center p-3 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 `}/>
                    </div>
                </div>
                <p className={'text-[20px] mt-[12px] mb-[5px] font-semibold'}>Parking space</p>
                <div className={'flex w-full gap-[2%]'}>
                    <button type={'button'} className={`text-[18px] w-full shadow-md rounded py-[8px] px-[8px] bg-white hover:shadow-lg focus:shadow-lg active:shadow-lg
                    font-medium transition duration-300 ease-in-out ${parking ? 'bg-green-500 text-white' : 'bg-white'}`}
                            name={'parking'} value={"true"} onClick={handleChange}>YES
                    </button>
                    <button type={'button'} className={`text-[18px] w-full shadow-md rounded py-[8px] px-[8px] bg-white hover:shadow-lg focus:shadow-lg active:shadow-lg
                    font-medium transition duration-300 ease-in-out ${!parking ? 'bg-green-500 text-white' : 'bg-white'}`}
                            name={'parking'} value={'false'} onClick={handleChange}>NO
                    </button>
                </div>
                <p className={'text-[20px] mt-[12px] mb-[5px] font-semibold'}>Furniture</p>
                <div className={'flex w-full gap-[2%]'}>
                    <button type={'button'} className={`text-[18px] w-full shadow-md rounded py-[8px] px-[8px] bg-white hover:shadow-lg focus:shadow-lg active:shadow-lg
                    font-medium transition duration-300 ease-in-out ${furniture ? 'bg-green-500 text-white' : 'bg-white'}`}
                            name={'furniture'} value={'true'} onClick={handleChange}>YES
                    </button>
                    <button type={'button'} className={`text-[18px] w-full shadow-md rounded py-[8px] px-[8px] bg-white hover:shadow-lg focus:shadow-lg active:shadow-lg
                    font-medium transition duration-300 ease-in-out ${!furniture ? 'bg-green-500 text-white' : 'bg-white'}`}
                            name={'furniture'} value={'false'} onClick={handleChange}>NO
                    </button>
                </div>
                <p className={'text-[20px] mt-[10px] mb-[5px] font-semibold'}>Address</p>
                <textarea value={address} onChange={handleChange} required name={'address'}
                          className={`text-[16px]  w-full  p-2 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 resize-none `}/>

                {
                    !geolocationIsWorking ?
                        <div className={'flex gap-[10px]'}>
                            <div>
                                <p className={'text-[20px] mt-[10px] mb-[5px] font-semibold'}>Latitude</p>
                                <input type="number" name="latitude" value={latitude} onChange={handleChange}
                                       min={'-90'} max={'90'}
                                       className={`text-[16px] w-full text-center p-3 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 `}/>
                            </div>
                            <div>
                                <p className={'text-[20px] mt-[10px] mb-[5px] font-semibold'}>Longitude</p>
                                <input type="number" name="longitude" value={longitude} onChange={handleChange}
                                       min={'-180'} max={'180'}
                                       className={`text-[16px] w-full text-center p-3 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 `}/>
                            </div>
                        </div>
                        :
                        null
                }

                <p className={'text-[20px] mt-[10px] mb-[5px] font-semibold'}>Description</p>
                <textarea value={description} onChange={handleChange} required name={'description'}
                          className={`text-[16px]  w-full  p-2 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 resize-none `}/>
                <p className={'text-[20px] mt-[12px] mb-[5px] font-semibold'}>Discount</p>
                <div className={'flex w-full gap-[2%]'}>
                    <button type={'button'} className={`text-[18px] w-full shadow-md rounded py-[8px] px-[8px] bg-white hover:shadow-lg focus:shadow-lg active:shadow-lg
                    font-medium transition duration-300 ease-in-out ${discount ? 'bg-green-500 text-white' : 'bg-white'}`}
                            name={'discount'} value={'true'} onClick={handleChange}>YES
                    </button>
                    <button type={'button'} className={`text-[18px] w-full shadow-md rounded py-[8px] px-[8px] bg-white hover:shadow-lg focus:shadow-lg active:shadow-lg
                    font-medium transition duration-300 ease-in-out ${!discount ? 'bg-green-500 text-white' : 'bg-white'}`}
                            name={'discount'} value={'false'} onClick={handleChange}>NO
                    </button>
                </div>
                <div className={'flex'}>
                    <div>
                        <p className={'text-[20px] mt-[12px] mb-[5px] font-semibold'}>Regular Price</p>
                        <div className={'flex items-center gap-[10px]'}>
                            <input type="number" value={regularPrice} min={'30'} max={'500000000'} required
                                   onChange={handleChange} name={'regularPrice'}
                                   className={`text-[16px] w-full text-center p-3 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 `}/>
                            {
                                type === 'rent' ?
                                    <div>
                                        <p className={'text-[20px] w-full whitespace-nowrap'}>$ / month</p>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </div>
                {
                    discount ?
                        <div className={'flex'}>
                            <div>
                                <p className={'text-[20px] mt-[10px] mb-[5px] font-semibold'}>Discounted Price</p>
                                <div className={'flex items-center gap-[10px]'}>
                                    <input type="number" value={discountedPrice} min={'1'} max={'500000000'} required
                                           onChange={handleChange} name={'discountedPrice'}
                                           className={`text-[16px] w-full text-center p-3 rounded-[6px] bg-white border-2 border-gray-300 outline-none focus:border-blue-500 `}/>
                                    {
                                        type === 'rent' ?
                                            <div>
                                                <p className={'text-[20px] w-full whitespace-nowrap'}>$ / month</p>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
                <div className={'mt-[12px] mb-[5px]'}>
                    <p className={'text-[20px]  font-semibold'}>Images</p>
                    <p className={'text-[16px] mb-[4px] text-gray-600'}>The first image will be the cover (max 6)</p>
                    <input type="file" onChange={handleChange} accept={'.jpg, .jpeg, .png'} multiple required
                           name={'images'}
                           className={`bg-white px-[8px] py-[4px] rounded w-full`}/>
                </div>
                <button type={'submit'} className={`uppercase bg-green-500 p-[10px] w-full text-[20px] 
                text-white font-semibold rounded-[10px] my-[15px] hover:bg-green-600 active:bg-green-700 transition duration-300 ease-in-out shadow-lg`}>Create
                    an advertisement
                </button>
            </form>
        </main>
    );
};

export default CreateAdvertisement;