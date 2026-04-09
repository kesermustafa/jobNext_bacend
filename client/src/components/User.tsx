import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";

const User = () => {
    const user = { photo: "https://picsum.photos/200" };
    const [show, setShow] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShow(false);
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show]);

    const close = () => setShow(false);

    return (
        <div ref={menuRef} className={'relative'}>

            <div onClick={() => setShow(prev => !prev)}
                 className={'flex justify-center items-center gap-1 cursor-pointer'}>
                <span className={'text-nowrap text-green-600 font-semibold'}>User</span>
                <img src={user?.photo} alt="avatar"
                     className={'w-10 rounded-full object-cover bg-gray-200 border border-green-400'}/>
            </div>

            {show && (
                <div className="w-40 z-10 text-center overflow-hidden p-1 text-[13px] flex flex-col
                        absolute top-10 -left-20 transition duration-500 bg-gray-100 rounded-md gap-1">
                    <Link onClick={close}
                          className={'bg-green-200 w-full py-2 text-nowrap hover:text-green-600 hover:font-semibold'}
                          to={'/my-gigs'}>Hizmetler</Link>
                    <Link onClick={close}
                          className={'bg-green-200 w-full py-2 text-nowrap hover:text-green-600 hover:font-semibold'}
                          to={'/my-profile'}>Profile</Link>
                    <Link onClick={close}
                          className={'bg-green-200 w-full py-2 text-nowrap hover:text-green-600 hover:font-semibold'}
                          to={'/my-gigs'}>Hizmetler</Link>
                    <Link onClick={close}
                          className={'bg-green-200 w-full py-2 text-nowrap hover:text-green-600 hover:font-semibold'}
                          to={'/my-gigs-5'}>Hizmetler</Link>
                    <button onClick={close}
                            className={'bg-red-200 w-full py-2 text-nowrap hover:text-red-600 hover:font-semibold'}>
                        Singup
                    </button>
                </div>
            )}

        </div>
    );
};

export default User;