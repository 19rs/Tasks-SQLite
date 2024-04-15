import "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { UserContextProvider } from "./src/contexts/UserContext";
import { Routes } from "./src/routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TaskContextProvider } from "./src/contexts/TaskContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin"; 
import { useEffect } from "react";

export default function App() {

  const configGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: "50327597686-v5c8n1fr1f673or06bdh5007o56bpu3f.apps.googleusercontent.com",
      profileImageSize: 120,
    });
  };

  useEffect(() => {
    configGoogleSignIn();
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <UserContextProvider>
          <TaskContextProvider>
            <Routes />
          </TaskContextProvider>
        </UserContextProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};