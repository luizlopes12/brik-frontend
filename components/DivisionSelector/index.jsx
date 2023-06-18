import React from "react";
import style from "./style.module.scss";
import SearchInput from "../SearchInput";

const DivisionSelector = ({
  lotDivision,
  handleShowDivisionOptions,
  showDivisionOptions,
  divisionSearch,
  handleSearchDivision,
  globalDivisionsDataFiltered,
  handleSelectDivisionToLot,
}) => {
  return (
    <div className={style.lotDivision}>
      <div
        className={style.divisionSelected}
        onClick={handleShowDivisionOptions}
      >
        <img src={lotDivision.logoUrl} />
        <span>{lotDivision.name}</span>
      </div>
      {showDivisionOptions && (
        <ul className={style.divisionOptionsSelector}>
          <SearchInput
            placeholder="Pesquisar"
            className={style.divisionSearchInput}
            value={divisionSearch}
            onChange={handleSearchDivision}
          />
          {globalDivisionsDataFiltered.map((division, index) => (
            <li
              key={index}
              className={style.divisionOption}
              onClick={() => handleSelectDivisionToLot(division)}
            >
              <img src={division.logoUrl} />
              <span>
                {division.name.length > 18
                  ? division.name.substring(18, "...")
                  : division.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DivisionSelector;
