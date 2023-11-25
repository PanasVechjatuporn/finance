import React from "react";
import Navigate  from "../components/Navbar";
import  CarouselInterval  from "../components/Carousel";
export const Home = () => {
    return (
        <React.Fragment>
            <div className='header'>
                <Navigate />
            </div>
            <div>
                <CarouselInterval />
            </div>
        </React.Fragment>
    );
}