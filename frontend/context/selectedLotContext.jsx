import { createContext, useState } from "react";

const lotSelectedContext = createContext({})
const LotSelectedProvider = ({children}) =>{
    
  const [lotSelected, setLotSelected] = useState() 

    return <lotSelectedContext.Provider value={{lotSelected, setLotSelected}}>{children}</lotSelectedContext.Provider>
}

export {LotSelectedProvider, lotSelectedContext};