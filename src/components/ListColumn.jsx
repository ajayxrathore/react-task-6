import { useState, useEffect } from "react";
import { db } from "../firebase/firestore.js";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  increment
} from "firebase/firestore";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";

function ListColumn({ list, onDeleteList }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksCollectionRef = collection(db, "lists", list.id, "tasks");
    const q = query(tasksCollectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return () => unsubscribe();
  }, [list.id]);

  const handleDeleteTask = async (taskId) => {
    try {
      console.log(taskId);

      await deleteDoc(doc(db, "lists", list.id, "tasks", taskId));

      const listDocRef = doc(db, "lists", list.id);
      await updateDoc(listDocRef, {
        taskCount: increment(-1), // Decrements the count by 1
        updatedAt: new Date(),
      });
     
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };
  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center rounded-t-xl">
          <h3 className="font-bold text-gray-700">{list.name}</h3>
          <button
            onClick={onDeleteList}
            className="text-gray-400 hover:text-red-500 p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
        <div className="p-3 max-h-96 overflow-y-auto space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={{ ...task, listId: list.id }}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">
              No tasks yet.
            </p>
          )}
        </div>
        <AddTaskForm listId={list.id} />
      </div>
    </div>
  );
}

export default ListColumn;
