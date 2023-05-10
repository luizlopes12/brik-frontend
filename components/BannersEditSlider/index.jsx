import React, { useRef, useState, useContext } from "react";
import style from "./style.module.scss";
import { PopUpsContext } from "../../context/popUpsContext";

const BannersEditSlider = ({ imagesData }) => {
  const sliderRef = useRef(null);
  const { popUps, setPopUps } = useContext(PopUpsContext);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const handlePrevClick = () => {
    sliderRef.current.scrollBy({
      left: -sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const handleNextClick = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  };
  const handleSelectImage = (indexNum) => {
    setCurrentBannerIndex(indexNum);
  };

  const handleAddImage = () => {
    setPopUps({ ...popUps, bannerAdd: true })
  }
  return (
    <div className={style.slider} ref={sliderRef}>
      <div className={style.sliderImages}>
      <div className={style.imageContainer}>
      <img
              className={style.addImage}
              src={'https://i.imgur.com/g8IFhRu.png'}
              onClick={() => handleAddImage()}
              alt={`Nova imagem`}
            />
      </div>
        {imagesData.map((image, index) => (
          <div className={style.imageContainer}>
            <img
              key={index}
              className={`${style.bannerDot} ${
                index === currentBannerIndex && style.active
              }`}
              src={image.imageUrl}
              onClick={() => handleSelectImage(index)}
              alt={`Image ${image.name}`}
            />
            <span className={style.imageNumber}>{index + 1}</span>
          </div>
        ))}
        <div className={style.bannerEditControls}>
          <button className={style.sliderPrev} onClick={handlePrevClick}>
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.75 2.1875L8 8.4375L14.25 2.1875"
                stroke="black"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button className={style.sliderNext} onClick={handleNextClick}>
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.75 2.1875L8 8.4375L14.25 2.1875"
                stroke="black"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannersEditSlider;
