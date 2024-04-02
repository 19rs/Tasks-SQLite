import { ReactNode, createContext, useState } from "react";
import db from "../services/sqlite/SQLiteDatabase";
import { Task } from "../types/Task";
import moment from "moment";

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
        console.log(dateSelected)
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
        console.log('getTasksByDate')
        setDateSelected(date);
        console.log('selectedCategory:');
        console.log(selectedCategory);
        const query =
        selectedCategory === "all"
            ? `SELECT * FROM tasks WHERE completed = 0 AND date = ?;`
            : `SELECT * FROM tasks WHERE completed = 0 AND date = ? AND category = ?;`;
        db.transaction((tx) => {
            tx.executeSql(
                query,
                selectedCategory === "all" ? [date] : [date, selectedCategory],
                (_, { rows: { _array } }) => {
                    console.log(query);
                setTaskList(_array);
                }
            );
        });
        console.log('query:');
        console.log(query);
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


 //ver
 const handleAddTask = async () => {
    console.log('veio na funcao')
     if (taskInput !== "" && categoryValue) {
        console.log('entrou no if')
        console.log(taskInput)
        console.log(categoryValue)
        console.log(dateInput)
         db.transaction((tx) => {
             tx.executeSql(
                 "INSERT INTO tasks (completed, title, category, date) VALUES (0, ?, ?, ?);",
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
        console.log(type)
     if(taskList) {
         switch(type) {
             case "all":
                console.log('todas')
                 getTasks();
                 break;
             case "done":
             console.log('completas')
                 getCompletedTasks();
                 break;
             default:
             console.log('por categoria')
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
        }}
    >
        {children}
    </TaskContext.Provider>
 );
};