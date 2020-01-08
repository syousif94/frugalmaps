import React from "react";
import { useKeyboardHeight } from "../utils/Hooks";

export const KeyboardContext = React.createContext(null);

export function KeyboardProvider({ children }) {
  const [keyboard, setBottomOffset] = useKeyboardHeight();

  return (
    <KeyboardContext.Provider value={[keyboard, setBottomOffset]}>
      {children}
    </KeyboardContext.Provider>
  );
}
