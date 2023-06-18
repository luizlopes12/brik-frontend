import { createContext, useState } from "react";

const globalDivisionsDataContext = createContext();
const GlobalDivisionsDataProvider = ({ children }) => {
  const [globalDivisionsData, setGlobalDivisionsData] = useState([]);

  return (
    <globalDivisionsDataContext.Provider
      value={{ globalDivisionsData, setGlobalDivisionsData }}
    >
      {children}
    </globalDivisionsDataContext.Provider>
  );
};

export { GlobalDivisionsDataProvider, globalDivisionsDataContext };
