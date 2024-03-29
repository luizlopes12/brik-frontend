import React, { useState, useEffect, useMemo, useContext } from "react";
import style from "./style.module.scss";
import SearchInput from "../../../components/SearchInput";
import HeadingText from "../../../components/HeadingText";
import formatCurrency from "../../../helpers/formatCurrency";
import { popUpsContext } from "../../../context/popUpsContext";
import { selectedDivisionContext } from "../../../context/selectedDivisionContext";
import { globalDivisionsDataContext } from "../../../context/globalDivisionsDataContext";
import { lotSelectedContext } from "../../../context/selectedLotContext";
import nextCookies from "next-cookies";
import { toast } from "react-toastify";
import Link from "next/link";

export async function getServerSideProps(context) {
  const cookies = nextCookies(context);
  const { token, refreshToken } = cookies ? cookies : {};

  if (!token && !refreshToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  let firstDivisionsData;
  try {
    firstDivisionsData = await fetch(
      `${process.env.BACKEND_URL}/divisions/list`
    ).then((res) => res.json());
  } catch (error) {
    firstDivisionsData = [];
  }
  return {
    props: { firstDivisionsData, token, refreshToken },
  };
}
const Availabilities = [
  { name: "Disponível", value: "avaible" },
  { name: "Indisponível", value: "unavaible" },
  { name: "Reservado", value: "reserved" },
];

const Loteamentos = ({ firstDivisionsData }) => {
  /* Contexts */
  const { globalDivisionsData, setGlobalDivisionsData } = useContext(
    globalDivisionsDataContext
  );
  const { popUps, setPopUps } = useContext(popUpsContext);
  const { divisionSelected, setDivisionSelected } = useContext(
    selectedDivisionContext
  );
  const { lotSelected, setLotSelected } = useContext(lotSelectedContext);
  /* States */
  const [selectValues, setSelectValues] = useState({
    division: "all",
    availability: "avaible",
  });
  const [lotsSearch, setLotsSearch] = useState("");
  const [divisionSearch, setDivisionSearch] = useState("");
  const [showOptions, setShowOptions] = useState({ id: null, selected: false });

  /* Memos */
  const divisions = useMemo(() => {
    return globalDivisionsData.flat();
  }, [globalDivisionsData]);

  const lotsData = useMemo(() => {
    return divisions.map((division) => division.lotes).flat();
  }, [divisions]);
  const dataFiltered = useMemo(() => {
    return lotsData
      .filter(
        (lotByDivision) =>
          lotByDivision.idLoteamento ==
          (selectValues.division != "all"
            ? selectValues.division
            : lotByDivision.idLoteamento)
      )
      .filter(
        (lotByAvaibility) =>
          lotByAvaibility.isAvaible == selectValues.availability &&
          lotByAvaibility.isSolded == false
      )
      .filter((lotByName) =>
        lotsSearch.length > 0
          ? lotByName.name.toLowerCase().includes(lotsSearch.toLowerCase())
          : lotByName
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [lotsSearch, selectValues, lotsData]);
  /* Handles */
  const handleSelectFilters = (e) => {
    setSelectValues((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };
  const handlePopUps = (e) => {
    setPopUps((prevState) => ({
      ...prevState,
      [e.target.name]: !popUps[e.target.name],
    }));
  };
  const handleEditDivision = (selectedDivision) => {
    setDivisionSelected(selectedDivision);
    setPopUps((prevState) => ({ ...prevState, divisionEdit: true }));
  };
  const handleLotOptions = (selectedLot) => {
    if (showOptions.id == selectedLot.id) {
      setShowOptions({ id: null, selected: false });
    } else {
      setShowOptions({ id: selectedLot.id, selected: true });
    }
  };
  const handleLotEditPopUp = (selectedLot) => {
    setLotSelected(selectedLot);
    setPopUps((prevState) => ({ ...prevState, lotEdit: true }));
  };

  /* Side effects */

  useEffect(() => {
    setGlobalDivisionsData(
      globalDivisionsData.length > 0 ? globalDivisionsData : firstDivisionsData
    );
  }, [firstDivisionsData, globalDivisionsData]);
  return (
    <section className={style.loteamentosContainer}>
      <div className={style.heading}>
        <HeadingText>Lotes e Loteamentos</HeadingText>
        <SearchInput
          value={divisionSearch}
          onChange={(e) => setDivisionSearch(e.target.value)}
        />
      </div>
      <div className={style.topActions}>
        <div className={style.lotFilters}>
          <div className={style.dropdownsContainer}>
            <select
              onChange={handleSelectFilters}
              value={selectValues.division}
              name="division"
              className={style.dropdownMenu}
            >
              <option value="all">Todos</option>
              {globalDivisionsData.map((item, index) => (
                <>
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                </>
              ))}
            </select>
            <select
              onChange={handleSelectFilters}
              value={selectValues.availability}
              name="availability"
              className={style.dropdownMenu}
            >
              {Availabilities.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <SearchInput
            value={lotsSearch}
            onChange={(e) => setLotsSearch(e.target.value)}
          />
        </div>
        <div className={style.lotHandleActions}>
          <button
            className={style.btnTaxes}
            onClick={handlePopUps}
            name="taxesEdit"
          >
            <img src="/images/taxesIcon.svg" />
            Editar juros
          </button>
          <button
            className={style.btnLot}
            onClick={handlePopUps}
            name="lotRegister"
          >
            <img src="/images/plusIcon.svg" />
            Cadastrar lote
          </button>
        </div>
      </div>
      <div className={style.listsContainer}>
        <ul className={style.lotsList}>
          {dataFiltered.length > 0 ? (
            dataFiltered.map(
              (lot) =>
                lot.isSolded == false && (
                  <li className={style.lotsListItem} key={lot.id}>
                    <div className={style.lotImage}>
                      <img
                        src={lot.loteImages[0]?.imageUrl ?? "/images/labels/defaultImage.png"}
                        alt="Imagem do lote"
                      />
                    </div>
                    <div className={style.lotInfos}>
                      <div className={style.lotSpecs}>
                        <span className={style.lotName}>{lot.name}</span>
                        <span className={style.divName}>
                          {divisions.find(
                            (division) => division.id == lot.idLoteamento
                          ).name.length > 20
                            ? divisions
                                .find(
                                  (division) => division.id == lot.idLoteamento
                                )
                                .name.substring(0, 20) + "..."
                            : divisions.find(
                                (division) => division.id == lot.idLoteamento
                              ).name}
                        </span>
                        <div className={style.location}>
                          <span>
                            <img src="/images/locationIcon.svg" />
                            {lot.location.substring(0, 20) + "..."}
                          </span>
                          <span>
                            <img src="/images/metricsIcon.svg" />
                            {lot.metrics}m<sup>2</sup>
                          </span>
                        </div>
                      </div>
                      <div className={style.lotPrice}>
                        {lot.hiddenPrice ? (
                          <p className={style.lotPriceHidden}>
                            <span>{formatCurrency(lot.finalPrice)}</span>
                            <span>(Preço sob consulta)</span>
                          </p>
                        ) : (
                          <>
                            <p>{formatCurrency(lot.finalPrice)}</p>
                            <p>{formatCurrency(lot.basePrice)}</p>
                          </>
                        )}
                      </div>
                      <button
                        className={style.lotOptionsBtn}
                        onClick={() => handleLotOptions(lot)}
                      >
                        ...
                      </button>
                      {lot.id == showOptions.id && showOptions.selected && (
                        <span className={style.lotOptions}>
                          <button
                            onClick={(e) => {
                              handleLotEditPopUp(lot);
                            }}
                          >
                            Editar
                          </button>
                          <button>
                            <Link href={`/lotes/${lot.id}`}>Visualizar</Link>
                          </button>
                        </span>
                      )}
                      <div className={style.lotViews}>
                        <span>{lot.userViews}</span>
                        <img src="/images/viewIcon.svg" alt="Visualizações" />
                      </div>
                    </div>
                  </li>
                )
            )
          ) : (
            <p className={style.nullAlert}>Nenhum item encontrado.</p>
          )}
        </ul>
        <div className={style.divisionsListContainer}>
          <h2>Loteamentos</h2>
          <ul className={style.divisionsList}>
            {divisions
              .filter((divisionByName) =>
                divisionByName.name
                  .toLowerCase()
                  .includes(divisionSearch.toLowerCase())
              )
              .map((division, key) => (
                <li key={key} onClick={() => handleEditDivision(division)}>
                  <img src={division.logoUrl} alt="logotipo" />
                  <div className={style.divInfo}>
                    <p>
                      {division.name.length > 20
                        ? division.name.substring(0, 18) + "..."
                        : division.name}
                    </p>
                    <span>
                      {division.location.length > 20
                        ? division.location.substring(0, 18) + "..."
                        : division.location}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
          <button
            className={style.addDivisionBtn}
            onClick={handlePopUps}
            name="divisionRegister"
          >
            <img src="/images/plusIcon-green.svg" /> Cadastrar Loteamento
          </button>
        </div>
      </div>
    </section>
  );
};

export default Loteamentos;
