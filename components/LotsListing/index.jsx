import React, { useState, useMemo, useEffect } from 'react';
import style from './style.module.scss';
import Link from 'next/link';
import formatCurrency from '../../helpers/formatCurrency';
import LotsCarousel from '../LotsCarousel';
import ListFilters from '../ListFilters';

const LotsListing = ({ lotsData, arrowIcon, homeFilterIcon }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lotsDataPerPage, setlotsDataPerPage] = useState(6);
  const [divisionsData, setDivisionsData] = useState([]);
  const [showListFilters, setShowListFilters] = useState(false);
  const [isGroupView, setIsGroupView] = useState(false);
  const [rangeValues, setRangeValues] = useState([10000, 1000000]);
  const renderlotsData = useMemo(() => {
    const startIndex = (currentPage - 1) * lotsDataPerPage;
    const endIndex = startIndex + lotsDataPerPage;
    
    return lotsData.slice(startIndex, endIndex).map((item) => (
        <Link href={`/lote/${item.id}`}>
            <li key={item.id}>
                <div className={style.lotImage}>
                <img src={
                    item.loteImages[0]?.imageUrl || 'https://i.imgur.com/Nmdccpi.png'
                    } alt="Lote" />
                </div>
                <div className={style.lotInfo}>
                    <div className={style.lotInfos}>
                    <p className={style.location}>{item.location}</p>
                    <p className={style.name}>{item.name}</p>
                    <p className={style.metrics}>{item.metrics}m²</p>
                    <p className={style.description}>{item.description.length > 200 ? item.description.substring(0, 200) + "...": item.description}</p>
                    </div>
                    <div className={style.lotItemActions}>
                        <span className={style.itemPrice}>{item.hiddenPrice ? <span className={style.hiddenPrice}>Preço sob consulta</span>: formatCurrency(item.finalPrice)}
                        </span>
                        <button className={style.showMoreBtn}>Ver mais</button>
                    </div>
                </div>
            </li>
        </Link>
    ));
  }, [currentPage, lotsData, lotsDataPerPage]);



  const handlePageChange = (pageNumber) => {
    window.scrollTo(0, 200);
    const totalPages = Math.ceil(lotsData.length / lotsDataPerPage);
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    setCurrentPage(pageNumber);
    window.scrollTo(0, 200);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    window.scrollTo(0, 200);
  };

  const goToLastPage = () => {
    setCurrentPage(Math.ceil(lotsData.length / lotsDataPerPage));
    window.scrollTo(0, 200);
  };
  const handleGroupView = () => {
    setIsGroupView(!isGroupView);
    };

  const handleShowFilters = () => {
    setShowListFilters(prev => !prev)
  };

  const totalPages = Math.ceil(lotsData.length / lotsDataPerPage);
  const isLastPage = currentPage === totalPages;


  useEffect(() => {
    const getDivisions = () =>{
      fetch(`${process.env.BACKEND_URL}/divisions/list`)
      .then((res) => res.json())
      .then((data) => {
        setDivisionsData(data);
      });
    }
    getDivisions()
  }, []);
  return (
    <section className={style.lotListingContainer}>
        <div className={style.heading}>
        <h2>Encontre um Imóvel</h2>
            <div className={style.filterBtns}>
                <button onClick={handleGroupView} className={`${style.groupByLoteamento} ${isGroupView && style.active}`}>Agrupar por loteamento</button>
                <button className={style.filterBtn}  onClick={handleShowFilters}><img src={homeFilterIcon} alt="Filtrar" />Filtros</button>
            </div>
            {
              showListFilters && (
                <ListFilters rangeValues={rangeValues} setRangeValues={setRangeValues}/>
              )

            }
        </div>
        {isGroupView ? (
            <div className={style.groupView}>
              {divisionsData.map((division) => (
                <LotsCarousel lotsData={division.lotes}
                arrowIcon={arrowIcon} 
                title={<><img src={division.logoUrl} />{division.name}</>}
                />
              ))}
            </div>
        ): (
            <>
            <ul className={style.lotsList}>{renderlotsData}</ul>
            <div className={style.lotsListingControls}>
      {
        currentPage > 1 && (
            <button onClick={() => handlePageChange(currentPage - 1)} className={style.controlPrev}>Anterior <img src={arrowIcon} alt="Anterior" /></button>
        )
      }
      <button onClick={goToFirstPage} className={style.currentPage}>{currentPage} </button>
      <span>
        de
      </span>
      <button onClick={goToLastPage} className={style.totalPages}> {totalPages}</button>
      {
        currentPage != totalPages && (
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={isLastPage} className={style.controlNext}>
            Seguinte
            <img src={arrowIcon} alt="Seguinte" />
          </button>
        )
      }

      </div>
            
            </>
        )
        }

    </section>
  );
};

export default LotsListing;
