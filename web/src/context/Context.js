import React, { createContext, useReducer } from "react"
import { reducer } from "./Reducer";

export const GlobalContext = createContext("Initial Value");

let data = {
  user: {},
  isLogin: null,
  darkTheme: true,
  myNum : 5,
  baseUrl: (window.location.href.indexOf("https") === -1) ? "http://localhost:5001" : "https://file-upload-bucket-production.up.railway.app"
}


export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}