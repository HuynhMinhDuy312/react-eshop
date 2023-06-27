import React, { useEffect, useState } from "react";
import "./Slider.scss";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { sliderData } from "./slider-data";

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideLength = sliderData.length;

    let autoscroll = true;
    let slideInterval;
    const nextSlide = () => {
        if (currentSlide === slideLength - 1) {
            setCurrentSlide(0);
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    };
    const prevSlide = () => {
        if (currentSlide <= 0) {
            setCurrentSlide(slideLength - 1);
        } else {
            setCurrentSlide(currentSlide - 1);
        }
    };

    useEffect(() => {
        setCurrentSlide(0);
    }, []);

    useEffect(() => {
        if (autoscroll) {
            const auto = () => {
                slideInterval = setInterval(nextSlide, 5000);
            };
            auto();
        }
        return () => clearInterval(slideInterval);
    }, [currentSlide, slideInterval, autoscroll]);

    return (
        <div className="slider">
            <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
            <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />

            {sliderData.map((slide, index) => {
                const { image, heading, desc } = slide;
                return (
                    <div key={index} className={index === currentSlide ? "slide current" : "slide"}>
                        {index === currentSlide && (
                            <>
                                <img src={image} alt="product" />
                                <div className="content">
                                    <h2>{heading}</h2>
                                    <p>{desc}</p>
                                    <hr />
                                    <a href="#product" className="--btn --btn-primary">
                                        Buy Now
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Slider;
