import React from "react";
import { useDraggable } from "@dnd-kit/core";
function TaskCard({ task, onDelete }) {
    

    const {attributes, listeners, setNodeRef, transform} = useDraggable({ id: task.id,
        data:{
            task,
            listId: task.listId,
            taskId: task.id,
        }
     });
     const style= transform ? {
        transform: `translate3d(${transform.x}px,${transform.y}px,0)`,
        zIndex: 1000,
     }:undefined
  const priorityClasses = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };
  return (
  <div ref={setNodeRef} style={style}  {...attributes}  className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing ">
      <div className="flex justify-between items-start">
        <h4 {...listeners} className="font-semibold text-gray-800 text-md">{task.title}</h4>
        <button onClick={(e)=>{e.stopPropagation(),console.log('button clicked')
        ,onDelete()}} className="text-gray-400 hover:text-red-500 p-1 rounded-full text-xs">✕</button>
      </div>
      <p {...listeners} className="text-sm text-gray-600 my-1">{task.description}</p>
      <div {...listeners}  className="flex justify-between items-center mt-2">
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${priorityClasses[task.priority] || "bg-gray-100 text-gray-800"}`}>
          {task.priority}
        </span>
        {task.dueDate && <span className="text-xs text-gray-500">{task.dueDate}</span>}
      </div>
    </div>
);
}

export default TaskCard;
