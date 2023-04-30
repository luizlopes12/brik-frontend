import { createContext, useState } from "react";

const lotTypeContext = createContext({})
const LotTypeProvider = ({children}) =>{
  const [lotType, setLotType] = useState('Urbano') 
    return <lotTypeContext.Provider value={{lotType, setLotType}}>{children}</lotTypeContext.Provider>
}

export {LotTypeProvider, lotTypeContext};