import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, StyleSheet, View, FlatList, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from "react-native-dropdown-picker";
import { categories } from "../utils/data";
import CategoryItem from "../components/CategoryItem";
import { showError, showSuccess } from "../components/Toast";
import ItemCard from "../components/ItemCard";
import { Task } from "../types/Task";
import { TouchableOpacity } from "react-native-gesture-handler";
// import { StatusBar } from "expo-status-bar";
import { StatusBar } from 'react-native';
// import * as SQLite from "expo-sqlite";
import db from "../services/sqlite/SQLiteDatabase";
import Animated, { BounceInDown, FlipInYRight, FlipOutYRight } from "react-native-reanimated";

const Home = () => {
    const { user, getUser } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [categoryValue, setCategoryValue] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [taskInput, setTaskInput] = useState("");
    const [taskList, setTaskList] = useState<Task[]>([]);


    // const openDatabase = () => {
    //     const db = SQLite.openDatabase("db.db");
    //     return db;
    // }

    // const db = openDatabase();


    useEffect(() => {
        getUser();
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, completed INT, title TEXT, category TEXT);"
            );
        });
        getTasks();
    }, []);

    useEffect(() => {
        handleSelectCategory(selectedCategory);
    }, [taskList]);


    const getTasks = async () => {
       db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM tasks WHERE completed = 0;",
            [],
            (_, { rows: { _array } }) => {
                setTaskList(_array);
            }
        );
       });
    };


    const getTasksByCategory = (category: string) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM tasks WHERE completed = 0 AND category = ?;",
                [category],
                (_, { rows: { _array } }) => {
                    setTaskList(_array);
                }
            );
        });
    };

    const getCompletedTasks = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM tasks WHERE completed = 1;",
                [],
                (_, { rows: { _array } }) => {
                    setTaskList(_array);
                }
            );
        });
    };


    const handleAddTask = async () => {
        if (taskInput !== "" && categoryValue) {
            db.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO tasks (completed, title, category) VALUES (0, ?, ?);",
                    [taskInput, categoryValue]
                );
                tx.executeSql(
                    "SELECT * FROM tasks WHERE completed = 0;",
                    [],
                    (_, { rows: { _array } }) => {
                        setTaskList(_array);
                    }
                );
            });

            setTaskInput("");
            setCategoryValue(null);
        }
    };

    const handleDoneTask = (id: number) => {
        db.transaction((tx) => {
            tx.executeSql("UPDATE tasks SET completed = ? WHERE id = ?;", [1, id]);
            tx.executeSql(
                "SELECT * FROM tasks WHERE completed = 0;",
                [],
                (_, { rows: { _array } }) => {
                    setTaskList(_array);
                }
            );
        });
    };

    const handleRemoveTask = (id: number) => {
        db.transaction((tx) => {
            tx.executeSql("DELETE FROM tasks WHERE id = ?;", [id]);
            tx.executeSql(
                "SELECT * FROM tasks WHERE completed = 0;",
                [],
                (_, { rows: { _array } }) => {
                    setTaskList(_array);
                }
            );
        });
        //precisa?
        // handleSelectCategory(selectedCategory)
    };
    
    const handleSelectCategory = (type: string) => {
        setSelectedCategory(type)

        if(taskList) {
            switch(type) {
                case "all":
                    getTasks();
                    break;
                case "done":
                    getCompletedTasks();
                    break;
                default:
                    getTasksByCategory(type);
                    break;
            }
        }
    };

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

                <View>
                    <Animated.FlatList 
                        entering={BounceInDown}
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

                <Animated.View 
                    entering={BounceInDown}
                    style={{display: taskList.length === 0 ? 'flex' : 'none', alignItems: 'center'}}>
                    <Text style={{color: '#fff'}}>Sem tarefas para fazer!</Text>
                </Animated.View>

                <Animated.FlatList
                    entering={FlipInYRight}
                    exiting={FlipOutYRight}
                    style={{marginBottom: 20}}
                    horizontal={false}
                    data={taskList}
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