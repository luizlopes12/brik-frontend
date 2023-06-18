import React, { useEffect, useContext, useState } from "react";
import style from "./style.module.scss";
import { popUpsContext } from "../../context/popUpsContext";

const TaxesEditPopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext);
  const [savedTaxes, setSavedTaxes] = useState(false);
  const [taxes, setTaxes] = useState({ defaultTax: 0, after24Months: 0 });

  const [currentMarketData, setCurrentMarketData] = useState({
    currentIGPM: {},
    currentIPCA: {},
  });
  const fetchData = async () => {
    const currentIGPM = await fetch(
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4175/dados?formato=json"
    )
      .then((res) => res.json())
      .catch((err) => {
        // console.log(err);
        return [];
      });
    const currentIPCA = await fetch(
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.10843/dados?formato=json"
    )
      .then((res) => res.json())
      .catch((err) => {
        // console.log(err);
        return [];
      });
    let accumulatedIGPM = currentIGPM.slice(-12).reduce((acc, curr) => {
      return (parseFloat(acc) + parseFloat(curr.valor)).toFixed(2);
    }, 0);
    let accumulatedIPCA = currentIPCA.slice(-12).reduce((acc, curr) => {
      return (parseFloat(acc) + parseFloat(curr.valor)).toFixed(2);
    }, 0);

    setCurrentMarketData({
      currentIGPM: {
        data: currentIGPM.slice(-12)[0].data,
        valor: accumulatedIGPM,
      },
      currentIPCA: {
        data: currentIPCA.slice(-12)[0].data,
        valor: accumulatedIPCA,
      },
    });
    await fetch(`${process.env.BACKEND_URL}/taxes/list`)
      .then((res) => res.json())
      .then((data) => {
        setTaxes({
          defaultTax: parseFloat(data[0].defaultTax),
          after24Months: parseFloat(data[0].after24Months),
        });
      })
      .catch((err) => // console.log(err));
  };
  const handleChangeTax = (e) => {
    setTaxes({ ...taxes, [e.target.name]: e.target.value });
  };
  const handleSaveNewTax = async () => {
    await fetch(`${process.env.BACKEND_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taxes),
    })
      .then((res) => res.json())
      .then((res) => (res.message ? setSavedTaxes(true) : setSavedTaxes(false)))
      .catch((err) => // console.log(err));

    setTimeout(() => {
      setSavedTaxes(false);
    }, 3000);
  };

  useEffect(() => {
    fetchData();
  }, [popUps.taxesEdit]);

  return (
    <div
      className={popUps.taxesEdit ? style.popUpBackdrop : style.popUpDisabled}
    >
      <div className={style.popUpWrapper}>
        <div className={style.popUpHeader}>
          <span>
            <img src="/images/taxesIcon.svg" />
            Editar juros
          </span>
          <button
            className={style.closeBtn}
            onClick={(e) => setPopUps((popUps.lotRegister = false))}
            name="lotRegister"
          >
            <img src="/images/closeIcon.svg" alt="Sair" />
          </button>
        </div>
        <ul className={style.taxContent}>
          <li className={style.taxItem}>
            <span>
              IGP-M <sup> (acumulado)</sup>
            </span>
            <span className={style.taxItemLine}></span>
            <span>
              {currentMarketData.currentIGPM.valor
                ?.toString()
                .replace(".", ",")}
              %
            </span>
          </li>
          <li className={style.taxItem}>
            <span>
              IPCA <sup> (acumulado)</sup>
            </span>
            <span className={style.taxItemLine}></span>
            <span>
              {currentMarketData.currentIPCA.valor
                ?.toString()
                .replace(".", ",")}
              %
            </span>
          </li>
        </ul>
        <ul className={style.taxInputs}>
          <li className={style.taxInputItem}>
            <span>Juros Padrão</span>
            <span className={style.taxItemLine}></span>
            <div className={style.taxInputWrapper}>
              <input
                type="number"
                pattern="^(?=.)(\d{1,3}(,\d{3})*)?(\.\d+)?$"
                name="defaultTax"
                value={taxes.defaultTax}
                onChange={handleChangeTax}
              />
              %
            </div>
          </li>
          <li className={style.taxInputItem}>
            <span>Juros após 24 meses</span>
            <span className={style.taxItemLine}></span>
            <div className={style.taxInputWrapper}>
              <input
                type="number"
                pattern="^(?=.)(\d{1,3}(,\d{3})*)?(\.\d+)?$"
                name="after24Months"
                value={taxes.after24Months}
                onChange={handleChangeTax}
              />
              %
            </div>
          </li>
        </ul>
        <button className={style.saveTaxButton} onClick={handleSaveNewTax}>
          {savedTaxes ? "Juros aplicados!" : "Aplicar a todos os lotes"}
        </button>
      </div>
    </div>
  );
};

export default TaxesEditPopUp;
