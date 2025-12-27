"use client";
import { StorageService } from "@/services/StorageService";
import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";

export interface UserContextType {
  name: string;
  token: string;
  state: UserState;
}

type UserActionType = "Login" | "Logout";
type UserState = "Online" | "Offline";
interface UserAction {
  type: UserActionType;
  user: UserContextType;
}

const initUserContext: UserContextType = {
  name: "",
  token: "",
  state: "Offline",
};
const UserContext = createContext<UserContextType>(initUserContext);
const UserDispatchContext = createContext<Dispatch<UserAction> | null>(null);
const reducer = (
  state: UserContextType,
  action: UserAction
): UserContextType => {
  switch (action.type) {
    case "Login":
      return {
        ...state,
        name: action.user.name,
        token: action.user.token,
        state: "Online",
      };
    case "Logout":
      return {
        ...state,
        name: "",
        token: "",
        state: "Offline",
      };
    default:
      return state;
  }
};

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userContext, dispatch] = useReducer(reducer, initUserContext);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    console.log("用户状态改变:", userContext.state, isLoaded);
    if (!isLoaded) {
      return;
    }
    const saveUserInfo = async () => {
      await StorageService.saveAuth(userContext.token, userContext.name);
    };

    switch (userContext.state) {
      case "Offline":
        StorageService.clearAuth();
        break;
      case "Online":
        saveUserInfo();
        break;
      default:
        break;
    }
  }, [userContext.state]);

  useEffect(() => {
    const loadUserInfo = async () => {
      const auth = await StorageService.getDefaultUser();
      if (auth.token && auth.name) {
        dispatch({
          type: "Login",
          user: {
            name: auth.name,
            token: auth.token,
            state: "Online",
          },
        });
      }

      setIsLoaded(true);
    };
    loadUserInfo();
  }, []);

  return (
    <UserContext.Provider value={userContext}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

export { UserContextProvider, UserContext, UserDispatchContext };
