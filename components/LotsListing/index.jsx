import React, { useState, useMemo, useEffect, useContext } from 'react';
import style from './style.module.scss';
import Link from 'next/link';
import formatCurrency from '../../helpers/formatCurrency';
import LotsCarousel from '../LotsCarousel';
import ListFilters from '../ListFilters';
import { lotTypeContext } from '../../context/lotTypeContext';



const LotsListing = ({ lotsData, arrowIcon, homeFilterIcon, defaultImage }) => {
  const [divisionsFromBackend, setDivisionsFromBackend] = useState([]);
  const [divisionsData, setDivisionsData] = useState(divisionsFromBackend);
  const { lotType } = useContext(lotTypeContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [lotsDataPerPage, setlotsDataPerPage] = useState(6);
  const [showListFilters, setShowListFilters] = useState(false);
  const [isGroupView, setIsGroupView] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    rangeValues: [10000, 1000000],
  });



  const lotsDataFiltered = useMemo(() => {
    return lotsData.filter((item) => {
      const isInRange = item.finalPrice >= filters.rangeValues[0] && item.finalPrice <= filters.rangeValues[1];
      const isLocationMatch = filters.location === '' || item.location.match(new RegExp(filters.location, 'gi'));
      const isTypeMatch = filters.type === '' || item.lotType.match(new RegExp(lotType, 'gi'));
      const isAvailable = item.isAvaible === 'avaible';
      return isInRange && isLocationMatch && isTypeMatch && isAvailable;
    });
  }, [filters.rangeValues, filters.location, lotsData, divisionsData, lotType]); 
  
  const divisionsDataFiltered = useMemo(() => {
    return divisionsData.filter((division) => {
      const isDivisionLocationMatch =
        filters.location === '' ||
        division.location.match(new RegExp(filters.location, 'gi'));
      division.lotes = division.lotes.filter((item) => {
        const isInRange =
          item.finalPrice >= filters.rangeValues[0] &&
          item.finalPrice <= filters.rangeValues[1];
        const isLocationMatch =
          filters.location === '' ||
          item.location.match(new RegExp(filters.location, 'gi'));
        const isTypeMatch =
          filters.type === '' || item.lotType.match(new RegExp(lotType, 'gi'));
        const isAvailable = item.isAvaible === 'avaible';
        return isInRange && isLocationMatch && isTypeMatch && isAvailable;
      });
  
      return isDivisionLocationMatch || division.lotes.length > 0;
    });
  }, [divisionsData, filters.location, filters.rangeValues, lotsData, lotType]);
  
  
  

  const renderlotsData = useMemo(() => {
    const startIndex = (currentPage - 1) * lotsDataPerPage;
    const endIndex = startIndex + lotsDataPerPage;
    if(lotsDataFiltered.length === 0 && !isGroupView) {
      return (<div className={style.noLotsFound}>Nenhum imóvel encontrado, entre em contato para mais informações.</div>)
    }
    return lotsDataFiltered.slice(startIndex, endIndex).map((item) => (
        <Link href={`/lote/${item.id}`} key={item.id}>
            <li>
                <div className={style.lotImage}>
                <img src={
                    item.loteImages[0]?.imageUrl || defaultImage
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
  }, [currentPage, lotsDataFiltered, lotsDataPerPage]);



  const handlePageChange = (pageNumber) => {
    window.scrollTo(0, 200);
    const totalPages = Math.ceil(lotsDataFiltered.length / lotsDataPerPage);
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
    setCurrentPage(Math.ceil(lotsDataFiltered.length / lotsDataPerPage));
    window.scrollTo(0, 200);
  };
  const handleGroupView = () => {
    setIsGroupView(!isGroupView);
    };

  const handleShowFilters = () => {
    setShowListFilters(prev => !prev)
  };

  const totalPages = Math.ceil(lotsDataFiltered.length / lotsDataPerPage);
  const isLastPage = currentPage === totalPages;


  useEffect(() => {
    const getDivisions = async () =>{
      await fetch(`${process.env.BACKEND_URL}/divisions/list`)
      .then((res) => res.json())
      .then((data) => {
        setDivisionsFromBackend(data);
        setDivisionsData(data);
      });
    } 
    getDivisions()
  }, [divisionsDataFiltered]);

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
                <ListFilters 
                  hideFilter={handleShowFilters}
                  rangeValues={filters.rangeValues} 
                  setFilters={setFilters}
                  lotsDataFiltered={lotsDataFiltered}
                />
              )
            }
        </div>
        {isGroupView ? (
            <div className={style.groupView}>
              {
              divisionsDataFiltered.length > 0 ?(
                divisionsDataFiltered.map((division) => (
                  <LotsCarousel lotsData={division.lotes}
                  type={'find'}
                  arrowIcon={arrowIcon} 
                  title={<><img src={division.logoUrl} 
                  defaultImage={defaultImage}
                  divisionData={divisionsDataFiltered}
                  />{division.name}</>}
                  />
                ))
              ):(
                <div className={style.noLotsFound}>Nenhum imóvel encontrado, entre em contato para mais informações.</div>
              )
              }
            </div>
        ): (
            <>
            <ul className={style.lotsList}>{renderlotsData}</ul>
            {totalPages > 0 && (

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
            )}
            </>
        )
        }

    </section>
  );
};

export default LotsListing;
