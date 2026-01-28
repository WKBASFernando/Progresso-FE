import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
  MarkerType,
} from "reactflow";
import { apiRequest } from "../services/api";
import "reactflow/dist/style.css";

const Admin: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "WEB",
    videoUrl: "",
    prerequisites: [] as string[],
  });

  // 1. FETCH MATRIX DATA
  const loadTree = async () => {
    try {
      const data = await apiRequest("/api/progresso/skill");

      // Map MongoDB data to ReactFlow Nodes
      const formattedNodes = data.map((s: any) => ({
        id: s._id,
        position: s.position || { x: 100, y: 100 },
        data: { label: s.title },
        style: {
          background: "#000",
          color: "#22c55e",
          border: "2px solid #22c55e",
          borderRadius: "8px",
          padding: "10px",
          fontWeight: "bold",
          width: 160,
          fontSize: "12px",
        },
      }));
      setNodes(formattedNodes);

      // Map Prerequisites to Edges
      const formattedEdges = data.flatMap((s: any) =>
        s.prerequisites.map((p: any) => ({
          id: `e-${p._id || p}-${s._id}`,
          source: p._id || p,
          target: s._id,
          animated: true,
          style: { stroke: "#166534", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#166534" },
        }))
      );
      setEdges(formattedEdges);
    } catch (err) {
      console.error("System sync failed:", err);
    }
  };

  useEffect(() => {
    loadTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. AUTO-SYNC POSITION (Drag & Drop)
  const onNodeDragStop = useCallback(async (_: any, node: Node) => {
    try {
      await apiRequest(`/api/progresso/skill/${node.id}/position`, "PATCH", {
        position: node.position,
      });
      console.log(`Node ${node.id} synced at`, node.position);
    } catch (err) {
      alert("Position sync failed! Check server connection.");
    }
  }, []);

  // 3. ESTABLISH NEURAL LINK (Drawing Lines)
  const onConnect = useCallback(
    async (params: Connection | Edge) => {
      // Update UI immediately so the line stays visible
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#166534", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#166534" },
          },
          eds
        )
      );

      try {
        // Sync the prerequisite to the backend
        await apiRequest(
          `/api/progresso/skill/${params.target}/prerequisite`,
          "PATCH",
          {
            prerequisiteId: params.source,
          }
        );
        console.log("Neural link established in the Matrix.");
      } catch (err) {
        alert("Link failed to synchronize with HQ.");
        loadTree(); // Rollback on failure
      }
    },
    [setEdges]
  );

  // 4. REMOVE NODE FROM MATRIX
  const deleteNode = async (id: string) => {
    if (
      !window.confirm(
        "WARNING: Deleting this node will remove it from all player trees. Proceed?"
      )
    )
      return;
    try {
      await apiRequest(`/api/progresso/skill/${id}`, "DELETE");
      loadTree();
    } catch (err) {
      alert("System could not delete node.");
    }
  };

  // 5. CREATE NEW SKILL NODE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/api/progresso/skill", "POST", {
        ...formData,
        position: { x: 50, y: 50 },
      });

      alert("Node successfully initialized.");
      setFormData({
        title: "",
        description: "",
        category: "WEB",
        videoUrl: "",
        prerequisites: [],
      });
      loadTree();
    } catch (err) {
      alert("Deployment failed. Check if title is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-black text-green-500 font-mono">
      {/* SIDEBAR: THE NODE FORGE */}
      <div className="w-full md:w-80 p-5 border-r border-green-900 overflow-y-auto shrink-0 bg-zinc-950 z-20">
        <div className="mb-8">
          <h2 className="text-xl font-black text-white tracking-tighter italic">
            ADMIN_FORGE
          </h2>
          <div className="h-1 w-12 bg-green-500 mt-1"></div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4 text-[11px]">
          <div>
            <label className="text-green-800 uppercase font-bold">
              Node_Title
            </label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-black border border-green-900 p-2 outline-none focus:border-green-400 text-white mt-1"
              placeholder="e.g. React Hooks"
              required
            />
          </div>

          <div>
            <label className="text-green-800 uppercase font-bold">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-black border border-green-900 p-2 text-white mt-1"
            >
              <option value="WEB">WEB_DEV</option>
              <option value="JAVA">JAVA_CORE</option>
              <option value="DATABASE">SQL_NOSQL</option>
            </select>
          </div>

          <div>
            <label className="text-green-800 uppercase font-bold">
              YouTube_URL
            </label>
            <input
              value={formData.videoUrl}
              onChange={(e) =>
                setFormData({ ...formData, videoUrl: e.target.value })
              }
              className="w-full bg-black border border-green-900 p-2 text-white mt-1 outline-none"
              placeholder="https://youtube.com/..."
              required
            />
          </div>

          <div>
            <label className="text-green-800 uppercase font-bold">
              Intel_Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-black border border-green-900 p-2 h-20 text-white mt-1 outline-none"
              placeholder="Brief lesson overview..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-700 text-black font-black hover:bg-green-400 transition uppercase"
          >
            {loading ? "UPLOADING_INTEL..." : "DEPLOY_NODE"}
          </button>
        </form>

        <div className="mt-10 border-t border-green-900 pt-4">
          <h3 className="text-[10px] text-white mb-3 uppercase tracking-widest">
            Active_Nodes
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {nodes.map((n) => (
              <div
                key={n.id}
                className="flex justify-between items-center text-[9px] bg-zinc-900 p-2 border border-green-900/30"
              >
                <span className="truncate w-3/4 text-green-300">
                  {n.data.label}
                </span>
                <button
                  onClick={() => deleteNode(n.id)}
                  className="text-red-500 hover:text-white"
                >
                  DEL
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN PANEL: THE MAP ARCHITECT */}
      <div className="flex-grow relative overflow-hidden z-10">
        <div className="absolute top-6 left-6 z-50 bg-black/90 border border-green-500 px-4 py-2 text-[10px] uppercase text-green-400 font-black">
          Live_Map_Architect_Grid
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          fitView
        >
          <Background
            variant={BackgroundVariant.Lines}
            color="#166534"
            gap={25}
            size={1}
            style={{ opacity: 0.3 }}
          />
          <Controls className="bg-zinc-900 border-2 border-green-900 fill-green-500" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Admin;
