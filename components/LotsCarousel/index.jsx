import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import formatCurrency from '../../helpers/formatCurrency'
import Link from 'next/link'

const LotsCarousel = ({ lotsData, arrowIcon, title }) => {
    const carouselRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(1);
    const [lotsDataPerPage, setlotsDataPerPage] = useState(3);

    useEffect(() => {
        setlotsDataPerPage(() =>{
            if (typeof window !== undefined) {
                if (window.innerWidth < 768) {
                    return 1
                } else if (window.innerWidth < 1024) {
                    return 2
                } else {
                    return 3
            }
        }
    })
    }, [])

    const handleScroll = (direction) => {
        switch (direction) {
            case 'left':
                currentPage > 1 && setCurrentPage(currentPage - 1);
                if (window.innerWidth < 768) {
                    carouselRef.current.scrollLeft = carouselRef.current.scrollLeft - (carouselRef.current.querySelector('div').clientWidth+18)

                }else{
                    carouselRef.current.scrollLeft = carouselRef.current.scrollLeft - (carouselRef.current.clientWidth-120)
                }
                break;
            case 'right':
                currentPage < Math.ceil(lotsData.length / lotsDataPerPage) && setCurrentPage(currentPage + 1);
                if (window.innerWidth < 768) {
                    carouselRef.current.scrollLeft = carouselRef.current.scrollLeft + (carouselRef.current.querySelector('div').clientWidth+18)

                }else{
                    carouselRef.current.scrollLeft = carouselRef.current.scrollLeft + (carouselRef.current.clientWidth-120)
                }
                break;
            default:
                break;
        }
    };
    if (lotsData.length === 0) {
        return 
    }
  return (
    <section className={style.lotsCarouselContainer}>
        <div className={style.lotsCarousel}>
        <h2 className={style.lotsCarouselTitle}>{title}</h2>
            <div className={style.lotsCarouselList} ref={carouselRef}>
                {lotsData.map((item) => (

                    <div className={style.lotItem}>
                <Link href={`/lote/${item.id}`}>

                        <div className={style.lotImage}>
                            <img src={
                                item.loteImages[0]?.imageUrl || 'https://i.imgur.com/Nmdccpi.png'
                                } alt="Lote" />
                        </div>
                        <div className={style.lotInfo}>
                            <div className={style.lotInfos}>
                                <span className={style.itemPrice}>{formatCurrency(item.finalPrice)}
                                </span>
                                <p className={style.name}>{item.name}</p>
                                <p className={style.metrics}>{item.metrics}m²</p>
                                <p className={style.location}>{item.location}</p>
                                <p className={style.description}>{item.description.length > 100 ? (item.description.substring(0, 100).trim() + "..."): item.description}</p>
                            </div>
                            <div className={style.lotItemActions}>
                                <button className={style.showMoreBtn}>Ver detalhes</button>
                            </div>
                        </div>
                    </Link>
                </div>
                ))}
            </div>
            <div className={style.lotsCarouselPagination}>
                    <button onClick={() => handleScroll('left')} className={style.prevPage}><img src={arrowIcon}/></button>
                                <span className={style.currentPage}>{currentPage} </span>
                                <span>de</span>
                                <span>{Math.ceil(lotsData.length / lotsDataPerPage)}</span>
            <button onClick={() => handleScroll( 'right')} className={style.nextPage}><img src={arrowIcon}/></button>
            </div>
        </div>
    </section>
  )
}

export default LotsCarousel