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
  increment,
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
    const sourceListId = active.data.current.listId;
    const destinationId = over.id;

    console.log("DragEnd event:", { active, over });

    try {
      // Case 1: Priority zone (High/Medium/Low)
      if (["High", "Medium", "Low"].includes(destinationId)) {
        const taskDocRef = doc(db, "lists", sourceListId, "tasks", taskId);
        await updateDoc(taskDocRef, { priority: destinationId });
      }
      // Case 2: Another list column
      else {
        const taskDocRef = doc(db, "lists", sourceListId, "tasks", taskId);
        const newTaskDocRef = doc(db, "lists", destinationId, "tasks", taskId);

        // Move task: delete from old list, add to new one
        const taskSnapshot = await getDocs(
          collection(db, "lists", sourceListId, "tasks")
        );

        const taskData = taskSnapshot.docs
          .find((doc) => doc.id === taskId)
          ?.data();

        if (taskData) {
          const batch = writeBatch(db);
          batch.delete(taskDocRef);
          batch.set(newTaskDocRef, { ...taskData, listId: destinationId });
           batch.update(doc(db, "lists", sourceListId), {
        taskCount: increment(-1),
        updatedAt: new Date(),
      });

      // increment taskCount in new list
      batch.update(doc(db, "lists", destinationId), {
        taskCount: increment(1),
        updatedAt: new Date(),
      });
          await batch.commit();
        }
      }
    } catch (error) {
      console.error("Error handling drag:", error);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* "Create List" form is now at the top */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-slate-200 transition-all hover:shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
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
                placeholder="add your todos here"
                className="flex-grow px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400"
              />
              <button
                type="submit"
                className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create List
              </button>
            </form>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.2 6.5 10.266a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              Change Task Priority
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PriorityDropZone id="High" label="High" color="#fecaca" />
              <PriorityDropZone id="Medium" label="Medium" color="#fef08a" />
              <PriorityDropZone id="Low" label="Low" color="#bbf7d0" />
            </div>
          </div>

          {/* Area to display lists in a responsive grid */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              My Lists
            </h2>
            {lists.length > 0 ? (
              <div className="flex items-start gap-5 pb-4 overflow-x-auto custom-scrollbar">
                {lists.map((list) => (
                  <ListColumn
                    key={list.id}
                    list={list}
                    onDeleteList={() => handleDeleteList(list.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white rounded-2xl shadow-md text-center text-slate-500 border-2 border-dashed border-slate-200 transition-all hover:border-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-300 mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-lg font-medium text-slate-500">
                  You don't have any lists yet. Create one above to get started!
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Lists help you organize your tasks into categories
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
