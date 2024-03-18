import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, Text } from "react-native";
import { Category } from "../types/Task";

interface Props {
    category: Category;
    handleSelectCategory: (value: string) => void;
    selectedCategory: string;
}

const CategoryItem = ({ category, handleSelectCategory, selectedCategory}: Props) => {
    const styles = StyleSheet.create({
        categoryItem: {
            backgroundColor: category.color,
            paddingHorizontal: 10,
            paddingVertical: 12,
            marginRight: 10,
            width: 120,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: selectedCategory === category.value ? 'white' : category.color,
        },
        label: {
            color: '#fff',
            fontSize: 15,
            textAlign: 'center',
            alignItems: 'center',
        }
    });

    return (
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => {
            handleSelectCategory(selectedCategory)}}
        >
          <Text style={styles.label}>{ category.label }</Text>
        </TouchableOpacity>
    );
};


export default CategoryItem;