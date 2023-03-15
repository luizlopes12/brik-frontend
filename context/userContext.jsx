import { createContext, useState } from "react";

const userContext = createContext({})
const UserProvider = ({children}) =>{
    const [userData, setUserData] = useState({
        userName: 'Luiz',
        userEmail: 'Luiz@luiz.com',
        userPhone: '13996440101'
    })
    return <userContext.Provider value={{userData, setUserData}}>{children}</userContext.Provider>
}

export {UserProvider, userContext};