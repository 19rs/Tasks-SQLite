import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from '@expo/vector-icons';

const AddHeader = () => {
    const navigation = useNavigation<any>();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("AddTask")}
        >
            <FontAwesome name="plus" size={24} color="#ceff27" />
        </TouchableOpacity>
    );
}

export default AddHeader;