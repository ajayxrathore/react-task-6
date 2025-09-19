import { useDroppable } from "@dnd-kit/core";
import React from 'react'

function PriorityDropZone({id,label,color}) {
    const { isOver , setNodeRef } = useDroppable({ id });
     const style = {
    backgroundColor: isOver ? color : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} className="p-4 rounded-lg border-2 border-dashed border-gray-300 text-center transition-colors">
      <h3 className="font-semibold text-gray-600">{label}</h3>
    </div>
  )
}

export default PriorityDropZone
