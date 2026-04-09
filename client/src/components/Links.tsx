import React from 'react';
import {Link} from "react-router-dom";

const Links = () => {
    return (

        <div className={'flex gap-1'}>
            <Link className={'transition duration-300 w-20 text-center border p-2 rounded-sm hover:font-semibold hover:text-green-600 hover:bg-green-200'} to={'/login'} >
                Login
            </Link>
            <Link className={'transition duration-300 w-20 text-center border border-green-500 text-green-800 hover:text-white hover:bg-green-500 p-2 rounded-sm'} to={'/register'} >
                Register
            </Link>
        </div>

    );
};

export default Links;