import { StyleSheet, Text, View, Alert } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import { Task } from "../types/Task";
import { categories } from "../utils/data";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

interface Props {
    task: Task;
    handleRemoveTask: (id: number) => void;
    handleDoneTask: (id: number) => void;
}

const ItemCard = ({ task, handleRemoveTask, handleDoneTask }: Props) => {

    const navigation = useNavigation<any>();

    const category = categories.filter((c) => c.value === task.category);

    const handleDetails = () => {
        navigation.navigate('TaskDetails', task);
    };

    const handleDelete = () => {
        Alert.alert("Tarefas", "Tem certeza que deseja excluir esta tarefa?", [
            {
                text: "Não",
                style: "cancel",
            },
            { text: "Sim", onPress: () => handleRemoveTask(task.id) },
        ]);
    };

    const LeftAction = () => {
        return (
            !task.completed ?
            <View style={styles.swipeLeft}>
                <MaterialIcons
                    name="done"
                    size={20}
                    color="#fff"
                    onPress={() => handleDoneTask(task.id)}
                />
            </View> : null
        );
    };

    const RightAction = () => {
        return (
            <View style={styles.swipeRight}>
                <MaterialIcons
                    name="delete"
                    size={20}
                    color="#fff"
                    onPress={handleDelete}
                />
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: task.completed ? '#186300' : '#303030',
            alignItems: 'center',
            paddingVertical: 10,
            paddingLeft: 5,
            marginBottom: 3,
            zIndex: 2,
        },
        date: {
            color: '#fff',
            fontSize: 15,
        },
        title: {
            color: '#fff',
            fontSize: 18,
            width: '70%',
            textAlign: 'justify'
        },
        swipeLeft: {
            flex: 1,
            backgroundColor: 'green',
            justifyContent: 'center',
            paddingLeft: 12,
            marginBottom: 3,
        },
        swipeRight: {
            flex: 1,
            backgroundColor: 'red',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingRight: 12,
            marginBottom: 3,
        }
    })

    return (
        <Swipeable renderLeftActions={LeftAction} renderRightActions={RightAction}>
            <TouchableOpacity onPress={handleDetails}>
                <View style={styles.container}>
                    <View
                        style={{
                            borderStyle: "solid",
                            height: "100%",
                            borderLeftWidth: 6,
                            borderColor: category[0].color,
                            marginRight: 10,
                        }}
                    />
                    <Text style={styles.date}>{ moment(task.date).format('DD/MM')}  -  </Text>
                    <Text style={styles.title}>{task.title}</Text>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};


export default ItemCard;