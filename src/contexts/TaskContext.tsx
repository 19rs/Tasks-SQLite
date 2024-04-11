import { ReactNode, createContext, useState } from "react";
import db from "../services/sqlite/SQLiteDatabase";
import { Task } from "../types/Task";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";

type TaskContextProps = {
    taskList: Task[];
    setTaskList: (taskList: Task[]) => void;
    getTasks: () => void;
    getTasksByCategory: (category: string) => void;
    getCompletedTasks: () => void;
    categoryValue: string | null;
    setCategoryValue: React.Dispatch<React.SetStateAction<null>>;
    selectedCategory: string;
    setSelectedCategory: (selectedCategory: string) => void;
    handleSelectCategory: (type: string) => void;
    handleAddTask: () => void;
    handleDoneTask: (id: number) => void;
    handleRemoveTask: (id: number) => void;
    dateInput: Date;
    setDateInput: (value: Date) => void;
    taskInput: string;
    setTaskInput: (task: string) => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    getTasksByDate: (date: string) => void;
    pickImage: (id: number) => void;
    takePhoto: (id: number) => void;
    image: string[];
    setImage: (value: string[]) => void;
    taskSelected: string;
};

type TaskProviderProps = {
    children: ReactNode;
};

export const TaskContext = createContext<TaskContextProps>(
    {} as TaskContextProps
);

export const TaskContextProvider = ({ children }: TaskProviderProps) => {
    const [taskList, setTaskList] = useState<Task[] >([]);
    const [categoryValue, setCategoryValue] = useState(null);
    const [dateInput, setDateInput] = useState(new Date());
    const [taskInput, setTaskInput] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [open, setOpen] = useState<boolean>(false);
    const [dateSelected, setDateSelected] = useState("");
    const [taskSelected, setTaskSelected] = useState("");
    const [image, setImage] = useState<string[]>([]);

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
                `SELECT * FROM tasks WHERE completed = 0 AND category = ? AND date = ?;`,
                [category, dateSelected],
                (_, { rows: { _array } }) => {
                    setTaskList(_array);
                }
            );
        });
    };

    const getTasksByDate = (date: string) => {
        setDateSelected(date);
        const query =
        selectedCategory === "all"
            ? `SELECT * FROM tasks WHERE completed = 0 AND date = ?;`
            : `SELECT * FROM tasks WHERE completed = 0 AND date = ? AND category = ?;`;
        db.transaction((tx) => {
            tx.executeSql(
                query,
                selectedCategory === "all" ? [date] : [date, selectedCategory],
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
                 "INSERT INTO tasks (completed, title, category, date, images) VALUES (0, ?, ?, ?, '');",
                 [taskInput, categoryValue, moment(dateInput).format("YYYY-MM-DD") ]
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
         getTasks();
     }
 };


const handleAddImage = async (file: string[], id: number) => {
    // console.log('handleAddImage')
    // console.log(id)
    // console.log('length das imagens')
    // console.log(file.length)
    db.transaction((tx) => {
        tx.executeSql("UPDATE tasks SET images = ? WHERE id = ?;", [
            file.toString(),
            id,
        ]);
        tx.executeSql(
            "SELECT * FROM tasks WHERE completed = 0;",
            [],
            (_, { rows: { _array } }) => {
                setTaskList(_array);
            }
        );
    });
};

const handleImage = async (file: string, id: number) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT images FROM tasks WHERE id = ?;",
            [id],
            (_, { rows: { _array } }) => {
                let taskImages = _array.length > 0 ? _array[0].images.split(',') : [];
                // console.log('taskImages')
                // console.log(taskImages)
                taskImages != "" ? taskImages.push(file) : taskImages = file;
                //taskImages.push(file);
                handleAddImage(taskImages, id);
                setImage(taskImages);
            }
        );
    });
};

const pickImage = async (id: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [16, 9],
        base64: true,
    });

    if(!result.canceled && result.assets[0].base64) {
        handleImage(result.assets[0].base64, id);
    }
};

const takePhoto = async (id: number) => {
    console.log('takePhoto')
    console.log(id)
    let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [16, 9],
        base64: true,
    });

    if(!data.canceled && data.assets[0].base64) {
        handleImage(data.assets[0].base64, id);
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

 return (
    <TaskContext.Provider
        value={{
            taskList,
            setTaskList,
            getTasks,
            getCompletedTasks,
            categoryValue,
            setCategoryValue,
            selectedCategory,
            getTasksByCategory,
            setSelectedCategory,
            handleSelectCategory,
            handleAddTask,
            handleDoneTask,
            handleRemoveTask,
            dateInput,
            setDateInput,
            taskInput,
            setTaskInput,
            open,
            setOpen,
            getTasksByDate,
            pickImage,
            takePhoto,
            image,
            setImage,
            taskSelected,
        }}
    >
        {children}
    </TaskContext.Provider>
 );
};