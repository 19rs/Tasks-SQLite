import { StyleSheet, Text, View, Alert } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { Task } from "../types/Task";
import { categories } from "../utils/data";

interface Props {
    task: Task;
    handleRemoveTask: (id: number) => void;
    handleDoneTask: (id: number) => void;
}

const ItemCard = ({ task, handleRemoveTask, handleDoneTask }: Props) => {
    const category = categories.filter((c) => c.value === task.category);

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
            // backgroundColor: "#303030",
            backgroundColor: task.completed ? '#186300' : '#303030',
            alignItems: 'center',
            paddingVertical: 10,
            paddingLeft: 5,
            marginBottom: 3,
            zIndex: 2,
        },
        title: {
            color: '#fff',
            fontSize: 18,
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
                <Text style={styles.title}>{task.title}</Text>
            </View>
        </Swipeable>
    );
};


export default ItemCard;