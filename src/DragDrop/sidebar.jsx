import React from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'Start')} draggable>
        Start
      </div>
      <div className="dndnode process" onDragStart={(event) => onDragStart(event, 'Process')} draggable>
        Process
      </div>
      <div className="dndnode decision" onDragStart={(event) => onDragStart(event, 'Decision')} draggable>
        Decision
      </div>
    </aside>
  );
};
