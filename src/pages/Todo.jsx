import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../firebase/firestore.js";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  getDocs,
  writeBatch,
  collectionGroup,
  updateDoc,
} from "firebase/firestore";
import Header from "../components/Header.jsx";
import ListColumn from "../components/ListColumn.jsx";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import PriorityDropZone from "../components/PriorityDropZone.jsx";
import TaskCard from "../components/TaskCard.jsx";

function Todo() {
  const { currentUser } = useAuth();
  const [listname, setListname] = useState("");
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "lists"),
      where("owner", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setLists(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return () => unsubscribe();
  }, [currentUser]);
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collectionGroup(db, "tasks"),
      where("owner", "==", currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  }, [currentUser]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (listname.trim() === "") return;
    try {
      await addDoc(collection(db, "lists"), {
        name: listname,
        owner: currentUser.uid,
        createdAt: new Date(),
        taskCount: 0,
        updatedAt: new Date(), 
      });
      setListname("");
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleDeleteList = async (listId) => {
    const listDocRef = doc(db, "lists", listId);
    try {
      const tasksSnapshot = await getDocs(
        collection(db, "lists", listId, "tasks")
      );
      const batch = writeBatch(db);
      tasksSnapshot.forEach((taskDoc) => {
        batch.delete(taskDoc.ref);
      });
      batch.delete(listDocRef);
      await batch.commit();
    } catch (error) {
      console.error("Error deleting list and tasks: ", error);
    }
  };
  const handleDragEnd = async (e) => {
    const { active, over } = e;
    if (!active || !over) return;
    const taskId = active.id;
    const listId = active.data.current.listId;
    const newPriority = over.id;
    console.log("DragEnd event:", { active, over });

    if (["High", "Medium", "Low"].includes(newPriority)) {
      try {
        const taskDocRef = doc(db, "lists", listId, "tasks", taskId);
        await updateDoc(taskDocRef, { priority: newPriority });
      } catch (error) {
        console.error("Error updating task priority: ", error);
      }
    }
  };

  return (
    <DndContext
      onDragStart={(e) => setActiveTask(e.active.data.current.task)}
      onDragEnd={(e) => {
        handleDragEnd(e), setActiveTask(null);
      }}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="h-screen w-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* "Create List" form is now at the top */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Create a New List
            </h2>
            <form
              onSubmit={handleCreateList}
              className="flex flex-col sm:flex-row gap-4"
            >
              <input
                type="text"
                value={listname}
                onChange={(e) => setListname(e.target.value)}
                placeholder="e.g., House Chores"
                className="flex-grow px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 shadow-md"
              >
                Create List
              </button>
            </form>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Change Task Priority (Drag & Drop)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PriorityDropZone id="High" label="High" color="#fecaca" />
              <PriorityDropZone id="Medium" label="Medium" color="#fef08a" />
              <PriorityDropZone id="Low" label="Low" color="#bbf7d0" />
            </div>
          </div>
          {/* Area to display lists in a responsive grid */}
          <div>
            <h2 className="text-2xl font-bold mb-5 text-gray-800">My Lists</h2>
            {lists.length > 0 ? (
              <div className="flex items-start space-x-4 pb-4 overflow-x-auto">
                {lists.map((list) => (
                  <ListColumn
                    key={list.id}
                    list={list}
                    onDeleteList={() => handleDeleteList(list.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white rounded-xl shadow-md text-center text-gray-500 border border-dashed border-gray-300">
                <p className="text-lg">
                  You don't have any lists yet. Create one above to get started!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onDelete={() => {}} // no delete while dragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Todo;
