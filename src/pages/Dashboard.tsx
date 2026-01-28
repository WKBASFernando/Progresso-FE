import React, { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from "reactflow";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import ChatBot from "../components/ChatBot"; // <--- IMPORT THE CHATBOT
import "reactflow/dist/style.css";

// --- 1. CARTOON UI STYLING ---
const nodeStyle: React.CSSProperties = {
  background: "#fff",
  border: "3px solid black",
  boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
  padding: "16px",
  borderRadius: "16px",
  width: 180,
  textAlign: "center",
  fontFamily: "Fredoka, sans-serif",
  fontWeight: "800",
  fontSize: "15px",
  color: "black",
  cursor: "pointer",
};

const edgeOptions = {
  type: "smoothstep",
  animated: true,
  style: { stroke: "black", strokeWidth: 4 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "black",
  },
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [user, setUser] = useState<any>(null);

  // --- 2. DATA SYNC ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await apiRequest("/api/progresso/user/me");
        setUser(userRes);

        const skillsData = await apiRequest("/api/progresso/skill");

        // Map to Cartoon Nodes
        const formattedNodes = skillsData.map((skill: any) => ({
          id: skill._id,
          position: skill.position || { x: 250, y: 0 },
          data: { label: skill.title },
          style: {
            ...nodeStyle,
            background: skill.category === "JAVA" ? "#fdba74" : "#93c5fd",
          },
          sourcePosition: Position.Top,
          targetPosition: Position.Bottom,
        }));

        setNodes(formattedNodes);

        // Map Prerequisites to Edges
        const formattedEdges = skillsData.flatMap((skill: any) =>
          skill.prerequisites.map((pre: any) => ({
            id: `e-${pre._id || pre}-${skill._id}`,
            source: pre._id || pre,
            target: skill._id,
            ...edgeOptions,
          }))
        );

        setEdges(formattedEdges);
      } catch (err) {
        console.error("Matrix Sync Error:", err);
      }
    };

    loadData();
  }, [setNodes, setEdges]);

  // --- 3. LESSON NAVIGATION ---
  const handleNodeClick = (_: any, node: Node) => {
    navigate(`/skill/${node.id}`);
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans relative overflow-hidden bg-[#fffdf5]">
      {/* --- DYNAMIC BACKGROUND PATTERN --- */}
      {/* 1. Dot Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(#cbd5e1 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* 2. Floating Code Elements (Animated) */}
      <div className="absolute top-20 left-10 text-6xl md:text-8xl font-black text-blue-200 opacity-20 animate-bounce-slow z-0 select-none pointer-events-none rotate-12">
        {"< />"}
      </div>
      <div className="absolute bottom-32 right-10 text-7xl md:text-9xl font-black text-pink-200 opacity-20 animate-pulse z-0 select-none pointer-events-none -rotate-6">
        {"{ }"}
      </div>
      <div className="absolute bottom-10 left-20 text-5xl md:text-7xl font-black text-green-200 opacity-20 animate-spin-slow z-0 select-none pointer-events-none">
        {";"}
      </div>

      {/* HEADER (COMPACT MOBILE + VISIBLE NAME) */}
      <div className="bg-white p-2 md:p-4 z-20 border-b-4 border-black flex flex-row justify-between items-center shadow-md relative gap-2">
        {/* LOGO */}
        <h1 className="text-lg md:text-2xl font-black text-black flex items-center gap-1 md:gap-2 shrink-0">
          ⚡ <span className="hidden xs:inline">Progresso</span>
          <span className="text-blue-600 bg-blue-100 px-1 md:px-2 border-2 border-black rounded-lg transform rotate-1 text-[10px] md:text-base">
            Matrix
          </span>
        </h1>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <Link
            to="/profile"
            className="flex items-center gap-2 hover:scale-105 transition"
          >
            {/* NAME SECTION */}
            <div className="text-right">
              <span className="block font-bold text-xs md:text-sm leading-tight">
                {user ? (
                  <>
                    <span className="md:hidden">{user.firstname}</span>
                    <span className="hidden md:inline">
                      Lvl {user.level || 1}. {user.firstname}
                    </span>
                  </>
                ) : (
                  "..."
                )}
              </span>
            </div>

            {/* AVATAR */}
            <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-200 rounded-full border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_black] shrink-0">
              <img
                src={
                  user?.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    user?.firstname || "Player"
                  }`
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* LOGOUT BUTTON */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="text-[10px] md:text-sm font-bold text-black bg-red-100 border-2 border-black px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl hover:bg-red-500 hover:text-white transition shadow-[2px_2px_0px_0px_black] md:shadow-[3px_3px_0px_0px_black] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
          >
            EXIT
          </button>
        </div>
      </div>

      {/* REACT FLOW CANVAS */}
      <div className="flex-grow h-full w-full z-10 bg-transparent">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          {/* Subtle Grid */}
          <Background
            color="#000"
            gap={30}
            size={1}
            style={{ opacity: 0.05 }}
          />
          <Controls className="border-2 border-black shadow-[4px_4px_0px_0px_black] bg-white" />
        </ReactFlow>
      </div>

      {/* FOOTER HINT */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-full text-center px-4">
        <p className="bg-black text-white px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest animate-pulse shadow-lg inline-block">
          Tap a node to begin transmission
        </p>
      </div>

      {/* --- AI CHATBOT INTEGRATION --- */}
      <ChatBot currentSkill="Skill Tree Map" />
    </div>
  );
};

export default Dashboard;
