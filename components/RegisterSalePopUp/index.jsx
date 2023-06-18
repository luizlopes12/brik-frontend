import React, { useContext, useState, useMemo } from "react";
import style from "./style.module.scss";
import { popUpsContext } from "../../context/popUpsContext";
import DivisionSelector from "../DivisionSelector";
import LotSelector from "../LotSelector";
import { globalDivisionsDataContext } from "../../context/globalDivisionsDataContext";
import { toast } from "react-toastify";

const RegisterSalePopUp = () => {

  const { popUps, setPopUps } = useContext(popUpsContext);
  const { globalDivisionsData, setGlobalDivisionsData } = useContext(
    globalDivisionsDataContext
  );
  console.log(globalDivisionsData);
  const [showDivisionOptions, setShowDivisionOptions] = useState(false);
  const [divisionSearch, setDivisionSearch] = useState("");
  const [showLotOptions, setShowLotOptions] = useState(false);
  const [parcelsAlert, setParcelsAlert] = useState(false);
  const [lotDivision, setLotDivision] = useState({
    name: "Selecione um Loteamento",
    logoUrl: "https://i.imgur.com/YQOzMWA.png",
    id: 0,
    partners: [],
  });

  const [lotSelected, setLotSelected] = useState({
    name: "Selecione um Lote",
    logoUrl: "https://i.imgur.com/YQOzMWA.png",
    id: 0,
    price: 0,
    basePrice: 0,
    hiddenPrice: false,
    maxPortionsQuantity: 0,
    taxPercentage: 0,
    taxPercentage24: 0,
    partners: [],
    metrics: "",
    entryValue: 0,
    parcels: 0,
  });

  const [lotSearch, setLotSearch] = useState("");

  const [lotData, setLotData] = useState({
    name: "",
    description: "",
    location: "",
    metrics: "",
    price: "",
    basePrice: "",
    hiddenPrice: false,
    maxPortionsQuantity: 0,
    taxPercentage: "",
    taxPercentage24: "",
    partners: [],
  });
  const handleShowDivisionOptions = () => {
    setShowDivisionOptions(!showDivisionOptions);
  };
  const handleShowLotOptions = () => {
    setShowLotOptions(!showLotOptions);
  };

  const [textsInputs, setTextsInputs] = useState({
    seller: "",
    buyer: "",
  });
  const globalDivisionsDataFiltered = useMemo(() => {
    return globalDivisionsData.filter((division) =>
      divisionSearch.length > 0
        ? division.name.toLowerCase().includes(divisionSearch.toLowerCase())
        : division
    );
  }, [divisionSearch, globalDivisionsData]);
  const lotsDataFiltered = useMemo(() => {
    return lotDivision.lotes?.filter((lot) =>
      lotSearch.length > 0
        ? lot.name.toLowerCase().includes(lotSearch.toLowerCase())
        : lot
    );
  }, [lotSearch, lotDivision.lotes]);

  const handleChangeTextsInputs = (e) => {
    setTextsInputs({ ...textsInputs, [e.target.name]: e.target.value });
  };

  const handleSearchDivision = (e) => {
    setDivisionSearch(e.target.value);
  };
  const handleSearchLot = (e) => {
    setLotSearch(e.target.value);
  };
  const handleSelectDivisionToLot = (selectedDivision) => {
    setLotDivision({
      name: selectedDivision.name,
      logoUrl: selectedDivision.logoUrl,
      id: selectedDivision.id,
      partners: selectedDivision.divisionPartners,
      lotes: selectedDivision.lotes,
    });

    setLotData((prev) => ({ ...prev, partners: [] }));
    setShowDivisionOptions(false);
    console.log(lotDivision);
  };
  const handleSelectLot = (selectedLot) => {
    setLotSelected(() => {
      selectedLot.parcels = selectedLot.maxPortionsQuantity;
      selectedLot.entryValue = 0;
      return selectedLot;
    });

    setShowLotOptions(false);
  };

  const handleExitPopUp = () => {
    setShowDivisionOptions(false);
    setShowLotOptions(false);
    setPopUps({ ...popUps, registerSale: false });
    setLotDivision({
      name: "Selecione um Loteamento",
      logoUrl: "https://i.imgur.com/YQOzMWA.png",
      id: 0,
      partners: [],
    });
    setLotSelected({
      name: "Selecione um Lote",
      logoUrl: "https://i.imgur.com/YQOzMWA.png",
      id: 0,
      price: 0,
      basePrice: 0,
      hiddenPrice: false,
      maxPortionsQuantity: 0,
      taxPercentage: 0,
      taxPercentage24: 0,
      entryValue: 0,
      partners: [],
    });
  };

  const handleSubmit = async () => {
  let currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);
  let year = currentDate.getFullYear();
  let month = String(currentDate.getMonth() + 1).padStart(2, '0');
  let day = String(currentDate.getDate()).padStart(2, '0');
  let formattedDate = `${year}-${month}-${day}`;
  let saleData = {
      seller: {
          name: "Vendedor",
          email: textsInputs.seller
      },
      buyer: {
          name: "Cliente",
          email: textsInputs.buyer
      },
      loteId: lotSelected.id,
      parcelsQuantity: lotSelected.maxPortionsQuantity,
      entryValue: lotSelected.entryValue,
      initDate: formattedDate
  }
  console.log(saleData);
    await fetch(`${process.env.BACKEND_URL_LOCAL}/sales/contract/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleData)
    }
    ).then(res => res.json())
    .then((data) =>{
      toast.success(data.message);
    })
    .catch((err) => {
      toast.error(err.message);
      console.log(err);
    })
  }

  const formatPrice = (price) => {
    const priceAsNumber = parseFloat(price);
    return priceAsNumber.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      decimalSeparator: ",",
      thousandsSeparator: ".",
    });
  };

  const handleVerifyParcels = (e) => {
    if (lotSelected.maxPortionsQuantity >= e.target.value) {
      setParcelsAlert(false);
      setLotSelected((prev) => ({ ...prev, parcels: e.target.value }));
    } else {
      setParcelsAlert(true);
    }
  };
  const handleEntryInput = (e) => {
    setLotSelected((prev) => ({ ...prev, entryValue: e.target.value }));
  };

  return (
    <div
      className={
        popUps.registerSale ? style.popUpBackdrop : style.popUpDisabled
      }
    >
      <div className={style.popUpWrapper}>
        <div className={style.popUpHeader}>
          <span>Nova venda</span>
          <button
            className={style.closeBtn}
            onClick={handleExitPopUp}
            name="lotRegister"
          >
            <img src="/images/closeIcon.svg" alt="Sair" />
          </button>
        </div>
        <section className={style.lotSelection}>
          <DivisionSelector
            lotDivision={lotDivision}
            handleShowDivisionOptions={handleShowDivisionOptions}
            showDivisionOptions={showDivisionOptions}
            divisionSearch={divisionSearch}
            handleSearchDivision={handleSearchDivision}
            globalDivisionsDataFiltered={globalDivisionsDataFiltered}
            handleSelectDivisionToLot={handleSelectDivisionToLot}
          />
          <LotSelector
            lotSelected={lotSelected}
            showLotOptions={showLotOptions}
            lotsDataFiltered={lotsDataFiltered}
            handleShowLotOptions={handleShowLotOptions}
            handleSelectLot={handleSelectLot}
            handleSearchLot={handleSearchLot}
            lotSearch={lotSearch}
          />
        </section>
        <section className={style.lotData}>
          {lotSelected.name !== "Selecione um Lote" && (
            <>
              <div className={style.lotDataWrapper}>
                <span className={style.dataType}>Nome:</span>{" "}
                <span>{lotSelected.name}</span>
                <span className={style.dataType}>Preço:</span>{" "}
                <span>{formatPrice(lotSelected.finalPrice)}</span>
                <span className={style.dataType}>Área:</span>{" "}
                <span>{lotSelected.metrics}m²</span>
                <span className={style.dataType}>Parcelas:</span>{" "}
                <span>
                  <input
                    type="number"
                    className={style.parcelsInput}
                    value={lotSelected.parcels}
                    onChange={handleVerifyParcels}
                  />
                  {parcelsAlert && (
                    <span className={style.parcelsAlert}>
                      Parcelas não podem ser maiores que{" "}
                      {lotSelected.maxPortionsQuantity}
                    </span>
                  )}
                </span>
                <span className={style.dataType}>Entrada:</span>{" "}
                <span className={style.entryInputContainer}>
                  R$
                  <input
                    type="number"
                    className={style.entryInput}
                    value={lotSelected.entryValue}
                    onChange={handleEntryInput}
                  />
                </span>
              </div>
            </>
          )}
        </section>
        <section className={style.inputsSection}>
          <div className={style.inputs}>
            <div className={style.input}>
              <label>Email do Vendedor:</label>
              <input
                type="email"
                placeholder="vendedor@gmail.com"
                value={textsInputs.seller}
                name="seller"
                onChange={handleChangeTextsInputs}
              />
            </div>
            <div className={style.input}>
              <label>Email do Cliente:</label>
              <input
                type="email"
                placeholder="cliente@gmail.com"
                value={textsInputs.buyer}
                name="buyer"
                onChange={handleChangeTextsInputs}
              />
            </div>
            <button className={style.sendEmail} onClick={handleSubmit}>
              Enviar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterSalePopUp;
