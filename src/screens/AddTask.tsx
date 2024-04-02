import { StatusBar } from 'react-native';
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import { TaskContext } from '../contexts/TaskContext';
import DropDownPicker from 'react-native-dropdown-picker';
import { categories } from '../utils/data';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Fontisto } from '@expo/vector-icons';

const AddTask = () => {
    const { taskInput, setTaskInput, categoryValue, setCategoryValue, handleAddTask, open, setOpen, dateInput, setDateInput } = useContext(TaskContext);
    
    const [mode, setMode] = useState<"date" | "time">("date");
    const [show, setShow] = useState(false);

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setShow(false);
        setDateInput(currentDate);
    };
    
    const showMode = (currentMode: React.SetStateAction<"date" | "time">) => {
        setShow(true);
        setMode(currentMode);
    };
    
    const showDatePicker = () => {
        showMode("date");
    };

    return(
        <SafeAreaView style={styles.container}>
            {show && (
            <DateTimePicker
                testID="dateTimePicker"
                value={dateInput}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
            />
            )}
            <StatusBar barStyle="light-content" backgroundColor="#292d3e" />
                <TextInput
                    style={styles.input}
                    placeholder={'O que você quer fazer?'}
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

                    <TouchableOpacity onPress={showDatePicker}>
                        <Fontisto name="date" size={24} color="#ceff27" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleAddTask}>
                        <MaterialCommunityIcons name="send-circle-outline" size={45} color="#ceff27" />    
                    </TouchableOpacity>
                </View>            
        </SafeAreaView>
        )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
        backgroundColor: '#252525',
        paddingHorizontal: 20,
        rowGap: 10,
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
    }
});

export default AddTask;