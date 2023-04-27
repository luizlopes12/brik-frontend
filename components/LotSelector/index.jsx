import React from 'react';
import style from './style.module.scss';
import SearchInput from '../SearchInput';


const LotSelector = ({
  lotSelected,
  handleShowLotOptions,
  showLotOptions,
  lotSearch,
  handleSearchLot,
  lotsDataFiltered,
  handleSelectLot,
}) => {
  return (
    <div className={style.lotDivision}>
      <div className={style.divisionSelected} onClick={handleShowLotOptions}>
        <img src={lotSelected.loteImages?.[0].imageUrl || 'https://i.imgur.com/YQOzMWA.png'} />
        <span>{lotSelected.name}</span>
      </div>
      {showLotOptions && (
        <ul className={style.divisionOptionsSelector}>
          <SearchInput
            placeholder="Pesquisar"
            className={style.lotSearchInput}
            value={lotSearch}
            onChange={handleSearchLot}
          />
          {lotsDataFiltered?.map((lot, index) => (
            <li
              key={index}
              className={style.lotOption}
              onClick={() => handleSelectLot(lot)}
            >
              <img src={lot.loteImages?.[0].imageUrl} />
              <span>
                {lot.name.length > 18
                  ? lot.name.substring(18, '...')
                  : lot.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LotSelector;
