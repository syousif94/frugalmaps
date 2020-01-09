import React, { useState } from "react";

export const InputContext = React.createContext(null);

export function InputProvider({ children }) {
  const [focused, setFocused] = useState(false);
  return (
    <InputContext.Provider value={[focused, setFocused]}>
      {children}
    </InputContext.Provider>
  );
}
