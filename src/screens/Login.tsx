import { StyleSheet, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../contexts/UserContext";
import { StatusBar } from "expo-status-bar";

const Login = () => {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>LOGIN</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholder="MAX POWER   -   (Tá mockado)"
        placeholderTextColor={'#fff'}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Insira sua senha"
        placeholderTextColor={'#fff'}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => login(username, password)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    rowGap: 10,
    backgroundColor: '#252525',
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: '#292d3e',
    color: '#fff',
    padding: 10,
    paddingLeft: 15,
    fontSize: 15,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#3c3147",
    borderWidth: 2,
    borderColor: '#292d3e',
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  buttonText: {
    color: "#ceff27",
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    color: "#ceff27",
    fontSize: 26,
    fontWeight: "bold",
  },
});

export default Login;
