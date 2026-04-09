import React from 'react';
import {IoSearch} from "react-icons/io5";
import {useNavigate} from "react-router-dom";

const Hero = () => {

    const navigate = useNavigate();

    const handleSubmit = (e: React.InvalidEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = (e.currentTarget[0] as HTMLInputElement).value
        navigate(`/search?q=${text}`)
    };

    return (

        <div className={'max-h-160 overflow-hidden flex justify-center items-center relative'}>
            <video width="100%" object-cover={'true'} className={'object-cover'} autoPlay muted loop>
                <source
                    src="https://fiverr-res.cloudinary.com/video/upload/f_auto:video,q_auto:best/v1/video-attachments/generic_asset/asset/18ad23debdc5ce914d67939eceb5fc27-1738830703211/Desktop%20Header%20new%20version"
                    type="video/mp4"/>
                Tarayıcınız video etiketini desteklemiyor.
            </video>

            <div className={'absolute p-4 w-full h-full flex justify-center items-center flex-col gap-5 text-white'}>
                <div className="max-w-150">
                    <h1 className="text-4xl md:text-5xl font-light md:text-center">
                        Profesyonel iş gücünüzü{" "}
                        <span className="font-serif">freelancer'larla</span> ölçeklendirin
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-md w-full flex gap-5 mt-10"
                    >
                        <input
                            type="text"
                            className="flex-1 p-2 rounded-md text-black outline-none"
                            placeholder="hizmet ara..."
                        />
                        <button className="bg-f-green m-1 p-2 text-green-700 rounded-md hover:bg-opacity-70 transition">
                            <IoSearch/>
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Hero;