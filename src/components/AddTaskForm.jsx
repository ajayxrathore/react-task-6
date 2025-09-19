import { useState } from "react";
import { db } from "../firebase/firestore.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
function AddTaskForm({ listId }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Low");
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (taskTitle.trim() === "") return;
    try {
      await addDoc(collection(db, "lists", listId, "tasks"), {
        title: taskTitle,

        listId: listId, // NEW: Pass the list ID to the task document

        description: taskDescription,
        dueDate: taskDueDate,
        priority: taskPriority,
        completed: false,
        createdAt: new Date(),
      });

      const listDocRef = doc(db, "lists", listId);
      await updateDoc(listDocRef, {
        taskCount: increment(1),
        updatedAt: new Date(),
      });

      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
      setTaskPriority("Low");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form
      onSubmit={handleAddTask}
      className="space-y-2 mt-4 p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl"
    >
      <h4 className="text-xs font-semibold text-gray-700">Add New Task</h4>
      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
        required
      />
      <textarea
        placeholder="Description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
        rows="2"
      />
      <input
        type="date"
        value={taskDueDate}
        onChange={(e) => setTaskDueDate(e.target.value)}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
      />
      <div className="flex space-x-1">
        {["Low", "Medium", "High"].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setTaskPriority(p)}
            className={`flex-1 px-2 py-1 text-xs rounded ${
              taskPriority === p
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="w-full py-2 font-semibold text-white text-sm bg-green-500 rounded-lg hover:bg-green-600"
      >
        Add Task
      </button>
    </form>
  );
}

export default AddTaskForm;
