"use client";
import { api } from "@/app/api/ApiService";
import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from "react";

interface UserContextType {
  name: string | null;
  token: string | null;
  state: UserState;
}

type UserActionType = "Login" | "Logout";
type UserState = "Online" | "Offline";
interface UserAction {
  type: UserActionType;
  user: UserContextType;
}
const getDefaultUser = (): UserContextType => {
  const token = localStorage.getItem("auth_token");
  const username = localStorage.getItem("username");
  console.log("token:", token, username);
  if (token) {
    return { name: username, token: token, state: "Online" };
  } else {
    return { name: "", token: "", state: "Offline" };
  }
};
const initUserContext: UserContextType = getDefaultUser();
const UserContext = createContext<UserContextType>(initUserContext);
const UserDispatchContext = createContext<Dispatch<UserAction> | null>(null);
const reducer = (state: UserContextType, action: UserAction) => {
  let newState = state;
  switch (action.type) {
    case "Login":
      newState.name = action.user.name;
      newState.state = "Online";
      api.setToken(action.user.token);

      localStorage.setItem("auth_token", action.user.token!);
      localStorage.setItem("username", action.user.name!);
      break;
    case "Logout":
      newState.name = "ction.user.name";
      newState.state = "Offline";
      break;
    default:
      break;
  }
  return newState;
};

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userContext, dispatch] = useReducer(reducer, initUserContext);

  useEffect(() => {}, []);

  return (
    <UserContext.Provider value={userContext}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

export { UserContextProvider, UserContext, UserDispatchContext };
