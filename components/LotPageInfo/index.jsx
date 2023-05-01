import React, {useState} from "react";
import style from "./style.module.scss";
import formatCurrency from "../../helpers/formatCurrency";
import { CircularProgress } from '@mui/material'
import { toast } from 'react-toastify';


const LotPageInfo = ({ lotData, divisionData, mapIcon, metricsIcon }) => {

    const [sendEmail, setSendEmail] = useState(false)

    const [simulation, setSimulation] = useState({
        portionValue: 0,
        portionsQuantity: 0,
        totalValue: 0,
        selected:{
            option1: false,
            option2: false,
            option3: false,
        }
    })

    const [visitData, setVisitData] = useState({
        name: '',
        email: '',
        date: '',
        time: '',
        portionsQuantity: 0,
        portionValue: 0,
        divisionName: divisionData.name,
        lotName: lotData.name,
        lotPrice: formatCurrency(lotData.totalValue),
        lotLocation: lotData.location,
    })

    const handleVisitData = (e) => {
        const {name, value} = e.target
        setVisitData({
            ...visitData,
            [name]: value
        })
    }

    const handleSendEmail = async () => {
        if(visitData.name === '' || visitData.email === '' || visitData.date === '' || visitData.time === ''){
            toast.error('Preencha todos os campos!')
            return
        }
        setSendEmail(true)
        await fetch(`${process.env.BACKEND_URL}/email/visit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(visitData)
        })
        .then(async res => {
            toast.success(res.message)
        }).catch(err => {
            toast.error(err.message)
        }).finally(() => {
            setSendEmail(false)
        })
    }

    const handleSimulation = (e) => {
        const portionsQuantity = e.target.value
        const portionValue = lotData.finalPrice / portionsQuantity
        const totalValue = portionValue + (portionValue * (lotData.taxPercentage / 100))
        setSimulation({
            portionValue: portionValue,
            portionsQuantity: portionsQuantity,
            totalValue: totalValue,
            selected:{
                option1: portionsQuantity == Math.ceil(lotData.maxPortionsQuantity / 3) ? true : false,
                option2: portionsQuantity == Math.ceil((lotData.maxPortionsQuantity / 3) * 2) ? true : false,
                option3: portionsQuantity == lotData.maxPortionsQuantity ? true : false,
            }
        })
        setVisitData({
            ...visitData,
            portionsQuantity: portionsQuantity,
            portionValue: formatCurrency(totalValue),
            lotPrice: formatCurrency(Number(lotData.finalPrice) + Number((lotData.finalPrice *(lotData.taxPercentage / 100)))),
        })
    }

  return (
    <section className={style.lotInfoSection}>
      <div className={style.lotInfoContainer}>
        <div className={style.lotInfo}>
          <h3 className={style.divisionInfo}>
            <img src={divisionData.logoUrl} alt={divisionData.name} />
            {divisionData.name}
          </h3>
          <h1>
            <span className={style.lotName}>{lotData.name},</span>
            <span className={style.lotPrice}>
              {formatCurrency(lotData.finalPrice)}
            </span>
          </h1>
          <p className={style.lotLocation}>
            <img src={mapIcon} alt="Localização" />
            {lotData.location}
          </p>
          <p className={style.lotMetrics}>
            <img src={metricsIcon} alt="Metricas" />
            {lotData.metrics}m²
          </p>
          <h4 className={style.lotDescTitle}>Descrição</h4>
          <p className={style.lotDesc}>{lotData.description}</p>
        </div>
        {lotData.maxPortionsQuantity && (
        <div className={style.lotSimulation}>
          <h3 className={style.simulationTitle}>Simule seu Parcelamento</h3>
          <p className={style.simulationDesc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
            <ul className={style.lotSimulationList}>
              <li>
              <p>
                <span>+{lotData.taxPercentage}%</span>
                  <span> {Math.ceil(lotData.maxPortionsQuantity / 3)}x </span>
                </p>
                  <span className={style.input}>
                    <input type="radio" value={Math.ceil(lotData.maxPortionsQuantity / 3)} onClick={handleSimulation} name={'option1'} checked={simulation.selected.option1} className={style.seletionRadio} />
                  </span>
              </li>
                    
              <li>
              <p>
                <span>+{lotData.taxPercentage}%</span>
                  <span> {Math.ceil((lotData.maxPortionsQuantity / 3) * 2)}x </span>
                </p>
                  <span className={style.input}>
                    <input type="radio" value={Math.ceil((lotData.maxPortionsQuantity / 3) * 2)} onClick={handleSimulation} name={'option2'} checked={simulation.selected.option2} className={style.seletionRadio} />
                  </span>
              </li>
              <li>
              <p>
                <span>+{lotData.taxPercentage}%</span>
                  <span> {Math.ceil((lotData.maxPortionsQuantity ))}x </span>
                </p>
                  <span className={style.input}>
                    <input type="radio" value={Math.ceil((lotData.maxPortionsQuantity ))} onClick={handleSimulation} name={'option3'} checked={simulation.selected.option3} className={style.seletionRadio} />
                  </span>
              </li>
            </ul>
            <div className={style.simulationResult}>
                <p><b>R$</b> <span>{ formatCurrency(simulation.totalValue).slice(2) }</span></p>
            </div>
        </div>
          )}
      </div>
      <div className={style.makeVisitContainer}>
        <h3>Agendar visita</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et.</p>
        <div className={style.makeVisitForm}>
          <input type="text" name='name' className={style.visitInput} placeholder="Nome completo" onChange={handleVisitData}/>
          <input type="email" name='email' className={style.visitInput} placeholder="E-mail" onChange={handleVisitData}/>
          <div className={style.dateGroup}>
          <input type="date" name='date' className={style.visitInput} onChange={handleVisitData}/>
          <input type="time" name='time'  className={style.visitInput} onChange={handleVisitData}/>
          </div>
          <button className={style.visitBtn} onClick={() => handleSendEmail()}>
                {sendEmail ? <CircularProgress size={22} color='inherit'/> : 'Agendar visita'}
            </button>
        </div>
      </div>
    </section>
  );
};

export default LotPageInfo;
