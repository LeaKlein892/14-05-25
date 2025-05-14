import { createContext, Dispatch, SetStateAction } from "react";
import { UserProfile } from "../models";
import { emptyFn } from "../utils/render-utils";

interface LoggedUserContextData {
  loggedUser: UserProfile;
  setLoggedUser: Dispatch<SetStateAction<UserProfile>>;
}

export const defaultLoggedUser = {
  id: "",
  username: "",
  email: "",
};

export const LoggedUserContext = createContext<LoggedUserContextData>({
  loggedUser: defaultLoggedUser,
  setLoggedUser: emptyFn,
});
