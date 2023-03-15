import { createContext, useState } from "react";

const lotSelectedContext = createContext({})
const LotSelectedProvider = ({children}) =>{
    
  const [lotSelected, setLotSelected] = useState({
    name: '',
    description: '',
    location: '',
    metrics: '',
    finalPrice: '',
    basePrice: '',
    hiddenPrice: false,
    maxPortionsQuantity: 0,
    taxPercentage: '',
    taxPercentage24: '',
    lotePartners: [
    ]
    })
    return <lotSelectedContext.Provider value={{lotSelected, setLotSelected}}>{children}</lotSelectedContext.Provider>
}

export {LotSelectedProvider, lotSelectedContext};