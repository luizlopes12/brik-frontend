import { createContext, useState } from "react";

const popUpsContext = createContext({})
const PopUpsProvider = ({children}) =>{
    
  const [popUps, setPopUps] = useState({
    lotRegister: false,
    taxesEdit: false,
    divisionRegister: false,
    divisionEdit: false,
  }) 

    return <popUpsContext.Provider value={{popUps, setPopUps}}>{children}</popUpsContext.Provider>
}

export {PopUpsProvider, popUpsContext};