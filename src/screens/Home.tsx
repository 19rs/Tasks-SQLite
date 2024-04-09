import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, StyleSheet, View, FlatList, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { categories } from "../utils/data";
import CategoryItem from "../components/CategoryItem";
import { showError, showSuccess } from "../components/Toast";
import ItemCard from "../components/ItemCard";
import { StatusBar } from 'react-native';
// import * as SQLite from "expo-sqlite";
import db from "../services/sqlite/SQLiteDatabase";
import Animated, { BounceInDown, FlipInYRight, FlipOutYRight } from "react-native-reanimated";
import { TaskContext } from "../contexts/TaskContext";
import WeekCalendar from "../components/WeekCalendar";

const Home = () => {
    const { user, getUser } = useContext(UserContext);
    const {
      taskList,
      selectedCategory,
      handleSelectCategory,
      handleRemoveTask,
      handleDoneTask,
      getTasks,
    } = useContext(TaskContext);


    // const openDatabase = () => {
    //     const db = SQLite.openDatabase("db.db");
    //     return db;
    // }

    // const db = openDatabase();

    
    useEffect(() => {
        getUser();
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, completed INT, title TEXT, category TEXT, date TEXT, images TEXT);"
            );
        });
        getTasks();
    }, []);




    

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#292d3e" />
                <View>
                    <WeekCalendar />
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
        paddingTop: 15,
        backgroundColor: '#252525',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    // scroll: {
    //     rowGap: 10,
    // },
    viewSelectCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        columnGap: 20,
        marginBottom: 10,
    },
    categoryListFilter: {
        marginTop: 10,
        height: 90,
    }
});

export default Home;