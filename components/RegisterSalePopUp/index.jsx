import React, { useContext, useState, useMemo } from "react";
import style from "./style.module.scss";
import { popUpsContext } from "../../context/popUpsContext";
import DivisionSelector from "../DivisionSelector";
import { globalDivisionsDataContext } from "../../context/globalDivisionsDataContext";

const RegisterSalePopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext);
  const { globalDivisionsData, setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  console.log(globalDivisionsData)
  const [showDivisionOptions, setShowDivisionOptions] = useState(false);
  const [divisionSearch, setDivisionSearch] = useState('');
  
  const [textsInputs, setTextsInputs] = useState({
    seller: '',
    buyer: '',
  }); 

  const handleChangeTextsInputs = (e) => {
    setTextsInputs({ ...textsInputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log(textsInputs)
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
            onClick={() => setPopUps({ ...popUps, registerSale: false })}
            name="lotRegister"
          >
            <img src="/images/closeIcon.svg" alt="Sair" />
          </button>
        </div>
        <section className={style.inputsSection}>
            <div className={style.inputs}>
                <div className={style.input}>
                  <label>Email do Vendedor:</label>
                  <input type="email" placeholder='vendedor@gmail.com' value={textsInputs.seller} name='seller' onChange={handleChangeTextsInputs}/>
                </div>
                <div className={style.input}>
                  <label>Email do Cliente:</label>
                  <input type="email" placeholder='cliente@gmail.com' value={textsInputs.buyer} name='buyer' onChange={handleChangeTextsInputs}/>
                </div>
                <button className={style.sendEmail} onClick={handleSubmit}>Enviar</button>
            </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterSalePopUp;
