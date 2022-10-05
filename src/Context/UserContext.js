import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setuserData] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  return (
    <UserContext.Provider value={{ userData, setuserData, isAuth, setIsAuth }}>
      {children}
    </UserContext.Provider>
  );
};
