import React, { useContext, useState, useMemo } from 'react';
import style from './style.module.scss';
import { popUpsContext } from '../../context/popUpsContext';
import DivisionSelector from '../DivisionSelector';
import { globalDivisionsDataContext } from '../../context/globalDivisionsDataContext';

const RegisterSalePopUp = () => {
  const { popUps, setPopUps } = useContext(popUpsContext);
  const { globalDivisionsData, setGlobalDivisionsData } = useContext(globalDivisionsDataContext)
  console.log(globalDivisionsData)
  const [showDivisionOptions, setShowDivisionOptions] = useState(false);
  const [divisionSearch, setDivisionSearch] = useState('');
  const [lotDivision, setLotDivision] = useState({
    name: 'Selecione um Loteamento',
    logoUrl: 'https://i.imgur.com/YQOzMWA.png',
    id: 0,
    partners: [],
  });
  const [formData, setFormData] = useState({
    saleDate: '',
  });
  const [textsInputs, setTextsInputs] = useState({
    seller: '',
    buyer: '',
    });

  const handleChangeInputs = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleShowDivisionOptions = () => {
    setShowDivisionOptions(!showDivisionOptions);
  };
  const handleSearchDivision = (e) => {
    setDivisionSearch(e.target.value);
  };
  const globalDivisionsDataFiltered = useMemo(() => {
    return globalDivisionsData.filter((division) =>
      divisionSearch.length > 0
        ? division.name.toLowerCase().includes(divisionSearch.toLowerCase())
        : division,
    );
  }, [divisionSearch, globalDivisionsData]);
  const handleSelectDivisionToLot = (selectedDivision) => {
    setLotDivision({
      name: selectedDivision.name,
      logoUrl: selectedDivision.logoUrl,
      id: selectedDivision.id,
      partners: selectedDivision.divisionPartners,
    });
    setShowDivisionOptions(false);
  };
  
    const handleChangeTextsInputs = (e) => {
    setTextsInputs({ ...textsInputs, [e.target.name]: e.target.value });
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
            onClick={(e) => setPopUps((popUps.registerSale = false))}
            name="lotRegister"
          >
            <img src="/images/closeIcon.svg" alt="Sair" />
          </button>
        </div>
        {/* <section className={style.inputsSection}>

          <div className={style.dateInput}>
            <span>Data de início:</span>
            <input
              type="date"
              name="saleDate"
              value={formData.saleDate}
              onChange={handleChangeInputs}
            />
          </div>
        </section> */}
        <section className={style.inputsSection}>
            <div className={style.inputs}>
                {/* <DivisionSelector
                lotDivision={lotDivision}
                handleShowDivisionOptions={handleShowDivisionOptions}
                showDivisionOptions={showDivisionOptions}
                divisionSearch={divisionSearch}
                handleSearchDivision={handleSearchDivision}
                globalDivisionsDataFiltered={globalDivisionsDataFiltered}
                handleSelectDivisionToLot={handleSelectDivisionToLot}
                /> */}
                <div className={style.input}>
                <label>Email do Vendedor:</label><input type="text" placeholder='vendedor@gmail.com' value={textsInputs.seller} name='seller' onChange={handleChangeTextsInputs}/>    
                </div>   
                <div className={style.input}>
                <label>Email do Cliente:</label><input type="text" placeholder='cliente@gmail.com' value={textsInputs.buyer} name='buyer' onChange={handleChangeTextsInputs}/>  
                </div> 
                <button className={style.sendEmail}>Enviar</button>  
            </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterSalePopUp;
