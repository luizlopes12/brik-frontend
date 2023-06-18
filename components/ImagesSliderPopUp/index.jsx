import React, { useState, useRef } from "react";
import style from "./style.module.scss";

const ImagesSlidePopUp = ({ images, arrowIcon }) => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    switch (direction) {
      case "left":
        sliderRef.current.scrollLeft -=
          sliderRef.current.querySelector("figure").clientWidth + 60;
        break;
      case "right":
        sliderRef.current.scrollLeft +=
          sliderRef.current.querySelector("figure").clientWidth + 60;
        break;
      default:
        break;
    }
  };

  return (
    <section className={style.imagesSliderBackdrop} ref={sliderRef}>
      <div className={style.imagesSliderContainer}>
        {images.map((image) => {
          return (
            <figure className={style.imageItem}>
              <img src={image.imageUrl} alt="Lote" />
            </figure>
          );
        })}
      </div>
      <div className={style.controlButtons}>
        <button className={style.prev} onClick={() => handleScroll("left")}>
          <img src={arrowIcon} alt="Anterior" />{" "}
        </button>
        <button className={style.next} onClick={() => handleScroll("right")}>
          {" "}
          <img src={arrowIcon} alt="Próximo" />{" "}
        </button>
      </div>
    </section>
  );
};

export default ImagesSlidePopUp;
