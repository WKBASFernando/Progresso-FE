import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import YouTube, { type YouTubeProps } from "react-youtube";
import { apiRequest } from "../services/api";

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoFinished, setVideoFinished] = useState(false);
  const [claimingXp, setClaimingXp] = useState(false);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true);
        const res = await apiRequest(`/api/progresso/skill/${id}`);
        setSkill(res);
      } catch (err) {
        console.error("Transmission Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [id]);

  // Extract YouTube ID for the player
  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  // Called when the video reaches the very end
  const onPlayerEnd = () => {
    setVideoFinished(true);
    console.log("Validation complete: Node unlocked.");
  };

  const handleMarkAsDone = async () => {
    setClaimingXp(true);
    try {
      // Future logic: Send request to backend to award XP
      await apiRequest(`/api/progresso/user/complete-skill/${id}`, "POST");
      alert("Mission Accomplished! XP Gained. 🚀");
    } catch (err) {
      alert("Failed to sync progress with HQ.");
    } finally {
      setClaimingXp(false);
    }
  };

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      rel: 0, // Don't show related videos from other channels
    },
  };

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-yellow-50 font-black animate-pulse">
        RECEIVING SIGNAL...
      </div>
    );

  if (!skill)
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-yellow-50 font-black">
        <p className="text-xl mb-4 text-red-600">⚠ ERROR: NODE_NOT_FOUND</p>
        <Link
          to="/dashboard"
          className="bg-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_black]"
        >
          RETURN TO MAP
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/dashboard"
            className="bg-white border-3 border-black px-6 py-2 rounded-xl font-black shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all uppercase text-sm"
          >
            ← Back to Matrix
          </Link>
          <div className="flex gap-2">
            <span className="bg-blue-200 border-2 border-black px-4 py-1 rounded-full text-xs font-black uppercase shadow-[2px_2px_0px_0px_black]">
              {skill.category}
            </span>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
            {skill.title}
          </h1>
          <div className="h-2 w-32 bg-black mt-2"></div>
        </div>

        {/* REPLACED IFRAME WITH REACT-YOUTUBE COMPONENT */}
        <div className="border-4 border-black shadow-[15px_15px_0px_0px_black] rounded-3xl overflow-hidden bg-black aspect-video relative">
          {skill.videoUrl ? (
            <YouTube
              videoId={getYoutubeId(skill.videoUrl)}
              opts={opts}
              onEnd={onPlayerEnd}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white">
              <span className="text-6xl mb-4">📡</span>
              <p className="font-mono tracking-widest uppercase">
                No Video Feed
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-8 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-2xl mb-4 underline decoration-pink-400 decoration-4">
              Mission Intelligence:
            </h3>
            <p className="font-bold text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
              {skill.description}
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

            {/* DYNAMIC BUTTON LOGIC */}
            <button
              onClick={handleMarkAsDone}
              disabled={!videoFinished || claimingXp}
              className={`w-full py-6 border-4 border-black rounded-3xl font-black text-xl shadow-[8px_8px_0px_0px_black] transition-all 
                ${
                  videoFinished
                    ? "bg-green-400 hover:translate-y-1 hover:shadow-none active:scale-95 cursor-pointer"
                    : "bg-gray-300 opacity-50 cursor-not-allowed"
                }`}
            >
              {claimingXp
                ? "SYNCING..."
                : videoFinished
                ? "MARK AS COMPLETED ✅"
                : "WATCH TO UNLOCK 🔒"}
            </button>
            {!videoFinished && (
              <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                * button unlocks after full transmission *
              </p>
            )}
          </div>
        </div>
        <div className="h-20" />
      </div>
    </div>
  );
};

export default SkillDetail;
