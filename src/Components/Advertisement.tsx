import React, {FC} from 'react';
import {IAdvertisement} from "../Pages/Profile";
import {Link} from "react-router-dom";
import Moment from "react-moment";
import {HiMapPin} from 'react-icons/hi2'
import {MdModeEdit} from 'react-icons/md'
import {FaTrashAlt} from 'react-icons/fa'


interface AdvertisementProps {
    advertisement: any,
    id: string,
    editAdv?: (id: string) => void,
    deleteAdv?: (id: string) => void
}

const Advertisement: FC<AdvertisementProps> = ({advertisement, id, deleteAdv, editAdv}) => {
    return (
        <div
            className={'bg-white rounded-[10px] relative mb-[10px] overflow-hidden shadow-md hover:shadow-xl transition duration-300 ease-in-out'}>
            <Link to={`/category/${advertisement.type}/${id}`}>
                <div className={'relative overflow-hidden'}>
                    <img className={'h-[170px] w-full hover:scale-110 object-cover transition duration-300 ease-in-out'}
                         loading={'lazy'} src={advertisement.imageUrls[0]}/>
                    <Moment fromNow
                            className={'absolute top-1 left-1 bg-blue-500 rounded-lg px-[5px] py-[2px] text-white font-[600] uppercase text-[14px]'}>
                        {advertisement.createdAt.toDate()}
                    </Moment>
                </div>
                <div className={'px-[8px] py-[5px]'}>
                    <div className={'flex items-center gap-[10px] '}>
                        <HiMapPin className={'text-red-500 h-4 w-4'}/>
                        <p className={'font-[500] text-gray-600 truncate'}>{advertisement.address}</p>
                    </div>
                    <p className={'font-[600] text-[18px] truncate'}>
                        {advertisement.name}
                    </p>
                    <p className={`font-[500] text-[#3db742]`}> {/*${advertisement.discount ? 'text-[#3db742]' : 'text-black'}*/}
                        {
                            advertisement.discount ?
                                advertisement.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                :
                                advertisement.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }$
                        {
                            advertisement.type === 'rent' && ' / month'
                        }
                    </p>
                    <div className={'flex font-[700] mt-[3px] mb-[5px] gap-[15px] text-[14px]'}>
                        <div>
                            {
                                advertisement.bedrooms > 1 ? `${advertisement.bedrooms} Bedrooms` : '1 Bedroom'
                            }
                        </div>
                        <div>
                            {
                                advertisement.bathrooms > 1 ? `${advertisement.bathrooms} Bathrooms` : '1 Bathroom'
                            }
                        </div>
                    </div>
                </div>
            </Link>

            {
                editAdv ?
                    <MdModeEdit className={'absolute right-8 bottom-2 text-blue-500 cursor-pointer'}
                                onClick={() => editAdv(id)}/>
                    :
                    null
            }
            {
                deleteAdv ?
                    <FaTrashAlt className={'absolute right-2 bottom-2 text-red-500 cursor-pointer'}
                                onClick={() => deleteAdv(id)}/>
                    :
                    null
            }
        </div>
    );
};

export default Advertisement;