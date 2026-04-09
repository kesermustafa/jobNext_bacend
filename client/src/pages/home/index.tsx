import React from 'react';
import Hero from "./Hero.tsx";
import Category from "./Category.tsx";
import Info from "./Info.tsx";

const Home = () => {
    return (
        <div className={'min-h-screen'}>
            <Hero/>

            <div className={'flex-col min-h-screen max-w-350 mx-auto justify-center items-center'}>
               <Category/>
               <Info/>
            </div>
        </div>
    );
};

export default Home;