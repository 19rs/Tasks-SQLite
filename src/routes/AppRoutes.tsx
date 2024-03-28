import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
import Home from "../screens/Home";
import User from "../screens/User";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddTask from "../screens/AddTask";

const Stack = createNativeStackNavigator();

export const HomeRoutes = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    headerTitle: "Lista de Tarefas",
                    headerStyle: {
                        backgroundColor: '#292d3e',
                      },
                      headerTintColor: '#ceff27',
                      headerTitleStyle: {
                        fontWeight: '500',
                      },
                }}
            />
            <Stack.Screen
                name="AddTask"
                component={AddTask}
                options={{
                    headerTitle: "Lista de Tarefas",
                    headerStyle: {
                        backgroundColor: '#292d3e',
                      },
                      headerTintColor: '#ceff27',
                      headerTitleStyle: {
                        fontWeight: '500',
                      },
                }}
            />
        </Stack.Navigator>
    );
};

export const Tab = createBottomTabNavigator();

export const AppRoutes = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
            }}
            
          >
            <Tab.Screen
                name="HomeRoutes"
                component={HomeRoutes}
                options={{
                    tabBarActiveBackgroundColor: '#3c3147',
                    tabBarInactiveBackgroundColor: '#292d3e',
                    tabBarIcon: () => (
                        <MaterialIcons name="home" size={30} color="#ceff27"/>
                    ),
                }}
            />
            <Tab.Screen
                name="User"
                component={User}
                options={{
                    tabBarActiveBackgroundColor: '#3c3147',
                    tabBarInactiveBackgroundColor: '#292d3e',
                    tabBarIcon: () => (
                        <MaterialIcons name="person" size={30} color="#ceff27" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};