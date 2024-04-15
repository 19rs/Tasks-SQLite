import axios from "axios";
import { ReactNode, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "../types/User";
import { showError } from "../components/Toast";
import { GoogleSignin } from "@react-native-google-signin/google-signin"; 

type UserContextProps = {
  token: string;
  setToken: (token: string) => void;
  getToken: () => void;
  user: UserDTO | null;
  setUser: (user: UserDTO) => void;
  getUser: () => void;
  login: (username: string, password: string) => void;
  logout: () => void;
  googleSignIn: () => void;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

export const UserContextProvider = ({ children }: UserProviderProps) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<UserDTO | null>(null);

  const storeToken = async (value: string) => {
    try {
      await AsyncStorage.setItem("@token", value);
    } catch (error) {
      showError("Não foi possível salvar o token");
    }
  };

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem("@token");

      if (value !== null) {
        setToken(value);
      }
    } catch (error) {
      showError("Não foi possível recuperar o token");
    }
  };

  const storeUser = async (value: UserDTO) => {
    try {
      const jsonValue = JSON.stringify(value);

      await AsyncStorage.setItem("@user", jsonValue);
    } catch (error) {
      showError("Não foi possível salvar os dados do usuário");
    }
  };

  const getUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@user");
      const userData = jsonValue !== null ? JSON.parse(jsonValue) : null;

      setUser(userData);
    } catch (error) {
      showError("Não foi possível recuperar o usuário");
    }
  };

  // const login = async (username: string, password: string) => {
  //   try {
  //     const url = "https://dummyjson.com/auth/login";

  //     const response = await axios.post<UserDTO>(url, {
  //       username,
  //       password,
  //     });

  //     setUser(response.data);
  //     storeUser(response.data);
  //     setToken(response.data.token);
  //     storeToken(response.data.token);
  //   } catch (error) {
  //     showError("Não foi possível realizar o login");
  //   }
  // };

  const login = async (username: string, password: string) => {

      const user: UserDTO = {
        id: "1",
        username: 'MAX POWER',
        email: 'homer@doh.com',
        firstName: 'Homer',
        lastName: 'J. Simpson',
        gender: 'Male',
        image: 'https://whatsondisneyplus.b-cdn.net/wp-content/uploads/2021/09/homer.png',
        token: '1'
      }
      setUser(user);
      storeUser(user);
      setToken(user.token);
      storeToken(user.token);
  };

  
  const logout = async () => {
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@user");
    setToken("");
    await AsyncStorage.removeItem("@cart");
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const res = await GoogleSignin.signIn();
      if (res) {
        const user: UserDTO = {
          id: res.user.id,
          username: res.user.name || "",
          email: res.user.email,
          firstName: res.user.givenName || "",
          lastName: res.user.familyName || "",
          gender: "",
          image: res.user.photo || "",
          token: res.idToken || "",
        };
        setToken(res.idToken || "");
        storeUser(user);
        setUser(user);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        getToken,
        user,
        setUser,
        getUser,
        login,
        logout,
        googleSignIn
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
