import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../services/api";

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- HELPER: CONVERT YOUTUBE LINK TO EMBED LINK ---
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
      : "";
  };

  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        setLoading(true);
        // Updated path to include the /api/progresso prefix
        const res = await apiRequest(`/api/progresso/skill/${id}`);
        setSkill(res);
      } catch (err) {
        console.error("Transmission Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkillData();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-yellow-50 font-black text-2xl animate-pulse">
        RECEIVING SIGNAL...
      </div>
    );

  if (!skill)
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-yellow-50 font-black">
        <p className="text-xl mb-4 text-red-600">⚠ ERROR: NODE_NOT_FOUND</p>
        <Link
          to="/dashboard" // Updated to match your Dashboard route
          className="bg-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all"
        >
          RETURN TO MAP
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* TOP NAVIGATION */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/dashboard" // Updated to match your Dashboard route
            className="bg-white border-3 border-black px-6 py-2 rounded-xl font-black shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all uppercase text-sm"
          >
            ← Back to Matrix
          </Link>
          <div className="flex gap-2">
            <span className="bg-blue-200 border-2 border-black px-4 py-1 rounded-full text-xs font-black uppercase shadow-[2px_2px_0px_0px_black]">
              {skill.category}
            </span>
            <span className="bg-green-200 border-2 border-black px-4 py-1 rounded-full text-xs font-black uppercase shadow-[2px_2px_0px_0px_black]">
              Lvl 1 Node
            </span>
          </div>
        </div>

        {/* MISSION TITLE */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight">
            {skill.title}
          </h1>
          <div className="h-2 w-32 bg-black mt-2"></div>
        </div>

        {/* VIDEO PLAYER SECTION */}
        <div className="border-4 border-black shadow-[15px_15px_0px_0px_black] rounded-3xl overflow-hidden bg-black aspect-video relative group">
          {skill.videoUrl ? (
            <iframe
              src={getEmbedUrl(skill.videoUrl)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={skill.title}
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white space-y-4">
              <span className="text-6xl animate-bounce">📡</span>
              <p className="font-mono text-xl opacity-80 tracking-widest uppercase">
                No Video Feed Found
              </p>
            </div>
          )}
        </div>

        {/* DESCRIPTION & INTEL */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-8 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-2xl mb-4 underline decoration-pink-400 decoration-4">
              Mission Intelligence:
            </h3>
            <p className="font-bold text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
              {skill.description ||
                "No specific instructions provided for this node. Use the video feed to gather intel."}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-blue-400 p-6 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_black] text-white">
              <p className="font-black text-xs uppercase mb-1 opacity-80">
                Prerequisites:
              </p>
              <div className="font-bold">
                {skill.prerequisites?.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {skill.prerequisites.map((p: any) => (
                      <li key={p._id || p}>{p.title || "Linked Node"}</li>
                    ))}
                  </ul>
                ) : (
                  "None - Entry Level"
                )}
              </div>
            </div>

            <button className="w-full py-6 bg-green-400 border-4 border-black rounded-3xl font-black text-xl shadow-[8px_8px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all active:scale-95">
              MARK AS COMPLETED ✅
            </button>
          </div>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default SkillDetail;
