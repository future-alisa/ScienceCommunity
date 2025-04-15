"use client";
import { api } from "@/app/api/ApiService";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

interface UserContextType {
  name: string;
  token: string;
  state: string;
}

type UserActionType = "Login" | "Logout";
interface UserAction {
  type: UserActionType;
  user: UserContextType;
}
const initUserContext = {
  name: "syb",
  token: "",
  state: "",
};
const UserContext = createContext<UserContextType>(initUserContext);
const UserDispatchContext = createContext<Dispatch<UserAction> | null>(null);
const reducer = (state: UserContextType, action: UserAction) => {
  let newState = state;
  switch (action.type) {
    case "Login":
      newState.name = action.user.name;
      newState.state = "online";
      api.setToken(action.user.token);
      break;
    case "Logout":
      newState.name = "ction.user.name";
      newState.state = "offline";
      break;
    default:
      break;
  }
  return newState;
};

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userContext, dispatch] = useReducer(reducer, initUserContext);
  return (
    <UserContext.Provider value={userContext}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

export { UserContextProvider, UserContext, UserDispatchContext };
