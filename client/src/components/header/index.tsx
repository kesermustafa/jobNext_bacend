import React from 'react';
import {Link} from "react-router-dom";
import {IoSearch} from "react-icons/io5";
import Links from "../Links.tsx";
import User from "../User.tsx";
import {useAuth} from "../../context/authContent.tsx";


const Header = () => {

    const { user, logout } = useAuth();

    return (
        <div>
            <div className={'max-w-350 mx-auto flex gap-3 justify-between items-center px-2 pt-2 pb-3'}>
                <Link to={'/'}>
                    <div className="logo  text-4xl font-bold">friverr<span
                        className={'text-4xl text-green-600'}>.</span></div>
                </Link>

                <form action=""
                      className={'flex-1 max-sm:hidden flex bg-white border rounded overflow-hidden max-w-125'}>
                    <input type="text" placeholder="Search" className={'w-full h-full p-3 outline-none bg-white '}/>
                    <button className={'bg-black cursor-pointer text-white p-2'}><IoSearch size={20}/></button>
                </form>

                <div className={'flex items-center gap-2 relative group'}>
                    {user ? <User data={user} logout={logout} /> : <Links />}
                </div>


            </div>


        </div>
    );
};

export default Header;