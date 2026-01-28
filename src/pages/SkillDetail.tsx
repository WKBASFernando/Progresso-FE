import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import YouTube from "react-youtube";
import { apiRequest } from "../services/api";

const SkillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [videoFinished, setVideoFinished] = useState(false);
  const [claimingXp, setClaimingXp] = useState(false);

  // --- ANTI-SKIP STATE ---
  const playerRef = useRef<any>(null);
  const furthestTime = useRef(0);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const res = await apiRequest(`/api/progresso/skill/${id}`);
        setSkill(res);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [id]);

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;

    // Check every 500ms to ensure the user isn't skipping ahead
    const interval = setInterval(() => {
      if (playerRef.current && !videoFinished) {
        const currentTime = playerRef.current.getCurrentTime();

        // If user tries to skip more than 2 seconds ahead of their furthest point
        if (currentTime > furthestTime.current + 2) {
          playerRef.current.seekTo(furthestTime.current);
          console.warn(
            "Skipping forbidden. Complete the transmission normally."
          );
        } else {
          // Update furthest point as they watch
          furthestTime.current = Math.max(furthestTime.current, currentTime);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  };

  const onPlayerEnd = () => {
    setVideoFinished(true);
    console.log("Transmission complete. XP claim unlocked.");
  };

  const handleMarkAsDone = async () => {
    if (!videoFinished || claimingXp) return;

    setClaimingXp(true);
    try {
      // Calls the new auto-calculating XP route
      const res = await apiRequest(
        `/api/progresso/user/complete-skill/${id}`,
        "POST"
      );
      alert(
        `Success! You gained ${res.addedXp} XP. Total: ${res.totalXp} (Level ${res.currentLevel})`
      );

      // Return to the Matrix to see the updated tree
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to synchronize progress with HQ.");
    } finally {
      setClaimingXp(false);
    }
  };

  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      rel: 0,
      controls: 1, // Keep controls enabled so they can rewind
    },
  };

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-yellow-50 font-[900] animate-pulse">
        RECEIVING SIGNAL...
      </div>
    );

  if (!skill)
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-yellow-50 font-black">
        <p className="text-xl mb-4 text-red-600">⚠ ERROR: NODE_NOT_FOUND</p>
        <Link
          to="/dashboard"
          className="bg-white border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all"
        >
          RETURN TO MAP
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-yellow-50 p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/dashboard"
            className="bg-white border-3 border-black px-4 py-2 rounded-xl font-black shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none transition-all text-xs uppercase"
          >
            ← Back to Matrix
          </Link>
          <span className="bg-blue-200 border-2 border-black px-4 py-1 rounded-full text-xs font-black uppercase">
            {skill.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase italic tracking-tighter">
          {skill.title}
        </h1>

        <div className="border-4 border-black shadow-[12px_12px_0px_0px_black] rounded-3xl overflow-hidden bg-black aspect-video">
          <YouTube
            videoId={getYoutubeId(skill.videoUrl)}
            opts={opts}
            onReady={onPlayerReady}
            onEnd={onPlayerEnd}
            className="w-full h-full"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="font-black text-xl mb-2 uppercase italic">
              Intel_Brief:
            </h3>
            <p className="bg-white p-6 border-4 border-black rounded-2xl font-bold shadow-[4px_4px_0px_0px_black] min-h-[150px] whitespace-pre-wrap text-slate-700">
              {skill.description || "No specific instructions for this node."}
            </p>
          </div>

          <div className="flex flex-col gap-4 justify-end">
            <button
              onClick={handleMarkAsDone}
              disabled={!videoFinished || claimingXp}
              className={`w-full py-6 border-4 border-black rounded-2xl font-black text-xl shadow-[8px_8px_0px_0px_black] transition-all 
                  ${
                    videoFinished && !claimingXp
                      ? "bg-green-400 hover:translate-y-1 hover:shadow-none active:scale-95 cursor-pointer"
                      : "bg-gray-200 opacity-50 cursor-not-allowed"
                  }`}
            >
              {claimingXp
                ? "SYNCING..."
                : videoFinished
                ? "CLAIM XP ✅"
                : "WATCH TO UNLOCK 🔒"}
            </button>
            {!videoFinished && (
              <p className="text-[10px] text-center font-black text-slate-400 uppercase italic animate-pulse">
                * Forward skipping is disabled in this sector *
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
