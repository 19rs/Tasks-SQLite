import { useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { Task } from "../types/Task";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../contexts/TaskContext";
import { categories } from "../utils/data";
import moment from "moment";


const TaskDetails = () => {
    const routes = useRoute();
    let { id, title, category, date, images } = routes.params as Task;

    const { takePhoto, pickImage, image, setImage } = useContext(TaskContext);

    const [taskImages, setTaskImages] = useState<string[]>([])
    
    useEffect(() => {
        console.log('aqui')
        let imagens = images.split(',')
        setImage(imagens)
        // setTaskImages(imagens)
    }, [])

    useEffect(() => {
        console.log('alterou')
        console.log(image.length)
        //images = image
        setTaskImages(image)

    }, [image]);

    const nomeCategoria = () => {
        let index: number = categories.findIndex(c => c.value === category)
        return categories[index].label
    };

    const corCategoria = () => {
        let index: number = categories.findIndex(c => c.value === category)
        return categories[index].color
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            // height: '100%',
            paddingTop: 15,
            backgroundColor: '#252525',
            justifyContent: 'center',
            paddingHorizontal: 20,
        },
        botoesImagem: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 20,
            marginRight: 2,
        },
        categoria: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            backgroundColor: corCategoria(),
            color: '#fff',
            paddingHorizontal: 17,
            paddingVertical: 12,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
        },
        texto: {
            color: '#fff',
            fontSize: 16,
        },
        titulo: {
            backgroundColor: '#303030',
            borderWidth: 2,
            borderColor: corCategoria(),
            color: '#fff',
            fontSize: 20,
            paddingHorizontal: 20,
            paddingVertical: 25,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
            marginBottom: 20,
        },
        imagem: {
            width: 320,
            height: 300,
            // resizeMode: 'contain',
            // resizeMode: 'center',
            marginBottom: 20,
            borderWidth: 1,
            borderRadius: 2,
            borderColor: 'white',
            padding: 10
        }
    });

    return(
        <View style={styles.container}>
            <View style={ styles.categoria }>
                <View style={{ flexDirection: 'column'}}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'white'}}>{ nomeCategoria() }</Text>
                    <Text style={ styles.texto }>{ moment(date).format('DD/MM/YYYY')}</Text>
                </View>
                <View style={ styles.botoesImagem }>
                    <MaterialIcons name="add-a-photo" size={34} color="#fff" onPress={() => takePhoto(id)} />
                    <FontAwesome name="photo" size={34} color="#fff"  onPress={() => pickImage(id)} />
                </View>
            </View>
            <Text style={styles.titulo}>{ title }</Text>


            <FlatList
                // data={images.split(",")}
                data={taskImages}
                extraData={image}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: "data:image/jpeg;base64," + item }}
                        style={ styles.imagem }
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};


export default TaskDetails;