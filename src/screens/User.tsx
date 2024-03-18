import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { showError } from "../components/Toast";

const User = () => {
  const { user, getUser, logout } = useContext(UserContext);


  useEffect(() => {
    const getData = async () => {
      try {
        await getUser();
      } catch (error) {
        showError("Não foi possível recuperar os dados do usuário");
      }
    };
    getData();
  }, []);

  return (
    <SafeAreaView style={ styles.container }>
      <View style={ styles.viewImg }>
        <Image
            resizeMode="contain"
            style={{ width: 200, height: 200 }}
            source={{ uri: user?.image }}
        />
      </View>
      <View style={ styles.viewUsername }>
        <Text style={ styles.username }>{ user?.username }</Text>
      </View>
      
      <Text style={ styles.info }>{user?.firstName} { user?.lastName } </Text>
      {/* <Text style={ styles.info }>{ user?.lastName }</Text> */}
        
      <Text style={ styles.info }>{ user?.email} </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => logout()}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
    paddingVertical: 20,
    rowGap: 10,
    alignItems: 'center',
  },
  viewImg: {
    width: 250,
    height: 250,
    borderRadius: 350/2,
    backgroundColor: '#f8fafc',
    borderWidth: 3,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewUsername: {
    width: '90%',
    alignItems: 'center',
    backgroundColor: '#292d3e',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: 2,
    borderColor: '#3c3147',
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    marginVertical: 10
    },
    username: {
      fontWeight: 'bold',
      fontSize: 25,
      color: '#ceff27',
    },
    info: {
      fontSize: 20,
      color: '#fff',
    },
    button: {
      width: "80%",
      backgroundColor: "#ceff27",
      borderWidth: 2,
      borderColor: '#3c3147',
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      paddingVertical: 15
    },
    buttonText: {
      color: "#3c3147",
      fontSize: 18,
      fontWeight: '600',
    },
});