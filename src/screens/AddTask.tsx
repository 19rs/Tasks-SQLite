import { StatusBar } from 'react-native';
import { TouchableOpacity } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { View } from "react-native-reanimated/lib/typescript/Animated"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import { UserContext } from '../contexts/UserContext';


const AddTask = () => {
const { user, getUser } = useContext(UserContext);

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#292d3e" />
                <TextInput
                    style={styles.input}
                    placeholder={`Oi ${user?.firstName}! O que você quer fazer?`}
                    placeholderTextColor={'#fff'}
                    value={taskInput}
                    onChangeText={setTaskInput}
                />

                <View style={styles.viewSelectCategory}>
                    <DropDownPicker
                        style={styles.dropDownPicker}
                        open={open}
                        value={categoryValue}
                        items={categories.filter(
                            (c) => c.value !== "all" && c.value !== "done"
                        )}
                        setOpen={setOpen}
                        setValue={setCategoryValue}
                        placeholder="Categoria"
                        theme="DARK"
                        placeholderStyle={{
                            color: "#fff",
                            fontSize: 18,
                            paddingLeft: 5,
                        }}
                        listItemLabelStyle={{
                            color: "#fff",
                            fontSize: 16,
                            paddingLeft: 15,
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: "#11212D",
                        }}
                        selectedItemContainerStyle={{
                            backgroundColor: "#1c2541",
                        }}
                        selectedItemLabelStyle={{
                            fontWeight: "bold",
                            fontSize: 16,
                            color: "#fff",
                        }}
                    />

                    <TouchableOpacity
                        onPress={handleAddTask}
                    >
                        <MaterialCommunityIcons name="send-circle-outline" size={45} color="#ceff27" />    
                        {/* <Ionicons name="send" size={36} color="#ceff27" />             */}
                    </TouchableOpacity>

                </View>
                </SafeAreaView>
                )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#252525',
        justifyContent: 'center',
        paddingHorizontal: 20,
        rowGap: 10,
    },
    scroll: {
        rowGap: 10,
    },
    hello: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold', 
    },
    input: {
        backgroundColor: '#292d3e',
        color: '#fff',
        padding: 10,
        paddingLeft: 15,
        fontSize: 18,
        minHeight: 50,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 8,
    },
    dropDownPicker: {
        color: "#fff",
        fontSize: 18,
        paddingLeft: 15,
        zIndex: 10,
    },
    viewSelectCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        columnGap: 20,
        marginBottom: 10,
    },
    categoryListFilter: {
        marginTop: 10,
        marginBottom: 5,
        height: 90,
    }
});

export default AddTask;