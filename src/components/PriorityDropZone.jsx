import { useDroppable } from "@dnd-kit/core";
import React from 'react'

function PriorityDropZone({id,label,color}) {
    const { isOver , setNodeRef } = useDroppable({ id });
    const colorMap = {
    High: { base: "#de231d", hover: "#f87171" },   // light red → darker red
    Medium: { base: "#ebe710", hover: "#facc15" }, // light yellow → darker yellow
    Low: { base: "#10eb26", hover: "#4ade80" },    // light green → darker green
  };
  const { base, hover } = colorMap[label] || { base: "#f3f4f6", hover: "#d1d5db" };
    const style = {
    backgroundColor: isOver ? hover : base,
    transition: "background-color 0.2s ease-in-out",
  };
  return (
    <div ref={setNodeRef} style={style} className="p-4 rounded-lg border-2  border-gray-300 text-center transition-colors ">
      <h3 className=" text-white font-bold">{label}</h3>
    </div>
  )
}

export default PriorityDropZone
