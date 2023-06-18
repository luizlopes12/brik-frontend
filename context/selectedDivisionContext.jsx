import { createContext, useState } from "react";

const selectedDivisionContext = createContext({});
const DivisionSelectedProvider = ({ children }) => {
  const [divisionSelected, setDivisionSelected] = useState({});

  return (
    <selectedDivisionContext.Provider
      value={{ divisionSelected, setDivisionSelected }}
    >
      {children}
    </selectedDivisionContext.Provider>
  );
};

export { DivisionSelectedProvider, selectedDivisionContext };
