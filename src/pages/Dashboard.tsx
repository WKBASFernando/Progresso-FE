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
        // Updated path to include the /api/progresso prefix
        const userRes = await apiRequest("/api/progresso/auth/me");
        setUser(userRes.data);

        // Updated path to include the /api/progresso prefix
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
    <div className="h-screen w-screen flex flex-col font-sans relative overflow-hidden bg-white">
      {/* DECORATIVE CODING ELEMENTS */}
      <div className="absolute top-10 left-10 text-8xl font-mono font-black text-gray-100 opacity-50 z-0 select-none pointer-events-none">
        {"< >"}
      </div>
      <div className="absolute bottom-10 right-10 text-9xl font-mono font-black text-gray-100 opacity-50 z-0 select-none pointer-events-none">
        {"}"}
      </div>

      {/* HEADER */}
      <div className="bg-white p-4 z-20 border-b-4 border-black flex flex-col md:flex-row justify-between items-center shadow-md relative gap-4">
        <h1 className="text-2xl font-black text-black flex items-center gap-2">
          ⚡ Progresso{" "}
          <span className="text-blue-600 bg-blue-100 px-2 border-2 border-black rounded-lg transform rotate-1">
            Matrix
          </span>
        </h1>

        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="flex items-center gap-2 hover:scale-105 transition"
          >
            <span className="font-bold text-sm hidden md:block">
              {user ? `Lvl 1. ${user.firstname}` : "Syncing..."}
            </span>
            <div className="w-10 h-10 bg-yellow-200 rounded-full border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_black]">
              <img
                src={
                  user?.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    user?.firstname || "Player"
                  }`
                }
                alt="Avatar"
              />
            </div>
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="text-sm font-bold text-black bg-red-100 border-2 border-black px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition shadow-[3px_3px_0px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* REACT FLOW CANVAS */}
      <div className="flex-grow h-full w-full z-10 bg-[#fafafa]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Background color="#000" gap={30} size={1} style={{ opacity: 0.1 }} />
          <Controls className="border-2 border-black shadow-[4px_4px_0px_0px_black] bg-white" />
        </ReactFlow>
      </div>

      {/* FOOTER HINT */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <p className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse shadow-lg">
          Click a node to begin transmission
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
