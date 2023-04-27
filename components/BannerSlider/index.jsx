import React, { useState, useEffect } from 'react';
import style from './style.module.scss';


const BannerSlider = ({imagesData}) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let intervalId;
    if (!isHovered) {
      intervalId = setInterval(() => {
        setCurrentBannerIndex((prevIndex) =>
          prevIndex === imagesData.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [currentBannerIndex, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  console.log(imagesData)


  return (
    <div className={style.bannerContainer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <a href={imagesData[currentBannerIndex].link}><img src={imagesData[currentBannerIndex].imageUrl} alt="Banner" /></a>
      <div className={style.bannerControls}>
      <ul className={style.bannerDots}>
        {imagesData.map((image, index) => (
            <li
                key={image}
                className={`${style.bannerDot} ${
                index === currentBannerIndex ? style.active : null
                }`}
                onClick={() => setCurrentBannerIndex(index)}
            ></li>
        ))}
        </ul>
      </div>
      
    </div>
  );
};

export default BannerSlider;
