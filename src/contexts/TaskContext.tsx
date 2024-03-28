import { ReactNode, createContext, useState } from "react";
import db from "../services/sqlite/SQLiteDatabase";
import { Task } from "../types/Task";

type TaskContextProps = {
    taskList: Task[];
    setTaskList: (taskList: Task[]) => void;
    getTasks: () => void;
    getTasksByCategory: () => void;
    getCompletedTasks: () => void;
    selectedCategory: string;
    setSelectedCategory: (selectedCategory: string) => void;
    handleSelectedCategory: (type: string) => void;
    handleDoneTask: (id: number) => void;
    handleRemoveTask: (id: number) => void;
};

type TaskProviderProps = {
    children: ReactNode;
};

export const TaskContext = createContext<TaskContextProps>(
    {} as TaskContextProps
);

export const TaskContextProvider = ({ children }: TaskProviderProps) => {
    const [taskList, setTaskList] = useState<Task[] >([]);
    const [categoryValue, selectedCategoryValue] = useState("all");
    const [dateInput, setDateInput] = useState(new Date());

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


 //ver
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
};