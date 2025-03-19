import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';


import Sidebar from './sidebar';

import './style.css';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 5 }
  },
];

let id = 0;

const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [saveid, setSaveid] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  // Background state
  const [variant, setVariant] = useState('');

  // Node Edit state
  const [editValue, setEditValue] = useState('');
  const [currentNodeId, setCurrentNodeId] = useState(null);

  // Edit function
  const onNodeClick = (e, node) => {
    setEditValue(node.data.label);
    setCurrentNodeId(node.id);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setEditValue(e.target.value);
  };

  const handleEdit = () => {
    const updatedNodes = nodes.map((item) => {
      if (item.id === currentNodeId) {
        item.data = {
          ...item.data,
          label: editValue
        };
      }
      return item;
    });
    setNodes(updatedNodes);
    setEditValue('');
  };

  // Delete Node function
  const handleDeleteNode = (nodeId) => {
    const updatedNodes = nodes.filter((node) => node.id !== nodeId);
    setNodes(updatedNodes);
  };

  // Background controls
  const canvascross = () => setVariant('cross');
  const canvasline = () => setVariant('line');
  const canvasdots = () => setVariant('dots');

  // Connect nodes
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  // Drag and Drop handlers
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');

    // Check if the dropped element is valid
    if (typeof type === 'undefined' || !type) return;

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode = {
      id: getId(),
      type,
      position,
      data: { label: `${type} node` },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance]);

  useEffect(() => {
    const handleLoadID = async () => {
      try {
        const response = await fetch('http://localhost:5000/workflow');
        const data = await response.json();
        setSaveid(data);
       
      } catch (error) {
        console.error('Load failed:', error);
      }
    };

    handleLoadID(); // Call the function inside useEffect
  }, []);

  const handleSave = async () => {
    const workflow = { nodes, edges };

    try {
      const response = await fetch('http://localhost:5000/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow),
      });
  
      const data = await response.json();
      alert(`Saved! Workflow ID: ${data.id}`);
      

    }
     catch (error) {
      console.error('Save failed:', error);
    }
  };
  const handleLoad = async () => {
    
    if (!selectedId) return;
  
    try {
      const response = await fetch(`http://localhost:5000/workflow/${selectedId}`);
      const data = await response.json();
      setNodes(data.nodes);
      setEdges(data.edges);
    } catch (error) {
      console.error('Load failed:', error);
    }
  };

  const handledelete = async () => {
    if (!selectedId) {
      alert('Please select a workflow to delete!');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/workflow/${selectedId}`, {
        method: 'DELETE',
      });
  console.log(response)
      if (!response.ok) {
        throw new Error('Failed to delete workflow');
      }
  
      // Remove deleted workflow from the dropdown list
      setSaveid((prev) => prev.filter((item) => item.id !== selectedId));
  
      // Clear selection after deletion
      setSelectedId('');
      setNodes([]); // Reset nodes
      setEdges([]); // Reset edges
  
      alert('Workflow deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };
  
    
  return (
    <div className="dndflow">
      
      {/* Controls for editing, adding, and changing the background */}
      <div className="updatenode__controls">
      <h2>Canvas Background</h2>

      <div className='canvascontrol'>
      
          <div className='canvasbutton' onClick={canvascross}>cross</div>
          <div className='canvasbutton' onClick={canvasline}>line</div>
          <div className='canvasbutton' onClick={canvasdots}>dots</div>
        </div>
      <br/>
      <br/>
      <br/>
        <input type="text" value={editValue} placeholder='node name' onChange={handleChange} /> <br />
        <div className="flex">
        <button onClick={handleEdit} className="btn">Update</button>
        
        <button onClick={() => handleDeleteNode(currentNodeId)} className="btn delete">Delete Node</button>
        </div>
        <br/>


        <select onChange={(e) => setSelectedId(e.target.value)}>
        <option value="">Select Workflow for Loading</option>
        {saveid?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.id}
          </option>
        ))}
      </select><br/>

        <button onClick={handleLoad} className="btn">Load</button><br/>
        <button onClick={handleSave} className="btn save">Save Workflow</button><br/>
        <button onClick={handledelete} className="btn delete">Delete Workflow</button>

      </div>

      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background color="red" variant={variant} />
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
