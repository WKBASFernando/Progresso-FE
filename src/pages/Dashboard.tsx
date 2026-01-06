import React, { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position, // <--- 1. IMPORT THIS
} from "reactflow";
import { Link } from "react-router-dom";
import "reactflow/dist/style.css";

// --- STYLING ---
const commonStyle: React.CSSProperties = {
  border: "3px solid black",
  boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
  borderRadius: "16px",
  padding: "16px",
  width: 180,
  textAlign: "center",
  fontFamily: "Fredoka, sans-serif",
  fontWeight: "800",
  fontSize: "15px",
  color: "black",
  transition: "all 0.2s ease-in-out",
};

// --- 2. DEFINE HANDLE POSITIONS ---
// This forces lines to go Vertical (Upwards)
const nodeDefaults = {
  sourcePosition: Position.Top, // Lines leave from the Top
  targetPosition: Position.Bottom, // Lines arrive at the Bottom
};

// --- DATA: WEB TREE ---
const WEB_NODES: Node[] = [
  // GOAL
  {
    id: "web-cap",
    position: { x: 250, y: 0 },
    data: { label: "🏆 FULL STACK APP" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #f9a8d4 0%, #fbcfe8 100%)",
      width: 220,
      fontSize: "18px",
    },
    ...nodeDefaults, // <--- Apply Position
  },

  // TIER 2
  {
    id: "react",
    position: { x: 80, y: 160 },
    data: { label: "5. React.js ⚛️" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #d8b4fe 0%, #e9d5ff 100%)",
    },
    ...nodeDefaults,
  },
  {
    id: "node",
    position: { x: 420, y: 160 },
    data: { label: "6. Node.js 🟢" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #bef264 0%, #d9f99d 100%)",
    },
    ...nodeDefaults,
  },

  // TIER 3
  {
    id: "js",
    position: { x: 250, y: 320 },
    data: { label: "4. JavaScript ⚡" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #fde047 0%, #fef08a 100%)",
    },
    ...nodeDefaults,
  },

  // TIER 4
  {
    id: "css",
    position: { x: 80, y: 480 },
    data: { label: "3. CSS3 🎨" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #93c5fd 0%, #bfdbfe 100%)",
    },
    ...nodeDefaults,
  },
  {
    id: "html",
    position: { x: 420, y: 480 },
    data: { label: "2. HTML5 🧱" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #fca5a5 0%, #fecaca 100%)",
    },
    ...nodeDefaults,
  },

  // START
  {
    id: "start",
    position: { x: 250, y: 640 },
    data: { label: "🚀 START JOURNEY" },
    style: {
      ...commonStyle,
      background: "white",
      borderStyle: "dashed",
      color: "#555",
    },
    ...nodeDefaults,
  },
];

// --- EDGE STYLING ---
const edgeOptions = {
  type: "default", // Bezier Curve
  animated: true,
  style: { stroke: "black", strokeWidth: 4 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "black",
  },
};

const WEB_EDGES: Edge[] = [
  { id: "e-start-html", source: "start", target: "html", ...edgeOptions },
  { id: "e-start-css", source: "start", target: "css", ...edgeOptions },
  { id: "e-html-js", source: "html", target: "js", ...edgeOptions },
  { id: "e-css-js", source: "css", target: "js", ...edgeOptions },
  { id: "e-js-react", source: "js", target: "react", ...edgeOptions },
  { id: "e-js-node", source: "js", target: "node", ...edgeOptions },
  {
    id: "e-react-cap",
    source: "react",
    target: "web-cap",
    ...edgeOptions,
    style: { stroke: "black", strokeWidth: 4, strokeDasharray: "10,5" },
  },
  {
    id: "e-node-cap",
    source: "node",
    target: "web-cap",
    ...edgeOptions,
    style: { stroke: "black", strokeWidth: 4, strokeDasharray: "10,5" },
  },
];

// --- JAVA DATA ---
const JAVA_NODES: Node[] = [
  {
    id: "j-cap",
    position: { x: 250, y: 0 },
    data: { label: "🏆 ENTERPRISE API" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #c4b5fd 0%, #ddd6fe 100%)",
      width: 220,
      fontSize: "18px",
    },
    ...nodeDefaults,
  },
  {
    id: "j-spring",
    position: { x: 250, y: 160 },
    data: { label: "5. Spring Boot 🍃" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #86efac 0%, #bbf7d0 100%)",
    },
    ...nodeDefaults,
  },
  {
    id: "j-db",
    position: { x: 420, y: 320 },
    data: { label: "4. SQL & JDBC 💾" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #6ee7b7 0%, #a7f3d0 100%)",
    },
    ...nodeDefaults,
  },
  {
    id: "j-adv",
    position: { x: 80, y: 320 },
    data: { label: "3. Collections 📚" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #fca5a5 0%, #fecaca 100%)",
    },
    ...nodeDefaults,
  },
  {
    id: "j-oop",
    position: { x: 250, y: 480 },
    data: { label: "2. OOP Concepts 🏗️" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #fdba74 0%, #fed7aa 100%)",
    },
    ...nodeDefaults,
  },
  {
    id: "j-core",
    position: { x: 250, y: 640 },
    data: { label: "1. Core Java ☕" },
    style: {
      ...commonStyle,
      background: "linear-gradient(135deg, #fdba74 0%, #fed7aa 100%)",
    },
    ...nodeDefaults,
  },
];

