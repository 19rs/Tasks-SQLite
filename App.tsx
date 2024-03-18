import "react-native-gesture-handler";
import { RootSiblingParent } from "react-native-root-siblings";
import { UserContextProvider } from "./src/contexts/UserContext";
import { Routes } from "./src/routes";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <UserContextProvider>
          <Routes />
        </UserContextProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
};