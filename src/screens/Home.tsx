import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, StyleSheet, View, FlatList, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from "react-native-dropdown-picker";
import { categories } from "../utils/data";
import CategoryItem from "../components/CategoryItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showError, showSuccess } from "../components/Toast";
import ItemCard from "../components/ItemCard";
import { Task } from "../types/Task";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

const Home = () => {
    const { user, getUser } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [categoryValue, setCategoryValue] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [taskInput, setTaskInput] = useState("");
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);


    useEffect(() => {
        getData();
        getUser();
    }, []);

    useEffect(() => {
        handleSelectCategory(selectedCategory);
    }, [taskList]);


    const getData = async () => {
        try {
          await getTasks();
        } catch (error) {
          showError("Não foi possível recuperar a lista de tarefas");
        }
    };


    const getTasks = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@tasks");
            const tasksData = jsonValue !== null ? JSON.parse(jsonValue) : null;
            setTaskList(tasksData);
        } catch (error) {
            showError("Não foi possível recuperar a lista de tarefas");
        }
    };


    const storeTasks = async (value: Task[]) => {
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem("@tasks", jsonValue);
        } catch (error) {
          showError("Não foi possível salvar as lista de tarefas");
        }
      };
       

    const handleAddTask = async () => {
        if(taskInput.trim() !== '' && categoryValue) {
            const currentDate = new Date();
            const currentTimeInMillis = currentDate.getTime().toString();

            const newTaskList = [...taskList ?? []];
            const data: Task = { id: currentTimeInMillis, title: taskInput, completed: false, category: categoryValue };
            newTaskList.push(data);
            
            storeTasks(newTaskList);
            setTaskInput('');
            setCategoryValue(null);
            getData();
        } else {
            showError("Preencha a tarefa e selecione uma categoria");
        }
    };

    const handleDoneTask = (id: string) => {
        const existingTask = taskList.find(t => id === t.id);

        if (existingTask) {
            const newTaskList = taskList.map((task) =>
                task.id === existingTask.id
                ? { ...task, completed: true }
                : task
            );

            setTaskList(newTaskList);
            storeTasks(newTaskList);
            getData();
            handleSelectCategory(selectedCategory)
        }
    };

    const handleRemoveTask = (id: string) => {
        const newTaskList = [...taskList];

        const taskIndex = newTaskList.findIndex(task => task.id === id);
    
        newTaskList.splice(taskIndex, 1) 
        setTaskList(newTaskList);
        storeTasks(newTaskList);
        getData();
        handleSelectCategory(selectedCategory)
    };
    
    const handleSelectCategory = async (type: string) => {
        setSelectedCategory(type)

        if(taskList) {
            let tasks:Task[] = [];
            switch(type) {
                case "all":
                    tasks = taskList.filter(task => !task.completed);
                    break;
                case "done":
                    tasks = taskList.filter(task => task.completed);
                    break;
                default:
                    tasks = taskList.filter(task => task.category === type)
                    break;
            }
            setFilteredTasks(tasks);
        }
    };

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
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

                <View>
                    <FlatList 
                        style={styles.categoryListFilter}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={categories}
                        renderItem={({ item }) => (
                            <CategoryItem 
                                category={item} 
                                handleSelectCategory={() => {
                                    handleSelectCategory(item.value)
                                }} 
                                selectedCategory={selectedCategory} 
                            />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
                <FlatList
                    style={{marginBottom: 20}}
                    horizontal={false}
                    data={filteredTasks}
                    renderItem={({ item }) => (
                        <ItemCard
                            task={item}
                            handleRemoveTask={() => { handleRemoveTask(item.id) }}
                            handleDoneTask={() => { handleDoneTask(item.id) }}
                        />
                    )}
                />
        </SafeAreaView>
    );
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

export default Home;