const JAVA_EDGES: Edge[] = [
  { id: "e-core-oop", source: "j-core", target: "j-oop", ...edgeOptions },
  { id: "e-oop-adv", source: "j-oop", target: "j-adv", ...edgeOptions },
  { id: "e-oop-db", source: "j-oop", target: "j-db", ...edgeOptions },
  { id: "e-adv-spring", source: "j-adv", target: "j-spring", ...edgeOptions },
  { id: "e-db-spring", source: "j-db", target: "j-spring", ...edgeOptions },
  {
    id: "e-spring-cap",
    source: "j-spring",
    target: "j-cap",
    ...edgeOptions,
    style: { stroke: "black", strokeWidth: 4, strokeDasharray: "10,5" },
  },
];

const Dashboard: React.FC = () => {
  const [mode, setMode] = useState<"WEB" | "JAVA">("WEB");
  const [nodes, setNodes, onNodesChange] = useNodesState(WEB_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(WEB_EDGES);

  useEffect(() => {
    if (mode === "WEB") {
      setNodes(WEB_NODES);
      setEdges(WEB_EDGES);
    } else {
      setNodes(JAVA_NODES);
      setEdges(JAVA_EDGES);
    }
  }, [mode, setNodes, setEdges]);

  const accentColor = mode === "WEB" ? "text-blue-200" : "text-orange-200";
  const secondaryColor = mode === "WEB" ? "text-pink-200" : "text-red-200";

  return (
    <div className="h-screen w-screen flex flex-col font-sans relative overflow-hidden">
      {/* Background Animations */}
      <div
        className={`absolute top-10 left-10 text-8xl font-mono font-black opacity-40 animate-float-slow z-0 select-none pointer-events-none ${accentColor}`}
      >
        {mode === "WEB" ? "< >" : "class"}
      </div>
      <div
        className={`absolute bottom-20 right-20 text-9xl font-mono font-black opacity-40 animate-spin-slow z-0 select-none pointer-events-none ${secondaryColor}`}
      >
        {mode === "WEB" ? "();" : ";"}
      </div>
      <div className="absolute top-1/2 -left-5 text-7xl font-mono font-black text-green-200 opacity-40 animate-bounce-gentle z-0 select-none pointer-events-none">
        &&
      </div>
      <div className="absolute top-20 right-40 text-8xl font-mono font-black text-purple-200 opacity-40 animate-float-medium z-0 select-none pointer-events-none">
        []
      </div>

      {/* HEADER */}
      <div className="bg-white/90 backdrop-blur-sm p-4 z-20 border-b-4 border-black flex flex-col md:flex-row justify-between items-center shadow-sm relative gap-4">
        <h1 className="text-2xl font-black text-black flex items-center gap-2">
          {mode === "WEB" ? "🌐 Web" : "☕ Java"}{" "}
          <span className="text-green-600 bg-green-200 px-2 border-2 border-black rounded-lg transform -rotate-2">
            Tree
          </span>
        </h1>
        <div className="flex bg-gray-100 p-1 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_black]">
          <button
            onClick={() => setMode("WEB")}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              mode === "WEB"
                ? "bg-blue-300 text-black border-2 border-black shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Web Dev
          </button>
          <button
            onClick={() => setMode("JAVA")}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              mode === "JAVA"
                ? "bg-orange-300 text-black border-2 border-black shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Java Dev
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <span className="font-bold text-sm hidden md:block">
              Lvl 1. Angelo
            </span>
            <div className="w-10 h-10 bg-blue-200 rounded-full border-2 border-black overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Angelo"
                alt="Avatar"
              />
            </div>
          </Link>
          <Link
            to="/"
            className="text-sm font-bold text-black bg-red-100 border-2 border-black px-3 py-2 rounded-lg hover:bg-red-400 hover:text-white transition shadow-[2px_2px_0px_0px_black]"
          >
            Quit
          </Link>
        </div>
      </div>

      <div className="flex-grow h-full w-full z-10">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
          connectionLineStyle={{ stroke: "black", strokeWidth: 4 }}
        >
          <Background
            color="#000"
            gap={30}
            size={2}
            style={{ opacity: 0.05 }}
          />
          <Controls className="border-2 border-black shadow-[4px_4px_0px_0px_black]" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Dashboard;
